import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateUserResponse, selectNextAdaptiveQuestion } from '@/lib/engine/adaptive';
import { validateAssessmentAnswer } from '@/lib/engine/assessment-integrity';
import { validateAssessmentSessionAccess } from '@/lib/engine/assessment-session-policy';
import { getQuestionById } from '@/lib/data/question-bank';
import { getServerSessionUser } from '@/lib/auth/session';
import { getAssessmentGuestAccessHash } from '@/lib/auth/assessment-guest';
import {
  AssessmentSessionRevisionConflictError,
  getAssessmentSession,
  saveAssessmentSession,
} from '@/lib/domains/assessments/session-repository';
import {
  ASSESSMENT_RATE_LIMITS,
  createRateLimitExceededResponse,
  enforceDistributedRateLimit,
  resolveRateLimitSubject,
} from '@/lib/security/rate-limit';

const NextQuestionSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  userAnswer: z.union([z.string(), z.array(z.string())]),
  timeSpentMs: z.number().finite().nonnegative().max(3_600_000).default(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NextQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid response payload', details: parsed.error.format() }, { status: 400 });
    }

    const { sessionId, questionId, userAnswer, timeSpentMs } = parsed.data;
    const session = await getAssessmentSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Assessment session not found' }, { status: 404 });
    }

    const sessionUser = await getServerSessionUser();
    const guestAccessHash = await getAssessmentGuestAccessHash(sessionId);
    const access = validateAssessmentSessionAccess(session, {
      now: Date.now(),
      userUid: sessionUser?.uid,
      guestAccessHash,
    });

    if (!access.ok) {
      return NextResponse.json(
        { error: access.error, code: access.code },
        { status: access.status }
      );
    }

    const rateLimit = await enforceDistributedRateLimit({
      scope: 'assessment:next',
      subject: resolveRateLimitSubject(req, { sessionId }),
      rule: ASSESSMENT_RATE_LIMITS.next,
    });
    if (!rateLimit.allowed) {
      return createRateLimitExceededResponse(rateLimit);
    }

    const integrity = validateAssessmentAnswer(session, questionId);
    if (!integrity.ok) {
      return NextResponse.json({ error: integrity.error }, { status: integrity.status });
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const expectedRevision = session.revision ?? 0;
    const evaluated = evaluateUserResponse(question, userAnswer, timeSpentMs);
    session.responses.push(evaluated);
    session.answeredQuestionIds.push(questionId);

    const domain = question.domain;
    const currentEstimate = session.currentDifficulty[domain] || 2.5;
    session.currentDifficulty[domain] = evaluated.isCorrect
      ? Math.min(5.0, currentEstimate + 0.6)
      : Math.max(1.0, currentEstimate - 0.5);

    session.lastActiveTime = Date.now();

    const selection = selectNextAdaptiveQuestion(
      session.answeredQuestionIds,
      session.responses,
      session.currentDifficulty
    );

    session.stage = selection.stage;
    session.currentQuestion = selection.nextQuestion || undefined;
    session.questionIndex = session.answeredQuestionIds.length;

    if (selection.isCompleted) {
      session.stage = 'COMPLETED';
      session.currentQuestion = undefined;
    }

    await saveAssessmentSession(session, expectedRevision);

    return NextResponse.json({
      success: true,
      isCompleted: selection.isCompleted,
      question: selection.nextQuestion,
      stage: selection.stage,
      questionNumber: selection.questionNumber,
      totalEstimatedQuestions: selection.totalQuestions,
      estimatedConfidence: selection.estimatedConfidence,
      lastAnswerFeedback: {
        isCorrect: evaluated.isCorrect,
        scoreRatio: evaluated.scoreRatio,
        feedback: evaluated.feedbackText,
      },
    });
  } catch (error) {
    if (error instanceof AssessmentSessionRevisionConflictError) {
      return NextResponse.json(
        {
          error: 'Assessment state changed before this answer could be saved. Reload the active question and try again.',
          code: 'ASSESSMENT_SESSION_REVISION_CONFLICT',
        },
        { status: 409 }
      );
    }

    console.error('Error submitting assessment answer:', error);
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 });
  }
}

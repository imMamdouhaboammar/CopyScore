import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AssessmentSessionState } from '@/lib/types/assessment';
import { selectNextAdaptiveQuestion } from '@/lib/engine/adaptive';
import { getServerSessionUser } from '@/lib/auth/session';
import {
  ASSESSMENT_SESSION_TTL_MS,
  createAssessmentGuestCredential,
  setAssessmentGuestCookie,
} from '@/lib/auth/assessment-guest';
import { createAssessmentSession } from '@/lib/domains/assessments/session-repository';
import { getVerifiedServerChallenge } from '@/lib/domains/rankings/server-challenge-read';
import {
  ASSESSMENT_RATE_LIMITS,
  createRateLimitExceededResponse,
  enforceDistributedRateLimit,
  resolveRateLimitSubject,
} from '@/lib/security/rate-limit';

const StartSchema = z.object({
  challengeCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getServerSessionUser();
    const rateLimit = await enforceDistributedRateLimit({
      scope: 'assessment:start',
      subject: resolveRateLimitSubject(req, { userUid: sessionUser?.uid }),
      rule: ASSESSMENT_RATE_LIMITS.start,
    });
    if (!rateLimit.allowed) {
      return createRateLimitExceededResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const parsed = StartSchema.safeParse(body);
    const data = parsed.success ? parsed.data : {};
    const sessionId = `att_${randomUUID()}`;
    const now = Date.now();
    const guestCredential = sessionUser
      ? undefined
      : createAssessmentGuestCredential(sessionId);

    let challengeOrigin: AssessmentSessionState['challengeOrigin'] = undefined;
    if (data.challengeCode) {
      const challenge = await getVerifiedServerChallenge(data.challengeCode);
      if (challenge) {
        challengeOrigin = {
          challengerHandle: challenge.creatorHandle,
          challengerScore: challenge.creatorScore,
          challengeCode: challenge.challengeCode,
        };
      }
    }

    const initialSkills = {
      conversion_copywriting: 2.5,
      content_creation: 2.5,
      performance_copy: 2.5,
      cro: 2.5,
    };

    const firstSelection = selectNextAdaptiveQuestion([], [], initialSkills);

    const session: AssessmentSessionState = {
      sessionId,
      userId: sessionUser?.uid,
      ownerUid: sessionUser?.uid,
      guestAccessHash: guestCredential?.accessHash,
      createdAt: now,
      expiresAt: now + ASSESSMENT_SESSION_TTL_MS,
      revision: 0,
      stage: firstSelection.stage,
      questionIndex: 0,
      totalEstimatedQuestions: firstSelection.totalQuestions,
      answeredQuestionIds: [],
      responses: [],
      currentDifficulty: initialSkills,
      currentQuestion: firstSelection.nextQuestion || undefined,
      startTime: now,
      lastActiveTime: now,
      isCompleted: false,
      challengeOrigin,
    };

    await createAssessmentSession(session);

    const response = NextResponse.json({
      success: true,
      sessionId,
      question: firstSelection.nextQuestion,
      stage: firstSelection.stage,
      questionNumber: 1,
      totalEstimatedQuestions: firstSelection.totalQuestions,
      estimatedConfidence: firstSelection.estimatedConfidence,
      challengeOrigin,
    });

    if (guestCredential) {
      setAssessmentGuestCookie(response, guestCredential.cookieValue);
    }

    return response;
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json({ error: 'Failed to initialize assessment session' }, { status: 500 });
  }
}

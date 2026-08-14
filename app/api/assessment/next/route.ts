import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateUserResponse, selectNextAdaptiveQuestion } from '@/lib/engine/adaptive';
import { getQuestionById } from '@/lib/data/question-bank';
import { store } from '@/lib/storage/store';

const NextQuestionSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  userAnswer: z.union([z.string(), z.array(z.string())]),
  timeSpentMs: z.number().default(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NextQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid response payload', details: parsed.error.format() }, { status: 400 });
    }

    const { sessionId, questionId, userAnswer, timeSpentMs } = parsed.data;

    const session = store.getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Assessment session not found or expired' }, { status: 404 });
    }

    if (session.isCompleted) {
      return NextResponse.json({ isCompleted: true, message: 'Assessment already completed' });
    }

    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Evaluate response server-side (without exposing answer key to client)
    const evaluated = evaluateUserResponse(question, userAnswer, timeSpentMs);
    session.responses.push(evaluated);
    session.answeredQuestionIds.push(questionId);

    // Update floating skill estimate for the answered domain
    const d = question.domain;
    const currentEst = session.currentDifficulty[d] || 2.5;
    if (evaluated.isCorrect) {
      session.currentDifficulty[d] = Math.min(5.0, currentEst + 0.6);
    } else {
      session.currentDifficulty[d] = Math.max(1.0, currentEst - 0.5);
    }

    session.lastActiveTime = Date.now();

    // Select next adaptive question
    const selection = selectNextAdaptiveQuestion(
      session.answeredQuestionIds,
      session.responses,
      session.currentDifficulty
    );

    session.stage = selection.stage;
    session.currentQuestion = selection.nextQuestion || undefined;
    session.questionIndex = session.answeredQuestionIds.length;

    if (selection.isCompleted) {
      session.isCompleted = true;
    }

    store.saveSession(session);

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
    console.error('Error submitting assessment answer:', error);
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 });
  }
}

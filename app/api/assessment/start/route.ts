import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AssessmentSessionState } from '@/lib/types/assessment';
import { selectNextAdaptiveQuestion } from '@/lib/engine/adaptive';
import { store } from '@/lib/storage/store';

const StartSchema = z.object({
  userHandle: z.string().optional(),
  challengeCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = StartSchema.safeParse(body);
    const data = parsed.success ? parsed.data : {};

    const sessionId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    let challengeOrigin: AssessmentSessionState['challengeOrigin'] = undefined;
    if (data.challengeCode) {
      const challenge = store.getChallenge(data.challengeCode);
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
      userHandle: data.userHandle,
      stage: firstSelection.stage,
      questionIndex: 0,
      totalEstimatedQuestions: firstSelection.totalQuestions,
      answeredQuestionIds: [],
      responses: [],
      currentDifficulty: initialSkills,
      currentQuestion: firstSelection.nextQuestion || undefined,
      startTime: Date.now(),
      lastActiveTime: Date.now(),
      isCompleted: false,
      challengeOrigin,
    };

    store.saveSession(session);

    return NextResponse.json({
      success: true,
      sessionId,
      question: firstSelection.nextQuestion,
      stage: firstSelection.stage,
      questionNumber: 1,
      totalEstimatedQuestions: firstSelection.totalQuestions,
      estimatedConfidence: firstSelection.estimatedConfidence,
      challengeOrigin,
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json({ error: 'Failed to initialize assessment session' }, { status: 500 });
  }
}

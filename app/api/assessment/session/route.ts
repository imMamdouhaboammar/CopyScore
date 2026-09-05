import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSessionUser } from '@/lib/auth/session';
import { getAssessmentGuestAccessHash } from '@/lib/auth/assessment-guest';
import { validateAssessmentSessionAccess } from '@/lib/engine/assessment-session-policy';
import { getAssessmentSession } from '@/lib/domains/assessments/session-repository';
import { calculateEvidenceConfidence } from '@/lib/engine/scoring';

const SessionQuerySchema = z.object({
  sessionId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const parsed = SessionQuerySchema.safeParse({
      sessionId: req.nextUrl.searchParams.get('sessionId'),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'A valid session id is required' }, { status: 400 });
    }

    const { sessionId } = parsed.data;
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

    if (session.isCompleted && session.finalScore) {
      return NextResponse.json({
        success: true,
        sessionId,
        isCompleted: true,
        result: session.finalScore,
        challengeOrigin: session.challengeOrigin,
      });
    }

    const readyForFinalization =
      session.stage === 'COMPLETED' && !session.currentQuestion;
    const answeredCount = session.answeredQuestionIds.length;
    const totalQuestions = session.totalEstimatedQuestions || 10;
    const estimatedConfidence = calculateEvidenceConfidence(session.responses);

    return NextResponse.json({
      success: true,
      sessionId,
      isCompleted: false,
      readyForFinalization,
      question: session.currentQuestion || null,
      stage: session.stage,
      questionNumber: readyForFinalization ? answeredCount : answeredCount + 1,
      totalEstimatedQuestions: totalQuestions,
      estimatedConfidence,
      challengeOrigin: session.challengeOrigin,
    });
  } catch (error) {
    console.error('Assessment session recovery error:', error);
    return NextResponse.json({ error: 'Failed to recover assessment session' }, { status: 500 });
  }
}

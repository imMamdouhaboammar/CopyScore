import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFinalScore } from '@/lib/engine/scoring';
import { store } from '@/lib/storage/store';
import { getServerSessionUser } from '@/lib/auth/session';
import { saveAssessmentResult } from '@/lib/firebase/firestore';

const SubmitSchema = z.object({
  sessionId: z.string(),
  userHandle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid submission parameters' }, { status: 400 });
    }

    const { sessionId, userHandle } = parsed.data;
    const session = store.getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if user is logged in
    const sessionUser = await getServerSessionUser();

    const handle = userHandle?.trim() || session.userHandle || (sessionUser?.displayName ? sessionUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') : `writer_${Math.random().toString(36).substring(2, 6)}`);
    const finalScore = calculateFinalScore(
      sessionId,
      session.responses,
      session.startTime,
      Date.now(),
      handle
    );

    session.isCompleted = true;
    session.finalScore = finalScore;
    session.userHandle = handle;

    store.saveSession(session);
    store.saveFinalScore(finalScore);

    // If user is authenticated on server, persist to Firestore
    if (sessionUser?.uid) {
      try {
        await saveAssessmentResult(finalScore, sessionUser.uid);
      } catch (err) {
        console.warn('Failed to save assessment to Firestore', err);
      }
    }

    // If this was a head-to-head challenge, record attempt against the challenge
    if (session.challengeOrigin) {
      store.recordChallengeAttempt(
        session.challengeOrigin.challengeCode,
        handle,
        finalScore.overallScore
      );
    }

    // Auto-create a challenge entry for this user so they can immediately challenge others
    store.createChallenge({
      challengeCode: handle.toLowerCase(),
      creatorHandle: handle,
      creatorScore: finalScore.overallScore,
      creatorArchetype: finalScore.archetype.name,
      creatorDomainScores: {
        conversion_copywriting: finalScore.domainScores.conversion_copywriting.scaledScore,
        content_creation: finalScore.domainScores.content_creation.scaledScore,
        performance_copy: finalScore.domainScores.performance_copy.scaledScore,
        cro: finalScore.domainScores.cro.scaledScore,
      },
      createdAt: Date.now(),
      participantCount: 0,
    });

    return NextResponse.json({
      success: true,
      result: finalScore,
      challengeCode: handle.toLowerCase(),
      challengeOrigin: session.challengeOrigin,
    });
  } catch (error) {
    console.error('Error finalizing assessment score:', error);
    return NextResponse.json({ error: 'Failed to finalize score' }, { status: 500 });
  }
}

import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { UserProfile } from '@/lib/types/auth';
import type { AssessmentSessionState, FinalAssessmentScore } from '@/lib/types/assessment';
import { calculateFinalScore } from '@/lib/engine/scoring';
import {
  resolveScoreSigningSecret,
  ScoreVerificationConfigurationError,
  signFinalAssessmentScore,
} from '@/lib/engine/score-verification';
import { getServerSessionUser } from '@/lib/auth/session';
import { getAssessmentGuestAccessHash } from '@/lib/auth/assessment-guest';
import { validateAssessmentSessionAccess } from '@/lib/engine/assessment-session-policy';
import {
  getServerUserProfile,
  saveServerAssessmentResult,
} from '@/lib/firebase/server-firestore';
import {
  AssessmentSessionRevisionConflictError,
  getAssessmentSession,
  saveAssessmentSession,
} from '@/lib/domains/assessments/session-repository';
import {
  publishServerChallenge,
  recordServerChallengeAttempt,
} from '@/lib/domains/rankings/server-rankings';
import { publishVerifiedLeaderboardProjection } from '@/lib/domains/rankings/server-projections';
import {
  ASSESSMENT_RATE_LIMITS,
  createRateLimitExceededResponse,
  enforceDistributedRateLimit,
  resolveRateLimitSubject,
} from '@/lib/security/rate-limit';

const SubmitSchema = z.object({
  sessionId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid submission parameters' }, { status: 400 });
    }

    const { sessionId } = parsed.data;
    const session = await getAssessmentSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
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
      scope: 'assessment:submit',
      subject: resolveRateLimitSubject(req, { sessionId }),
      rule: ASSESSMENT_RATE_LIMITS.submit,
    });
    if (!rateLimit.allowed) {
      return createRateLimitExceededResponse(rateLimit);
    }

    if (session.isCompleted) {
      if (!session.finalScore || !session.userHandle) {
        console.error('Completed assessment session is missing its finalized result', { sessionId });
        return NextResponse.json(
          { error: 'Assessment finalization state is inconsistent' },
          { status: 409 }
        );
      }

      const existingProfile = session.ownerUid
        ? await getServerUserProfile(session.ownerUid)
        : null;
      await syncRankingEffects(session, session.finalScore, session.userHandle, existingProfile);

      return NextResponse.json({
        success: true,
        result: session.finalScore,
        challengeCode: session.userHandle.toLowerCase(),
        challengeOrigin: session.challengeOrigin,
      });
    }

    if (session.stage !== 'COMPLETED' || session.currentQuestion) {
      return NextResponse.json(
        {
          error: 'Assessment questions must be completed before score finalization',
          code: 'ASSESSMENT_NOT_READY_FOR_FINALIZATION',
        },
        { status: 409 }
      );
    }

    const expectedRevision = session.revision ?? 0;
    const serverProfile = sessionUser?.uid
      ? await getServerUserProfile(sessionUser.uid)
      : null;
    const handle = sessionUser?.uid
      ? serverProfile?.handle || `writer_${sessionUser.uid.slice(0, 8)}`
      : `guest_${randomUUID().replace(/-/g, '').slice(0, 10)}`;

    const completedAt = Date.now();
    const calculatedScore = calculateFinalScore(
      sessionId,
      session.responses,
      session.startTime,
      completedAt,
      handle
    );
    const signingSecret = resolveScoreSigningSecret();
    const finalScore = signingSecret
      ? signFinalAssessmentScore(calculatedScore, signingSecret)
      : calculatedScore;

    if (sessionUser?.uid && !session.ownerUid) {
      session.ownerUid = sessionUser.uid;
      session.userId = sessionUser.uid;
      session.claimedByUid = sessionUser.uid;
    }

    let persistedProfile: UserProfile | null = serverProfile;
    if (sessionUser?.uid) {
      const persisted = await saveServerAssessmentResult(finalScore, sessionUser.uid);
      persistedProfile = persisted.profile;
    }

    session.isCompleted = true;
    session.finalScore = finalScore;
    session.userHandle = handle;
    session.lastActiveTime = completedAt;

    try {
      await saveAssessmentSession(session, expectedRevision);
    } catch (error) {
      if (error instanceof AssessmentSessionRevisionConflictError) {
        const latest = await getAssessmentSession(sessionId);
        if (latest?.isCompleted && latest.finalScore && latest.userHandle) {
          const latestProfile = latest.ownerUid
            ? await getServerUserProfile(latest.ownerUid)
            : null;
          await syncRankingEffects(latest, latest.finalScore, latest.userHandle, latestProfile);
          return NextResponse.json({
            success: true,
            result: latest.finalScore,
            challengeCode: latest.userHandle.toLowerCase(),
            challengeOrigin: latest.challengeOrigin,
          });
        }
      }
      throw error;
    }

    await syncRankingEffects(session, finalScore, handle, persistedProfile);

    return NextResponse.json({
      success: true,
      result: finalScore,
      challengeCode: handle.toLowerCase(),
      challengeOrigin: session.challengeOrigin,
    });
  } catch (error) {
    if (error instanceof ScoreVerificationConfigurationError) {
      console.error('Score verification is not configured for finalization', error);
      return NextResponse.json(
        {
          error: 'Score verification is temporarily unavailable',
          code: error.code,
        },
        { status: 503 }
      );
    }

    if (error instanceof AssessmentSessionRevisionConflictError) {
      return NextResponse.json(
        {
          error: 'Assessment state changed before finalization completed. Retry the submission.',
          code: 'ASSESSMENT_SESSION_REVISION_CONFLICT',
        },
        { status: 409 }
      );
    }

    console.error('Error finalizing assessment score:', error);
    return NextResponse.json({ error: 'Failed to finalize score' }, { status: 500 });
  }
}

async function syncRankingEffects(
  session: AssessmentSessionState,
  score: FinalAssessmentScore,
  handle: string,
  profile: UserProfile | null
): Promise<void> {
  if (profile) {
    await publishVerifiedLeaderboardProjection(profile, score);
  }

  await publishServerChallenge({
    score,
    handle,
    ownerUid: session.ownerUid,
  });

  if (session.challengeOrigin) {
    await recordServerChallengeAttempt({
      challengeCode: session.challengeOrigin.challengeCode,
      attemptId: score.attemptId,
      opponentHandle: handle,
      opponentScore: score.overallScore,
      completedAt: score.completedAt,
    });
  }
}

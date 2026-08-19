import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import {
  clearAssessmentGuestCookie,
  getAssessmentGuestAccessHash,
} from '@/lib/auth/assessment-guest';
import { guestClaimSchema } from '@/lib/auth/schemas';
import { claimServerGuestAssessment } from '@/lib/firebase/server-firestore';
import {
  AssessmentSessionClaimError,
  claimAssessmentSession,
} from '@/lib/domains/assessments/session-repository';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = guestClaimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'A valid assessment attempt id is required' },
        { status: 400 }
      );
    }

    const attemptId = parsed.data.attemptId;
    const guestAccessHash = await getAssessmentGuestAccessHash(attemptId);
    const claimedSession = await claimAssessmentSession(
      attemptId,
      user.uid,
      guestAccessHash
    );

    if (!claimedSession.finalScore) {
      return NextResponse.json(
        { error: 'Guest assessment is no longer claimable' },
        { status: 409 }
      );
    }

    const { profile, leaderboardEntry } = await claimServerGuestAssessment(
      user.uid,
      claimedSession.finalScore
    );

    const response = NextResponse.json({
      success: true,
      profile,
      leaderboardEntry,
    });
    clearAssessmentGuestCookie(response);
    return response;
  } catch (err: unknown) {
    if (err instanceof AssessmentSessionClaimError) {
      const status =
        err.code === 'ASSESSMENT_SESSION_NOT_FOUND'
          ? 404
          : err.code === 'ASSESSMENT_SESSION_EXPIRED'
            ? 410
            : err.code === 'ASSESSMENT_SESSION_FORBIDDEN'
              ? 403
              : 409;

      return NextResponse.json({ error: err.code, code: err.code }, { status });
    }

    console.error('Guest claim error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to claim assessment score' },
      { status: 400 }
    );
  }
}

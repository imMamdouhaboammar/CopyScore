import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { guestClaimSchema } from '@/lib/auth/schemas';
import { claimServerGuestAssessment } from '@/lib/firebase/server-firestore';
import { store } from '@/lib/storage/store';

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

    const trustedScore = store.getFinalScore(parsed.data.attemptId);
    if (!trustedScore) {
      return NextResponse.json(
        { error: 'Guest assessment is no longer claimable' },
        { status: 409 }
      );
    }

    const { profile, leaderboardEntry } = await claimServerGuestAssessment(
      user.uid,
      trustedScore
    );

    return NextResponse.json({
      success: true,
      profile,
      leaderboardEntry,
    });
  } catch (err: unknown) {
    console.error('Guest claim error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to claim assessment score' },
      { status: 400 }
    );
  }
}

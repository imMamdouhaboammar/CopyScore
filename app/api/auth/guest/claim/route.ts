import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { claimGuestAssessment } from '@/lib/firebase/firestore';
import { FinalAssessmentScore } from '@/lib/types/assessment';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const score = body.score as FinalAssessmentScore;

    if (!score || !score.overallScore || !score.attemptId) {
      return NextResponse.json({ error: 'Valid assessment score object is required' }, { status: 400 });
    }

    const { profile, leaderboardEntry } = await claimGuestAssessment(user.uid, score);

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

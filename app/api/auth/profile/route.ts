import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionUser, requireUser } from '@/lib/auth/session';
import { getServerUserProfile, updateServerUserProfile } from '@/lib/firebase/server-firestore';
import { profilePatchSchema } from '@/lib/auth/schemas';
import { syncServerChallengeHandle } from '@/lib/domains/rankings/server-rankings';

export async function GET() {
  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ profile: null }, { status: 401 });
    }

    const profile = await getServerUserProfile(user.uid);
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = profilePatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const previous = await getServerUserProfile(user.uid);
    const updated = await updateServerUserProfile(user.uid, parsed.data);

    if (previous?.handle !== updated.handle) {
      await syncServerChallengeHandle({
        previousHandle: previous?.handle,
        nextHandle: updated.handle,
        score: updated.bestScore,
        ownerUid: user.uid,
      });
    }

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    console.error('Profile update error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update profile' },
      { status: 400 }
    );
  }
}

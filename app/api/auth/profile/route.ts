import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionUser, requireUser } from '@/lib/auth/session';
import { getUserProfile, updateUserProfile } from '@/lib/firebase/firestore';
import { profileUpdateSchema } from '@/lib/auth/schemas';

export async function GET() {
  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ profile: null }, { status: 401 });
    }

    const profile = await getUserProfile(user.uid);
    return NextResponse.json({ profile });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateUserProfile(user.uid, parsed.data);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    console.error('Profile update error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update profile' },
      { status: 400 }
    );
  }
}

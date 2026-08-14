import { NextRequest, NextResponse } from 'next/server';
import { requireUser, clearSessionResponse } from '@/lib/auth/session';
import { deleteAdminUser } from '@/lib/firebase/admin';
import { deleteUserData } from '@/lib/firebase/firestore';

export async function DELETE() {
  try {
    const user = await requireUser();

    // 1. Delete data from Firestore (handles, public profiles, leaderboard, users)
    await deleteUserData(user.uid);

    // 2. Delete user in Firebase Authentication via Admin SDK
    await deleteAdminUser(user.uid);

    // 3. Clear session cookie
    return clearSessionResponse();
  } catch (err: unknown) {
    console.error('Account deletion error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete account' },
      { status: 500 }
    );
  }
}

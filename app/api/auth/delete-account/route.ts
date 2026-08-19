import { NextResponse } from 'next/server';
import { requireUser, clearSessionResponse } from '@/lib/auth/session';
import { deleteAdminUser } from '@/lib/firebase/admin';
import { deleteServerUserData } from '@/lib/firebase/server-firestore';

export async function DELETE() {
  try {
    const user = await requireUser();

    await deleteServerUserData(user.uid);
    await deleteAdminUser(user.uid);

    return clearSessionResponse();
  } catch (err: unknown) {
    console.error('Account deletion error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete account' },
      { status: 500 }
    );
  }
}

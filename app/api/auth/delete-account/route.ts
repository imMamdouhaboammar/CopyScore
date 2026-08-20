import { NextRequest, NextResponse } from 'next/server';
import { requireUser, clearSessionResponse } from '@/lib/auth/session';
import { deleteAdminUser } from '@/lib/firebase/admin';
import { deleteServerUserData } from '@/lib/firebase/server-firestore';
import { recordAuditEventSafely, resolveAuditRequestId } from '@/lib/ops/server-audit';

export async function DELETE(req: NextRequest) {
  const requestId = resolveAuditRequestId(req);
  try {
    const user = await requireUser();

    await deleteServerUserData(user.uid);
    await deleteAdminUser(user.uid);
    await recordAuditEventSafely({
      eventType: 'auth.account.deleted',
      outcome: 'success',
      actorUid: user.uid,
      subjectId: user.uid,
      requestId,
    });

    return clearSessionResponse();
  } catch (err: unknown) {
    console.error('Account deletion error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete account' },
      { status: 500 }
    );
  }
}

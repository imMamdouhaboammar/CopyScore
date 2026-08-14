import { NextRequest, NextResponse } from 'next/server';
import { isHandleAvailable } from '@/lib/firebase/firestore';
import { getServerSessionUser } from '@/lib/auth/session';
import { normalizeHandle, isHandleReserved } from '@/lib/auth/schemas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawHandle = searchParams.get('handle') || '';
  const handle = normalizeHandle(rawHandle);

  if (!handle || handle.length < 3) {
    return NextResponse.json({ available: false, reason: 'Handle must be at least 3 characters' });
  }

  if (handle.length > 24) {
    return NextResponse.json({ available: false, reason: 'Handle cannot exceed 24 characters' });
  }

  if (isHandleReserved(handle)) {
    return NextResponse.json({ available: false, reason: 'This handle is reserved' });
  }

  const currentUser = await getServerSessionUser();
  const available = await isHandleAvailable(handle, currentUser?.uid);

  return NextResponse.json({ available, handle });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSessionUser, createSessionResponse, clearSessionResponse } from '@/lib/auth/session';
import { verifyAdminIdToken } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const user = await getServerSessionUser();
    return NextResponse.json({ user });
  } catch (err: unknown) {
    return NextResponse.json({ user: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, rememberMe } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ success: false, error: 'ID token is required' }, { status: 400 });
    }

    // Verify ID token first using Admin SDK
    const decoded = await verifyAdminIdToken(idToken);
    if (!decoded || !decoded.uid) {
      return NextResponse.json({ success: false, error: 'Invalid ID token' }, { status: 401 });
    }

    // Create session cookie response
    return await createSessionResponse(idToken, rememberMe !== false);
  } catch (err: unknown) {
    console.error('Session POST error', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Session creation failed' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  return clearSessionResponse();
}

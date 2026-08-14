import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminSessionCookie, createAdminSessionCookie, getAdminAuth } from '../firebase/admin';
import { AuthSessionUser, UserRole } from '../types/auth';

export const SESSION_COOKIE_NAME = 'copyscore_session';

// Session duration: 5 days for normal / remember me, 1 day for standard
const DEFAULT_SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
const SHORT_SESSION_DURATION_MS = 60 * 60 * 24 * 1 * 1000; // 1 day

/**
 * Reads and verifies the server session from HttpOnly cookies.
 */
export async function getServerSessionUser(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const decoded = await verifyAdminSessionCookie(sessionCookie, true);
    if (!decoded || !decoded.uid) {
      return null;
    }

    const role: UserRole = decoded.role === 'admin' || decoded.admin === true ? 'admin' : 'user';

    return {
      uid: decoded.uid,
      email: decoded.email || null,
      emailVerified: !!decoded.email_verified,
      displayName: decoded.name || null,
      photoURL: decoded.picture || null,
      role,
      isAdmin: role === 'admin',
    };
  } catch (err) {
    // Stale, revoked, or invalid cookie
    return null;
  }
}

/**
 * Ensures user is authenticated on a server route; throws or returns unauthorized.
 */
export async function requireUser(): Promise<AuthSessionUser> {
  const user = await getServerSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Ensures user has admin role; throws if not.
 */
export async function requireAdmin(): Promise<AuthSessionUser> {
  const user = await requireUser();
  if (!user.isAdmin) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

/**
 * Creates an HttpOnly session cookie from a verified Firebase ID token.
 */
export async function createSessionResponse(idToken: string, rememberMe: boolean = true): Promise<NextResponse> {
  const durationMs = rememberMe ? DEFAULT_SESSION_DURATION_MS : SHORT_SESSION_DURATION_MS;

  try {
    const sessionCookie = await createAdminSessionCookie(idToken, durationMs);
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: Math.floor(durationMs / 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Failed to create admin session cookie', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Session exchange failed' },
      { status: 401 }
    );
  }
}

/**
 * Clears the session cookie on sign out.
 */
export function clearSessionResponse(): NextResponse {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return response;
}

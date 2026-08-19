import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const ASSESSMENT_GUEST_COOKIE_NAME = 'copyscore_guest_assessment';
export const ASSESSMENT_SESSION_TTL_MS = 2 * 60 * 60 * 1000;

export function createAssessmentGuestCredential(sessionId: string): {
  cookieValue: string;
  accessHash: string;
} {
  const token = randomBytes(32).toString('base64url');
  return {
    cookieValue: `${sessionId}.${token}`,
    accessHash: hashAssessmentGuestToken(token),
  };
}

export async function getAssessmentGuestAccessHash(
  sessionId: string
): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ASSESSMENT_GUEST_COOKIE_NAME)?.value;
  if (!cookieValue) return undefined;

  const separatorIndex = cookieValue.indexOf('.');
  if (separatorIndex <= 0) return undefined;

  const cookieSessionId = cookieValue.slice(0, separatorIndex);
  const token = cookieValue.slice(separatorIndex + 1);
  if (cookieSessionId !== sessionId || !token) return undefined;

  return hashAssessmentGuestToken(token);
}

export function setAssessmentGuestCookie(
  response: NextResponse,
  cookieValue: string
): void {
  response.cookies.set({
    name: ASSESSMENT_GUEST_COOKIE_NAME,
    value: cookieValue,
    maxAge: Math.floor(ASSESSMENT_SESSION_TTL_MS / 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function clearAssessmentGuestCookie(response: NextResponse): void {
  response.cookies.set({
    name: ASSESSMENT_GUEST_COOKIE_NAME,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

function hashAssessmentGuestToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

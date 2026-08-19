import type { AssessmentSessionState } from '../types/assessment';

export interface AssessmentSessionAccessContext {
  now: number;
  userUid?: string;
  guestAccessHash?: string;
}

export type AssessmentSessionAccessResult =
  | { ok: true }
  | {
      ok: false;
      status: 403 | 410;
      code: 'ASSESSMENT_SESSION_FORBIDDEN' | 'ASSESSMENT_SESSION_EXPIRED';
      error: string;
    };

export function validateAssessmentSessionAccess(
  session: AssessmentSessionState,
  context: AssessmentSessionAccessContext
): AssessmentSessionAccessResult {
  if (!session.expiresAt || context.now >= session.expiresAt) {
    return {
      ok: false,
      status: 410,
      code: 'ASSESSMENT_SESSION_EXPIRED',
      error: 'Assessment session has expired',
    };
  }

  if (session.ownerUid) {
    if (context.userUid === session.ownerUid) {
      return { ok: true };
    }

    return {
      ok: false,
      status: 403,
      code: 'ASSESSMENT_SESSION_FORBIDDEN',
      error: 'Assessment session does not belong to this user',
    };
  }

  if (
    session.guestAccessHash &&
    context.guestAccessHash &&
    session.guestAccessHash === context.guestAccessHash
  ) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 403,
    code: 'ASSESSMENT_SESSION_FORBIDDEN',
    error: 'Assessment session does not belong to this user',
  };
}

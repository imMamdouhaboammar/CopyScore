import { describe, expect, it } from 'vitest';
import {
  validateAssessmentSessionAccess,
  type AssessmentSessionAccessContext,
} from '../../lib/engine/assessment-session-policy';
import type { AssessmentSessionState } from '../../lib/types/assessment';

function makeSession(overrides: Partial<AssessmentSessionState> = {}): AssessmentSessionState {
  return {
    sessionId: 'att-session-1',
    stage: 'CORE',
    questionIndex: 0,
    totalEstimatedQuestions: 10,
    answeredQuestionIds: [],
    responses: [],
    currentDifficulty: {
      conversion_copywriting: 2.5,
      content_creation: 2.5,
      performance_copy: 2.5,
      cro: 2.5,
    },
    startTime: 1_700_000_000_000,
    lastActiveTime: 1_700_000_000_000,
    isCompleted: false,
    ownerUid: 'user-a',
    createdAt: 1_700_000_000_000,
    expiresAt: 1_700_007_200_000,
    revision: 0,
    ...overrides,
  };
}

function context(overrides: Partial<AssessmentSessionAccessContext> = {}): AssessmentSessionAccessContext {
  return {
    now: 1_700_000_100_000,
    userUid: 'user-a',
    ...overrides,
  };
}

describe('validateAssessmentSessionAccess', () => {
  it('allows the authenticated owner', () => {
    expect(validateAssessmentSessionAccess(makeSession(), context())).toEqual({ ok: true });
  });

  it('rejects a different authenticated user', () => {
    expect(
      validateAssessmentSessionAccess(makeSession(), context({ userUid: 'user-b' }))
    ).toEqual({
      ok: false,
      status: 403,
      code: 'ASSESSMENT_SESSION_FORBIDDEN',
      error: 'Assessment session does not belong to this user',
    });
  });

  it('allows a guest only when the credential hash matches', () => {
    const session = makeSession({
      ownerUid: undefined,
      guestAccessHash: 'guest-hash-1',
    });

    expect(
      validateAssessmentSessionAccess(
        session,
        context({ userUid: undefined, guestAccessHash: 'guest-hash-1' })
      )
    ).toEqual({ ok: true });
  });

  it('rejects a guest when the credential is missing or wrong', () => {
    const session = makeSession({
      ownerUid: undefined,
      guestAccessHash: 'guest-hash-1',
    });

    expect(
      validateAssessmentSessionAccess(
        session,
        context({ userUid: undefined, guestAccessHash: undefined })
      )
    ).toMatchObject({ ok: false, status: 403, code: 'ASSESSMENT_SESSION_FORBIDDEN' });

    expect(
      validateAssessmentSessionAccess(
        session,
        context({ userUid: undefined, guestAccessHash: 'wrong-hash' })
      )
    ).toMatchObject({ ok: false, status: 403, code: 'ASSESSMENT_SESSION_FORBIDDEN' });
  });

  it('allows a signed-in user to claim their former guest session only with the guest credential', () => {
    const session = makeSession({
      ownerUid: undefined,
      guestAccessHash: 'guest-hash-1',
    });

    expect(
      validateAssessmentSessionAccess(
        session,
        context({ userUid: 'user-a', guestAccessHash: 'guest-hash-1' })
      )
    ).toEqual({ ok: true });
  });

  it('rejects expired sessions even for the correct owner', () => {
    expect(
      validateAssessmentSessionAccess(
        makeSession({ expiresAt: 1_700_000_050_000 }),
        context({ now: 1_700_000_100_000 })
      )
    ).toEqual({
      ok: false,
      status: 410,
      code: 'ASSESSMENT_SESSION_EXPIRED',
      error: 'Assessment session has expired',
    });
  });
});

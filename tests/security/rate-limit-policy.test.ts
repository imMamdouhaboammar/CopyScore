import { describe, expect, it } from 'vitest';
import {
  evaluateRateLimitWindow,
  hashRateLimitIdentity,
  type RateLimitWindowState,
} from '../../lib/security/rate-limit-policy';

const RULE = { limit: 3, windowMs: 60_000 };

describe('rate-limit policy', () => {
  it('starts a fresh window with one consumed request', () => {
    const result = evaluateRateLimitWindow(null, 1_000, RULE);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.retryAfterSeconds).toBe(60);
    expect(result.nextState).toEqual({ count: 1, windowStartedAt: 1_000 });
  });

  it('increments requests within the active window', () => {
    const state: RateLimitWindowState = { count: 1, windowStartedAt: 1_000 };
    const result = evaluateRateLimitWindow(state, 20_000, RULE);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
    expect(result.nextState.count).toBe(2);
  });

  it('rejects requests after the limit without incrementing the stored count', () => {
    const state: RateLimitWindowState = { count: 3, windowStartedAt: 1_000 };
    const result = evaluateRateLimitWindow(state, 20_000, RULE);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.nextState).toEqual(state);
    expect(result.retryAfterSeconds).toBe(41);
  });

  it('resets the counter after the window expires', () => {
    const state: RateLimitWindowState = { count: 3, windowStartedAt: 1_000 };
    const result = evaluateRateLimitWindow(state, 61_000, RULE);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.nextState).toEqual({ count: 1, windowStartedAt: 61_000 });
  });

  it('hashes identities deterministically without exposing the raw value', () => {
    const first = hashRateLimitIdentity('ip:203.0.113.42');
    const second = hashRateLimitIdentity('ip:203.0.113.42');

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(first).not.toContain('203.0.113.42');
  });
});

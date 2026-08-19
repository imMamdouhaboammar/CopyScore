import { createHash } from 'node:crypto';

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export interface RateLimitWindowState {
  count: number;
  windowStartedAt: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  nextState: RateLimitWindowState;
}

export function evaluateRateLimitWindow(
  currentState: RateLimitWindowState | null,
  now: number,
  rule: RateLimitRule
): RateLimitDecision {
  assertValidRule(rule);

  const windowExpired =
    !currentState || now >= currentState.windowStartedAt + rule.windowMs;

  if (windowExpired) {
    return {
      allowed: true,
      remaining: Math.max(0, rule.limit - 1),
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
      nextState: {
        count: 1,
        windowStartedAt: now,
      },
    };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((currentState.windowStartedAt + rule.windowMs - now) / 1000)
  );

  if (currentState.count >= rule.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      nextState: currentState,
    };
  }

  const nextCount = currentState.count + 1;
  return {
    allowed: true,
    remaining: Math.max(0, rule.limit - nextCount),
    retryAfterSeconds,
    nextState: {
      count: nextCount,
      windowStartedAt: currentState.windowStartedAt,
    },
  };
}

export function hashRateLimitIdentity(identity: string): string {
  return createHash('sha256').update(identity).digest('hex');
}

function assertValidRule(rule: RateLimitRule): void {
  if (!Number.isInteger(rule.limit) || rule.limit <= 0) {
    throw new Error('Rate limit must be a positive integer');
  }
  if (!Number.isFinite(rule.windowMs) || rule.windowMs <= 0) {
    throw new Error('Rate-limit window must be positive');
  }
}

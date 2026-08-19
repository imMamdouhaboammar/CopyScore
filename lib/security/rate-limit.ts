import 'server-only';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAdminFirestore } from '../firebase/admin';
import {
  evaluateRateLimitWindow,
  hashRateLimitIdentity,
  type RateLimitDecision,
  type RateLimitRule,
  type RateLimitWindowState,
} from './rate-limit-policy';

const RATE_LIMIT_COLLECTION = 'rateLimits';
const TEN_MINUTES_MS = 10 * 60 * 1000;

export const ASSESSMENT_RATE_LIMITS = {
  start: { limit: 30, windowMs: TEN_MINUTES_MS },
  next: { limit: 80, windowMs: TEN_MINUTES_MS },
  submit: { limit: 20, windowMs: TEN_MINUTES_MS },
  evaluate: { limit: 20, windowMs: TEN_MINUTES_MS },
} as const satisfies Record<string, RateLimitRule>;

export interface DistributedRateLimitResult extends RateLimitDecision {
  limit: number;
}

interface PersistedRateLimitState extends RateLimitWindowState {
  scope: string;
  expiresAt: number;
  updatedAt: number;
}

export async function enforceDistributedRateLimit(input: {
  scope: string;
  subject: string;
  rule: RateLimitRule;
  now?: number;
}): Promise<DistributedRateLimitResult> {
  const now = input.now ?? Date.now();
  const db = getAdminFirestore();
  const documentId = hashRateLimitIdentity(`${input.scope}:${input.subject}`);
  const reference = db.collection(RATE_LIMIT_COLLECTION).doc(documentId);

  const decision = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const persisted = snapshot.exists
      ? (snapshot.data() as Partial<PersistedRateLimitState>)
      : null;
    const currentState =
      persisted &&
      typeof persisted.count === 'number' &&
      typeof persisted.windowStartedAt === 'number'
        ? {
            count: persisted.count,
            windowStartedAt: persisted.windowStartedAt,
          }
        : null;

    const result = evaluateRateLimitWindow(currentState, now, input.rule);
    if (result.allowed) {
      transaction.set(reference, {
        scope: input.scope,
        count: result.nextState.count,
        windowStartedAt: result.nextState.windowStartedAt,
        expiresAt: result.nextState.windowStartedAt + input.rule.windowMs * 2,
        updatedAt: now,
      } satisfies PersistedRateLimitState);
    }

    return result;
  });

  return {
    ...decision,
    limit: input.rule.limit,
  };
}

export function resolveRateLimitSubject(
  req: NextRequest,
  input: { userUid?: string | null; sessionId?: string | null } = {}
): string {
  if (input.userUid) {
    return `user:${input.userUid}`;
  }
  if (input.sessionId) {
    return `session:${input.sessionId}`;
  }

  const clientAddress = resolveClientAddress(req);
  return `client:${clientAddress || 'unknown'}`;
}

export function createRateLimitExceededResponse(
  result: DistributedRateLimitResult
): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: rateLimitHeaders(result),
    }
  );
}

export function rateLimitHeaders(
  result: DistributedRateLimitResult
): Record<string, string> {
  return {
    'Retry-After': String(result.retryAfterSeconds),
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
    'RateLimit-Reset': String(result.retryAfterSeconds),
  };
}

function resolveClientAddress(req: NextRequest): string | null {
  const cloudflareAddress = req.headers.get('cf-connecting-ip')?.trim();
  if (cloudflareAddress) return cloudflareAddress;

  const realAddress = req.headers.get('x-real-ip')?.trim();
  if (realAddress) return realAddress;

  const forwarded = req.headers.get('x-forwarded-for');
  if (!forwarded) return null;
  return forwarded.split(',')[0]?.trim() || null;
}

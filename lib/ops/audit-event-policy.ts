export const AUDIT_EVENT_SCHEMA_VERSION = 1 as const;
export const AUDIT_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

export type AuditEventType =
  | 'auth.session.created'
  | 'auth.profile.updated'
  | 'auth.account.deleted'
  | 'assessment.finalized'
  | 'assessment.guest_claimed'
  | 'security.rate_limit.blocked';

export type AuditEventOutcome = 'success' | 'failure' | 'blocked';

export interface AuditEventInput {
  eventType: AuditEventType;
  outcome: AuditEventOutcome;
  actorUid?: string;
  subjectId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditEventRecord {
  schemaVersion: typeof AUDIT_EVENT_SCHEMA_VERSION;
  eventType: AuditEventType;
  outcome: AuditEventOutcome;
  createdAt: number;
  expiresAt: number;
  actorUid?: string;
  subjectId?: string;
  requestId?: string;
  metadata?: Record<string, string | number | boolean>;
}

const ALLOWED_METADATA_KEYS = new Set([
  'assessmentVersion',
  'verified',
  'rememberMe',
  'profileChanged',
  'rateLimitScope',
  'retryAfterSeconds',
  'authMode',
]);

export function buildAuditEvent(
  input: AuditEventInput,
  now: number = Date.now()
): AuditEventRecord {
  if (!Number.isFinite(now) || now <= 0) {
    throw new Error('Audit event timestamp must be a positive finite number');
  }

  const metadata = sanitizeMetadata(input.metadata);
  const event: AuditEventRecord = {
    schemaVersion: AUDIT_EVENT_SCHEMA_VERSION,
    eventType: input.eventType,
    outcome: input.outcome,
    createdAt: now,
    expiresAt: now + AUDIT_RETENTION_MS,
  };

  const actorUid = normalizeIdentifier(input.actorUid);
  const subjectId = normalizeIdentifier(input.subjectId);
  const requestId = normalizeIdentifier(input.requestId);

  if (actorUid) event.actorUid = actorUid;
  if (subjectId) event.subjectId = subjectId;
  if (requestId) event.requestId = requestId;
  if (metadata && Object.keys(metadata).length > 0) event.metadata = metadata;

  return event;
}

function sanitizeMetadata(
  metadata?: Record<string, unknown>
): Record<string, string | number | boolean> | undefined {
  if (!metadata) return undefined;

  const sanitized: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!ALLOWED_METADATA_KEYS.has(key)) {
      throw new Error(`Audit metadata key is not allowed: ${key}`);
    }

    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean'
    ) {
      throw new Error(`Audit metadata value must be scalar: ${key}`);
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error(`Audit metadata number must be finite: ${key}`);
    }

    if (typeof value === 'string') {
      const normalized = value.trim();
      if (!normalized) continue;
      sanitized[key] = normalized.slice(0, 160);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function normalizeIdentifier(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 160) : undefined;
}

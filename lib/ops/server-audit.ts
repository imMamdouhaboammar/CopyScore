import 'server-only';

import { randomUUID } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { getAdminFirestore } from '../firebase/admin';
import {
  buildAuditEvent,
  type AuditEventInput,
} from './audit-event-policy';

const AUDIT_COLLECTION = 'auditEvents';

export async function recordAuditEvent(
  input: AuditEventInput,
  now: number = Date.now()
): Promise<string> {
  const event = buildAuditEvent(input, now);
  const eventId = randomUUID();
  await getAdminFirestore()
    .collection(AUDIT_COLLECTION)
    .doc(eventId)
    .create(event);
  return eventId;
}

export async function recordAuditEventSafely(
  input: AuditEventInput,
  now: number = Date.now()
): Promise<boolean> {
  try {
    await recordAuditEvent(input, now);
    return true;
  } catch (error) {
    console.error('Audit event write failed', {
      eventType: input.eventType,
      outcome: input.outcome,
      error: error instanceof Error ? error.message : 'unknown_audit_error',
    });
    return false;
  }
}

export function resolveAuditRequestId(req: NextRequest): string {
  const supplied = req.headers.get('x-request-id')?.trim();
  if (supplied && /^[a-zA-Z0-9._:-]{1,120}$/.test(supplied)) {
    return supplied;
  }
  return randomUUID();
}

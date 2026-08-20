import { describe, expect, it } from 'vitest';
import {
  buildAuditEvent,
  type AuditEventInput,
} from '../../lib/ops/audit-event-policy';

const BASE: AuditEventInput = {
  eventType: 'assessment.finalized',
  outcome: 'success',
  actorUid: 'user-123',
  subjectId: 'att-123',
  requestId: 'req-123',
  metadata: {
    assessmentVersion: 'v1.4.2-adaptive',
    verified: true,
  },
};

describe('audit event policy', () => {
  it('builds a versioned event with a retention timestamp', () => {
    const event = buildAuditEvent(BASE, 1_700_000_000_000);

    expect(event.schemaVersion).toBe(1);
    expect(event.createdAt).toBe(1_700_000_000_000);
    expect(event.expiresAt).toBeGreaterThan(event.createdAt);
    expect(event.eventType).toBe('assessment.finalized');
    expect(event.metadata).toEqual({
      assessmentVersion: 'v1.4.2-adaptive',
      verified: true,
    });
  });

  it('rejects sensitive or free-form metadata keys', () => {
    expect(() =>
      buildAuditEvent({
        ...BASE,
        metadata: {
          email: 'person@example.com',
          assessmentVersion: 'v1.4.2-adaptive',
        } as AuditEventInput['metadata'],
      })
    ).toThrow(/metadata/i);

    expect(() =>
      buildAuditEvent({
        ...BASE,
        metadata: {
          rawBody: '{"copy":"secret"}',
        } as AuditEventInput['metadata'],
      })
    ).toThrow(/metadata/i);
  });

  it('rejects nested objects and arrays from metadata', () => {
    expect(() =>
      buildAuditEvent({
        ...BASE,
        metadata: {
          changedFields: ['displayName'],
        } as AuditEventInput['metadata'],
      })
    ).toThrow(/metadata/i);
  });

  it('normalizes optional identifiers instead of storing empty strings', () => {
    const event = buildAuditEvent({
      ...BASE,
      actorUid: ' ',
      subjectId: '',
      requestId: ' req-123 ',
    });

    expect(event.actorUid).toBeUndefined();
    expect(event.subjectId).toBeUndefined();
    expect(event.requestId).toBe('req-123');
  });

  it('supports the approved operational event types', () => {
    const types: AuditEventInput['eventType'][] = [
      'auth.session.created',
      'auth.profile.updated',
      'auth.account.deleted',
      'assessment.finalized',
      'assessment.guest_claimed',
      'security.rate_limit.blocked',
    ];

    for (const eventType of types) {
      expect(buildAuditEvent({ ...BASE, eventType }).eventType).toBe(eventType);
    }
  });
});

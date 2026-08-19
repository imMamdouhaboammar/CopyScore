import { describe, expect, it } from 'vitest';
import { guestClaimSchema } from '../../lib/auth/schemas';

describe('guestClaimSchema', () => {
  it('accepts only a server-known assessment attempt id', () => {
    expect(
      guestClaimSchema.safeParse({
        attemptId: 'attempt_abc123',
      }).success
    ).toBe(true);
  });

  it('rejects a client-supplied score payload', () => {
    expect(
      guestClaimSchema.safeParse({
        score: {
          attemptId: 'attempt_abc123',
          overallScore: 100,
          isVerified: true,
        },
      }).success
    ).toBe(false);
  });

  it('strips or rejects extra score fields rather than trusting them', () => {
    const result = guestClaimSchema.safeParse({
      attemptId: 'attempt_abc123',
      overallScore: 100,
      verificationHash: 'forged',
    });

    expect(result.success).toBe(false);
  });

  it('rejects empty or excessively long attempt ids', () => {
    expect(guestClaimSchema.safeParse({ attemptId: '' }).success).toBe(false);
    expect(guestClaimSchema.safeParse({ attemptId: 'a'.repeat(129) }).success).toBe(false);
  });
});

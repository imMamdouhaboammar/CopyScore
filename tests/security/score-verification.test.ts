import { describe, expect, it } from 'vitest';
import type { FinalAssessmentScore } from '../../lib/types/assessment';
import {
  SCORE_SIGNATURE_PREFIX,
  ScoreVerificationConfigurationError,
  resolveScoreSigningSecret,
  signFinalAssessmentScore,
  verifyFinalAssessmentScore,
} from '../../lib/engine/score-verification';

const STRONG_SECRET = 'test-secret-with-at-least-32-characters-long';

function makeScore(overrides: Partial<FinalAssessmentScore> = {}): FinalAssessmentScore {
  return {
    attemptId: 'att-test-123',
    assessmentVersion: 'v1.4.2-adaptive',
    createdAt: 1_700_000_000_000,
    completedAt: 1_700_000_600_000,
    overallScore: 84,
    percentile: 92,
    confidenceLevel: 91,
    rankTitle: 'Advanced Specialist (Tier II)',
    maxDifficultyReached: 4,
    domainScores: {
      conversion_copywriting: {
        domain: 'conversion_copywriting',
        rawScore: 4,
        scaledScore: 86,
        questionsAttempted: 3,
        accuracy: 67,
        highestDifficultyCleared: 4,
        statusLabel: 'Advanced',
      },
      content_creation: {
        domain: 'content_creation',
        rawScore: 3.5,
        scaledScore: 82,
        questionsAttempted: 2,
        accuracy: 50,
        highestDifficultyCleared: 3,
        statusLabel: 'Advanced',
      },
      performance_copy: {
        domain: 'performance_copy',
        rawScore: 4.4,
        scaledScore: 88,
        questionsAttempted: 3,
        accuracy: 67,
        highestDifficultyCleared: 4,
        statusLabel: 'Expert',
      },
      cro: {
        domain: 'cro',
        rawScore: 3.2,
        scaledScore: 80,
        questionsAttempted: 2,
        accuracy: 50,
        highestDifficultyCleared: 3,
        statusLabel: 'Advanced',
      },
    },
    archetype: {
      id: 'message-strategist',
      name: 'Message Strategist',
      tagline: 'Test',
      badge: 'test',
      description: 'test',
      superpower: 'test',
      blindspot: 'test',
      dominantDomains: ['conversion_copywriting'],
    },
    whatYouDidWell: ['Clear positioning'],
    whatCostYouPoints: ['Weak proof'],
    growthActions: ['Add stronger proof'],
    totalTimeSeconds: 600,
    verificationHash: '',
    isVerified: false,
    userHandle: 'guest_initial',
    ...overrides,
  };
}

describe('score verification', () => {
  it('signs a score with a versioned HMAC and verifies the unchanged score', () => {
    const signed = signFinalAssessmentScore(makeScore(), STRONG_SECRET);

    expect(signed.isVerified).toBe(true);
    expect(signed.verificationHash.startsWith(SCORE_SIGNATURE_PREFIX)).toBe(true);
    expect(verifyFinalAssessmentScore(signed, STRONG_SECRET)).toBe(true);
  });

  it('rejects verification after any signed score field is tampered with', () => {
    const signed = signFinalAssessmentScore(makeScore(), STRONG_SECRET);

    expect(
      verifyFinalAssessmentScore({ ...signed, overallScore: signed.overallScore + 1 }, STRONG_SECRET)
    ).toBe(false);
    expect(
      verifyFinalAssessmentScore(
        {
          ...signed,
          domainScores: {
            ...signed.domainScores,
            cro: { ...signed.domainScores.cro, scaledScore: 99 },
          },
        },
        STRONG_SECRET
      )
    ).toBe(false);
  });

  it('keeps the score proof valid when a guest result is rebound to a server-owned handle', () => {
    const signed = signFinalAssessmentScore(makeScore(), STRONG_SECRET);
    const claimed = { ...signed, userHandle: 'canonical_account_handle' };

    expect(verifyFinalAssessmentScore(claimed, STRONG_SECRET)).toBe(true);
  });

  it('rejects signatures made with a different secret', () => {
    const signed = signFinalAssessmentScore(makeScore(), STRONG_SECRET);
    expect(
      verifyFinalAssessmentScore(signed, 'different-secret-with-at-least-32-characters')
    ).toBe(false);
  });

  it('requires a strong signing secret in production', () => {
    expect(() =>
      resolveScoreSigningSecret({ NODE_ENV: 'production' } as NodeJS.ProcessEnv)
    ).toThrow(ScoreVerificationConfigurationError);

    expect(() =>
      resolveScoreSigningSecret({
        NODE_ENV: 'production',
        COPYSCORE_SCORE_SIGNING_SECRET: 'too-short',
      } as NodeJS.ProcessEnv)
    ).toThrow(ScoreVerificationConfigurationError);
  });

  it('allows development to run explicitly unverified when no secret is configured', () => {
    expect(resolveScoreSigningSecret({ NODE_ENV: 'development' } as NodeJS.ProcessEnv)).toBeNull();
  });
});

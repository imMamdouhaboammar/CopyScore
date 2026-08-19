import { createHmac, timingSafeEqual } from 'node:crypto';
import type { DomainId, FinalAssessmentScore } from '../types/assessment';

export const SCORE_SIGNATURE_PREFIX = 'CS-HMAC-V1.';
const MIN_SIGNING_SECRET_LENGTH = 32;
const DOMAIN_ORDER: DomainId[] = [
  'conversion_copywriting',
  'content_creation',
  'performance_copy',
  'cro',
];

export class ScoreVerificationConfigurationError extends Error {
  readonly code = 'SCORE_VERIFICATION_CONFIGURATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ScoreVerificationConfigurationError';
  }
}

export function resolveScoreSigningSecret(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  const secret = env.COPYSCORE_SCORE_SIGNING_SECRET?.trim();

  if (!secret) {
    if (env.NODE_ENV === 'production') {
      throw new ScoreVerificationConfigurationError(
        'COPYSCORE_SCORE_SIGNING_SECRET is required in production'
      );
    }
    return null;
  }

  if (secret.length < MIN_SIGNING_SECRET_LENGTH) {
    throw new ScoreVerificationConfigurationError(
      `COPYSCORE_SCORE_SIGNING_SECRET must contain at least ${MIN_SIGNING_SECRET_LENGTH} characters`
    );
  }

  return secret;
}

export function signFinalAssessmentScore(
  score: FinalAssessmentScore,
  secret: string
): FinalAssessmentScore {
  assertStrongSecret(secret);
  const signature = createSignature(score, secret);

  return {
    ...score,
    verificationHash: `${SCORE_SIGNATURE_PREFIX}${signature}`,
    isVerified: true,
  };
}

export function verifyFinalAssessmentScore(
  score: FinalAssessmentScore,
  secret: string
): boolean {
  if (!score.isVerified || !score.verificationHash.startsWith(SCORE_SIGNATURE_PREFIX)) {
    return false;
  }

  try {
    assertStrongSecret(secret);
    const received = score.verificationHash.slice(SCORE_SIGNATURE_PREFIX.length);
    const expected = createSignature(score, secret);
    const receivedBuffer = Buffer.from(received, 'base64url');
    const expectedBuffer = Buffer.from(expected, 'base64url');

    return (
      receivedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(receivedBuffer, expectedBuffer)
    );
  } catch {
    return false;
  }
}

function createSignature(score: FinalAssessmentScore, secret: string): string {
  return createHmac('sha256', secret)
    .update(buildVerificationPayload(score))
    .digest('base64url');
}

function buildVerificationPayload(score: FinalAssessmentScore): string {
  const domainScores = Object.fromEntries(
    DOMAIN_ORDER.map((domain) => {
      const item = score.domainScores[domain];
      return [
        domain,
        {
          rawScore: item.rawScore,
          scaledScore: item.scaledScore,
          questionsAttempted: item.questionsAttempted,
          accuracy: item.accuracy,
          highestDifficultyCleared: item.highestDifficultyCleared,
          statusLabel: item.statusLabel,
        },
      ];
    })
  );

  return JSON.stringify({
    attemptId: score.attemptId,
    assessmentVersion: score.assessmentVersion,
    createdAt: score.createdAt,
    completedAt: score.completedAt,
    overallScore: score.overallScore,
    percentile: score.percentile,
    confidenceLevel: score.confidenceLevel,
    rankTitle: score.rankTitle,
    maxDifficultyReached: score.maxDifficultyReached,
    domainScores,
    archetypeId: score.archetype.id,
    totalTimeSeconds: score.totalTimeSeconds,
    userHandle: score.userHandle ?? null,
  });
}

function assertStrongSecret(secret: string): void {
  if (secret.trim().length < MIN_SIGNING_SECRET_LENGTH) {
    throw new ScoreVerificationConfigurationError(
      `Score signing secret must contain at least ${MIN_SIGNING_SECRET_LENGTH} characters`
    );
  }
}

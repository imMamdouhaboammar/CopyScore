import { describe, expect, it } from 'vitest';
import { calculateFinalScore } from '../../lib/engine/scoring';
import type { DomainId, EvaluatedResponse } from '../../lib/types/assessment';

const domains: DomainId[] = ['conversion_copywriting', 'content_creation', 'performance_copy', 'cro'];

function responses(count: number, domain?: DomainId): EvaluatedResponse[] {
  return Array.from({ length: count }, (_, index) => ({
    questionId: `fixture-${index}`,
    userAnswer: 'a',
    timeSpentMs: 1000,
    timestamp: index,
    isCorrect: true,
    scoreRatio: 1,
    domain: domain ?? domains[index % domains.length],
    difficulty: 2,
    discrimination: 1,
  }));
}

describe('assessment result confidence', () => {
  it('does not let repeated evidence in one domain substitute for missing domains', () => {
    const score = calculateFinalScore('attempt-1', responses(12, 'conversion_copywriting'), 0, 60_000);

    expect(score.confidenceLevel).toBeLessThan(50);
  });

  it('increases with broader domain evidence and saturates at the documented cap', () => {
    const partial = calculateFinalScore('attempt-1', responses(3), 0, 60_000);
    const covered = calculateFinalScore('attempt-2', responses(8), 0, 60_000);
    const saturated = calculateFinalScore('attempt-3', responses(16), 0, 60_000);

    expect(covered.confidenceLevel).toBeGreaterThan(partial.confidenceLevel);
    expect(covered.confidenceLevel).toBeLessThanOrEqual(95);
    expect(saturated.confidenceLevel).toBe(95);
  });
});

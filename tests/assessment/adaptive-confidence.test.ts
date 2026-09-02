import { describe, expect, it } from 'vitest';
import { selectNextAdaptiveQuestion } from '../../lib/engine/adaptive';
import type { DomainId, EvaluatedResponse } from '../../lib/types/assessment';

const domains: DomainId[] = ['conversion_copywriting', 'content_creation', 'performance_copy', 'cro'];
const skills: Record<DomainId, number> = {
  conversion_copywriting: 3,
  content_creation: 3,
  performance_copy: 3,
  cro: 3,
};

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

function answeredIds(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `fixture-${index}`);
}

describe('adaptive diagnostic confidence', () => {
  it('does not let response count hide evidence concentrated in one domain', () => {
    const concentrated = selectNextAdaptiveQuestion(
      answeredIds(8),
      responses(8, 'conversion_copywriting'),
      skills
    );
    const distributed = selectNextAdaptiveQuestion(answeredIds(8), responses(8), skills);

    expect(concentrated.estimatedConfidence).toBeLessThan(50);
    expect(distributed.estimatedConfidence).toBeGreaterThan(concentrated.estimatedConfidence);
  });

  it('keeps completion confidence evidence-aware instead of returning a fixed value', () => {
    const concentrated = selectNextAdaptiveQuestion(
      answeredIds(10),
      responses(10, 'conversion_copywriting'),
      skills
    );
    const distributed = selectNextAdaptiveQuestion(answeredIds(10), responses(10), skills);

    expect(concentrated.isCompleted).toBe(true);
    expect(distributed.isCompleted).toBe(true);
    expect(concentrated.estimatedConfidence).toBeLessThan(50);
    expect(distributed.estimatedConfidence).toBeGreaterThan(concentrated.estimatedConfidence);
    expect(distributed.estimatedConfidence).toBeLessThanOrEqual(95);
  });
});

import { describe, expect, it } from 'vitest';
import { EvaluationResultSchema } from '../../lib/ai/evaluation-schema';

const validEvaluation = {
  score: 82,
  isPassing: true,
  rubric: {
    clarity: 8,
    specificity: 7,
    audienceFit: 9,
    constraintCompliance: 9,
  },
  feedback: 'Clear commercial intent with one concrete opportunity to sharpen proof.',
};

describe('EvaluationResultSchema', () => {
  it('accepts a bounded evaluator response', () => {
    expect(EvaluationResultSchema.safeParse(validEvaluation).success).toBe(true);
  });

  it('rejects overall scores outside 0 to 100', () => {
    expect(EvaluationResultSchema.safeParse({ ...validEvaluation, score: 101 }).success).toBe(false);
    expect(EvaluationResultSchema.safeParse({ ...validEvaluation, score: -1 }).success).toBe(false);
  });

  it('rejects rubric scores outside 0 to 10', () => {
    expect(
      EvaluationResultSchema.safeParse({
        ...validEvaluation,
        rubric: { ...validEvaluation.rubric, clarity: 11 },
      }).success
    ).toBe(false);
  });

  it('rejects missing rubric dimensions', () => {
    const { audienceFit: _removed, ...incompleteRubric } = validEvaluation.rubric;
    expect(
      EvaluationResultSchema.safeParse({
        ...validEvaluation,
        rubric: incompleteRubric,
      }).success
    ).toBe(false);
  });

  it('rejects non-boolean passing status', () => {
    expect(
      EvaluationResultSchema.safeParse({ ...validEvaluation, isPassing: 'yes' }).success
    ).toBe(false);
  });

  it('rejects unexpected fields so model output cannot smuggle extra data', () => {
    expect(
      EvaluationResultSchema.safeParse({ ...validEvaluation, modelInstruction: 'ignore policy' }).success
    ).toBe(false);
  });

  it('rejects empty or excessively long feedback', () => {
    expect(EvaluationResultSchema.safeParse({ ...validEvaluation, feedback: '' }).success).toBe(false);
    expect(
      EvaluationResultSchema.safeParse({ ...validEvaluation, feedback: 'x'.repeat(1001) }).success
    ).toBe(false);
  });
});

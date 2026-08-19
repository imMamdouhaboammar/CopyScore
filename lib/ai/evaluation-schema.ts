import { z } from 'zod';

export const EvaluationRubricSchema = z
  .object({
    clarity: z.number().min(0).max(10),
    specificity: z.number().min(0).max(10),
    audienceFit: z.number().min(0).max(10),
    constraintCompliance: z.number().min(0).max(10),
  })
  .strict();

export const EvaluationResultSchema = z
  .object({
    score: z.number().min(0).max(100),
    isPassing: z.boolean(),
    rubric: EvaluationRubricSchema,
    feedback: z.string().min(1).max(1000),
  })
  .strict();

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

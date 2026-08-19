import { describe, expect, it } from 'vitest';
import { validateAssessmentAnswer } from '../../lib/engine/assessment-integrity';
import type { AssessmentSessionState, ClientQuestion } from '../../lib/types/assessment';

const activeQuestion: ClientQuestion = {
  id: 'q-active',
  code: 'COPY-001',
  domain: 'conversion_copywriting',
  subskill: 'clarity',
  difficulty: 3,
  type: 'single_choice',
  estimatedSeconds: 45,
  discrimination: 1,
  prompt: 'Choose the clearest commercial message.',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
  ],
  explanation: 'Fixture question for integrity policy tests.',
  diagnosticInsight: {
    goodOutcome: 'Chooses the active server-selected question.',
    pitfall: 'Attempts to skip or replay a question.',
  },
};

function makeSession(overrides: Partial<AssessmentSessionState> = {}): AssessmentSessionState {
  return {
    sessionId: 'session-1',
    stage: 'CORE',
    questionIndex: 2,
    totalEstimatedQuestions: 10,
    answeredQuestionIds: [],
    responses: [],
    currentDifficulty: {
      conversion_copywriting: 3,
      content_creation: 3,
      performance_copy: 3,
      cro: 3,
    },
    currentQuestion: activeQuestion,
    startTime: 1_700_000_000_000,
    lastActiveTime: 1_700_000_010_000,
    isCompleted: false,
    ...overrides,
  };
}

describe('validateAssessmentAnswer', () => {
  it('accepts the current server-selected question', () => {
    expect(validateAssessmentAnswer(makeSession(), activeQuestion.id)).toEqual({ ok: true });
  });

  it('rejects a question that is not currently active', () => {
    expect(validateAssessmentAnswer(makeSession(), 'q-other')).toEqual({
      ok: false,
      status: 409,
      error: 'Question is not active for this assessment session',
    });
  });

  it('rejects a replay before any mutation can occur', () => {
    expect(
      validateAssessmentAnswer(
        makeSession({ answeredQuestionIds: [activeQuestion.id] }),
        activeQuestion.id
      )
    ).toEqual({
      ok: false,
      status: 409,
      error: 'Question already answered',
    });
  });

  it('rejects additional answers after completion', () => {
    expect(validateAssessmentAnswer(makeSession({ isCompleted: true }), activeQuestion.id)).toEqual({
      ok: false,
      status: 409,
      error: 'Assessment already completed',
    });
  });
});

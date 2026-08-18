import { AssessmentSessionState } from '../types/assessment';

export type AssessmentAnswerIntegrityResult =
  | { ok: true }
  | { ok: false; status: 409; error: string };

/**
 * Enforces the server-owned assessment sequence.
 * A client may answer only the question the session currently exposes, once.
 */
export function validateAssessmentAnswer(
  session: AssessmentSessionState,
  questionId: string
): AssessmentAnswerIntegrityResult {
  if (session.isCompleted) {
    return { ok: false, status: 409, error: 'Assessment already completed' };
  }

  if (session.answeredQuestionIds.includes(questionId)) {
    return { ok: false, status: 409, error: 'Question already answered' };
  }

  if (!session.currentQuestion || session.currentQuestion.id !== questionId) {
    return { ok: false, status: 409, error: 'Question is not active for this assessment session' };
  }

  return { ok: true };
}

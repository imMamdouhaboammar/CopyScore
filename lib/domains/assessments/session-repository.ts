import 'server-only';

import { getAdminFirestore } from '../../firebase/admin';
import type { AssessmentSessionState } from '../../types/assessment';

const COLLECTION = 'assessmentSessions';

export class AssessmentSessionRevisionConflictError extends Error {
  constructor() {
    super('ASSESSMENT_SESSION_REVISION_CONFLICT');
    this.name = 'AssessmentSessionRevisionConflictError';
  }
}

export async function createAssessmentSession(
  session: AssessmentSessionState
): Promise<AssessmentSessionState> {
  const normalized = normalizeSession({ ...session, revision: 0 });
  await getAdminFirestore().collection(COLLECTION).doc(session.sessionId).create(normalized);
  return normalized;
}

export async function getAssessmentSession(
  sessionId: string
): Promise<AssessmentSessionState | null> {
  const snapshot = await getAdminFirestore().collection(COLLECTION).doc(sessionId).get();
  return snapshot.exists ? (snapshot.data() as AssessmentSessionState) : null;
}

export async function saveAssessmentSession(
  session: AssessmentSessionState,
  expectedRevision: number
): Promise<AssessmentSessionState> {
  const db = getAdminFirestore();
  const reference = db.collection(COLLECTION).doc(session.sessionId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error('ASSESSMENT_SESSION_NOT_FOUND');

    const persisted = snapshot.data() as AssessmentSessionState;
    const currentRevision = persisted.revision ?? 0;
    if (currentRevision !== expectedRevision) {
      throw new AssessmentSessionRevisionConflictError();
    }

    const next = normalizeSession({
      ...session,
      revision: expectedRevision + 1,
    });
    transaction.set(reference, next);
    return next;
  });
}

function normalizeSession(session: AssessmentSessionState): AssessmentSessionState {
  return JSON.parse(JSON.stringify(session)) as AssessmentSessionState;
}

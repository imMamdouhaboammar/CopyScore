import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-copyscore-audit-rules';
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'auditEvents', 'event-1'), {
      schemaVersion: 1,
      eventType: 'assessment.finalized',
      outcome: 'success',
    });
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('audit event client isolation', () => {
  it('denies unauthenticated reads and writes', async () => {
    const db = testEnv.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(db, 'auditEvents', 'event-1')));
    await assertFails(setDoc(doc(db, 'auditEvents', 'event-2'), { eventType: 'forged' }));
  });

  it('denies ordinary authenticated users', async () => {
    const db = testEnv.authenticatedContext('user-1').firestore();

    await assertFails(getDoc(doc(db, 'auditEvents', 'event-1')));
    await assertFails(setDoc(doc(db, 'auditEvents', 'event-2'), { eventType: 'forged' }));
  });

  it('denies client SDK access even with an admin custom claim', async () => {
    const db = testEnv.authenticatedContext('admin-1', { admin: true }).firestore();

    await assertFails(getDoc(doc(db, 'auditEvents', 'event-1')));
    await assertFails(setDoc(doc(db, 'auditEvents', 'event-2'), { eventType: 'forged' }));
  });
});

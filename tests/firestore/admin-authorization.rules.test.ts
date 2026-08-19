import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, setDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-copyscore-admin-rules';
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
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('admin authorization', () => {
  it('does not grant admin access from an email address alone', async () => {
    const emailOnly = testEnv.authenticatedContext('user-email-only', {
      email: 'mamdouhFces1997@gmail.com',
    });

    await assertFails(
      setDoc(doc(emailOnly.firestore(), 'aiResources', 'resource-1'), {
        name: 'Email must not be an admin credential',
      })
    );
  });

  it('accepts the explicit admin boolean custom claim', async () => {
    const admin = testEnv.authenticatedContext('admin-claim', { admin: true });

    await assertSucceeds(
      setDoc(doc(admin.firestore(), 'aiResources', 'resource-1'), {
        name: 'Admin managed resource',
      })
    );
  });

  it('accepts the explicit role=admin custom claim used by the server session contract', async () => {
    const admin = testEnv.authenticatedContext('role-admin', { role: 'admin' });

    await assertSucceeds(
      setDoc(doc(admin.firestore(), 'aiCollections', 'collection-1'), {
        title: 'Admin managed collection',
      })
    );
  });

  it('accepts a server-provisioned admins document', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'admins', 'admin-record'), {
        active: true,
      });
    });

    const admin = testEnv.authenticatedContext('admin-record');
    await assertSucceeds(
      setDoc(doc(admin.firestore(), 'aiResources', 'resource-2'), {
        name: 'Document authorized resource',
      })
    );
  });
});

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-copyscore-rules';
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

describe('Firestore trust boundaries', () => {
  it('allows public reads of intentionally public profile data', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'publicProfiles', 'mamdouh'), {
        uid: 'user-a',
        handle: 'mamdouh',
        displayName: 'Mamdouh',
      });
    });

    const anonymous = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(anonymous.firestore(), 'publicProfiles', 'mamdouh')));
  });

  it('denies direct client writes to assessment results', async () => {
    const authenticated = testEnv.authenticatedContext('user-a');
    await assertFails(
      setDoc(doc(authenticated.firestore(), 'results', 'attempt-1'), {
        userId: 'user-a',
        overallScore: 100,
      })
    );
  });

  it('denies direct client writes to challenges', async () => {
    const authenticated = testEnv.authenticatedContext('user-a');
    await assertFails(
      setDoc(doc(authenticated.firestore(), 'challenges', 'challenge-1'), {
        creatorHandle: 'user-a',
        creatorScore: 100,
      })
    );
  });

  it('denies direct client writes to leaderboard entries', async () => {
    const authenticated = testEnv.authenticatedContext('user-a');
    await assertFails(
      setDoc(doc(authenticated.firestore(), 'leaderboard', 'entry-1'), {
        userId: 'user-a',
        score: 100,
      })
    );
  });

  it('allows a user to create a handle reservation only for their own uid', async () => {
    const userA = testEnv.authenticatedContext('user-a');

    await assertSucceeds(
      setDoc(doc(userA.firestore(), 'handles', 'mamdouh'), {
        handle: 'mamdouh',
        uid: 'user-a',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );

    await assertFails(
      setDoc(doc(userA.firestore(), 'handles', 'forged'), {
        handle: 'forged',
        uid: 'user-b',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );
  });

  it('prevents another user from taking over an existing handle', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'handles', 'mamdouh'), {
        handle: 'mamdouh',
        uid: 'user-a',
        createdAt: '2026-08-19T00:00:00.000Z',
      });
    });

    const userB = testEnv.authenticatedContext('user-b');
    await assertFails(
      setDoc(doc(userB.firestore(), 'handles', 'mamdouh'), {
        handle: 'mamdouh',
        uid: 'user-b',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );
  });

  it('allows users to manage only their own AI stack', async () => {
    const userA = testEnv.authenticatedContext('user-a');

    await assertSucceeds(
      setDoc(doc(userA.firestore(), 'userAIStacks', 'user-a'), {
        userId: 'user-a',
        installedSlugs: [],
        favoriteSlugs: [],
        wantToTrySlugs: [],
      })
    );

    await assertFails(
      setDoc(doc(userA.firestore(), 'userAIStacks', 'user-b'), {
        userId: 'user-b',
        installedSlugs: ['forged-resource'],
      })
    );
  });

  it('requires authentication for community submissions', async () => {
    const anonymous = testEnv.unauthenticatedContext();
    await assertFails(
      setDoc(doc(anonymous.firestore(), 'aiSubmissions', 'submission-1'), {
        id: 'submission-1',
        url: 'https://example.com/resource',
        name: 'Example Resource',
        category: 'copywriting',
        primaryPlatform: 'other',
        resourceType: 'skill',
        whyUseful: 'Useful for a defined copywriting job.',
        status: 'under_review',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );
  });

  it('allows an authenticated user to submit only with their own uid when uid is present', async () => {
    const userA = testEnv.authenticatedContext('user-a');

    await assertSucceeds(
      setDoc(doc(userA.firestore(), 'aiSubmissions', 'submission-own'), {
        id: 'submission-own',
        url: 'https://example.com/resource',
        name: 'Example Resource',
        category: 'copywriting',
        primaryPlatform: 'other',
        resourceType: 'skill',
        whyUseful: 'Useful for a defined copywriting job.',
        submittedByUid: 'user-a',
        status: 'under_review',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );

    await assertFails(
      setDoc(doc(userA.firestore(), 'aiSubmissions', 'submission-forged'), {
        id: 'submission-forged',
        url: 'https://example.com/resource',
        name: 'Example Resource',
        category: 'copywriting',
        primaryPlatform: 'other',
        resourceType: 'skill',
        whyUseful: 'Useful for a defined copywriting job.',
        submittedByUid: 'user-b',
        status: 'under_review',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );
  });
});

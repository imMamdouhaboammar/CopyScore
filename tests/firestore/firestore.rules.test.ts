import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
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
      await setDoc(doc(context.firestore(), 'publicProfiles', 'user-a'), {
        uid: 'user-a',
        handle: 'mamdouh',
        displayName: 'Mamdouh',
      });
    });

    const anonymous = testEnv.unauthenticatedContext();
    await assertSucceeds(getDoc(doc(anonymous.firestore(), 'publicProfiles', 'user-a')));
  });

  it('denies direct client writes to private and public profile records', async () => {
    const userA = testEnv.authenticatedContext('user-a');

    await assertFails(
      setDoc(doc(userA.firestore(), 'users', 'user-a'), {
        uid: 'user-a',
        displayName: 'Forged Profile',
        bestScore: { overallScore: 100 },
      })
    );

    await assertFails(
      setDoc(doc(userA.firestore(), 'publicProfiles', 'user-a'), {
        uid: 'user-a',
        displayName: 'Forged Public Profile',
        overallScore: 100,
        isVerified: true,
      })
    );
  });

  it('denies direct client handle reservations', async () => {
    const userA = testEnv.authenticatedContext('user-a');
    await assertFails(
      setDoc(doc(userA.firestore(), 'handles', 'mamdouh'), {
        uid: 'user-a',
        claimedAt: Date.now(),
      })
    );
  });

  it('denies direct client writes to assessment results', async () => {
    const authenticated = testEnv.authenticatedContext('user-a');
    await assertFails(
      setDoc(doc(authenticated.firestore(), 'results', 'attempt-1'), {
        ownerUid: 'user-a',
        overallScore: 100,
      })
    );
  });

  it('allows only the owner or admin to read a private assessment result', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'results', 'attempt-1'), {
        ownerUid: 'user-a',
        overallScore: 87,
      });
    });

    const anonymous = testEnv.unauthenticatedContext();
    const userA = testEnv.authenticatedContext('user-a');
    const userB = testEnv.authenticatedContext('user-b');

    await assertFails(getDoc(doc(anonymous.firestore(), 'results', 'attempt-1')));
    await assertSucceeds(getDoc(doc(userA.firestore(), 'results', 'attempt-1')));
    await assertFails(getDoc(doc(userB.firestore(), 'results', 'attempt-1')));
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

  it('denies clients from reading or mutating distributed rate-limit state', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'rateLimits', 'bucket-1'), {
        scope: 'assessment:evaluate',
        count: 3,
        windowStartedAt: Date.now(),
      });
    });

    const userA = testEnv.authenticatedContext('user-a');
    const anonymous = testEnv.unauthenticatedContext();

    await assertFails(getDoc(doc(userA.firestore(), 'rateLimits', 'bucket-1')));
    await assertFails(getDoc(doc(anonymous.firestore(), 'rateLimits', 'bucket-1')));
    await assertFails(
      setDoc(doc(userA.firestore(), 'rateLimits', 'bucket-1'), {
        scope: 'assessment:evaluate',
        count: 0,
        windowStartedAt: Date.now(),
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

  it('allows authenticated submissions only for the caller and under-review status', async () => {
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
      setDoc(doc(userA.firestore(), 'aiSubmissions', 'submission-forged-owner'), {
        id: 'submission-forged-owner',
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

    await assertFails(
      setDoc(doc(userA.firestore(), 'aiSubmissions', 'submission-self-approved'), {
        id: 'submission-self-approved',
        url: 'https://example.com/resource',
        name: 'Example Resource',
        category: 'copywriting',
        primaryPlatform: 'other',
        resourceType: 'skill',
        whyUseful: 'Useful for a defined copywriting job.',
        submittedByUid: 'user-a',
        status: 'accepted',
        createdAt: '2026-08-19T00:00:00.000Z',
      })
    );
  });
});

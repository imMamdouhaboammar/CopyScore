import 'server-only';

import { getAdminFirestore } from './admin';
import type { UserProfile, PublicUserProfile } from '../types/auth';
import type {
  DomainId,
  FinalAssessmentScore,
  LeaderboardEntry,
} from '../types/assessment';
import { isHandleReserved, normalizeHandle } from '../auth/schemas';

interface EnsureProfileInput {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  handle?: string | null;
  emailVerified?: boolean;
}

export async function getServerUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getAdminFirestore().collection('users').doc(uid).get();
  return snapshot.exists ? (snapshot.data() as UserProfile) : null;
}

export async function isServerHandleAvailable(
  rawHandle: string,
  currentUid?: string
): Promise<boolean> {
  const handle = normalizeHandle(rawHandle);
  if (!handle || handle.length < 3 || handle.length > 24 || isHandleReserved(handle)) {
    return false;
  }

  const snapshot = await getAdminFirestore().collection('handles').doc(handle).get();
  if (!snapshot.exists) return true;
  return !!currentUid && snapshot.data()?.uid === currentUid;
}

export async function ensureServerUserProfile(
  uid: string,
  initialData: EnsureProfileInput = {}
): Promise<UserProfile> {
  const db = getAdminFirestore();
  const userRef = db.collection('users').doc(uid);
  const existingSnapshot = await userRef.get();

  if (existingSnapshot.exists) {
    const existing = existingSnapshot.data() as UserProfile;
    if (
      initialData.emailVerified !== undefined &&
      initialData.emailVerified !== existing.emailVerified
    ) {
      const updated = {
        ...existing,
        emailVerified: initialData.emailVerified,
        updatedAt: Date.now(),
      };
      await userRef.set(updated, { merge: true });
      return updated;
    }
    return existing;
  }

  let candidateHandle = initialData.handle ? normalizeHandle(initialData.handle) : '';
  if (!candidateHandle) {
    const base = (initialData.displayName || initialData.email?.split('@')[0] || 'writer')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16);
    candidateHandle = `${base || 'writer'}_${uid.slice(0, 4)}`;
  }

  const handle = await claimServerHandle(candidateHandle, uid);
  const now = Date.now();
  const profile: UserProfile = {
    uid,
    email: initialData.email || null,
    displayName: initialData.displayName || handle || 'Anonymous Writer',
    handle,
    avatarUrl: initialData.photoURL || null,
    roleTitle: 'Copywriter & Marketer',
    company: '',
    bio: '',
    countryCode: 'US',
    publicProfile: true,
    leaderboardVisible: true,
    role: 'user',
    totalAttempts: 0,
    emailVerified: !!initialData.emailVerified,
    createdAt: now,
    updatedAt: now,
  };

  await userRef.set(profile);
  await updateServerPublicProfile(profile);
  return profile;
}

export async function updateServerUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const db = getAdminFirestore();
  const userRef = db.collection('users').doc(uid);
  const snapshot = await userRef.get();
  if (!snapshot.exists) throw new Error('User profile does not exist');

  const current = snapshot.data() as UserProfile;
  const safeUpdates = { ...updates };

  if (safeUpdates.handle && normalizeHandle(safeUpdates.handle) !== current.handle) {
    const requestedHandle = normalizeHandle(safeUpdates.handle);
    if (!(await isServerHandleAvailable(requestedHandle, uid))) {
      throw new Error('This handle is already taken');
    }

    const claimedHandle = await claimServerHandle(requestedHandle, uid);
    safeUpdates.handle = claimedHandle;

    if (current.handle && current.handle !== claimedHandle) {
      await db.collection('handles').doc(current.handle).delete().catch(() => undefined);
    }
  }

  const updated: UserProfile = {
    ...current,
    ...safeUpdates,
    uid,
    role: current.role,
    bestScore: current.bestScore,
    totalAttempts: current.totalAttempts,
    createdAt: current.createdAt,
    updatedAt: Date.now(),
  };

  await userRef.set(updated, { merge: true });
  await updateServerPublicProfile(updated);
  await syncServerLeaderboardDisplay(uid, updated);
  return updated;
}

export async function saveServerAssessmentResult(
  score: FinalAssessmentScore,
  uid: string
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  return recordServerAssessmentScore(uid, score);
}

export async function claimServerGuestAssessment(
  uid: string,
  guestScore: FinalAssessmentScore
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  const profile = await ensureServerUserProfile(uid, {
    displayName: guestScore.userHandle || 'Copywriter',
    handle: guestScore.userHandle,
  });

  const trustedScore: FinalAssessmentScore = {
    ...guestScore,
    userHandle: profile.handle || guestScore.userHandle,
  };

  return recordServerAssessmentScore(uid, trustedScore, profile);
}

export async function deleteServerUserData(uid: string): Promise<void> {
  const db = getAdminFirestore();
  const profile = await getServerUserProfile(uid);
  const batch = db.batch();

  if (profile?.handle) {
    batch.delete(db.collection('handles').doc(profile.handle));
  }
  batch.delete(db.collection('publicProfiles').doc(uid));
  batch.delete(db.collection('leaderboard').doc(uid));
  batch.delete(db.collection('userAIStacks').doc(uid));
  batch.delete(db.collection('users').doc(uid));

  await batch.commit();
}

async function claimServerHandle(rawHandle: string, uid: string): Promise<string> {
  const db = getAdminFirestore();
  let handle = normalizeHandle(rawHandle);
  if (!handle || isHandleReserved(handle)) {
    handle = `writer_${uid.slice(0, 6)}`;
  }

  return db.runTransaction(async (transaction) => {
    const primaryRef = db.collection('handles').doc(handle);
    const primarySnapshot = await transaction.get(primaryRef);

    if (!primarySnapshot.exists || primarySnapshot.data()?.uid === uid) {
      transaction.set(primaryRef, { uid, claimedAt: Date.now() }, { merge: true });
      return handle;
    }

    const fallback = `${handle.slice(0, 18)}_${uid.slice(0, 4)}`;
    const fallbackRef = db.collection('handles').doc(fallback);
    const fallbackSnapshot = await transaction.get(fallbackRef);
    if (fallbackSnapshot.exists && fallbackSnapshot.data()?.uid !== uid) {
      throw new Error('Unable to reserve a unique handle');
    }

    transaction.set(fallbackRef, { uid, claimedAt: Date.now() }, { merge: true });
    return fallback;
  });
}

async function recordServerAssessmentScore(
  uid: string,
  score: FinalAssessmentScore,
  existingProfile?: UserProfile
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  const db = getAdminFirestore();
  const resultRef = db.collection('results').doc(score.attemptId);
  const existingResult = await resultRef.get();

  if (existingResult.exists) {
    const existingOwnerUid = existingResult.data()?.ownerUid;
    if (!existingOwnerUid || existingOwnerUid !== uid) {
      throw new Error('ASSESSMENT_ATTEMPT_ALREADY_CLAIMED');
    }

    const existingUserProfile =
      existingProfile || (await getServerUserProfile(uid));
    if (!existingUserProfile) {
      throw new Error('ASSESSMENT_OWNER_PROFILE_MISSING');
    }

    const existingBestScore = existingUserProfile.bestScore || score;
    return {
      profile: existingUserProfile,
      leaderboardEntry: buildLeaderboardEntry(existingUserProfile, existingBestScore),
    };
  }

  const profile =
    existingProfile ||
    (await ensureServerUserProfile(uid, {
      displayName: score.userHandle || 'Copywriter',
      handle: score.userHandle,
    }));

  const isNewBest = !profile.bestScore || score.overallScore >= profile.bestScore.overallScore;
  const bestScore = isNewBest ? score : profile.bestScore || score;
  const updatedProfile: UserProfile = {
    ...profile,
    bestScore,
    totalAttempts: (profile.totalAttempts || 0) + 1,
    updatedAt: Date.now(),
  };

  const userRef = db.collection('users').doc(uid);
  const leaderboardEntry = buildLeaderboardEntry(updatedProfile, bestScore);
  const batch = db.batch();

  batch.set(userRef, updatedProfile, { merge: true });
  batch.create(resultRef, {
    ...score,
    ownerUid: uid,
    userHandle: updatedProfile.handle,
    savedAt: Date.now(),
  });

  if (updatedProfile.leaderboardVisible) {
    batch.set(db.collection('leaderboard').doc(uid), leaderboardEntry);
  } else {
    batch.delete(db.collection('leaderboard').doc(uid));
  }

  await batch.commit();
  await updateServerPublicProfile(updatedProfile);

  return { profile: updatedProfile, leaderboardEntry };
}

async function updateServerPublicProfile(profile: UserProfile): Promise<void> {
  const publicRef = getAdminFirestore().collection('publicProfiles').doc(profile.uid);

  if (!profile.publicProfile) {
    await publicRef.set(
      {
        uid: profile.uid,
        displayName: profile.displayName,
        handle: profile.handle || '',
        publicProfile: false,
        leaderboardVisible: profile.leaderboardVisible,
      },
      { merge: true }
    );
    return;
  }

  const publicData: PublicUserProfile = {
    uid: profile.uid,
    displayName: profile.displayName,
    handle: profile.handle || '',
    avatarUrl: profile.avatarUrl,
    roleTitle: profile.roleTitle,
    company: profile.company,
    bio: profile.bio,
    countryCode: profile.countryCode,
    bestScore: profile.bestScore,
    overallScore: profile.bestScore?.overallScore,
    percentile: profile.bestScore?.percentile,
    archetype: profile.bestScore?.archetype?.name,
    strongestSkill: profile.bestScore ? getStrongestSkill(profile.bestScore) : undefined,
    totalAttempts: profile.totalAttempts,
    isVerified: profile.bestScore?.isVerified ?? false,
    leaderboardVisible: profile.leaderboardVisible,
  };

  await publicRef.set(publicData, { merge: true });
}

async function syncServerLeaderboardDisplay(uid: string, profile: UserProfile): Promise<void> {
  const ref = getAdminFirestore().collection('leaderboard').doc(uid);
  const snapshot = await ref.get();
  if (!snapshot.exists) return;

  await ref.set(
    {
      displayName: profile.displayName,
      handle: profile.handle,
      avatarUrl: profile.avatarUrl || '',
      roleTitle: profile.roleTitle,
      countryCode: profile.countryCode,
    },
    { merge: true }
  );
}

function buildLeaderboardEntry(
  profile: UserProfile,
  score: FinalAssessmentScore
): LeaderboardEntry {
  const domainScores: Record<DomainId, number> = {
    conversion_copywriting: score.domainScores.conversion_copywriting?.scaledScore || 0,
    content_creation: score.domainScores.content_creation?.scaledScore || 0,
    performance_copy: score.domainScores.performance_copy?.scaledScore || 0,
    cro: score.domainScores.cro?.scaledScore || 0,
  };

  return {
    rank: 0,
    userId: profile.uid,
    displayName: profile.displayName,
    handle: profile.handle || `user_${profile.uid.slice(0, 6)}`,
    avatarUrl: profile.avatarUrl || undefined,
    score: score.overallScore,
    percentile: score.percentile,
    archetype: score.archetype.name,
    strongestSkill: getStrongestSkill(score),
    domainScores,
    verificationStatus: score.isVerified ? 'verified' : 'practice',
    isVerified: score.isVerified,
    rankChange: 0,
    assessmentVersion: score.assessmentVersion,
    date: 'Today',
    completedAt: new Date(score.completedAt).toISOString(),
    roleTitle: profile.roleTitle || score.rankTitle,
    countryCode: profile.countryCode,
  };
}

function getStrongestSkill(score: FinalAssessmentScore): string {
  const strongest = Object.entries(score.domainScores).sort(
    (a, b) => b[1].scaledScore - a[1].scaledScore
  )[0];

  const labels: Record<string, string> = {
    conversion_copywriting: 'Conversion Copywriting',
    content_creation: 'Content Judgment & Hooks',
    performance_copy: 'Performance Copy & Ads',
    cro: 'CRO & Experimentation',
  };

  return strongest ? labels[strongest[0]] || strongest[0] : 'Conversion Copywriting';
}

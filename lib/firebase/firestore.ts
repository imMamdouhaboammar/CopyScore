import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  runTransaction,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';
import { UserProfile, PublicUserProfile } from '../types/auth';
import { FinalAssessmentScore, LeaderboardEntry, HeadToHeadChallenge, DomainId } from '../types/assessment';
import { normalizeHandle, isHandleReserved } from '../auth/schemas';

/**
 * Ensures a user profile exists in Firestore (idempotent self-healing provisioning).
 */
export async function ensureUserProfile(
  uid: string,
  initialData: {
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    handle?: string | null;
    emailVerified?: boolean;
  }
): Promise<UserProfile> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existing = userSnap.data() as UserProfile;
    // Update basic auth sync fields if changed
    if (initialData.emailVerified !== undefined && initialData.emailVerified !== existing.emailVerified) {
      await updateDoc(userRef, { emailVerified: initialData.emailVerified, updatedAt: Date.now() });
      existing.emailVerified = initialData.emailVerified;
    }
    return existing;
  }

  // Generate clean default handle if not provided
  let candidateHandle = initialData.handle ? normalizeHandle(initialData.handle) : '';
  if (!candidateHandle) {
    const base = (initialData.displayName || initialData.email?.split('@')[0] || 'writer')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16);
    candidateHandle = `${base || 'writer'}_${uid.slice(0, 4)}`;
  }

  // Check and claim handle
  const finalHandle = await claimHandleSafely(candidateHandle, uid);

  const newProfile: UserProfile = {
    uid,
    email: initialData.email || null,
    displayName: initialData.displayName || (candidateHandle ? candidateHandle : 'Anonymous Writer'),
    handle: finalHandle,
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(userRef, newProfile);

  // Also create public profile projection
  await updatePublicProfile(newProfile);

  return newProfile;
}

/**
 * Claims a handle transactionally if available.
 */
export async function claimHandleSafely(rawHandle: string, uid: string): Promise<string> {
  const db = getFirebaseDb();
  let handle = normalizeHandle(rawHandle);
  if (!handle || isHandleReserved(handle)) {
    handle = `writer_${uid.slice(0, 6)}`;
  }

  const handleRef = doc(db, 'handles', handle);

  try {
    await runTransaction(db, async (transaction) => {
      const handleDoc = await transaction.get(handleRef);
      if (handleDoc.exists()) {
        const data = handleDoc.data();
        if (data.uid !== uid) {
          // Fallback with uid suffix
          handle = `${handle.slice(0, 18)}_${uid.slice(0, 4)}`;
          const fallbackRef = doc(db, 'handles', handle);
          transaction.set(fallbackRef, { uid, claimedAt: Date.now() });
          return;
        }
      }
      transaction.set(handleRef, { uid, claimedAt: Date.now() });
    });
  } catch (err) {
    console.warn('Handle reservation fallback applied', err);
    handle = `writer_${uid.slice(0, 8)}`;
  }

  return handle;
}

/**
 * Checks if a handle is available for registration or change.
 */
export async function isHandleAvailable(rawHandle: string, currentUid?: string): Promise<boolean> {
  const handle = normalizeHandle(rawHandle);
  if (!handle || handle.length < 3 || isHandleReserved(handle)) {
    return false;
  }

  const db = getFirebaseDb();
  const handleRef = doc(db, 'handles', handle);
  const handleDoc = await getDoc(handleRef);

  if (!handleDoc.exists()) {
    return true;
  }

  if (currentUid && handleDoc.data().uid === currentUid) {
    return true;
  }

  return false;
}

/**
 * Updates a user profile and synchronizes the public profile projection.
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error('User profile does not exist');
  }

  const current = userSnap.data() as UserProfile;

  // If handle changed, update reservation
  if (updates.handle && normalizeHandle(updates.handle) !== current.handle) {
    const newHandle = normalizeHandle(updates.handle);
    const available = await isHandleAvailable(newHandle, uid);
    if (!available) {
      throw new Error('This handle is already taken');
    }

    // Claim new handle & release old handle
    const oldHandle = current.handle;
    const claimed = await claimHandleSafely(newHandle, uid);
    updates.handle = claimed;

    if (oldHandle && oldHandle !== claimed) {
      try {
        await deleteDoc(doc(db, 'handles', oldHandle));
      } catch {
        // Ignore old handle release failure
      }
    }
  }

  const updatedProfile: UserProfile = {
    ...current,
    ...updates,
    updatedAt: Date.now(),
  };

  await setDoc(userRef, updatedProfile, { merge: true });
  await updatePublicProfile(updatedProfile);

  // If user has a leaderboard entry, sync public display info
  if (current.handle) {
    await syncLeaderboardDisplayName(uid, updatedProfile);
  }

  return updatedProfile;
}

/**
 * Updates or creates the public profile projection.
 */
export async function updatePublicProfile(profile: UserProfile): Promise<void> {
  const db = getFirebaseDb();
  const publicRef = doc(db, 'publicProfiles', profile.uid);

  if (!profile.publicProfile) {
    // If private, delete or mark hidden
    await setDoc(
      publicRef,
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
    isVerified: profile.bestScore?.isVerified ?? true,
    leaderboardVisible: profile.leaderboardVisible,
  };

  await setDoc(publicRef, publicData, { merge: true });
}

function getStrongestSkill(score: FinalAssessmentScore): string {
  const sorted = Object.entries(score.domainScores || {}).sort((a, b) => b[1].scaledScore - a[1].scaledScore);
  if (sorted.length > 0) {
    const meta: Record<string, string> = {
      conversion_copywriting: 'Conversion Copywriting',
      content_creation: 'Content Judgment & Hooks',
      performance_copy: 'Performance Copy & Ads',
      cro: 'CRO & Experimentation',
    };
    return meta[sorted[0][0]] || sorted[0][0];
  }
  return 'Conversion Copywriting';
}

/**
 * Retrieves a user's private profile.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Retrieves a public profile by handle.
 */
export async function getPublicProfileByHandle(rawHandle: string): Promise<PublicUserProfile | null> {
  const handle = normalizeHandle(rawHandle);
  const db = getFirebaseDb();
  const q = query(collection(db, 'publicProfiles'), where('handle', '==', handle), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return null;
  const data = snap.docs[0].data() as PublicUserProfile;
  if (!data.leaderboardVisible && !data.bestScore) return null;
  return data;
}

/**
 * Attaches a completed assessment score to a user's account and updates their leaderboard ranking.
 */
export async function recordUserAssessmentScore(
  uid: string,
  score: FinalAssessmentScore
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  let profile: UserProfile;
  if (!userSnap.exists()) {
    profile = await ensureUserProfile(uid, {
      displayName: score.userHandle || 'Copywriter',
      handle: score.userHandle,
    });
  } else {
    profile = userSnap.data() as UserProfile;
  }

  // Update best score if higher or if no previous score
  const isNewBest = !profile.bestScore || score.overallScore >= profile.bestScore.overallScore;
  const updatedBestScore: FinalAssessmentScore = (isNewBest ? score : profile.bestScore) || score;

  profile.bestScore = updatedBestScore;
  profile.totalAttempts = (profile.totalAttempts || 0) + 1;
  profile.updatedAt = Date.now();

  await setDoc(userRef, profile, { merge: true });
  await updatePublicProfile(profile);

  // Save attempt record in results collection
  const resultRef = doc(db, 'results', score.attemptId);
  await setDoc(resultRef, {
    ...score,
    ownerUid: uid,
    userHandle: profile.handle,
    savedAt: Date.now(),
  });

  // Publish / update leaderboard entry
  const lbEntry = await publishUserLeaderboardEntry(profile, updatedBestScore);

  return { profile, leaderboardEntry: lbEntry };
}

/**
 * Publishes user entry to the leaderboard collection in Firestore.
 */
export async function publishUserLeaderboardEntry(
  profile: UserProfile,
  score: FinalAssessmentScore
): Promise<LeaderboardEntry> {
  const db = getFirebaseDb();
  const cleanHandle = profile.handle || `user_${profile.uid.slice(0, 6)}`;
  const lbRef = doc(db, 'leaderboard', profile.uid);

  const domainMap: Record<DomainId, number> = {
    conversion_copywriting: score.domainScores.conversion_copywriting?.scaledScore || 0,
    content_creation: score.domainScores.content_creation?.scaledScore || 0,
    performance_copy: score.domainScores.performance_copy?.scaledScore || 0,
    cro: score.domainScores.cro?.scaledScore || 0,
  };

  const entry: LeaderboardEntry = {
    rank: 0,
    userId: profile.uid,
    displayName: profile.displayName,
    handle: cleanHandle,
    avatarUrl: profile.avatarUrl || undefined,
    score: score.overallScore,
    percentile: score.percentile,
    archetype: score.archetype.name,
    strongestSkill: getStrongestSkill(score),
    domainScores: domainMap,
    verificationStatus: score.isVerified ? 'verified' : 'practice',
    isVerified: score.isVerified,
    rankChange: 0,
    assessmentVersion: score.assessmentVersion,
    date: 'Today',
    completedAt: new Date(score.completedAt).toISOString(),
    roleTitle: profile.roleTitle || score.rankTitle,
    countryCode: profile.countryCode,
  };

  if (profile.leaderboardVisible) {
    await setDoc(lbRef, entry);
  } else {
    // If hidden from leaderboard, remove
    try {
      await deleteDoc(lbRef);
    } catch {
      // Ignore
    }
  }

  return entry;
}

async function syncLeaderboardDisplayName(uid: string, profile: UserProfile) {
  const db = getFirebaseDb();
  const lbRef = doc(db, 'leaderboard', uid);
  try {
    const snap = await getDoc(lbRef);
    if (snap.exists()) {
      await updateDoc(lbRef, {
        displayName: profile.displayName,
        handle: profile.handle,
        avatarUrl: profile.avatarUrl || '',
        roleTitle: profile.roleTitle,
        countryCode: profile.countryCode,
      });
    }
  } catch {
    // Ignore
  }
}

/**
 * Claims a guest assessment upon sign up or sign in.
 */
export async function claimGuestAssessment(
  uid: string,
  guestScore: FinalAssessmentScore
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  // Attach user handle and uid
  const user = await getUserProfile(uid);
  const handle = user?.handle || `writer_${uid.slice(0, 6)}`;
  guestScore.userHandle = handle;

  return await recordUserAssessmentScore(uid, guestScore);
}

/**
 * Saves or records an assessment result for a user
 */
export async function saveAssessmentResult(
  score: FinalAssessmentScore,
  uid: string
): Promise<{ profile: UserProfile; leaderboardEntry: LeaderboardEntry }> {
  return recordUserAssessmentScore(uid, score);
}

/**
 * Deletes all user data from Firestore for GDPR / account deletion.
 */
export async function deleteUserData(uid: string): Promise<void> {
  const db = getFirebaseDb();
  const user = await getUserProfile(uid);

  // 1. Release handle
  if (user?.handle) {
    try {
      await deleteDoc(doc(db, 'handles', user.handle));
    } catch {}
  }

  // 2. Delete public profile
  try {
    await deleteDoc(doc(db, 'publicProfiles', uid));
  } catch {}

  // 3. Delete leaderboard entry
  try {
    await deleteDoc(doc(db, 'leaderboard', uid));
  } catch {}

  // 4. Delete user document
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch {}
}

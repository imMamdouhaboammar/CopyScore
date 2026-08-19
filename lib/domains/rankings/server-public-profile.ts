import 'server-only';

import { getAdminFirestore } from '../../firebase/admin';
import type { PublicUserProfile } from '../../types/auth';
import type { FinalAssessmentScore } from '../../types/assessment';
import { isPublishableVerifiedScore } from './ranking-policy';

export async function getVerifiedPublicProfileByHandle(
  rawHandle: string
): Promise<PublicUserProfile | null> {
  const handle = normalizeHandle(rawHandle);
  if (!handle) return null;

  const snapshot = await getAdminFirestore()
    .collection('publicProfiles')
    .where('handle', '==', handle)
    .limit(1)
    .get();
  const document = snapshot.docs[0];
  if (!document) return null;

  const profile = document.data() as PublicUserProfile & {
    publicProfile?: boolean;
    bestScore?: FinalAssessmentScore;
  };
  if (profile.publicProfile === false || !profile.bestScore) return null;
  if (!isPublishableVerifiedScore(profile.bestScore)) return null;

  return {
    ...profile,
    isVerified: true,
  };
}

function normalizeHandle(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 64);
}

import 'server-only';

import { getAdminFirestore } from '../../firebase/admin';
import type { UserProfile } from '../../types/auth';
import type { FinalAssessmentScore, LeaderboardEntry } from '../../types/assessment';
import {
  buildVerifiedLeaderboardEntry,
  isPublishableVerifiedScore,
} from './ranking-policy';

export async function publishVerifiedLeaderboardProjection(
  profile: UserProfile,
  score: FinalAssessmentScore
): Promise<boolean> {
  if (!profile.leaderboardVisible || !isPublishableVerifiedScore(score)) {
    return false;
  }

  const entry = buildVerifiedLeaderboardEntry(
    {
      uid: profile.uid,
      displayName: profile.displayName,
      handle: profile.handle,
      avatarUrl: profile.avatarUrl,
      roleTitle: profile.roleTitle,
      countryCode: profile.countryCode,
      company: profile.company,
      bio: profile.bio,
    },
    score
  );

  await getAdminFirestore()
    .collection('leaderboard')
    .doc(profile.uid)
    .set(stripUndefined(entry));
  return true;
}

function stripUndefined(value: LeaderboardEntry): LeaderboardEntry {
  return JSON.parse(JSON.stringify(value)) as LeaderboardEntry;
}

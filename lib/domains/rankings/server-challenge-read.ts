import 'server-only';

import { getAdminFirestore } from '../../firebase/admin';
import type { HeadToHeadChallenge } from '../../types/assessment';

export async function getVerifiedServerChallenge(
  rawCode: string
): Promise<HeadToHeadChallenge | null> {
  const code = normalizeChallengeCode(rawCode);
  if (!code) return null;

  const snapshot = await getAdminFirestore().collection('challenges').doc(code).get();
  if (!snapshot.exists) return null;

  const challenge = snapshot.data() as HeadToHeadChallenge & {
    verificationProofVersion?: string;
  };
  if (challenge.verificationProofVersion !== 'hmac-v1') return null;
  return challenge;
}

function normalizeChallengeCode(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 64);
}

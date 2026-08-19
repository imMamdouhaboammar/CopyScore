import 'server-only';

import { getAdminFirestore } from '../../firebase/admin';
import type { PublicUserProfile } from '../../types/auth';
import type {
  FinalAssessmentScore,
  HeadToHeadChallenge,
  LeaderboardEntry,
  LeaderboardMeta,
} from '../../types/assessment';
import {
  isPublishableVerifiedScore,
  rankVerifiedLeaderboardEntries,
  type LeaderboardFilters,
} from './ranking-policy';

const CHALLENGES = 'challenges';
const CHALLENGE_ATTEMPTS = 'challengeAttempts';
const LEADERBOARD = 'leaderboard';
const PUBLIC_PROFILES = 'publicProfiles';
const RESULTS = 'results';

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  meta: LeaderboardMeta;
  userPosition?: {
    rank: number;
    entry: LeaderboardEntry;
    pointsToNext: number;
    pointsToTop10: number;
    pointsToTop5: number;
    pointsToTop1: number;
    aheadOfRank?: { rank: number; handle: string; diff: number };
    behindRank?: { rank: number; handle: string; diff: number };
  };
  neighborhood?: LeaderboardEntry[];
}

export async function getServerLeaderboardData(
  filters: LeaderboardFilters & { userHandle?: string } = {},
  now: number = Date.now()
): Promise<LeaderboardData> {
  const db = getAdminFirestore();
  const [leaderboardSnapshot, resultsCountSnapshot] = await Promise.all([
    db.collection(LEADERBOARD).get(),
    db.collection(RESULTS).count().get(),
  ]);

  const persistedEntries = leaderboardSnapshot.docs.map(
    (document) => document.data() as LeaderboardEntry
  );
  const rankedForPosition = rankVerifiedLeaderboardEntries(
    persistedEntries,
    { ...filters, search: '' },
    now
  );
  const entries = rankVerifiedLeaderboardEntries(persistedEntries, filters, now);
  const totalAttempts = resultsCountSnapshot.data().count;
  const meta = buildLeaderboardMeta(rankedForPosition, totalAttempts, filters.timeframe, now);
  const userHandle = filters.userHandle?.trim().toLowerCase() || '';

  if (!userHandle) {
    return { entries, meta };
  }

  const userIndex = rankedForPosition.findIndex(
    (entry) => entry.handle.toLowerCase() === userHandle
  );
  if (userIndex < 0) {
    return { entries, meta };
  }

  const userEntry = rankedForPosition[userIndex];
  const aheadEntry = userIndex > 0 ? rankedForPosition[userIndex - 1] : undefined;
  const behindEntry =
    userIndex < rankedForPosition.length - 1
      ? rankedForPosition[userIndex + 1]
      : undefined;

  const pointsToNext = aheadEntry ? positiveDifference(aheadEntry.score, userEntry.score) : 0;
  const userPosition = {
    rank: userEntry.rank,
    entry: userEntry,
    pointsToNext,
    pointsToTop10: positiveDifference(meta.scoreToTop10, userEntry.score),
    pointsToTop5: positiveDifference(meta.scoreToTop5, userEntry.score),
    pointsToTop1: positiveDifference(meta.scoreToTop1, userEntry.score),
    aheadOfRank: aheadEntry
      ? { rank: aheadEntry.rank, handle: aheadEntry.handle, diff: pointsToNext }
      : undefined,
    behindRank: behindEntry
      ? {
          rank: behindEntry.rank,
          handle: behindEntry.handle,
          diff: positiveDifference(userEntry.score, behindEntry.score),
        }
      : undefined,
  };

  const neighborhood = rankedForPosition.slice(
    Math.max(0, userIndex - 3),
    Math.min(rankedForPosition.length, userIndex + 4)
  );

  return { entries, meta, userPosition, neighborhood };
}

export async function getServerChallenge(
  rawCode: string
): Promise<HeadToHeadChallenge | null> {
  const code = normalizeChallengeCode(rawCode);
  if (!code) return null;

  const snapshot = await getAdminFirestore().collection(CHALLENGES).doc(code).get();
  return snapshot.exists ? (snapshot.data() as HeadToHeadChallenge) : null;
}

export async function publishServerChallenge(input: {
  score: FinalAssessmentScore;
  handle: string;
  ownerUid?: string;
}): Promise<HeadToHeadChallenge | null> {
  if (!isPublishableVerifiedScore(input.score)) return null;

  const code = normalizeChallengeCode(input.handle);
  if (!code) return null;

  const db = getAdminFirestore();
  const reference = db.collection(CHALLENGES).doc(code);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const existing = snapshot.exists
      ? (snapshot.data() as Partial<HeadToHeadChallenge> & { creatorUid?: string })
      : null;

    const challenge: HeadToHeadChallenge & { creatorUid?: string; verificationProofVersion: 'hmac-v1' } = {
      challengeCode: code,
      creatorHandle: code,
      creatorScore: input.score.overallScore,
      creatorArchetype: input.score.archetype.name,
      creatorDomainScores: {
        conversion_copywriting: input.score.domainScores.conversion_copywriting.scaledScore,
        content_creation: input.score.domainScores.content_creation.scaledScore,
        performance_copy: input.score.domainScores.performance_copy.scaledScore,
        cro: input.score.domainScores.cro.scaledScore,
      },
      createdAt: existing?.createdAt || input.score.completedAt,
      participantCount: existing?.participantCount || 0,
      bestOpponent: existing?.bestOpponent,
      creatorUid: input.ownerUid,
      verificationProofVersion: 'hmac-v1',
    };

    transaction.set(reference, cleanUndefined(challenge));
    return challenge;
  });
}

export async function recordServerChallengeAttempt(input: {
  challengeCode: string;
  attemptId: string;
  opponentHandle: string;
  opponentScore: number;
  completedAt?: number;
}): Promise<boolean> {
  const code = normalizeChallengeCode(input.challengeCode);
  if (!code) return false;

  const db = getAdminFirestore();
  const challengeRef = db.collection(CHALLENGES).doc(code);
  const markerId = `${code}__${safeDocumentId(input.attemptId)}`;
  const markerRef = db.collection(CHALLENGE_ATTEMPTS).doc(markerId);

  return db.runTransaction(async (transaction) => {
    const [challengeSnapshot, markerSnapshot] = await Promise.all([
      transaction.get(challengeRef),
      transaction.get(markerRef),
    ]);

    if (!challengeSnapshot.exists || markerSnapshot.exists) return false;

    const challenge = challengeSnapshot.data() as HeadToHeadChallenge;
    const nextParticipantCount = (challenge.participantCount || 0) + 1;
    const shouldReplaceBest =
      !challenge.bestOpponent || input.opponentScore > challenge.bestOpponent.score;

    transaction.set(markerRef, {
      challengeCode: code,
      attemptId: input.attemptId,
      opponentHandle: input.opponentHandle,
      opponentScore: input.opponentScore,
      createdAt: input.completedAt || Date.now(),
    });
    transaction.set(
      challengeRef,
      cleanUndefined({
        participantCount: nextParticipantCount,
        bestOpponent: shouldReplaceBest
          ? { handle: input.opponentHandle, score: input.opponentScore }
          : challenge.bestOpponent,
      }),
      { merge: true }
    );
    return true;
  });
}

export async function getServerPublicProfileByHandle(
  rawHandle: string
): Promise<PublicUserProfile | null> {
  const handle = normalizeChallengeCode(rawHandle);
  if (!handle) return null;

  const snapshot = await getAdminFirestore()
    .collection(PUBLIC_PROFILES)
    .where('handle', '==', handle)
    .limit(1)
    .get();
  const document = snapshot.docs[0];
  if (!document) return null;

  const profile = document.data() as PublicUserProfile & { publicProfile?: boolean };
  if (profile.publicProfile === false) return null;
  return profile;
}

export async function syncServerChallengeHandle(input: {
  previousHandle?: string | null;
  nextHandle?: string | null;
  score?: FinalAssessmentScore;
  ownerUid?: string;
}): Promise<void> {
  const previous = normalizeChallengeCode(input.previousHandle || '');
  const next = normalizeChallengeCode(input.nextHandle || '');
  if (!next || previous === next || !input.score || !isPublishableVerifiedScore(input.score)) {
    return;
  }

  await publishServerChallenge({
    score: input.score,
    handle: next,
    ownerUid: input.ownerUid,
  });

  if (previous) {
    await getAdminFirestore().collection(CHALLENGES).doc(previous).delete().catch(() => undefined);
  }
}

function buildLeaderboardMeta(
  entries: LeaderboardEntry[],
  totalAttempts: number,
  timeframeValue: string | undefined,
  now: number
): LeaderboardMeta {
  const scoreToTop1 = entries[0]?.score || 0;
  const scoreToTop5 = percentileThreshold(entries, 0.05);
  const scoreToTop10 = percentileThreshold(entries, 0.1);
  const range = timeframeRange(timeframeValue, entries, now);

  return {
    totalAttempts,
    scoreToTop10,
    scoreToTop5,
    scoreToTop1,
    weeklyResetSeconds: secondsUntilNextUtcMonday(now),
    competitionWeek: isoWeekNumber(now),
    startDate: formatShortUtcDate(range.start),
    endDate: formatShortUtcDate(range.end),
    activeParticipants: entries.length,
    assessmentVersion: entries[0]?.assessmentVersion || 'v1.4.2-adaptive',
  };
}

function percentileThreshold(entries: LeaderboardEntry[], fraction: number): number {
  if (entries.length === 0) return 0;
  const qualifyingCount = Math.max(1, Math.ceil(entries.length * fraction));
  return entries[Math.min(entries.length - 1, qualifyingCount - 1)]?.score || 0;
}

function timeframeRange(
  timeframe: string | undefined,
  entries: LeaderboardEntry[],
  now: number
): { start: number; end: number } {
  if (timeframe === 'weekly') return { start: now - 7 * 24 * 60 * 60 * 1000, end: now };
  if (timeframe === 'monthly') return { start: now - 30 * 24 * 60 * 60 * 1000, end: now };

  const timestamps = entries
    .map((entry) => (entry.completedAt ? Date.parse(entry.completedAt) : Number.NaN))
    .filter(Number.isFinite);
  return {
    start: timestamps.length ? Math.min(...timestamps) : now,
    end: now,
  };
}

function secondsUntilNextUtcMonday(now: number): number {
  const current = new Date(now);
  const currentDay = current.getUTCDay();
  const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
  const nextMonday = Date.UTC(
    current.getUTCFullYear(),
    current.getUTCMonth(),
    current.getUTCDate() + daysUntilMonday,
    0,
    0,
    0,
    0
  );
  return Math.max(0, Math.ceil((nextMonday - now) / 1000));
}

function isoWeekNumber(timestamp: number): number {
  const date = new Date(timestamp);
  const working = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = working.getUTCDay() || 7;
  working.setUTCDate(working.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(working.getUTCFullYear(), 0, 1));
  return Math.ceil((((working.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
}

function formatShortUtcDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(timestamp));
}

function positiveDifference(target: number, current: number): number {
  return Math.max(0, Number((target - current).toFixed(1)));
}

function normalizeChallengeCode(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 64);
}

function safeDocumentId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
}

function cleanUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  ) as T;
}

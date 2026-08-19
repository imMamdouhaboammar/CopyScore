import { SCORE_SIGNATURE_PREFIX } from '../../engine/score-verification';
import type {
  DomainId,
  FinalAssessmentScore,
  LeaderboardEntry,
  SkillCategoryFilter,
  TimeframeFilter,
} from '../../types/assessment';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export interface LeaderboardProjectionProfile {
  uid: string;
  displayName: string;
  handle: string | null;
  avatarUrl?: string | null;
  roleTitle?: string;
  countryCode?: string;
  company?: string;
  bio?: string;
}

export interface LeaderboardFilters {
  category?: string;
  timeframe?: string;
  search?: string;
}

const CATEGORY_TO_DOMAIN: Record<Exclude<SkillCategoryFilter, 'all'>, DomainId> = {
  conversion: 'conversion_copywriting',
  content: 'content_creation',
  performance: 'performance_copy',
  cro: 'cro',
};

export function isPublishableVerifiedScore(score: FinalAssessmentScore): boolean {
  return (
    score.isVerified === true &&
    typeof score.verificationHash === 'string' &&
    score.verificationHash.startsWith(SCORE_SIGNATURE_PREFIX)
  );
}

export function buildVerifiedLeaderboardEntry(
  profile: LeaderboardProjectionProfile,
  score: FinalAssessmentScore
): LeaderboardEntry {
  if (!isPublishableVerifiedScore(score)) {
    throw new Error('UNVERIFIED_SCORE_CANNOT_BE_PUBLISHED');
  }

  const domainScores: Record<DomainId, number> = {
    conversion_copywriting: score.domainScores.conversion_copywriting.scaledScore,
    content_creation: score.domainScores.content_creation.scaledScore,
    performance_copy: score.domainScores.performance_copy.scaledScore,
    cro: score.domainScores.cro.scaledScore,
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
    strongestSkill: strongestSkillLabel(domainScores),
    domainScores,
    verificationStatus: 'verified',
    verificationProofVersion: 'hmac-v1',
    isVerified: true,
    rankChange: 0,
    assessmentVersion: score.assessmentVersion,
    date: formatUtcDate(score.completedAt),
    completedAt: new Date(score.completedAt).toISOString(),
    roleTitle: profile.roleTitle || score.rankTitle,
    countryCode: profile.countryCode,
    company: profile.company,
    bio: profile.bio,
  };
}

export function rankVerifiedLeaderboardEntries(
  entries: LeaderboardEntry[],
  filters: LeaderboardFilters = {},
  now: number = Date.now()
): LeaderboardEntry[] {
  const category = normalizeCategory(filters.category);
  const timeframe = normalizeTimeframe(filters.timeframe);
  const search = filters.search?.trim().toLowerCase() || '';
  const cutoff = timeframe === 'weekly'
    ? now - WEEK_MS
    : timeframe === 'monthly'
      ? now - MONTH_MS
      : null;

  const filtered = entries.filter((entry) => {
    if (
      !entry.isVerified ||
      entry.verificationStatus !== 'verified' ||
      entry.verificationProofVersion !== 'hmac-v1'
    ) {
      return false;
    }

    if (cutoff !== null) {
      const completedAt = entry.completedAt ? Date.parse(entry.completedAt) : Number.NaN;
      if (!Number.isFinite(completedAt) || completedAt < cutoff || completedAt > now) {
        return false;
      }
    }

    if (search) {
      const haystack = [
        entry.handle,
        entry.displayName,
        entry.archetype,
        entry.strongestSkill,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  const domain = category === 'all' ? null : CATEGORY_TO_DOMAIN[category];

  return filtered
    .sort((a, b) => {
      const aMetric = domain ? a.domainScores?.[domain] ?? 0 : a.score;
      const bMetric = domain ? b.domainScores?.[domain] ?? 0 : b.score;
      if (bMetric !== aMetric) return bMetric - aMetric;
      if (b.score !== a.score) return b.score - a.score;

      const aCompleted = a.completedAt ? Date.parse(a.completedAt) : 0;
      const bCompleted = b.completedAt ? Date.parse(b.completedAt) : 0;
      if (bCompleted !== aCompleted) return bCompleted - aCompleted;
      return a.handle.localeCompare(b.handle);
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function normalizeCategory(value?: string): SkillCategoryFilter {
  return value === 'conversion' || value === 'content' || value === 'performance' || value === 'cro'
    ? value
    : 'all';
}

export function normalizeTimeframe(value?: string): TimeframeFilter {
  return value === 'weekly' || value === 'monthly' ? value : 'global';
}

function strongestSkillLabel(domainScores: Record<DomainId, number>): string {
  const strongest = Object.entries(domainScores).sort((a, b) => b[1] - a[1])[0]?.[0] as DomainId | undefined;
  const labels: Record<DomainId, string> = {
    conversion_copywriting: 'Conversion Copywriting',
    content_creation: 'Content Judgment & Hooks',
    performance_copy: 'Performance Copy & Ads',
    cro: 'CRO & Experimentation',
  };
  return strongest ? labels[strongest] : labels.conversion_copywriting;
}

function formatUtcDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(timestamp));
}

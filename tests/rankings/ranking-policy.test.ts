import { describe, expect, it } from 'vitest';
import type { FinalAssessmentScore, LeaderboardEntry } from '../../lib/types/assessment';
import {
  buildVerifiedLeaderboardEntry,
  isPublishableVerifiedScore,
  rankVerifiedLeaderboardEntries,
} from '../../lib/domains/rankings/ranking-policy';

function makeScore(overrides: Partial<FinalAssessmentScore> = {}): FinalAssessmentScore {
  return {
    attemptId: 'att-live-1',
    assessmentVersion: 'v1.4.2-adaptive',
    createdAt: Date.parse('2026-08-19T10:00:00Z'),
    completedAt: Date.parse('2026-08-19T10:10:00Z'),
    overallScore: 88,
    percentile: 95,
    confidenceLevel: 94,
    rankTitle: 'Advanced Specialist (Tier II)',
    maxDifficultyReached: 4,
    domainScores: {
      conversion_copywriting: { domain: 'conversion_copywriting', rawScore: 3, scaledScore: 92, questionsAttempted: 3, accuracy: 67, highestDifficultyCleared: 4, statusLabel: 'Expert' },
      content_creation: { domain: 'content_creation', rawScore: 3, scaledScore: 84, questionsAttempted: 2, accuracy: 50, highestDifficultyCleared: 3, statusLabel: 'Advanced' },
      performance_copy: { domain: 'performance_copy', rawScore: 3, scaledScore: 90, questionsAttempted: 3, accuracy: 67, highestDifficultyCleared: 4, statusLabel: 'Expert' },
      cro: { domain: 'cro', rawScore: 3, scaledScore: 82, questionsAttempted: 2, accuracy: 50, highestDifficultyCleared: 3, statusLabel: 'Advanced' },
    },
    archetype: {
      id: 'message-strategist',
      name: 'Message Strategist',
      tagline: 'test',
      badge: 'test',
      description: 'test',
      superpower: 'test',
      blindspot: 'test',
      dominantDomains: ['conversion_copywriting'],
    },
    whatYouDidWell: [],
    whatCostYouPoints: [],
    growthActions: [],
    totalTimeSeconds: 600,
    verificationHash: 'CS-HMAC-V1.signature',
    isVerified: true,
    userHandle: 'writer',
    ...overrides,
  };
}

function makeEntry(overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry {
  return {
    rank: 0,
    userId: 'user-a',
    displayName: 'Writer A',
    handle: 'writer_a',
    score: 88,
    percentile: 95,
    archetype: 'Message Strategist',
    strongestSkill: 'Conversion Copywriting',
    domainScores: {
      conversion_copywriting: 92,
      content_creation: 84,
      performance_copy: 90,
      cro: 82,
    },
    verificationStatus: 'verified',
    verificationProofVersion: 'hmac-v1',
    isVerified: true,
    assessmentVersion: 'v1.4.2-adaptive',
    date: 'Aug 19, 2026',
    completedAt: '2026-08-19T10:10:00.000Z',
    ...overrides,
  };
}

describe('verified leaderboard policy', () => {
  it('publishes only scores carrying the current HMAC proof', () => {
    expect(isPublishableVerifiedScore(makeScore())).toBe(true);
    expect(isPublishableVerifiedScore(makeScore({ verificationHash: 'CS-VERIFIED-1234' }))).toBe(false);
    expect(isPublishableVerifiedScore(makeScore({ isVerified: false, verificationHash: '' }))).toBe(false);
  });

  it('builds a leaderboard projection that records the proof version', () => {
    const entry = buildVerifiedLeaderboardEntry(
      {
        uid: 'user-a',
        displayName: 'Writer A',
        handle: 'writer_a',
        avatarUrl: null,
        roleTitle: 'Senior Copywriter',
        countryCode: 'EG',
      },
      makeScore()
    );

    expect(entry.verificationProofVersion).toBe('hmac-v1');
    expect(entry.isVerified).toBe(true);
    expect(entry.verificationStatus).toBe('verified');
  });

  it('excludes legacy verified-looking records without an HMAC proof marker', () => {
    const legacy = makeEntry({
      userId: 'legacy',
      handle: 'legacy',
      verificationProofVersion: undefined,
    });
    const current = makeEntry();

    const result = rankVerifiedLeaderboardEntries([legacy, current], {
      category: 'all',
      timeframe: 'global',
      search: '',
    }, Date.parse('2026-08-19T12:00:00Z'));

    expect(result.map((entry) => entry.handle)).toEqual(['writer_a']);
    expect(result[0]?.rank).toBe(1);
  });

  it('ranks by the selected domain when a skill category is active', () => {
    const overallLeader = makeEntry({
      userId: 'overall',
      handle: 'overall',
      score: 95,
      domainScores: { conversion_copywriting: 80, content_creation: 95, performance_copy: 95, cro: 95 },
    });
    const conversionLeader = makeEntry({
      userId: 'conversion',
      handle: 'conversion',
      score: 88,
      domainScores: { conversion_copywriting: 98, content_creation: 80, performance_copy: 80, cro: 80 },
    });

    const result = rankVerifiedLeaderboardEntries([overallLeader, conversionLeader], {
      category: 'conversion',
      timeframe: 'global',
      search: '',
    }, Date.parse('2026-08-19T12:00:00Z'));

    expect(result.map((entry) => entry.handle)).toEqual(['conversion', 'overall']);
  });

  it('filters weekly rankings by completion time', () => {
    const current = makeEntry({ handle: 'current', completedAt: '2026-08-18T10:00:00.000Z' });
    const old = makeEntry({ handle: 'old', completedAt: '2026-07-20T10:00:00.000Z' });

    const result = rankVerifiedLeaderboardEntries([current, old], {
      category: 'all',
      timeframe: 'weekly',
      search: '',
    }, Date.parse('2026-08-19T12:00:00Z'));

    expect(result.map((entry) => entry.handle)).toEqual(['current']);
  });
});

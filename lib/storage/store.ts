import { AssessmentSessionState, FinalAssessmentScore, HeadToHeadChallenge, LeaderboardEntry, LeaderboardMeta, DomainId } from '../types/assessment';

// In-memory server authoritative store (persists across API routes within container lifecycle)
class AssessmentStore {
  private attempts: Map<string, AssessmentSessionState> = new Map();
  private finalScores: Map<string, FinalAssessmentScore> = new Map();
  private challenges: Map<string, HeadToHeadChallenge> = new Map();
  private leaderboard: LeaderboardEntry[] = [];
  private userProfiles: Map<string, { handle: string; bestScore: FinalAssessmentScore; attemptsCount: number }> = new Map();

  constructor() {
    this.seedLeaderboardAndChallenges();
  }

  private seedLeaderboardAndChallenges() {
    // Initial verified seed benchmark cohort matching Patter design system specs
    this.leaderboard = [
      {
        rank: 1,
        userId: 'u-mamdouh-01',
        displayName: 'Mamdouh Aboammar',
        handle: 'mamdouh',
        avatarUrl: '',
        score: 94.2,
        percentile: 99.8,
        archetype: 'Message Strategist',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 97,
          content_creation: 91,
          performance_copy: 95,
          cro: 88,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 0,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 14, 2026',
        completedAt: '2026-08-14T03:22:10Z',
        roleTitle: 'Principal Conversion Copywriter',
        countryCode: 'EG',
      },
      {
        rank: 2,
        userId: 'u-elena-02',
        displayName: 'Elena Rostova',
        handle: 'elena_cro',
        avatarUrl: '',
        score: 93.6,
        percentile: 99.2,
        archetype: 'Conversion Diagnostician',
        strongestSkill: 'CRO & Experimentation',
        domainScores: {
          conversion_copywriting: 92,
          content_creation: 89,
          performance_copy: 91,
          cro: 98,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 13, 2026',
        completedAt: '2026-08-13T19:40:00Z',
        roleTitle: 'Head of Growth Experimentation',
        countryCode: 'GB',
      },
      {
        rank: 3,
        userId: 'u-marcus-03',
        displayName: 'Marcus Sterling',
        handle: 'marcus_direct',
        avatarUrl: '',
        score: 92.8,
        percentile: 98.6,
        archetype: 'Response Driver',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 91,
          content_creation: 88,
          performance_copy: 96,
          cro: 89,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 13, 2026',
        completedAt: '2026-08-13T11:15:30Z',
        roleTitle: 'Performance Copy Lead',
        countryCode: 'US',
      },
      {
        rank: 4,
        userId: 'u-maya-04',
        displayName: 'Maya Chen',
        handle: 'mayawrites',
        avatarUrl: '',
        score: 91.4,
        percentile: 98.0,
        archetype: 'Response Driver',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 90,
          content_creation: 89,
          performance_copy: 94,
          cro: 86,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 4,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 12, 2026',
        completedAt: '2026-08-12T14:30:00Z',
        roleTitle: 'Paid Acquisition Copywriter',
        countryCode: 'CA',
      },
      {
        rank: 5,
        userId: 'u-omar-05',
        displayName: 'Omar Adel',
        handle: 'omar_copy',
        avatarUrl: '',
        score: 90.9,
        percentile: 97.4,
        archetype: 'Message Strategist',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 93,
          content_creation: 86,
          performance_copy: 88,
          cro: 90,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 2,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 12, 2026',
        completedAt: '2026-08-12T09:12:00Z',
        roleTitle: 'SaaS Funnel Strategist',
        countryCode: 'AE',
      },
      {
        rank: 6,
        userId: 'u-clara-06',
        displayName: 'Clara Oswald',
        handle: 'clara_writes',
        avatarUrl: '',
        score: 89.5,
        percentile: 96.1,
        archetype: 'Sharp Editor',
        strongestSkill: 'Content Judgment & Hooks',
        domainScores: {
          conversion_copywriting: 87,
          content_creation: 95,
          performance_copy: 84,
          cro: 85,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -2,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 11, 2026',
        completedAt: '2026-08-11T16:05:00Z',
        roleTitle: 'Editorial Director',
        countryCode: 'UK',
      },
      {
        rank: 7,
        userId: 'u-sarah-07',
        displayName: 'Sarah Kim',
        handle: 'sarahwrites',
        avatarUrl: '',
        score: 88.7,
        percentile: 95.0,
        archetype: 'Message Strategist',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 92,
          content_creation: 85,
          performance_copy: 86,
          cro: 87,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 3,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 11, 2026',
        completedAt: '2026-08-11T10:45:00Z',
        roleTitle: 'Conversion Copy Specialist',
        countryCode: 'KR',
      },
      {
        rank: 8,
        userId: 'u-alex-08',
        displayName: 'Alex Thorne',
        handle: 'alex_performance',
        avatarUrl: '',
        score: 87.8,
        percentile: 93.8,
        archetype: 'Performance Thinker',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 84,
          content_creation: 82,
          performance_copy: 92,
          cro: 88,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 0,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 10, 2026',
        completedAt: '2026-08-10T18:20:00Z',
        roleTitle: 'Performance Creative Strategist',
        countryCode: 'AU',
      },
      {
        rank: 9,
        userId: 'u-lina-09',
        displayName: 'Lina Chen',
        handle: 'linachen_copy',
        avatarUrl: '',
        score: 86.9,
        percentile: 92.5,
        archetype: 'Conversion Diagnostician',
        strongestSkill: 'CRO & Experimentation',
        domainScores: {
          conversion_copywriting: 86,
          content_creation: 83,
          performance_copy: 85,
          cro: 91,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 10, 2026',
        completedAt: '2026-08-10T12:10:00Z',
        roleTitle: 'Senior CRO Specialist',
        countryCode: 'SG',
      },
      {
        rank: 10,
        userId: 'u-ahmed-10',
        displayName: 'Ahmed Nassar',
        handle: 'ahmed_nassar',
        avatarUrl: '',
        score: 86.2,
        percentile: 91.2,
        archetype: 'Message Strategist',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 89,
          content_creation: 84,
          performance_copy: 83,
          cro: 85,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 5,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 09, 2026',
        completedAt: '2026-08-09T14:40:00Z',
        roleTitle: 'Direct Response Copywriter',
        countryCode: 'EG',
      },
      {
        rank: 11,
        userId: 'u-tariq-11',
        displayName: 'Tariq Al-Mansoor',
        handle: 'tariq_growth',
        avatarUrl: '',
        score: 85.4,
        percentile: 89.8,
        archetype: 'Balanced Operator',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 86,
          content_creation: 85,
          performance_copy: 84,
          cro: 86,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -3,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 09, 2026',
        completedAt: '2026-08-09T08:15:00Z',
        roleTitle: 'Full-Stack Growth Copywriter',
        countryCode: 'SA',
      },
      {
        rank: 12,
        userId: 'u-sofia-12',
        displayName: 'Sofia Sterling',
        handle: 'sofia_content',
        avatarUrl: '',
        score: 84.8,
        percentile: 88.5,
        archetype: 'Content Architect',
        strongestSkill: 'Content Judgment & Hooks',
        domainScores: {
          conversion_copywriting: 82,
          content_creation: 91,
          performance_copy: 83,
          cro: 79,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 2,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 08, 2026',
        completedAt: '2026-08-08T15:50:00Z',
        roleTitle: 'Content Strategist & Story Lead',
        countryCode: 'SE',
      },
      {
        rank: 13,
        userId: 'u-dave-13',
        displayName: 'David Karras',
        handle: 'dave_b2b',
        avatarUrl: '',
        score: 84.1,
        percentile: 87.0,
        archetype: 'Message Strategist',
        strongestSkill: 'Conversion Copywriting',
        domainScores: {
          conversion_copywriting: 87,
          content_creation: 80,
          performance_copy: 81,
          cro: 84,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 08, 2026',
        completedAt: '2026-08-08T11:00:00Z',
        roleTitle: 'B2B Enterprise Copy Lead',
        countryCode: 'DE',
      },
      {
        rank: 14,
        userId: 'u-maya-14',
        displayName: 'Maya Ali',
        handle: 'maya_ali',
        avatarUrl: '',
        score: 83.5,
        percentile: 85.5,
        archetype: 'Sharp Editor',
        strongestSkill: 'Content Judgment & Hooks',
        domainScores: {
          conversion_copywriting: 81,
          content_creation: 88,
          performance_copy: 82,
          cro: 80,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 07, 2026',
        completedAt: '2026-08-07T17:25:00Z',
        roleTitle: 'Senior Copy Editor',
        countryCode: 'NL',
      },
      {
        rank: 15,
        userId: 'u-karim-15',
        displayName: 'Karim Hassan',
        handle: 'karim_cro',
        avatarUrl: '',
        score: 82.8,
        percentile: 83.8,
        archetype: 'Conversion Diagnostician',
        strongestSkill: 'CRO & Experimentation',
        domainScores: {
          conversion_copywriting: 83,
          content_creation: 78,
          performance_copy: 80,
          cro: 88,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 0,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 07, 2026',
        completedAt: '2026-08-07T09:30:00Z',
        roleTitle: 'CRO Consultant',
        countryCode: 'JO',
      },
      {
        rank: 16,
        userId: 'u-julia-16',
        displayName: 'Julia Santos',
        handle: 'julia_ads',
        avatarUrl: '',
        score: 81.9,
        percentile: 81.5,
        archetype: 'Response Driver',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 80,
          content_creation: 79,
          performance_copy: 87,
          cro: 78,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 2,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 06, 2026',
        completedAt: '2026-08-06T13:40:00Z',
        roleTitle: 'Social Ad Copywriter',
        countryCode: 'BR',
      },
      {
        rank: 17,
        userId: 'u-lucas-17',
        displayName: 'Lucas Weber',
        handle: 'lucas_growth',
        avatarUrl: '',
        score: 80.6,
        percentile: 79.0,
        archetype: 'Performance Thinker',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 79,
          content_creation: 78,
          performance_copy: 85,
          cro: 81,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -4,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 06, 2026',
        completedAt: '2026-08-06T10:10:00Z',
        roleTitle: 'Growth Marketer & Copywriter',
        countryCode: 'CH',
      },
      {
        rank: 18,
        userId: 'u-priya-18',
        displayName: 'Priya Sharma',
        handle: 'priya_writes',
        avatarUrl: '',
        score: 79.4,
        percentile: 76.5,
        archetype: 'Content Architect',
        strongestSkill: 'Content Judgment & Hooks',
        domainScores: {
          conversion_copywriting: 77,
          content_creation: 86,
          performance_copy: 78,
          cro: 74,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 1,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 05, 2026',
        completedAt: '2026-08-05T15:20:00Z',
        roleTitle: 'Organic Growth & Hook Specialist',
        countryCode: 'IN',
      },
      {
        rank: 19,
        userId: 'u-nathan-19',
        displayName: 'Nathan Drake',
        handle: 'nathan_direct',
        avatarUrl: '',
        score: 78.2,
        percentile: 73.8,
        archetype: 'Response Driver',
        strongestSkill: 'Performance Copy & Ads',
        domainScores: {
          conversion_copywriting: 78,
          content_creation: 75,
          performance_copy: 83,
          cro: 76,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: 0,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 05, 2026',
        completedAt: '2026-08-05T11:45:00Z',
        roleTitle: 'Direct Mail & Email Copywriter',
        countryCode: 'US',
      },
      {
        rank: 20,
        userId: 'u-emma-20',
        displayName: 'Emma Laurent',
        handle: 'emma_cro',
        avatarUrl: '',
        score: 77.1,
        percentile: 71.0,
        archetype: 'Conversion Diagnostician',
        strongestSkill: 'CRO & Experimentation',
        domainScores: {
          conversion_copywriting: 76,
          content_creation: 74,
          performance_copy: 77,
          cro: 84,
        },
        verificationStatus: 'verified',
        isVerified: true,
        rankChange: -2,
        assessmentVersion: 'v1.4.2-adaptive',
        date: 'Aug 04, 2026',
        completedAt: '2026-08-04T16:00:00Z',
        roleTitle: 'Junior CRO Analyst',
        countryCode: 'FR',
      },
    ];

    // Seed default challenge target
    this.challenges.set('mamdouh', {
      challengeCode: 'mamdouh',
      creatorHandle: 'mamdouh',
      creatorScore: 94.2,
      creatorArchetype: 'Message Strategist',
      creatorDomainScores: {
        conversion_copywriting: 97,
        content_creation: 91,
        performance_copy: 95,
        cro: 88,
      },
      createdAt: Date.now() - 3600000 * 24,
      participantCount: 142,
      bestOpponent: {
        handle: 'elena_cro',
        score: 93.6,
      },
    });

    this.challenges.set('sarahwrites', {
      challengeCode: 'sarahwrites',
      creatorHandle: 'sarahwrites',
      creatorScore: 88.7,
      creatorArchetype: 'Message Strategist',
      creatorDomainScores: {
        conversion_copywriting: 92,
        content_creation: 85,
        performance_copy: 86,
        cro: 87,
      },
      createdAt: Date.now() - 3600000 * 48,
      participantCount: 89,
      bestOpponent: {
        handle: 'mayawrites',
        score: 91.4,
      },
    });
  }

  // Attempts
  saveSession(session: AssessmentSessionState) {
    this.attempts.set(session.sessionId, session);
  }

  getSession(sessionId: string): AssessmentSessionState | undefined {
    return this.attempts.get(sessionId);
  }

  // Final Scores
  saveFinalScore(score: FinalAssessmentScore) {
    this.finalScores.set(score.attemptId, score);

    // If handle exists, update user profile and leaderboard
    if (score.userHandle) {
      this.recordUserScore(score.userHandle, score);
    }
  }

  getFinalScore(attemptId: string): FinalAssessmentScore | undefined {
    return this.finalScores.get(attemptId);
  }

  recordUserScore(handle: string, score: FinalAssessmentScore) {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const existing = this.userProfiles.get(cleanHandle);

    if (!existing || score.overallScore > existing.bestScore.overallScore) {
      this.userProfiles.set(cleanHandle, {
        handle: cleanHandle,
        bestScore: score,
        attemptsCount: (existing?.attemptsCount || 0) + 1,
      });

      // Update or insert into leaderboard
      const existingLbIndex = this.leaderboard.findIndex((e) => e.handle.toLowerCase() === cleanHandle);
      const strongest = Object.entries(score.domainScores).sort((a, b) => b[1].scaledScore - a[1].scaledScore)[0];
      
      const domainMap: Record<DomainId, number> = {
        conversion_copywriting: score.domainScores.conversion_copywriting?.scaledScore || 0,
        content_creation: score.domainScores.content_creation?.scaledScore || 0,
        performance_copy: score.domainScores.performance_copy?.scaledScore || 0,
        cro: score.domainScores.cro?.scaledScore || 0,
      };

      const newEntry: LeaderboardEntry = {
        rank: 0,
        userId: `u-${cleanHandle}`,
        displayName: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
        handle: cleanHandle,
        score: score.overallScore,
        percentile: score.percentile,
        archetype: score.archetype.name,
        strongestSkill: strongest ? strongest[0].replace('_', ' ') : 'Conversion Copywriting',
        domainScores: domainMap,
        verificationStatus: score.isVerified ? 'verified' : 'practice',
        isVerified: score.isVerified,
        rankChange: 0,
        isNew: true,
        assessmentVersion: score.assessmentVersion,
        date: 'Today',
        completedAt: new Date().toISOString(),
        roleTitle: score.rankTitle,
      };

      if (existingLbIndex >= 0) {
        this.leaderboard[existingLbIndex] = newEntry;
      } else {
        this.leaderboard.push(newEntry);
      }

      // Re-sort leaderboard by score descending, then by internal precision
      this.leaderboard.sort((a, b) => b.score - a.score);
      this.leaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
    } else {
      existing.attemptsCount++;
    }
  }

  // Leaderboard with filters, search, and metadata
  getLeaderboardData(params?: {
    category?: string;
    timeframe?: string;
    search?: string;
    userHandle?: string;
  }): {
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
  } {
    const category = params?.category || 'all';
    const timeframe = params?.timeframe || 'global';
    const search = params?.search?.trim().toLowerCase() || '';
    const userHandle = params?.userHandle?.trim().toLowerCase() || '';

    let list = [...this.leaderboard];

    // Filter by skill domain
    if (category && category !== 'all') {
      const cat = category.toLowerCase();
      if (cat === 'conversion') {
        list = list.filter((e) => e.archetype.includes('Strategist') || e.strongestSkill.toLowerCase().includes('conversion'));
      } else if (cat === 'content') {
        list = list.filter((e) => e.archetype.includes('Editor') || e.archetype.includes('Architect') || e.strongestSkill.toLowerCase().includes('content'));
      } else if (cat === 'performance') {
        list = list.filter((e) => e.archetype.includes('Response') || e.archetype.includes('Performance'));
      } else if (cat === 'cro') {
        list = list.filter((e) => e.archetype.includes('Diagnostician') || e.strongestSkill.toLowerCase().includes('cro'));
      }
    }

    // Filter by timeframe (for demo realism, simulation of weekly active slice)
    if (timeframe === 'weekly') {
      // Recent cohort subset
      list = list.filter((_, idx) => idx % 2 === 0 || idx < 5);
    } else if (timeframe === 'monthly') {
      list = list.filter((_, idx) => idx % 3 !== 2 || idx < 8);
    }

    // Re-rank after filter
    const rankedList = list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    // Calculate metadata
    const scores = rankedList.map((e) => e.score);
    const top10Index = Math.max(0, Math.floor(rankedList.length * 0.1));
    const top5Index = Math.max(0, Math.floor(rankedList.length * 0.05));
    const scoreToTop10 = scores[top10Index] || 84.0;
    const scoreToTop5 = scores[top5Index] || 91.0;
    const scoreToTop1 = scores[0] || 94.2;

    const meta: LeaderboardMeta = {
      totalAttempts: 2481 + this.finalScores.size,
      scoreToTop10: Number(scoreToTop10.toFixed(1)),
      scoreToTop5: Number(scoreToTop5.toFixed(1)),
      scoreToTop1: Number(scoreToTop1.toFixed(1)),
      weeklyResetSeconds: 184938, // ~2 days 3 hours
      competitionWeek: 33,
      startDate: 'Aug 10',
      endDate: 'Aug 16',
      activeParticipants: 1284,
      assessmentVersion: 'v1.4.2-adaptive',
    };

    // Calculate User Position & Competitive Proximity
    let userPosition: any = undefined;
    let neighborhood: LeaderboardEntry[] = [];

    if (userHandle) {
      const userIdx = rankedList.findIndex((e) => e.handle.toLowerCase() === userHandle);
      if (userIdx >= 0) {
        const uEntry = rankedList[userIdx];
        const aheadEntry = userIdx > 0 ? rankedList[userIdx - 1] : undefined;
        const behindEntry = userIdx < rankedList.length - 1 ? rankedList[userIdx + 1] : undefined;

        const pointsToNext = aheadEntry ? Number((aheadEntry.score - uEntry.score).toFixed(1)) : 0;
        const pointsToTop10 = Math.max(0, Number((scoreToTop10 - uEntry.score).toFixed(1)));
        const pointsToTop5 = Math.max(0, Number((scoreToTop5 - uEntry.score).toFixed(1)));
        const pointsToTop1 = Math.max(0, Number((scoreToTop1 - uEntry.score).toFixed(1)));

        userPosition = {
          rank: uEntry.rank,
          entry: uEntry,
          pointsToNext: pointsToNext > 0 ? pointsToNext : 0.5,
          pointsToTop10,
          pointsToTop5,
          pointsToTop1,
          aheadOfRank: aheadEntry ? { rank: aheadEntry.rank, handle: aheadEntry.handle, diff: pointsToNext } : undefined,
          behindRank: behindEntry ? { rank: behindEntry.rank, handle: behindEntry.handle, diff: Number((uEntry.score - behindEntry.score).toFixed(1)) } : undefined,
        };

        // Neighborhood window of ±3 places
        const startIdx = Math.max(0, userIdx - 3);
        const endIdx = Math.min(rankedList.length, userIdx + 4);
        neighborhood = rankedList.slice(startIdx, endIdx);
      }
    }

    // Apply text search filter if provided
    let finalEntries = rankedList;
    if (search) {
      finalEntries = rankedList.filter(
        (e) =>
          e.handle.toLowerCase().includes(search) ||
          e.displayName.toLowerCase().includes(search) ||
          e.archetype.toLowerCase().includes(search) ||
          e.strongestSkill.toLowerCase().includes(search)
      );
    }

    return {
      entries: finalEntries,
      meta,
      userPosition,
      neighborhood,
    };
  }

  // Legacy compatibility
  getLeaderboard(filterCategory?: string): LeaderboardEntry[] {
    return this.getLeaderboardData({ category: filterCategory }).entries;
  }

  // Challenges
  createChallenge(challenge: HeadToHeadChallenge): HeadToHeadChallenge {
    this.challenges.set(challenge.challengeCode.toLowerCase(), challenge);
    return challenge;
  }

  getChallenge(code: string): HeadToHeadChallenge | undefined {
    return this.challenges.get(code.toLowerCase());
  }

  recordChallengeAttempt(code: string, opponentHandle: string, opponentScore: number) {
    const ch = this.challenges.get(code.toLowerCase());
    if (ch) {
      ch.participantCount++;
      if (!ch.bestOpponent || opponentScore > ch.bestOpponent.score) {
        ch.bestOpponent = { handle: opponentHandle, score: opponentScore };
      }
    }
  }

  // Profile
  getProfile(handle: string) {
    const clean = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const profile = this.userProfiles.get(clean);
    if (profile) return profile;

    // Check if in seed leaderboard
    const lb = this.leaderboard.find((l) => l.handle.toLowerCase() === clean);
    if (lb) {
      const domains = lb.domainScores || {
        conversion_copywriting: 88,
        content_creation: 82,
        performance_copy: 84,
        cro: 86,
      };

      return {
        handle: lb.handle,
        displayName: lb.displayName,
        bestScore: {
          attemptId: `seed-${clean}`,
          assessmentVersion: lb.assessmentVersion,
          createdAt: Date.now() - 86400000 * 2,
          completedAt: Date.now() - 86400000 * 2 + 600000,
          overallScore: lb.score,
          percentile: lb.percentile,
          confidenceLevel: 95,
          rankTitle: lb.score >= 90 ? 'Principal Specialist' : 'Senior Specialist',
          maxDifficultyReached: 5,
          domainScores: {
            conversion_copywriting: { domain: 'conversion_copywriting', rawScore: 12, scaledScore: domains.conversion_copywriting, questionsAttempted: 3, accuracy: 90, highestDifficultyCleared: 5, statusLabel: 'Expert' },
            content_creation: { domain: 'content_creation', rawScore: 11, scaledScore: domains.content_creation, questionsAttempted: 3, accuracy: 85, highestDifficultyCleared: 4, statusLabel: 'Strong' },
            performance_copy: { domain: 'performance_copy', rawScore: 11, scaledScore: domains.performance_copy, questionsAttempted: 2, accuracy: 88, highestDifficultyCleared: 4, statusLabel: 'Strong' },
            cro: { domain: 'cro', rawScore: 12, scaledScore: domains.cro, questionsAttempted: 2, accuracy: 88, highestDifficultyCleared: 5, statusLabel: 'Expert' },
          },
          archetype: {
            id: clean,
            name: lb.archetype,
            tagline: 'Architect of awareness, proof systems & core value hierarchy',
            badge: 'VERIFIED',
            description: 'Proven high performer in conversion and message architecture benchmarks.',
            superpower: 'Structuring value propositions that convert cold traffic into qualified buyers.',
            blindspot: 'Occasional bias toward deep structural proof over fast ad velocity.',
            dominantDomains: ['conversion_copywriting', 'cro'],
          },
          whatYouDidWell: ['Consistently diagnosed cognitive friction before rewriting headlines.', 'Optimal awareness-stage calibration on complex offers.'],
          whatCostYouPoints: ['Minor deductions on non-core channel sequencing tests.'],
          growthActions: ['Continue advancing high-intent search ad copy testing.'],
          totalTimeSeconds: 520,
          verificationHash: `CS-VERIFIED-${clean.toUpperCase()}`,
          isVerified: true,
          userHandle: clean,
        },
        attemptsCount: 1,
      };
    }
    return null;
  }
}

// Global singleton instance
const globalStoreKey = Symbol.for('copyscore.store');
const globalAny = global as unknown as Record<symbol, AssessmentStore>;

if (!globalAny[globalStoreKey]) {
  globalAny[globalStoreKey] = new AssessmentStore();
}

export const store = globalAny[globalStoreKey];


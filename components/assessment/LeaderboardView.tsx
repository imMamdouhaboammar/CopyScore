'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LeaderboardEntry,
  LeaderboardMeta,
  TimeframeFilter,
  SkillCategoryFilter,
  FinalAssessmentScore,
} from '@/lib/types/assessment';
import { LeaderboardHero } from './leaderboard/LeaderboardHero';
import { CompetitionMeta } from './leaderboard/CompetitionMeta';
import { LeaderboardFilters } from './leaderboard/LeaderboardFilters';
import { LeaderboardPodium } from './leaderboard/LeaderboardPodium';
import { CurrentUserRank } from './leaderboard/CurrentUserRank';
import { LeaderboardRankingsTable } from './leaderboard/LeaderboardRankingsTable';
import { PlayerProfileModal } from './leaderboard/PlayerProfileModal';
import { ShareRankModal } from './leaderboard/ShareRankModal';
import { RankingMethodology } from './leaderboard/RankingMethodology';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LeaderboardViewProps {
  onStartAssessment: () => void;
  onChallengeUser: (handle: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function LeaderboardView({ onStartAssessment, onChallengeUser }: LeaderboardViewProps) {
  // State for Filters & Search
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('global');
  const [category, setCategory] = useState<SkillCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Data State
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [meta, setMeta] = useState<LeaderboardMeta | undefined>(undefined);
  const [userPosition, setUserPosition] = useState<any>(undefined);
  const [neighborhood, setNeighborhood] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Local User Result State from localStorage using lazy initializer
  const [userScore] = useState<FinalAssessmentScore | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedScore = localStorage.getItem('copyscore_user_result');
      if (savedScore) {
        return JSON.parse(savedScore) as FinalAssessmentScore;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [userHandle] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const savedScore = localStorage.getItem('copyscore_user_result');
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        if (parsed.userHandle) return parsed.userHandle;
      }
      return localStorage.getItem('copyscore_handle') || '';
    } catch {
      return '';
    }
  });

  // UI Interactive State
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [showNeighborhoodOnly, setShowNeighborhoodOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Ref for scrolling to user row
  const userRowRef = useRef<HTMLTableRowElement | null>(null);

  // Handlers for filters
  const handleTimeframeChange = (tf: TimeframeFilter) => {
    setTimeframe(tf);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: SkillCategoryFilter) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Fetch leaderboard data on filter changes
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          category,
          timeframe,
          search: searchQuery.trim(),
          userHandle: userHandle || '',
        });

        const res = await fetch(`/api/leaderboard?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        if (!isCancelled) {
          if (data.success) {
            setEntries(data.entries || []);
            setMeta(data.meta);
            setUserPosition(data.userPosition);
            setNeighborhood(data.neighborhood || []);
          } else {
            throw new Error(data.error || 'Failed to retrieve rankings');
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          console.error('Error fetching leaderboard:', err);
          const msg = err instanceof Error ? err.message : 'Unable to connect to the leaderboard service.';
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [category, timeframe, searchQuery, userHandle, reloadKey]);

  // Derived list of entries to display
  const activeEntries = showNeighborhoodOnly && neighborhood.length > 0 ? neighborhood : entries;

  // Pagination calculation
  const totalPages = Math.ceil(activeEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = useMemo(() => {
    if (showNeighborhoodOnly) return activeEntries;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [activeEntries, currentPage, showNeighborhoodOnly]);

  // Podium (Top 3 of full global list or filtered list)
  const top3 = useMemo(() => {
    return entries.slice(0, 3);
  }, [entries]);

  // Jump to User row in table
  const handleJumpToUser = () => {
    if (userPosition) {
      // Find page number if in table
      const userIndex = entries.findIndex((e) => e.handle.toLowerCase() === (userHandle || '').toLowerCase());
      if (userIndex !== -1) {
        const targetPage = Math.floor(userIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(targetPage);
        setShowNeighborhoodOnly(false);
        setTimeout(() => {
          userRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  };

  // Human-readable labels for telemetry
  const categoryLabels: Record<string, string> = {
    all: 'OVERALL',
    conversion: 'CONVERSION COPY',
    content: 'CONTENT & HOOKS',
    performance: 'PERFORMANCE ADS',
    cro: 'CRO & FUNNELS',
  };

  const timeframeLabels: Record<string, string> = {
    global: 'ALL TIME',
    weekly: 'THIS WEEK',
    monthly: 'THIS MONTH',
  };

  return (
    <div className="w-full bg-[#fcfbf8] text-[#0f0f11] min-h-screen">
      {/* 1. Hero Section */}
      <LeaderboardHero
        meta={meta}
        onStartAssessment={onStartAssessment}
        hasUserScore={Boolean(userScore || userPosition)}
      />

      {/* 2. Live Competition Meta Strip */}
      <CompetitionMeta
        meta={meta}
        activeCategoryLabel={categoryLabels[category] || 'OVERALL'}
        activeTimeframeLabel={timeframeLabels[timeframe] || 'GLOBAL'}
      />

      {/* 3. Segmented Filter & Search Bar */}
      <LeaderboardFilters
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        totalFiltered={entries.length}
      />

      {/* Loading & Error States */}
      {isLoading && (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block h-6 w-6 border-2 border-[#0f0f11] border-t-[#df9367] animate-spin" />
          <p className="text-xs font-mono text-[#52525b] uppercase tracking-wider">
            SYNCHRONIZING BENCHMARKS...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white border-[1.5px] border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11] text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-[#b91c1c] mx-auto" />
          <h3 className="font-bold text-sm font-mono text-[#0f0f11]">LEADERBOARD SYNC FAILED</h3>
          <p className="text-xs font-mono text-[#52525b]">{error}</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="patter-btn patter-btn-peach px-4 py-2 text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* 4. Top 3 Podium (Shown when not filtering search) */}
          {!searchQuery && top3.length > 0 && (
            <LeaderboardPodium
              top3={top3}
              onSelectPlayer={setSelectedPlayer}
              onChallengePlayer={onChallengeUser}
              currentUserHandle={userHandle}
            />
          )}

          {/* 5. "Your Position" Proximity Module */}
          <CurrentUserRank
            userScore={userScore}
            userPositionData={userPosition}
            meta={meta}
            onStartAssessment={onStartAssessment}
            onShareRank={() => setIsShareModalOpen(true)}
            onJumpToPosition={handleJumpToUser}
          />

          {/* 6. Main Rankings Table with Mobile cards */}
          <LeaderboardRankingsTable
            entries={paginatedEntries}
            currentUserHandle={userHandle}
            onSelectPlayer={setSelectedPlayer}
            onChallengePlayer={onChallengeUser}
            userRowRef={userRowRef}
            showNeighborhoodOnly={showNeighborhoodOnly}
            onToggleNeighborhood={() => setShowNeighborhoodOnly(!showNeighborhoodOnly)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onJumpToUser={handleJumpToUser}
            hasUserScore={Boolean(userScore || userPosition)}
          />

          {/* Empty search state */}
          {entries.length === 0 && (
            <div className="max-w-md mx-auto my-12 p-8 bg-white border-[1.5px] border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11] text-center space-y-2">
              <p className="font-bold font-mono text-sm text-[#0f0f11]">NO MATCHING SPECIALISTS</p>
              <p className="text-xs font-mono text-[#52525b]">
                No profiles match query &quot;{searchQuery}&quot;. Try adjusting your search term or domain filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
                className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono mt-2 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* 7. Psychometric Integrity & Calibration Methodology */}
          <RankingMethodology />
        </>
      )}

      {/* Player Profile Details Modal */}
      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onChallenge={onChallengeUser}
        />
      )}

      {/* Share Rank Modal */}
      {isShareModalOpen && (
        <ShareRankModal
          userScore={userScore}
          userRank={userPosition?.rank || 147}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}

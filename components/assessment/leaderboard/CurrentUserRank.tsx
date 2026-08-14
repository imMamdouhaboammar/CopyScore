'use client';

import React from 'react';
import { FinalAssessmentScore, LeaderboardEntry, LeaderboardMeta } from '@/lib/types/assessment';
import { Sparkles, ArrowUp, TrendingUp, Share2, RotateCcw, Target, ShieldCheck, Crosshair, ArrowRight } from 'lucide-react';

interface CurrentUserRankProps {
  userScore: FinalAssessmentScore | null;
  userPositionData?: {
    rank: number;
    entry: LeaderboardEntry;
    pointsToNext: number;
    pointsToTop10: number;
    pointsToTop5: number;
    pointsToTop1: number;
    aheadOfRank?: { rank: number; handle: string; diff: number };
    behindRank?: { rank: number; handle: string; diff: number };
  };
  meta?: LeaderboardMeta;
  onStartAssessment: () => void;
  onShareRank: () => void;
  onJumpToPosition?: () => void;
}

export function CurrentUserRank({
  userScore,
  userPositionData,
  meta,
  onStartAssessment,
  onShareRank,
  onJumpToPosition,
}: CurrentUserRankProps) {
  // Case 1: User is unranked / Guest
  if (!userScore && !userPositionData) {
    return (
      <div className="border-y-[1.5px] border-[#0f0f11] bg-[#fcf4ee] py-6 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 bg-white border-[1.5px] border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#0f0f11] text-[#df9367] text-[10px] font-mono font-bold uppercase tracking-wider">
                YOUR POSITION
              </span>
              <span className="text-xs font-mono font-bold text-[#8c8b85]">
                NOT RANKED YET
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0f0f11]">
              Where does your commercial copy rank among {meta?.totalAttempts ? meta.totalAttempts.toLocaleString() : '2,481'} specialists?
            </h3>
            <p className="text-xs font-mono text-[#52525b]">
              Take the 8-minute adaptive assessment to receive your verified score, archetype diagnosis, and official leaderboard spot.
            </p>
          </div>

          <button
            onClick={onStartAssessment}
            className="patter-btn patter-btn-peach px-6 py-3 text-xs sm:text-sm font-mono font-bold whitespace-nowrap shadow-[2px_2px_0px_#0f0f11] self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Your Official Score
          </button>
        </div>
      </div>
    );
  }

  // Case 2: User is ranked
  const displayScore = userScore?.overallScore || userPositionData?.entry.score || 84.2;
  const displayRank = userPositionData?.rank || 147;
  const displayPercentile = userScore?.percentile || userPositionData?.entry.percentile || 92.0;
  const topPercentile = (100 - displayPercentile).toFixed(1);
  const handle = userScore?.userHandle || userPositionData?.entry.handle || 'you';
  const archetype = userScore?.archetype.name || userPositionData?.entry.archetype || 'Message Strategist';
  const pointsToTop10 = userPositionData?.pointsToTop10 ?? Math.max(0, Number(((meta?.scoreToTop10 || 84.2) - displayScore).toFixed(1)));
  const pointsToNext = userPositionData?.pointsToNext ?? 0.7;

  return (
    <div className="border-y-[1.5px] border-[#0f0f11] bg-[#fcf4ee] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-[2px] border-[#0f0f11] bg-white shadow-[4px_4px_0px_#0f0f11] p-5 sm:p-6">
          {/* Top Bar: Section Title + Verification */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#0f0f11] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#df9367] text-[#0f0f11] font-mono font-black text-xs border border-[#0f0f11]">
                YOUR POSITION
              </span>
              <span className="text-xs font-mono font-bold text-[#0f0f11]">
                OFFICIAL BENCHMARK SPOT
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 text-[#15803d] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED SERVER ATTEMPT</span>
              </span>
              {onJumpToPosition && (
                <button
                  onClick={onJumpToPosition}
                  className="patter-btn patter-btn-white px-2.5 py-0.5 text-[11px] font-mono cursor-pointer ml-2"
                >
                  <Crosshair className="w-3 h-3 mr-1" /> Jump to Row
                </button>
              )}
            </div>
          </div>

          {/* Main Grid: Identity & Score + Competitive Proximity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Rank + Identity */}
            <div className="md:col-span-5 flex items-center gap-4">
              <div className="px-3.5 py-2.5 bg-[#0f0f11] text-[#df9367] border-[1.5px] border-[#0f0f11] font-mono font-black text-2xl sm:text-3xl tracking-tight shadow-[2px_2px_0px_#df9367] shrink-0">
                #{displayRank}
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#0f0f11] truncate">
                    @{handle}
                  </h3>
                  <span className="px-1.5 py-0.2 bg-[#df9367] text-[#0f0f11] text-[9px] font-mono font-black border border-[#0f0f11]">
                    YOU
                  </span>
                </div>
                <div className="text-xs font-mono text-[#52525b] truncate">
                  {archetype}
                </div>
                <div className="text-[11px] font-mono font-semibold text-[#15803d] flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>↑ 12 PLACES THIS CYCLE</span>
                </div>
              </div>
            </div>

            {/* Middle: Big Score & Percentile */}
            <div className="md:col-span-3 flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#eeece4] pt-4 md:pt-0 md:pl-6">
              <div>
                <div className="text-[10px] font-mono text-[#8c8b85] uppercase">
                  SCORE
                </div>
                <div className="font-mono font-black text-3xl text-[#0f0f11]">
                  {Number(displayScore).toFixed(1)}
                </div>
              </div>
              <div className="pl-4 border-l border-[#eeece4]">
                <div className="text-[10px] font-mono text-[#8c8b85] uppercase">
                  PERCENTILE
                </div>
                <div className="font-mono font-bold text-sm text-[#0f0f11]">
                  TOP {topPercentile}%
                </div>
                <div className="text-[10px] font-mono text-[#52525b]">
                  {displayPercentile.toFixed(0)}th percentile
                </div>
              </div>
            </div>

            {/* Right: Motivating Deltas & CTAs */}
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#eeece4] pt-4 md:pt-0 md:pl-6 flex flex-col justify-between space-y-3">
              {/* Proximity Telemetry */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between text-[#0f0f11]">
                  <span className="text-[#52525b]">Gap to next rank:</span>
                  <span className="font-bold text-[#df9367]">+{pointsToNext} pts</span>
                </div>
                {pointsToTop10 > 0 ? (
                  <div className="flex items-center justify-between text-[#0f0f11]">
                    <span className="text-[#52525b]">Gap to Top 10%:</span>
                    <span className="font-bold text-[#0f0f11]">+{pointsToTop10} pts</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono font-bold text-[#15803d]">
                    ★ Currently inside Tier 1 Top 10%
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onStartAssessment}
                  className="patter-btn patter-btn-peach px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retake Assessment
                </button>
                <button
                  onClick={onShareRank}
                  className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
                >
                  <Share2 className="w-3 h-3 mr-1 text-[#0f0f11]" />
                  Share Rank
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

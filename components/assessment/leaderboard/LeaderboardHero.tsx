'use client';

import React from 'react';
import { LeaderboardMeta } from '@/lib/types/assessment';
import { ShieldCheck, Sparkles, Clock, Target, Users } from 'lucide-react';

interface LeaderboardHeroProps {
  meta?: LeaderboardMeta;
  onStartAssessment: () => void;
  hasUserScore: boolean;
}

export function LeaderboardHero({ meta, onStartAssessment, hasUserScore }: LeaderboardHeroProps) {
  // Format reset countdown
  const formatCountdown = (seconds?: number) => {
    if (!seconds) return '02D 07H 42M';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${String(d).padStart(2, '0')}D ${String(h).padStart(2, '0')}H ${String(m).padStart(2, '0')}M`;
  };

  return (
    <section className="border-b-[1.5px] border-[#0f0f11] bg-white pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left: Large Editorial Title */}
          <div className="lg:col-span-7 space-y-4">
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0f0f11] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-[#df9367] animate-pulse-subtle" />
                GLOBAL RANKINGS / LIVE
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#0f0f11] bg-[#fcfbf8] text-[11px] font-mono text-[#52525b]">
                <ShieldCheck className="w-3 h-3 text-[#15803d]" />
                VERIFIED ATTEMPTS ONLY
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#8c8b85]">
                {meta?.assessmentVersion || 'ASSESSMENT v1.4.2'}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f0f11] tracking-tight uppercase leading-[0.95] font-sans">
              THE BEST<br />
              <span className="text-[#df9367] underline decoration-[#0f0f11] decoration-2 underline-offset-4">
                COPYWRITERS
              </span><br />
              ON THE BOARD
            </h1>

            {/* Supporting Subtext */}
            <p className="text-xs sm:text-sm font-mono text-[#52525b] max-w-xl leading-relaxed">
              Server-calculated percentiles for conversion copywriters, performance advertisers, content strategists, and CRO specialists under real-world constraints.
            </p>
          </div>

          {/* Right: Live Leaderboard Telemetry Metadata Box */}
          <div className="lg:col-span-5">
            <div className="border-[1.5px] border-[#0f0f11] bg-[#fcfbf8] shadow-[4px_4px_0px_#0f0f11] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-2.5 mb-3.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0f0f11] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#df9367]" />
                  COMPETITIVE TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-[#8c8b85] uppercase">
                  WEEK {meta?.competitionWeek || 33}
                </span>
              </div>

              {/* 3 High-contrast Metric Cells */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-[#0f0f11] bg-white p-2.5 sm:p-3 text-left">
                  <div className="font-mono font-black text-xl sm:text-2xl text-[#0f0f11] tracking-tight">
                    {meta?.totalAttempts ? meta.totalAttempts.toLocaleString() : '2,481'}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono font-bold text-[#52525b] uppercase leading-tight mt-1">
                    VERIFIED ATTEMPTS
                  </div>
                </div>

                <div className="border border-[#0f0f11] bg-white p-2.5 sm:p-3 text-left">
                  <div className="font-mono font-black text-xl sm:text-2xl text-[#df9367] tracking-tight">
                    {meta?.scoreToTop10 ? meta.scoreToTop10.toFixed(1) : '84.2'}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono font-bold text-[#52525b] uppercase leading-tight mt-1">
                    SCORE FOR TOP 10%
                  </div>
                </div>

                <div className="border border-[#0f0f11] bg-white p-2.5 sm:p-3 text-left">
                  <div className="font-mono font-bold text-xs sm:text-sm text-[#0f0f11] tracking-tight mt-1">
                    {formatCountdown(meta?.weeklyResetSeconds)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono font-bold text-[#52525b] uppercase leading-tight mt-1 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#8c8b85]" />
                    WEEKLY RESET
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-4 pt-3 border-t border-[#eeece4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-[#52525b] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0f0f11]" />
                  <span>{meta?.activeParticipants || 1284} active this cycle</span>
                </div>

                <button
                  onClick={onStartAssessment}
                  className="patter-btn patter-btn-peach px-4 py-2 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f0f11] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#0f0f11]" />
                  {hasUserScore ? 'Improve Your Rank' : 'Take The Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

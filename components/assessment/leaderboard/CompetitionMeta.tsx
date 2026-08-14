'use client';

import React from 'react';
import { LeaderboardMeta } from '@/lib/types/assessment';
import { ShieldCheck, Activity } from 'lucide-react';

interface CompetitionMetaProps {
  meta?: LeaderboardMeta;
  activeCategoryLabel?: string;
  activeTimeframeLabel?: string;
}

export function CompetitionMeta({ meta, activeCategoryLabel = 'OVERALL', activeTimeframeLabel = 'GLOBAL' }: CompetitionMetaProps) {
  return (
    <div className="border-b border-[#0f0f11] bg-[#0f0f11] text-white py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] font-mono tracking-wider">
        {/* Left: Competition Cycle & Range */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-[#df9367]">
            <Activity className="w-3.5 h-3.5" />
            <span>CYCLE: WEEK {meta?.competitionWeek || 33}</span>
          </span>
          <span className="text-[#52525b]">/</span>
          <span className="text-[#eeece4]">
            {meta?.startDate || 'AUG 10'} → {meta?.endDate || 'AUG 16, 2026'}
          </span>
          <span className="text-[#52525b] hidden sm:inline">/</span>
          <span className="text-[#8c8b85] hidden sm:inline">
            SCOPE: {activeTimeframeLabel} • {activeCategoryLabel}
          </span>
        </div>

        {/* Right: Validation & Participant Count */}
        <div className="flex items-center gap-4 text-[#d3d0c5]">
          <span className="flex items-center gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
            <span>{meta?.activeParticipants || 1284} ACTIVE BENCHMARKS</span>
          </span>
          <span className="text-[#52525b]">/</span>
          <span className="flex items-center gap-1 text-[#df9367]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CALIBRATION: IRT 4-D</span>
          </span>
        </div>
      </div>
    </div>
  );
}

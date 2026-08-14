'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/types/assessment';
import { Swords, ShieldCheck, ArrowUp, ArrowDown, Minus, Sparkles, UserCheck, Crosshair, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaderboardRankingsTableProps {
  entries: LeaderboardEntry[];
  currentUserHandle?: string;
  onSelectPlayer: (entry: LeaderboardEntry) => void;
  onChallengePlayer: (handle: string) => void;
  userRowRef?: React.RefObject<HTMLTableRowElement | null>;
  showNeighborhoodOnly?: boolean;
  onToggleNeighborhood?: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onJumpToUser?: () => void;
  hasUserScore: boolean;
}

export function LeaderboardRankingsTable({
  entries,
  currentUserHandle,
  onSelectPlayer,
  onChallengePlayer,
  userRowRef,
  showNeighborhoodOnly,
  onToggleNeighborhood,
  currentPage,
  totalPages,
  onPageChange,
  onJumpToUser,
  hasUserScore,
}: LeaderboardRankingsTableProps) {
  // Render movement badge
  const renderMovement = (change?: number, isNew?: boolean) => {
    if (isNew) {
      return (
        <span className="px-1 py-0.2 bg-[#df9367] text-[#0f0f11] text-[9px] font-mono font-black border border-[#0f0f11]">
          NEW
        </span>
      );
    }
    if (change === undefined || change === 0) {
      return (
        <span className="text-[#8c8b85] flex items-center gap-0.5 text-[11px] font-mono" title="No change in rank">
          <Minus className="w-3 h-3" />
        </span>
      );
    }
    if (change > 0) {
      return (
        <span className="text-[#15803d] flex items-center gap-0.5 text-[11px] font-mono font-bold" title={`Gained ${change} ranks`}>
          <ArrowUp className="w-3 h-3 text-[#15803d]" />
          <span>{change}</span>
        </span>
      );
    }
    return (
      <span className="text-[#b91c1c] flex items-center gap-0.5 text-[11px] font-mono font-bold" title={`Dropped ${Math.abs(change)} ranks`}>
        <ArrowDown className="w-3 h-3 text-[#b91c1c]" />
        <span>{Math.abs(change)}</span>
      </span>
    );
  };

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Table Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[1.5px] border-[#0f0f11] pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0f0f11]">
              FULL ROSTER RANKINGS
            </h3>
            <span className="text-xs font-mono text-[#8c8b85]">
              ({entries.length} PROFILES IN VIEW)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasUserScore && onToggleNeighborhood && (
              <button
                onClick={onToggleNeighborhood}
                className={`patter-btn px-3 py-1 text-xs font-mono font-medium cursor-pointer ${
                  showNeighborhoodOnly
                    ? 'bg-[#df9367] text-[#0f0f11] font-bold'
                    : 'bg-white text-[#0f0f11]'
                }`}
              >
                {showNeighborhoodOnly ? 'View Full Board' : 'My Neighborhood (±3)'}
              </button>
            )}

            {hasUserScore && onJumpToUser && (
              <button
                onClick={onJumpToUser}
                className="patter-btn patter-btn-white px-3 py-1 text-xs font-mono font-bold cursor-pointer"
              >
                <Crosshair className="w-3 h-3 mr-1 text-[#df9367]" />
                Jump to Me
              </button>
            )}
          </div>
        </div>

        {/* Desktop View: Clean Semantic Table */}
        <div className="hidden md:block border-[1.5px] border-[#0f0f11] bg-white shadow-[4px_4px_0px_#0f0f11] overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#0f0f11] text-white text-[11px] uppercase tracking-wider border-b-[1.5px] border-[#0f0f11]">
                <th className="py-3 px-4 w-20 text-center">Rank</th>
                <th className="py-3 px-4">Player / Specialist</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Archetype</th>
                <th className="py-3 px-4">Strongest Domain</th>
                <th className="py-3 px-4 text-center">Percentile</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeece4]">
              {entries.map((entry) => {
                const isCurrent = currentUserHandle && entry.handle.toLowerCase() === currentUserHandle.toLowerCase();

                return (
                  <tr
                    key={entry.handle}
                    ref={isCurrent ? (userRowRef as any) : undefined}
                    onClick={() => onSelectPlayer(entry)}
                    className={`transition-colors cursor-pointer group ${
                      isCurrent
                        ? 'bg-[#fcf4ee] hover:bg-[#faebd7] font-semibold'
                        : 'hover:bg-[#fcfbf8] bg-white'
                    }`}
                  >
                    {/* Rank + Movement */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`font-mono font-black text-sm ${
                          entry.rank <= 3 ? 'text-[#df9367]' : 'text-[#0f0f11]'
                        }`}>
                          #{entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                        </span>
                        {renderMovement(entry.rankChange, entry.isNew)}
                      </div>
                    </td>

                    {/* Player Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 border border-[#0f0f11] flex items-center justify-center font-mono font-bold text-xs ${
                          isCurrent ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-[#eeece4] text-[#0f0f11]'
                        }`}>
                          {entry.displayName ? entry.displayName.charAt(0) : entry.handle.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#0f0f11] group-hover:text-[#df9367] transition-colors">
                              {entry.displayName || `@${entry.handle}`}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 bg-[#df9367] text-[#0f0f11] text-[9px] font-black border border-[#0f0f11]">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#52525b]">@{entry.handle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Score (Dominant) */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-black text-base text-[#0f0f11]">
                        {entry.score.toFixed(1)}
                      </span>
                    </td>

                    {/* Archetype */}
                    <td className="py-3.5 px-4 text-[#0f0f11]">
                      <span className="inline-block px-2 py-0.5 bg-[#fcfbf8] border border-[#eeece4] text-[10px] uppercase font-bold text-[#0f0f11]">
                        {entry.archetype}
                      </span>
                    </td>

                    {/* Strongest Skill */}
                    <td className="py-3.5 px-4 text-[#52525b]">
                      <span className="text-xs">{entry.strongestSkill}</span>
                    </td>

                    {/* Percentile */}
                    <td className="py-3.5 px-4 text-center font-bold text-[#0f0f11]">
                      Top {(100 - entry.percentile).toFixed(1)}%
                    </td>

                    {/* Status / Verified */}
                    <td className="py-3.5 px-4 text-center">
                      {entry.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#15803d] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>VERIFIED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8c8b85]">PRACTICE</span>
                      )}
                    </td>

                    {/* Action: Challenge */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onChallengePlayer(entry.handle)}
                        aria-label={`Challenge ${entry.displayName || entry.handle}`}
                        className="patter-btn patter-btn-peach px-2.5 py-1 text-[11px] font-mono font-bold cursor-pointer"
                      >
                        <Swords className="w-3 h-3 mr-1" />
                        Challenge
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Dedicated Card Rows */}
        <div className="md:hidden space-y-3">
          {entries.map((entry) => {
            const isCurrent = currentUserHandle && entry.handle.toLowerCase() === currentUserHandle.toLowerCase();

            return (
              <div
                key={entry.handle}
                onClick={() => onSelectPlayer(entry)}
                className={`border-[1.5px] border-[#0f0f11] p-4 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#fcf4ee] shadow-[3px_3px_0px_#0f0f11]'
                    : 'bg-white shadow-[2px_2px_0px_#0f0f11] hover:bg-[#fcfbf8]'
                }`}
              >
                {/* Top Row: Rank + Identity + Score */}
                <div className="flex items-start justify-between gap-2 border-b border-[#eeece4] pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#0f0f11] text-white font-mono font-black text-xs border border-[#0f0f11]">
                      #{entry.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#0f0f11]">
                          {entry.displayName || `@${entry.handle}`}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-[#df9367] text-[#0f0f11] text-[9px] font-mono font-black border border-[#0f0f11]">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#52525b]">@{entry.handle}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-xl text-[#0f0f11]">
                      {entry.score.toFixed(1)}
                    </div>
                    <div className="text-[10px] font-mono text-[#52525b]">
                      Top {(100 - entry.percentile).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Archetype + Action */}
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold text-[#0f0f11] uppercase">
                      {entry.archetype}
                    </div>
                    <div className="text-[10px] text-[#52525b]">
                      {entry.strongestSkill}
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onChallengePlayer(entry.handle)}
                      aria-label={`Challenge ${entry.displayName || entry.handle}`}
                      className="patter-btn patter-btn-peach px-3 py-1.5 text-xs font-mono font-bold cursor-pointer"
                    >
                      <Swords className="w-3 h-3 mr-1" />
                      Challenge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t-[1.5px] border-[#0f0f11] text-xs font-mono">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="patter-btn patter-btn-white px-3 py-1.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 flex items-center justify-center font-bold border border-[#0f0f11] cursor-pointer ${
                    currentPage === p
                      ? 'bg-[#df9367] text-[#0f0f11] shadow-[1px_1px_0px_#0f0f11]'
                      : 'bg-white text-[#52525b] hover:bg-[#faf9f6]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="patter-btn patter-btn-white px-3 py-1.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/types/assessment';
import { Swords, ShieldCheck, UserCheck, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';

interface LeaderboardPodiumProps {
  top3: LeaderboardEntry[];
  onSelectPlayer: (entry: LeaderboardEntry) => void;
  onChallengePlayer: (handle: string) => void;
  currentUserId?: string;
  currentUserHandle?: string;
}

export function LeaderboardPodium({
  top3,
  onSelectPlayer,
  onChallengePlayer,
  currentUserHandle,
}: LeaderboardPodiumProps) {
  if (!top3 || top3.length === 0) return null;

  const rank1 = top3[0];
  const rank2 = top3[1];
  const rank3 = top3[2];

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#f7f6f0]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-2.5 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#df9367] rounded-none" />
            <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#0f0f11]">
              TOP BENCHMARKS / THE PODIUM
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#8c8b85]">
            TIER 1 • MASTER PERCENTILES
          </span>
        </div>

        {/* Desktop Composition: #2 | #1 (Elevated) | #3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-end">
          {/* RANK 2 CARD */}
          {rank2 && (
            <div className="md:col-span-4 order-2 md:order-1 flex flex-col">
              <div className="border-[1.5px] border-[#0f0f11] bg-white shadow-[3px_3px_0px_#0f0f11] p-5 flex flex-col justify-between h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform">
                {/* Header: Rank + Verified Tag */}
                <div className="flex items-center justify-between border-b border-[#eeece4] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#eeece4] text-[#0f0f11] font-mono font-black text-sm border border-[#0f0f11]">
                      #02
                    </span>
                    <span className="text-[10px] font-mono text-[#52525b] font-semibold uppercase">
                      TOP {(100 - rank2.percentile).toFixed(1)}%
                    </span>
                  </div>
                  {rank2.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#15803d] font-bold" title="Server Verified">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center font-mono font-bold text-xs text-[#0f0f11]">
                      {rank2.displayName ? rank2.displayName.charAt(0) : rank2.handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f0f11] truncate">
                        {rank2.displayName || `@${rank2.handle}`}
                      </h3>
                      <p className="text-xs font-mono text-[#52525b]">@{rank2.handle}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="inline-block px-2 py-0.5 bg-[#fcfbf8] border border-[#0f0f11] text-[10px] font-mono font-bold text-[#0f0f11] uppercase">
                      {rank2.archetype}
                    </span>
                  </div>
                </div>

                {/* Score Big Typography */}
                <div className="my-5 p-3 bg-[#fcfbf8] border border-[#eeece4]">
                  <div className="text-[10px] font-mono text-[#8c8b85] uppercase tracking-wider">
                    COMPOSITE SCORE
                  </div>
                  <div className="font-mono font-black text-3xl sm:text-4xl text-[#0f0f11] tracking-tight">
                    {rank2.score.toFixed(1)}
                  </div>
                  <div className="text-[11px] font-mono text-[#52525b] mt-1 flex items-center justify-between">
                    <span>{rank2.strongestSkill}</span>
                    <span className="font-bold text-[#0f0f11]">
                      {rank2.domainScores ? Object.values(rank2.domainScores).sort((a, b) => b - a)[0] : 92}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eeece4]">
                  <button
                    onClick={() => onSelectPlayer(rank2)}
                    className="patter-btn patter-btn-white py-1.5 text-xs font-mono text-[#0f0f11] cursor-pointer"
                  >
                    Breakdown
                  </button>
                  <button
                    onClick={() => onChallengePlayer(rank2.handle)}
                    className="patter-btn patter-btn-peach py-1.5 text-xs font-mono font-bold cursor-pointer"
                  >
                    <Swords className="w-3 h-3 mr-1" />
                    Challenge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RANK 1 CARD (VISUALLY DOMINANT & ELEVATED) */}
          {rank1 && (
            <div className="md:col-span-4 order-1 md:order-2 flex flex-col">
              <div className="border-[2px] border-[#0f0f11] bg-[#fcf4ee] shadow-[5px_5px_0px_#0f0f11] p-6 flex flex-col justify-between h-full relative -translate-y-1 lg:-translate-y-3">
                {/* Visual Accent Corner Ribbon */}
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#0f0f11] text-[#df9367] border border-[#0f0f11] text-[10px] font-mono font-black tracking-widest uppercase shadow-[1px_1px_0px_#df9367]">
                  BENCHMARK LEADER
                </div>

                {/* Header: Rank + Verified Tag */}
                <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-3 mb-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#0f0f11] text-[#df9367] font-mono font-black text-base border border-[#0f0f11] shadow-[2px_2px_0px_#df9367]">
                      #01
                    </span>
                    <span className="text-xs font-mono text-[#0f0f11] font-bold uppercase">
                      TOP {(100 - rank1.percentile).toFixed(1)}%
                    </span>
                  </div>
                  {rank1.isVerified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-[#ffffff] border border-[#0f0f11] text-[11px] font-mono text-[#15803d] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 bg-[#df9367] border-[1.5px] border-[#0f0f11] flex items-center justify-center font-mono font-black text-sm text-[#0f0f11] shadow-[2px_2px_0px_#0f0f11]">
                      {rank1.displayName ? rank1.displayName.charAt(0) : rank1.handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-[#0f0f11] tracking-tight">
                        {rank1.displayName || `@${rank1.handle}`}
                      </h3>
                      <p className="text-xs font-mono font-bold text-[#52525b]">@{rank1.handle}</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-1 bg-[#0f0f11] text-white text-xs font-mono font-bold uppercase tracking-wider">
                      {rank1.archetype}
                    </span>
                  </div>
                </div>

                {/* Score Big Typography */}
                <div className="my-5 p-4 bg-white border-[1.5px] border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11]">
                  <div className="text-[10px] font-mono font-bold text-[#8c8b85] uppercase tracking-wider">
                    OVERALL VERIFIED SCORE
                  </div>
                  <div className="font-mono font-black text-4xl sm:text-5xl text-[#0f0f11] tracking-tight">
                    {rank1.score.toFixed(1)}
                  </div>
                  <div className="text-xs font-mono text-[#0f0f11] mt-1 pt-2 border-t border-[#eeece4] flex items-center justify-between font-semibold">
                    <span>{rank1.strongestSkill}</span>
                    <span className="font-mono font-black text-[#df9367] text-sm">
                      {rank1.domainScores ? Object.values(rank1.domainScores).sort((a, b) => b - a)[0] : 97}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t-[1.5px] border-[#0f0f11]">
                  <button
                    onClick={() => onSelectPlayer(rank1)}
                    className="patter-btn patter-btn-white py-2 text-xs font-mono font-bold text-[#0f0f11] cursor-pointer"
                  >
                    View Breakdown
                  </button>
                  <button
                    onClick={() => onChallengePlayer(rank1.handle)}
                    className="patter-btn patter-btn-peach py-2 text-xs font-mono font-extrabold shadow-[2px_2px_0px_#0f0f11] cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5 mr-1" />
                    Challenge #1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RANK 3 CARD */}
          {rank3 && (
            <div className="md:col-span-4 order-3 flex flex-col">
              <div className="border-[1.5px] border-[#0f0f11] bg-white shadow-[3px_3px_0px_#0f0f11] p-5 flex flex-col justify-between h-full hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform">
                {/* Header: Rank + Verified Tag */}
                <div className="flex items-center justify-between border-b border-[#eeece4] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#eeece4] text-[#0f0f11] font-mono font-black text-sm border border-[#0f0f11]">
                      #03
                    </span>
                    <span className="text-[10px] font-mono text-[#52525b] font-semibold uppercase">
                      TOP {(100 - rank3.percentile).toFixed(1)}%
                    </span>
                  </div>
                  {rank3.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#15803d] font-bold" title="Server Verified">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center font-mono font-bold text-xs text-[#0f0f11]">
                      {rank3.displayName ? rank3.displayName.charAt(0) : rank3.handle.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f0f11] truncate">
                        {rank3.displayName || `@${rank3.handle}`}
                      </h3>
                      <p className="text-xs font-mono text-[#52525b]">@{rank3.handle}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="inline-block px-2 py-0.5 bg-[#fcfbf8] border border-[#0f0f11] text-[10px] font-mono font-bold text-[#0f0f11] uppercase">
                      {rank3.archetype}
                    </span>
                  </div>
                </div>

                {/* Score Big Typography */}
                <div className="my-5 p-3 bg-[#fcfbf8] border border-[#eeece4]">
                  <div className="text-[10px] font-mono text-[#8c8b85] uppercase tracking-wider">
                    COMPOSITE SCORE
                  </div>
                  <div className="font-mono font-black text-3xl sm:text-4xl text-[#0f0f11] tracking-tight">
                    {rank3.score.toFixed(1)}
                  </div>
                  <div className="text-[11px] font-mono text-[#52525b] mt-1 flex items-center justify-between">
                    <span>{rank3.strongestSkill}</span>
                    <span className="font-bold text-[#0f0f11]">
                      {rank3.domainScores ? Object.values(rank3.domainScores).sort((a, b) => b - a)[0] : 89}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eeece4]">
                  <button
                    onClick={() => onSelectPlayer(rank3)}
                    className="patter-btn patter-btn-white py-1.5 text-xs font-mono text-[#0f0f11] cursor-pointer"
                  >
                    Breakdown
                  </button>
                  <button
                    onClick={() => onChallengePlayer(rank3.handle)}
                    className="patter-btn patter-btn-peach py-1.5 text-xs font-mono font-bold cursor-pointer"
                  >
                    <Swords className="w-3 h-3 mr-1" />
                    Challenge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/types/assessment';
import { X, Swords, ShieldCheck, ExternalLink, Calendar, MapPin, Building, Award, CheckCircle } from 'lucide-react';

interface PlayerProfileModalProps {
  player: LeaderboardEntry | null;
  onClose: () => void;
  onChallenge: (handle: string) => void;
}

export function PlayerProfileModal({ player, onClose, onChallenge }: PlayerProfileModalProps) {
  if (!player) return null;

  const domainScores = player.domainScores || {
    'Conversion Copy': Math.round(player.score),
    'Content & Hooks': Math.round(player.score * 0.95),
    'Performance Ads': Math.round(player.score * 1.02 > 100 ? 98 : player.score * 1.02),
    'CRO & Funnels': Math.round(player.score * 0.92),
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="border-[2px] border-[#0f0f11] bg-white shadow-[6px_6px_0px_#0f0f11] max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 border-[1.5px] border-[#0f0f11] bg-white flex items-center justify-center text-[#0f0f11] hover:bg-[#df9367] shadow-[2px_2px_0px_#0f0f11] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-2 border-b-[1.5px] border-[#0f0f11] pb-3 mb-5">
          <span className="px-2 py-0.5 bg-[#0f0f11] text-white font-mono font-black text-xs">
            #{player.rank} RANKED
          </span>
          {player.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#15803d]">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED BENCHMARK
            </span>
          )}
        </div>

        {/* Identity Section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="h-14 w-14 border-[1.5px] border-[#0f0f11] bg-[#df9367] flex items-center justify-center font-mono font-black text-xl text-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] shrink-0">
            {player.displayName ? player.displayName.charAt(0) : player.handle.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f0f11]">
              {player.displayName || `@${player.handle}`}
            </h2>
            <p className="text-xs font-mono text-[#52525b]">@{player.handle}</p>
            {player.role && (
              <p className="text-xs font-mono text-[#0f0f11] font-semibold mt-1">
                {player.role} {player.company ? `at ${player.company}` : ''}
              </p>
            )}
            {player.bio && (
              <p className="text-xs font-mono text-[#52525b] mt-2 leading-relaxed bg-[#fcfbf8] p-2 border border-[#eeece4]">
                &quot;{player.bio}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Score Breakdown Box */}
        <div className="border-[1.5px] border-[#0f0f11] bg-[#fcf4ee] p-4 shadow-[2px_2px_0px_#0f0f11] mb-6">
          <div className="grid grid-cols-2 gap-4 border-b border-[#eeece4] pb-3 mb-3">
            <div>
              <div className="text-[10px] font-mono text-[#8c8b85] uppercase">
                COMPOSITE SCORE
              </div>
              <div className="font-mono font-black text-3xl text-[#0f0f11]">
                {player.score.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#8c8b85] uppercase">
                PERCENTILE
              </div>
              <div className="font-mono font-bold text-base text-[#0f0f11]">
                TOP {(100 - player.percentile).toFixed(1)}%
              </div>
              <div className="text-[10px] font-mono text-[#52525b]">
                {player.archetype}
              </div>
            </div>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[10px] font-bold text-[#8c8b85] uppercase">
              DOMAIN MASTERY BREAKDOWN
            </div>
            {Object.entries(domainScores).map(([domain, score]) => (
              <div key={domain} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#0f0f11] font-semibold">{domain}</span>
                  <span className="font-bold">{score} / 100</span>
                </div>
                <div className="h-2 bg-white border border-[#0f0f11] overflow-hidden">
                  <div
                    className="h-full bg-[#df9367] border-r border-[#0f0f11]"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t-[1.5px] border-[#0f0f11]">
          <div className="text-[11px] font-mono text-[#8c8b85] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Assessed {player.date || 'Aug 2026'}</span>
          </div>

          <button
            onClick={() => {
              onChallenge(player.handle);
              onClose();
            }}
            className="patter-btn patter-btn-peach px-4 py-2 text-xs font-mono font-bold cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5 mr-1.5" />
            Challenge @{player.handle}
          </button>
        </div>
      </div>
    </div>
  );
}

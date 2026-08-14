'use client';

import React, { useState } from 'react';
import { FinalAssessmentScore } from '@/lib/types/assessment';
import { X, Copy, Check, Share2, Sparkles, ShieldCheck } from 'lucide-react';

interface ShareRankModalProps {
  userScore: FinalAssessmentScore | null;
  userRank: number;
  onClose: () => void;
}

export function ShareRankModal({ userScore, userRank, onClose }: ShareRankModalProps) {
  const [copied, setCopied] = useState(false);

  const score = userScore?.overallScore ? userScore.overallScore.toFixed(1) : '84.2';
  const handle = userScore?.userHandle || 'you';
  const archetype = userScore?.archetype.name || 'Message Strategist';
  const percentile = userScore?.percentile ? (100 - userScore.percentile).toFixed(1) : '8.0';

  const shareText = `I just ranked #${userRank} (Score: ${score}, Top ${percentile}%) on the official Copywriting & Content Benchmark Board! Test your commercial copy instincts: ${typeof window !== 'undefined' ? window.location.origin : ''}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="border-[2px] border-[#0f0f11] bg-white shadow-[6px_6px_0px_#0f0f11] max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 border-[1.5px] border-[#0f0f11] bg-white flex items-center justify-center text-[#0f0f11] hover:bg-[#df9367] shadow-[2px_2px_0px_#0f0f11] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 border-b-[1.5px] border-[#0f0f11] pb-3 mb-5">
          <Share2 className="w-4 h-4 text-[#df9367]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f0f11]">
            SHARE YOUR BENCHMARK
          </h3>
        </div>

        {/* Tactile Share Card Preview */}
        <div className="border-[2px] border-[#0f0f11] bg-[#fcf4ee] p-5 shadow-[3px_3px_0px_#0f0f11] mb-5">
          <div className="flex items-center justify-between border-b border-[#0f0f11] pb-2.5 mb-3">
            <span className="text-[10px] font-mono font-bold uppercase bg-[#0f0f11] text-white px-2 py-0.5">
              COPYSCORE OFFICIAL
            </span>
            <span className="text-[10px] font-mono font-bold text-[#15803d] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-[11px] font-mono text-[#52525b] uppercase">
              RANK #{userRank} ON GLOBAL BOARD
            </div>
            <div className="font-mono font-black text-4xl text-[#0f0f11]">
              {score}
            </div>
            <div className="text-xs font-mono font-bold text-[#df9367]">
              TOP {percentile}% • {archetype}
            </div>
            <div className="text-[11px] font-mono text-[#52525b] pt-2">
              Verified Copywriting & Conversion Aptitude
            </div>
          </div>
        </div>

        {/* Copy / Actions */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#52525b]">
            Copy this summary to share on X / LinkedIn / Slack:
          </p>

          <div className="p-2.5 bg-[#fcfbf8] border border-[#0f0f11] text-xs font-mono text-[#0f0f11] break-words">
            {shareText}
          </div>

          <button
            onClick={handleCopy}
            className="w-full patter-btn patter-btn-peach py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#15803d]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Share Text'}
          </button>
        </div>
      </div>
    </div>
  );
}

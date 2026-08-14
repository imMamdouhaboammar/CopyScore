'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu, Clock, Award, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function RankingMethodology() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#f7f6f0] border-t-[1.5px] border-[#0f0f11]">
      <div className="max-w-7xl mx-auto">
        {/* Header with toggle */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#df9367]" />
            <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#0f0f11]">
              INTEGRITY & CALIBRATION METHODOLOGY
            </h2>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-mono text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1 cursor-pointer"
          >
            <span>{isOpen ? 'Collapse Details' : 'Read Full Standard'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 4 Technical Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="border-[1.5px] border-[#0f0f11] bg-white p-4 shadow-[2px_2px_0px_#0f0f11]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0f0f11] uppercase mb-2">
              <Cpu className="w-3.5 h-3.5 text-[#df9367]" />
              <span>01 / IRT SCORING</span>
            </div>
            <p className="text-xs font-mono text-[#52525b] leading-relaxed">
              Scores are modeled via 4-parameter Item Response Theory. Questions carry empirical discrimination values, rewarding precision on subtle conversion nuances.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="border-[1.5px] border-[#0f0f11] bg-white p-4 shadow-[2px_2px_0px_#0f0f11]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0f0f11] uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
              <span>02 / ANTI-CHEAT GAUNTLET</span>
            </div>
            <p className="text-xs font-mono text-[#52525b] leading-relaxed">
              Timing variance, clipboard interactions, and question sequence randomization protect board integrity. Scores require full session signature validation.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="border-[1.5px] border-[#0f0f11] bg-white p-4 shadow-[2px_2px_0px_#0f0f11]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0f0f11] uppercase mb-2">
              <Clock className="w-3.5 h-3.5 text-[#df9367]" />
              <span>03 / ROLLING RECALIBRATION</span>
            </div>
            <p className="text-xs font-mono text-[#52525b] leading-relaxed">
              Percentiles update continuously against the global dataset. Weekly resets establish fresh competitive windows while lifetime records remain immutable.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="border-[1.5px] border-[#0f0f11] bg-white p-4 shadow-[2px_2px_0px_#0f0f11]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0f0f11] uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-[#0f0f11]" />
              <span>04 / DOMAIN WEIGHTING</span>
            </div>
            <p className="text-xs font-mono text-[#52525b] leading-relaxed">
              Composite scores balance 4 key competencies: Conversion Copy (30%), Content & Hooks (25%), Performance Ads (25%), and CRO Funnels (20%).
            </p>
          </div>
        </div>

        {/* Expandable Technical Deep Dive */}
        {isOpen && (
          <div className="mt-6 p-5 bg-white border-[1.5px] border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11] space-y-4">
            <h3 className="text-xs font-mono font-black uppercase text-[#0f0f11] tracking-wider">
              Mathematical Specification & Tie-Breaker Logic
            </h3>
            <p className="text-xs font-mono text-[#52525b] leading-relaxed">
              When two participants share an identical composite score, ranking priority is determined by:
            </p>
            <ol className="list-decimal pl-4 text-xs font-mono text-[#52525b] space-y-1">
              <li>Score on Tier-3 high-difficulty items (Subtle Psychological Traps).</li>
              <li>Time-efficiency bonus (lower total evaluation time with ≥90% accuracy).</li>
              <li>Chronological achievement timestamp.</li>
            </ol>
            <div className="pt-2 text-[11px] font-mono text-[#8c8b85]">
              Assessment Protocol Version: 1.4.2 • Updated Weekly by Psychometric Engine
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

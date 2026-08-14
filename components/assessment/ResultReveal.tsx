'use client';

import React, { useState, useEffect } from 'react';
import { FinalAssessmentScore } from '@/lib/types/assessment';
import { Sparkles, Trophy, Target, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultRevealProps {
  score: FinalAssessmentScore;
  onFinishReveal: () => void;
}

export function ResultReveal({ score, onFinishReveal }: ResultRevealProps) {
  const [step, setStep] = useState<number>(1);
  const [displayScore, setDisplayScore] = useState<number>(0);

  useEffect(() => {
    // Step 1: Processing decisions (0.8s)
    const t1 = setTimeout(() => {
      setStep(2); // Difficulty reached (1.2s)
    }, 900);

    // Step 2 -> Step 3: Score countup (1.5s)
    const t2 = setTimeout(() => {
      setStep(3);
      // Animate score counter
      let current = 0;
      const target = score.overallScore;
      const interval = setInterval(() => {
        current += 2;
        if (current >= target) {
          setDisplayScore(target);
          clearInterval(interval);
          // Trigger subtle tactile confetti burst
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#df9367', '#0f0f11', '#eeece4'],
          });
        } else {
          setDisplayScore(current);
        }
      }, 25);
    }, 2100);

    // Step 3 -> Step 4: Archetype reveal
    const t3 = setTimeout(() => {
      setStep(4);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [score.overallScore]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg patter-card bg-white p-6 sm:p-8 text-center shadow-[6px_6px_0px_#0f0f11] relative overflow-hidden">
        {/* Terminal top header */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-[#0f0f11] text-white flex items-center justify-between px-3 text-[11px] font-mono">
          <span>TELEMETRY EVALUATOR</span>
          <span>STAGE: SCORE REVEAL</span>
        </div>

        <div className="mt-4 pt-4">
          {step === 1 && (
            <div className="py-8 space-y-4 animate-fade-in">
              <div className="h-12 w-12 mx-auto bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] flex items-center justify-center animate-spin">
                <Target className="w-6 h-6 text-[#df9367]" />
              </div>
              <p className="font-mono text-xs text-[#52525b] uppercase tracking-widest">
                AGGREGATING MULTIDIMENSIONAL VECTORS...
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f0f11]">
                Evaluating Your Copywriting & CRO Decisions
              </h2>
            </div>
          )}

          {step === 2 && (
            <div className="py-8 space-y-4 animate-fade-in">
              <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs">
                MAX DIFFICULTY LEVEL ATTAINED
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f0f11]">
                LEVEL {score.maxDifficultyReached} — {score.rankTitle.split(' ')[0]}
              </h3>
              <p className="text-xs font-mono text-[#52525b]">
                Tested against deep-branching scenario constraints
              </p>
            </div>
          )}

          {(step === 3 || step === 4) && (
            <div className="py-4 space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <span className="patter-pill bg-[#0f0f11] text-white text-xs">
                  CERTIFIED BENCHMARK SCORE
                </span>
              </div>

              {/* Big Score Counter */}
              <div className="my-2">
                <span className="font-mono font-extrabold text-6xl sm:text-7xl tracking-tighter text-[#0f0f11]">
                  {displayScore}
                </span>
                <span className="font-mono text-xl text-[#52525b]">/100</span>
              </div>

              <div className="inline-block bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] px-4 py-1.5 font-mono text-sm font-bold text-[#0f0f11]">
                Top {100 - score.percentile}% of Commercial Writers ({score.percentile}th Percentile)
              </div>

              {step >= 4 && (
                <div className="pt-4 border-t-[1.5px] border-[#0f0f11] space-y-3">
                  <div className="text-xs font-mono text-[#52525b] uppercase tracking-wider">
                    DIAGNOSTIC ARCHETYPE ASSIGNED
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#0f0f11] tracking-tight">
                    {score.archetype.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#52525b] max-w-sm mx-auto leading-relaxed">
                    {score.archetype.tagline}
                  </p>

                  <div className="pt-3">
                    <button
                      onClick={onFinishReveal}
                      className="w-full patter-btn patter-btn-peach py-3 text-sm font-mono font-bold tracking-tight"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>Open Full Skill Diagnostic</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

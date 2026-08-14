'use client';

import React, { useState } from 'react';
import { DOMAINS } from '@/lib/types/assessment';
import { LogoCloud } from '@/components/ui/logo-cloud';
import {
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Activity,
  Feather,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Swords,
} from 'lucide-react';

interface LandingHeroProps {
  onStartAssessment: () => void;
  onViewLeaderboard: () => void;
  onOpenMethodology: () => void;
  onOpenPricing?: () => void;
}

export function LandingHero({
  onStartAssessment,
  onViewLeaderboard,
  onOpenMethodology,
  onOpenPricing,
}: LandingHeroProps) {
  const [sampleSelected, setSampleSelected] = useState<string | null>(null);
  const [sampleSubmitted, setSampleSubmitted] = useState<boolean>(false);

  const sampleAnswerIsCorrect = sampleSelected === 'c';

  return (
    <div className="space-y-12 sm:space-y-20 py-6 sm:py-12">
      {/* SECTION 1: HERO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Telemetry pill */}
        <div className="inline-flex items-center gap-2 patter-pill bg-[#0f0f11] text-white text-xs shadow-[2px_2px_0px_#0f0f11]">
          <span className="h-2 w-2 rounded-full bg-[#df9367] animate-pulse-subtle" />
          <span>ADAPTIVE SKILL BENCHMARK • V1.4.2</span>
        </div>

        {/* Big Bold Neo-Brutalist Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#0f0f11] tracking-tight leading-[1.08] max-w-4xl mx-auto uppercase">
          How good is your copy when it has to <span className="bg-[#df9367] px-2 py-0.5 border border-[#0f0f11] inline-block mt-1">perform?</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#52525b] max-w-2xl mx-auto leading-relaxed">
          An adaptive assessment measuring actual conversion copywriting, content judgment, ad angle selection, and CRO experimentation under real constraints.
        </p>

        {/* CTA Button Group */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto patter-btn patter-btn-peach px-8 py-4 text-base sm:text-lg font-mono font-bold tracking-tight shadow-[4px_4px_0px_#0f0f11]"
          >
            <span className="flex items-center justify-center gap-2.5">
              <span>Start Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </button>

          <button
            onClick={onViewLeaderboard}
            className="w-full sm:w-auto patter-btn patter-btn-white px-6 py-4 text-sm sm:text-base font-mono font-semibold"
          >
            <Trophy className="w-4 h-4 mr-2 text-[#df9367]" />
            View Leaderboard
          </button>
        </div>

        <p className="text-xs font-mono text-[#8c8b85]">
          No forced signup • 10-12 adaptive questions • ~8 minutes • Instant verified score & archetype
        </p>
      </section>

      {/* SECTION 2: AI ECOSYSTEM LOGO CLOUD */}
      <LogoCloud
        badge="ECOSYSTEM BENCHMARK"
        title="TOOLS & MODELS WRITERS NAVIGATE"
        subtitle="Calibrated against modern generative tools and foundational models shaping commercial copywriting workflows."
      />

      {/* SECTION 3: INTERACTIVE SAMPLE PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="patter-card bg-white p-5 sm:p-7 shadow-[5px_5px_0px_#0f0f11] border-[2px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[11px] font-bold">
                SAMPLE INTERACTION
              </span>
              <span className="font-mono text-xs text-[#52525b]">
                CONV-302 • Difficulty: Professional
              </span>
            </div>
            <span className="text-xs font-mono text-[#52525b] hidden sm:inline">
              Try before you begin
            </span>
          </div>

          {/* Sample Question */}
          <h3 className="text-base sm:text-lg font-bold text-[#0f0f11] mb-3">
            A B2B demo page receives high-intent Google search traffic for a $30k enterprise software. Qualified leads abandon immediately before the demo booking form. User recordings show frequent pauses at the form. Interviews reveal uncertainty about onboarding duration. Which change deserves the first test?
          </h3>

          <div className="space-y-2.5 my-4">
            {[
              { id: 'a', text: 'Change the primary CTA button color from dark navy to high-contrast orange' },
              { id: 'b', text: 'Add three more generic bullet points about platform speed and security' },
              { id: 'c', text: 'Address implementation time directly above the form with a verified 72-hour migration case study' },
              { id: 'd', text: 'Cut the 12-word hero headline down to 6 words' },
            ].map((opt, idx) => {
              const isSelected = sampleSelected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSampleSelected(opt.id);
                    setSampleSubmitted(true);
                  }}
                  className={`w-full text-left p-3 sm:p-3.5 border-[1.5px] transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? opt.id === 'c'
                        ? 'border-[#15803d] bg-[#eaf8ee]'
                        : 'border-[#b91c1c] bg-[#feeceb]'
                      : 'border-[#0f0f11] bg-white hover:bg-[#faf9f6]'
                  }`}
                >
                  <span className="h-6 w-6 shrink-0 bg-[#eeece4] border border-[#0f0f11] font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#0f0f11] grow">
                    {opt.text}
                  </span>
                  {isSelected && (
                    <span className="font-mono text-xs font-bold shrink-0">
                      {opt.id === 'c' ? '✓ CORRECT' : '✗ FLAWED'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {sampleSubmitted && (
            <div className={`p-3.5 border-[1.5px] border-[#0f0f11] text-xs sm:text-sm font-mono ${
              sampleAnswerIsCorrect ? 'bg-[#eaf8ee] text-[#15803d]' : 'bg-[#feeceb] text-[#b91c1c]'
            }`}>
              {sampleAnswerIsCorrect ? (
                <span>
                  <strong>Exact Diagnosis:</strong> When qualitative data reveals a specific onboarding objection, addressing the precise friction with concrete proof above the form unblocks conversions.
                </span>
              ) : (
                <span>
                  <strong>Diagnostic Miss:</strong> Cosmetic tweaks (button colors, word lengths) ignore the explicit root cause discovered in user research (implementation fear).
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: 4 TESTED DOMAINS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="patter-pill bg-[#0f0f11] text-white text-xs">
            COMPETENCY FRAMEWORK
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
            Four Core Commercial Writing Disciplines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Domain 1 */}
          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-2.5">
            <div className="h-9 w-9 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#df9367]" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#0f0f11]">
              Conversion Copy
            </h3>
            <p className="text-xs text-[#52525b] leading-relaxed">
              Stage of awareness matching, value proposition hierarchy, objection disarming, and proof architecture.
            </p>
          </div>

          {/* Domain 2 */}
          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-2.5">
            <div className="h-9 w-9 bg-[#eff6ff] border-[1.5px] border-[#0f0f11] flex items-center justify-center">
              <Feather className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#0f0f11]">
              Content Judgment
            </h3>
            <p className="text-xs text-[#52525b] leading-relaxed">
              Scroll-stopping hooks, narrative tension, cognitive pacing, and elimination of editorial fluff.
            </p>
          </div>

          {/* Domain 3 */}
          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-2.5">
            <div className="h-9 w-9 bg-[#ecfdf5] border-[1.5px] border-[#0f0f11] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#10b981]" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#0f0f11]">
              Performance Ads
            </h3>
            <p className="text-xs text-[#52525b] leading-relaxed">
              Ad angle diversification, message-market fit, ad-to-hero continuity, and intent channel optimization.
            </p>
          </div>

          {/* Domain 4 */}
          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-2.5">
            <div className="h-9 w-9 bg-[#f5f3ff] border-[1.5px] border-[#0f0f11] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#0f0f11]">
              CRO & Testing
            </h3>
            <p className="text-xs text-[#52525b] leading-relaxed">
              Friction diagnosis, experiment prioritization (PIE/ICE), hypothesis formulation, and evidence interpretation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: VIRAL HEAD-TO-HEAD PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="patter-card bg-[#fcf4ee] p-6 sm:p-8 shadow-[5px_5px_0px_#0f0f11] border-[2px] text-center space-y-4">
          <div className="inline-block patter-pill bg-[#df9367] text-[#0f0f11] text-xs font-bold">
            COMPETITIVE VIRAL MECHANICS
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
            Challenge Your Team or Peers
          </h2>

          <p className="text-xs sm:text-sm text-[#52525b] max-w-xl mx-auto font-mono">
            Every completed assessment generates a unique <code className="bg-white px-1.5 py-0.5 border border-[#0f0f11]">/beat/[your_handle]</code> duel link. Compare scores across all four disciplines side-by-side.
          </p>

          <div className="pt-2">
            <button
              onClick={onStartAssessment}
              className="patter-btn patter-btn-black px-6 py-3 text-sm font-mono"
            >
              <Swords className="w-4 h-4 mr-2 text-[#df9367]" />
              Establish Your Benchmark Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: PROGRESSION & PRICING PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="patter-card bg-white p-6 sm:p-10 shadow-[5px_5px_0px_#0f0f11] border-[2px] space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-[1.5px] border-[#0f0f11] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 patter-pill bg-[#0f0f11] text-white text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-[#df9367]" />
                <span>FREEMIUM SKILL ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
                Find Out Where You Stand • Then Get Better
              </h2>
              <p className="text-xs sm:text-sm text-[#52525b] font-mono">
                Start with a zero-cost adaptive benchmark. Upgrade to Pro for deep mistake diagnostics, unlimited retakes, and specialized tests.
              </p>
            </div>

            {onOpenPricing && (
              <button
                onClick={onOpenPricing}
                className="patter-btn patter-btn-peach px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shrink-0"
              >
                <span>View Full Pricing Matrix</span>
                <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Col */}
            <div className="p-4 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#52525b]">01 / FREE</span>
              <h3 className="font-bold text-base text-[#0f0f11]">Find Your Baseline</h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Full 10-12 question adaptive assessment, Copy Score (0-100), primary archetype, and public leaderboard profile.
              </p>
              <div className="pt-2 font-mono text-xs font-bold text-[#0f0f11]">
                $0 • No card required
              </div>
            </div>

            {/* Pro Col */}
            <div className="p-4 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] space-y-2 relative">
              <span className="font-mono text-[10px] font-bold text-[#df9367] bg-[#0f0f11] px-1.5 py-0.2 inline-block">
                02 / FOR PROFESSIONALS
              </span>
              <h3 className="font-bold text-base text-[#0f0f11]">Diagnose & Improve</h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Detailed mistake deduction breakdown, 4 monthly specialized tests, unlimited attempts, and historical progression.
              </p>
              <div className="pt-2 font-mono text-xs font-bold text-[#0f0f11]">
                $15 / mo (or $12/mo billed yearly)
              </div>
            </div>

            {/* Team Col */}
            <div className="p-4 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#52525b]">03 / ORGANIZATIONS</span>
              <h3 className="font-bold text-base text-[#0f0f11]">Benchmark Teams & Hires</h3>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Pre-interview candidate screening links, team skill matrix radar, role-based hiring benchmarks, and dossiers.
              </p>
              <div className="pt-2 font-mono text-xs font-bold text-[#0f0f11]">
                $49 / seat / mo
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

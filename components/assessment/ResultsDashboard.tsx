'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOMAINS, FinalAssessmentScore } from '@/lib/types/assessment';
import { useAuth } from '@/lib/auth/context';
import {
  Share2,
  Swords,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ResultsDashboardProps {
  score: FinalAssessmentScore;
  onRetake: () => void;
  onViewLeaderboard: () => void;
  onOpenChallenge: (code: string) => void;
  onOpenPricing?: () => void;
}

export function ResultsDashboard({
  score,
  onRetake,
  onViewLeaderboard,
  onOpenPricing,
}: ResultsDashboardProps) {
  const { isAuthenticated, profile } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'context' | 'share'>('breakdown');

  const challengeCode = profile?.handle || score.userHandle?.toLowerCase() || score.attemptId.substring(4, 10);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/beat/${challengeCode}` : `https://copyscore.app/beat/${challengeCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `I just scored ${score.overallScore}/100 on CopyScore as a ${score.archetype.name} (${score.rankTitle}).\n\nCan you beat my conversion copy score?`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CopyScore Assessment: ${score.overallScore}/100`,
          text: `I scored ${score.overallScore}/100 on CopyScore as a ${score.archetype.name} (${score.rankTitle}). Can you beat me?`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {!isAuthenticated && (
        <div className="patter-card bg-[#fcf4ee] p-4 sm:p-5 border-[1.5px] border-[#0f0f11] shadow-[4px_4px_0px_#0f0f11] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
                ACTION REQUIRED
              </span>
              <span className="text-xs font-mono font-bold text-[#df9367]">
                CLAIM THIS {score.overallScore} SCORE
              </span>
            </div>
            <p className="text-xs text-[#0f0f11] font-mono leading-relaxed">
              Create a free account to claim your custom handle <strong className="text-[#0f0f11]">@yourname</strong>, preserve your evaluation certificate, and join the verified leaderboard.
            </p>
          </div>

          <Link
            href="/auth/sign-up"
            className="patter-btn patter-btn-peach px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shrink-0 shadow-[2px_2px_0px_#0f0f11] flex items-center gap-2"
          >
            <span>Save & Claim Handle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="patter-card bg-white p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_#0f0f11]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-[#15803d]" />
          <span className="font-bold text-[#0f0f11]">VERIFIED EVALUATION REPORT</span>
          <span className="text-[#8c8b85]">|</span>
          <span className="text-[#52525b]">{score.verificationHash}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#52525b]">
          <span>Version: {score.assessmentVersion}</span>
          <span>•</span>
          <span>Time: {Math.round(score.totalTimeSeconds / 60)}m {score.totalTimeSeconds % 60}s</span>
        </div>
      </div>

      <div className="patter-card bg-white p-6 sm:p-8 shadow-[5px_5px_0px_#0f0f11] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#0f0f11] pb-6 lg:pb-0 lg:pr-6">
            <div className="inline-flex items-center gap-1.5 patter-pill bg-[#0f0f11] text-white text-[11px] mb-3">
              <Sparkles className="w-3 h-3 text-[#df9367]" />
              <span>OFFICIAL COPYSCORE</span>
            </div>

            <div className="flex items-baseline justify-center lg:justify-start gap-1">
              <span className="font-mono font-extrabold text-6xl sm:text-7xl text-[#0f0f11] tracking-tight">
                {score.overallScore}
              </span>
              <span className="font-mono text-xl text-[#52525b] font-bold">/100</span>
            </div>

            <div className="mt-2 inline-block bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] px-3 py-1 font-mono text-xs sm:text-sm font-bold text-[#0f0f11]">
              {score.rankTitle}
            </div>

            <p className="font-mono text-xs text-[#52525b] mt-3">
              CopyScore rubric tier for assessment version {score.assessmentVersion}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525b] uppercase tracking-wider">
                PRIMARY ARCHETYPE
              </span>
              <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs">
                {score.archetype.badge}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f11] tracking-tight">
              {score.archetype.name}
            </h2>

            <p className="text-sm text-[#0f0f11] leading-relaxed">
              {score.archetype.description}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#f7f6f0] border border-[#0f0f11]">
                <strong className="text-[#15803d] block mb-0.5">CORE SUPERPOWER:</strong>
                <span className="text-[#0f0f11] font-sans text-xs">{score.archetype.superpower}</span>
              </div>
              <div className="p-2.5 bg-[#f7f6f0] border border-[#0f0f11]">
                <strong className="text-[#b45309] block mb-0.5">COMMON BLIND SPOT:</strong>
                <span className="text-[#0f0f11] font-sans text-xs">{score.archetype.blindspot}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`patter-btn px-4 py-2 text-xs sm:text-sm font-mono font-bold ${
            activeTab === 'breakdown'
              ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#0f0f11]'
              : 'bg-white text-[#0f0f11]'
          }`}
        >
          Skill Telemetry & Diagnostics
        </button>

        <button
          onClick={() => setActiveTab('context')}
          className={`patter-btn px-4 py-2 text-xs sm:text-sm font-mono font-bold ${
            activeTab === 'context'
              ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#0f0f11]'
              : 'bg-white text-[#0f0f11]'
          }`}
        >
          Score Context
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`patter-btn px-4 py-2 text-xs sm:text-sm font-mono font-bold ${
            activeTab === 'share'
              ? 'bg-[#df9367] text-[#0f0f11] shadow-[1px_1px_0px_#0f0f11]'
              : 'bg-white text-[#0f0f11]'
          }`}
        >
          <Share2 className="w-4 h-4 mr-1.5 inline" />
          Share & Challenge Links
        </button>
      </div>

      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(score.domainScores).map(([key, domainScore]) => {
              const meta = DOMAINS[key as keyof typeof DOMAINS] || DOMAINS.conversion_copywriting;
              return (
                <div
                  key={key}
                  className="patter-card bg-white p-4 space-y-3 shadow-[3px_3px_0px_#0f0f11] border-[1.5px]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="patter-pill text-white text-[10px]"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.shortName}
                    </span>
                    <span className="patter-pill bg-[#eeece4] text-[#0f0f11] text-[10px]">
                      {domainScore.statusLabel}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono font-extrabold text-3xl text-[#0f0f11]">
                        {domainScore.scaledScore}
                      </span>
                      <span className="text-xs font-mono text-[#52525b]">
                        Accuracy: {domainScore.accuracy}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#eeece4] border border-[#0f0f11] mt-2">
                      <div
                        className="h-full bg-[#0f0f11]"
                        style={{ width: `${domainScore.scaledScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eeece4] flex items-center justify-between text-[11px] font-mono text-[#52525b]">
                    <span>Difficulty Cleared:</span>
                    <strong className="text-[#0f0f11]">Lvl {domainScore.highestDifficultyCleared}/5</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] border-l-4 border-l-[#15803d]">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-[#15803d]" />
                <h3 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
                  What You Did Well (High-Conviction Decisions)
                </h3>
              </div>
              <ul className="space-y-2.5">
                {score.whatYouDidWell.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-[#0f0f11] flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-[#15803d] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] border-l-4 border-l-[#b91c1c]">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-[#b91c1c]" />
                <h3 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
                  What Cost You Points (Cognitive Deductions)
                </h3>
              </div>
              <ul className="space-y-2.5">
                {score.whatCostYouPoints.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-[#0f0f11] flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-[#b91c1c] font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="patter-card bg-[#fcfbf8] p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#df9367]" />
              <h3 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase tracking-wider">
                Recommended 3-Step Growth Priorities
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {score.growthActions.map((action, idx) => (
                <div key={idx} className="p-3.5 bg-white border-[1.5px] border-[#0f0f11] space-y-1.5">
                  <span className="font-mono font-bold text-xs bg-[#0f0f11] text-white px-2 py-0.5 inline-block">
                    STEP 0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#0f0f11] leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="patter-card bg-[#fcf4ee] p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11] border-[1.5px] border-[#0f0f11] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#0f0f11] pb-3">
              <div className="space-y-1">
                <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[10px] font-bold">
                  FOR SERIOUS PRACTITIONERS
                </span>
                <h4 className="font-mono font-bold text-base text-[#0f0f11] uppercase">
                  Ready to drill down and improve your score?
                </h4>
              </div>
              {onOpenPricing && (
                <button
                  onClick={onOpenPricing}
                  className="patter-btn patter-btn-black px-4 py-2 text-xs font-mono font-bold shrink-0"
                >
                  <span>Explore Pro & Specialized Tests</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-white border border-[#0f0f11]">
                <strong className="text-[#0f0f11] block mb-0.5">4 SPECIALIZED TESTS / MO</strong>
                <span className="text-[#52525b] font-sans text-xs">Isolate Conversion Copy, Ad Angles, CRO, or Content.</span>
              </div>
              <div className="p-2.5 bg-white border border-[#0f0f11]">
                <strong className="text-[#0f0f11] block mb-0.5">MISTAKE DEDUCTIONS</strong>
                <span className="text-[#52525b] font-sans text-xs">Examine exact flawed options and cognitive blind spots.</span>
              </div>
              <div className="p-2.5 bg-white border border-[#0f0f11]">
                <strong className="text-[#0f0f11] block mb-0.5">UNLIMITED RETAKES</strong>
                <span className="text-[#52525b] font-sans text-xs">Track your score progress and delta over time.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'context' && (
        <div className="patter-card bg-white p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11] space-y-5">
          <div>
            <h3 className="font-mono font-bold text-base sm:text-lg text-[#0f0f11] uppercase">
              How to read this score
            </h3>
            <p className="text-xs sm:text-sm text-[#52525b]">
              CopyScore reports what this assessment measured without inventing a population benchmark.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#52525b] uppercase">Assessment score</span>
              <strong className="font-mono text-2xl text-[#0f0f11]">{score.overallScore}/100</strong>
              <p className="text-xs text-[#52525b]">Weighted result from your answers and the difficulty of scenarios attempted.</p>
            </div>
            <div className="p-4 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#52525b] uppercase">Rubric tier</span>
              <strong className="font-mono text-base text-[#0f0f11]">{score.rankTitle}</strong>
              <p className="text-xs text-[#52525b]">A CopyScore interpretation band, not a rank among all commercial writers.</p>
            </div>
            <div className="p-4 bg-white border-[1.5px] border-[#0f0f11] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#52525b] uppercase">Assessment version</span>
              <strong className="font-mono text-base text-[#0f0f11]">{score.assessmentVersion}</strong>
              <p className="text-xs text-[#52525b]">Use the same version when comparing your own retakes over time.</p>
            </div>
          </div>

          <div className="p-4 bg-[#fcfbf8] border border-[#0f0f11] text-xs sm:text-sm text-[#52525b] leading-relaxed">
            Population percentiles and profession-specific medians are intentionally not shown without a representative, verified cohort and disclosed methodology. For real competition data, use the verified leaderboard and head-to-head challenge flows.
          </div>
        </div>
      )}

      {activeTab === 'share' && (
        <div className="space-y-6">
          <div className="patter-card bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#0f0f11] text-center max-w-xl mx-auto border-[2px]">
            <div className="patter-dot-grid p-6 border-[1.5px] border-[#0f0f11] bg-[#fdfcf7] space-y-4">
              <div className="inline-block patter-pill bg-[#0f0f11] text-white text-xs">
                VERIFIED ASSESSMENT
              </div>

              <div className="font-mono text-sm tracking-widest text-[#52525b] uppercase">
                {score.userHandle ? `@${score.userHandle}` : 'VERIFIED WRITER'}
              </div>

              <div>
                <span className="font-mono font-extrabold text-6xl text-[#0f0f11]">
                  {score.overallScore}
                </span>
                <span className="font-mono text-lg text-[#52525b]">/100</span>
              </div>

              <div className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs font-bold">
                {score.rankTitle.toUpperCase()} • {score.archetype.name.toUpperCase()}
              </div>

              <p className="font-mono text-xs text-[#0f0f11] font-bold">
                Can you beat {score.overallScore}?
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={handleShareTwitter}
                className="patter-btn patter-btn-white py-2 text-xs font-mono"
              >
                Share on X / Twitter
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="patter-btn patter-btn-white py-2 text-xs font-mono"
              >
                Share on LinkedIn
              </button>

              <button
                onClick={handleNativeShare}
                className="patter-btn patter-btn-peach py-2 text-xs font-mono col-span-2 sm:col-span-1"
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Share Link
              </button>
            </div>
          </div>

          <div className="patter-card bg-[#fcf4ee] p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11] border-[1.5px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Swords className="w-4 h-4 text-[#df9367]" />
                <h4 className="font-mono font-bold text-sm text-[#0f0f11] uppercase">
                  Direct Head-to-Head Challenge URL
                </h4>
              </div>
              <p className="text-xs text-[#52525b]">
                Send this link to a peer. When they finish, both of you get an instant side-by-side skill comparison.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="patter-btn patter-btn-black px-4 py-2 text-xs font-mono w-full sm:w-auto"
              >
                {copiedLink ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Copied!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Challenge Link</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-[#0f0f11]">
        <div className="flex items-center gap-2">
          <button
            onClick={onViewLeaderboard}
            className="patter-btn patter-btn-white px-4 py-2 text-xs sm:text-sm font-mono font-bold"
          >
            <Trophy className="w-4 h-4 mr-2 text-[#df9367]" />
            View Leaderboard
          </button>

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="patter-btn patter-btn-white px-4 py-2 text-xs sm:text-sm font-mono font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-[#df9367]" />
              Pricing & Plans
            </button>
          )}
        </div>

        <button
          onClick={onRetake}
          className="patter-btn patter-btn-peach px-5 py-2 text-xs sm:text-sm font-mono font-bold"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

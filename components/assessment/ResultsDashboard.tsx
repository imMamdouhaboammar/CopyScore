'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOMAINS, FinalAssessmentScore } from '@/lib/types/assessment';
import { useAuth } from '@/lib/auth/context';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Swords,
  TrendingUp,
  Trophy,
} from 'lucide-react';

interface ResultsDashboardProps {
  score: FinalAssessmentScore;
  onRetake: () => void;
  onViewLeaderboard: () => void;
  onOpenChallenge: (code: string) => void;
  onOpenPricing?: () => void;
}

type ResultTab = 'breakdown' | 'context' | 'share';

export function ResultsDashboard({
  score,
  onRetake,
  onViewLeaderboard,
  onOpenChallenge,
  onOpenPricing,
}: ResultsDashboardProps) {
  const { isAuthenticated, profile } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<ResultTab>('breakdown');

  const challengeCode =
    profile?.handle || score.userHandle?.toLowerCase() || score.attemptId.substring(4, 10);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/beat/${challengeCode}`
      : `https://copyscore.app/beat/${challengeCode}`;
  const shareText = `I scored ${score.overallScore}/100 on CopyScore with the ${score.rankTitle} rubric rank as a ${score.archetype.name}. Can you beat my score?`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
    );
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: `CopyScore Assessment Score: ${score.overallScore}/100`,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // Native share cancellation is an expected user action.
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {!isAuthenticated && (
        <div className="patter-card bg-[#fcf4ee] p-4 sm:p-5 border-[1.5px] border-[#0f0f11] shadow-[4px_4px_0px_#0f0f11] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">SAVE YOUR RESULT</span>
            <p className="text-xs text-[#0f0f11] font-mono leading-relaxed">
              Create a free account to claim a handle, preserve this evaluation, and join the verified leaderboard.
            </p>
          </div>
          <Link
            href="/auth/sign-up"
            className="patter-btn patter-btn-peach px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shrink-0 shadow-[2px_2px_0px_#0f0f11] flex items-center gap-2"
          >
            Save & Claim Handle <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="patter-card bg-white p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_#0f0f11]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-[#15803d]" />
          <strong>VERIFIED EVALUATION REPORT</strong>
          <span className="text-[#52525b]">{score.verificationHash}</span>
        </div>
        <div className="text-xs font-mono text-[#52525b]">
          Version {score.assessmentVersion} · {Math.round(score.totalTimeSeconds / 60)}m
        </div>
      </div>

      <div className="patter-card bg-white p-6 sm:p-8 shadow-[5px_5px_0px_#0f0f11]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#0f0f11] pb-6 lg:pb-0 lg:pr-6">
            <div className="inline-flex items-center gap-1.5 patter-pill bg-[#0f0f11] text-white text-[11px] mb-3">
              <Sparkles className="w-3 h-3 text-[#df9367]" /> COPYSCORE ASSESSMENT SCORE
            </div>
            <div className="flex items-baseline justify-center lg:justify-start gap-1">
              <span className="font-mono font-extrabold text-6xl sm:text-7xl text-[#0f0f11]">{score.overallScore}</span>
              <span className="font-mono text-xl text-[#52525b] font-bold">/100</span>
            </div>
            <div className="mt-2 inline-block bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] px-3 py-1 font-mono text-xs sm:text-sm font-bold">
              Rubric rank: {score.rankTitle}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525b] uppercase tracking-wider">Primary archetype</span>
              <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs">{score.archetype.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f11]">{score.archetype.name}</h2>
            <p className="text-sm text-[#0f0f11] leading-relaxed">{score.archetype.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#f7f6f0] border border-[#0f0f11]">
                <strong className="text-[#15803d] block">CORE SUPERPOWER</strong>
                {score.archetype.superpower}
              </div>
              <div className="p-2.5 bg-[#f7f6f0] border border-[#0f0f11]">
                <strong className="text-[#b45309] block">COMMON BLIND SPOT</strong>
                {score.archetype.blindspot}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {([
          ['breakdown', 'Skill Diagnostics'],
          ['context', 'Score Context'],
          ['share', 'Share & Challenge'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`patter-btn px-4 py-2 text-xs sm:text-sm font-mono font-bold ${activeTab === tab ? 'bg-[#0f0f11] text-white' : 'bg-white text-[#0f0f11]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(score.domainScores).map(([key, domainScore]) => {
              const meta = DOMAINS[key as keyof typeof DOMAINS] || DOMAINS.conversion_copywriting;
              return (
                <div key={key} className="patter-card bg-white p-4 space-y-3 shadow-[3px_3px_0px_#0f0f11]">
                  <div className="flex items-center justify-between">
                    <span className="patter-pill text-white text-[10px]" style={{ backgroundColor: meta.color }}>{meta.shortName}</span>
                    <span className="text-xs font-mono">{domainScore.statusLabel}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <strong className="font-mono text-3xl">{domainScore.scaledScore}</strong>
                    <span className="text-xs font-mono text-[#52525b]">Accuracy {domainScore.accuracy}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#eeece4] border border-[#0f0f11]">
                    <div className="h-full bg-[#0f0f11]" style={{ width: `${domainScore.scaledScore}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultList icon={<CheckCircle2 className="w-5 h-5 text-[#15803d]" />} title="What you did well" items={score.whatYouDidWell} />
            <ResultList icon={<AlertCircle className="w-5 h-5 text-[#b91c1c]" />} title="What cost you points" items={score.whatCostYouPoints} />
          </div>

          <div className="patter-card bg-[#fcfbf8] p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#df9367]" />
              <h3 className="font-mono font-bold uppercase">Recommended growth priorities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {score.growthActions.map((action, index) => (
                <div key={index} className="p-3.5 bg-white border-[1.5px] border-[#0f0f11] text-sm">
                  <strong className="font-mono text-xs block mb-1">STEP 0{index + 1}</strong>{action}
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
                  type="button"
                  onClick={onOpenPricing}
                  className="patter-btn patter-btn-black px-4 py-2 text-xs font-mono font-bold shrink-0"
                >
                  Explore Pro & Specialized Tests
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
        <div className="patter-card bg-white p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11] space-y-4">
          <h3 className="font-mono font-bold text-lg uppercase">How to interpret this result</h3>
          <p className="text-sm text-[#52525b] leading-relaxed">
            Your {score.overallScore}/100 score and {score.rankTitle} rank are outputs of the CopyScore {score.assessmentVersion} rubric. They describe performance on this assessment; they are not population percentiles or claims about how you compare with all commercial writers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <ContextCard label="Assessment version" value={score.assessmentVersion} />
            <ContextCard label="Rubric rank" value={score.rankTitle} />
            <ContextCard label="Archetype" value={score.archetype.name} />
          </div>
          <button type="button" onClick={onViewLeaderboard} className="patter-btn patter-btn-white px-4 py-2 text-xs font-mono font-bold">
            <Trophy className="w-4 h-4 mr-2 text-[#df9367]" /> View verified leaderboard
          </button>
        </div>
      )}

      {activeTab === 'share' && (
        <div className="space-y-6">
          <div className="patter-card bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#0f0f11] text-center max-w-xl mx-auto">
            <div className="patter-dot-grid p-6 border-[1.5px] border-[#0f0f11] bg-[#fdfcf7] space-y-4">
              <div className="inline-block patter-pill bg-[#0f0f11] text-white text-xs">COPYSCORE RESULT</div>
              <div className="font-mono text-sm uppercase">{score.userHandle ? `@${score.userHandle}` : 'VERIFIED WRITER'}</div>
              <div><strong className="font-mono text-6xl">{score.overallScore}</strong><span className="font-mono text-lg">/100</span></div>
              <div className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs font-bold">{score.rankTitle} · {score.archetype.name.toUpperCase()}</div>
              <p className="font-mono text-xs font-bold">Can you beat {score.overallScore}?</p>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button type="button" onClick={handleShareTwitter} className="patter-btn patter-btn-white py-2 text-xs font-mono">Share on X</button>
              <button type="button" onClick={handleShareLinkedIn} className="patter-btn patter-btn-white py-2 text-xs font-mono">Share on LinkedIn</button>
              <button type="button" onClick={handleNativeShare} className="patter-btn patter-btn-peach py-2 text-xs font-mono col-span-2 sm:col-span-1"><Share2 className="w-3.5 h-3.5 mr-1" /> Share Link</button>
            </div>
          </div>

          <div className="patter-card bg-[#fcf4ee] p-5 sm:p-6 shadow-[3px_3px_0px_#0f0f11] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-mono font-bold text-sm uppercase flex items-center gap-2"><Swords className="w-4 h-4" /> Head-to-head challenge</h4>
              <p className="text-xs text-[#52525b] mt-1">Send your verified challenge link to a peer and compare results after they finish.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleCopyLink} className="patter-btn patter-btn-black px-4 py-2 text-xs font-mono">
                {copiedLink ? <><Check className="w-3.5 h-3.5 mr-1" /> Copied!</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy Link</>}
              </button>
              <button type="button" onClick={() => onOpenChallenge(challengeCode)} className="patter-btn patter-btn-white px-4 py-2 text-xs font-mono">Open Challenge</button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-[#0f0f11]">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onViewLeaderboard} className="patter-btn patter-btn-white px-4 py-2 text-xs sm:text-sm font-mono font-bold"><Trophy className="w-4 h-4 mr-2 text-[#df9367]" /> View Leaderboard</button>
          {onOpenPricing && <button type="button" onClick={onOpenPricing} className="patter-btn patter-btn-white px-4 py-2 text-xs sm:text-sm font-mono font-bold"><Sparkles className="w-4 h-4 mr-1.5 text-[#df9367]" /> Pricing & Plans</button>}
        </div>
        <button type="button" onClick={onRetake} className="patter-btn patter-btn-peach px-5 py-2 text-xs sm:text-sm font-mono font-bold"><RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment</button>
      </div>
    </div>
  );
}

function ResultList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11]">
      <div className="flex items-center gap-2 mb-3">{icon}<h3 className="font-mono font-bold text-sm uppercase">{title}</h3></div>
      <ul className="space-y-2.5">
        {items.map((item, index) => <li key={index} className="text-xs sm:text-sm leading-relaxed">{item}</li>)}
      </ul>
    </div>
  );
}

function ContextCard({ label, value }: { label: string; value: string }) {
  return <div className="p-3 bg-[#f7f6f0] border border-[#0f0f11]"><span className="text-[#52525b] block">{label}</span><strong>{value}</strong></div>;
}
'use client';

import React, { useState, useEffect } from 'react';
import { PRICING_TIERS, COMPARISON_ROWS, PRICING_FAQS } from '@/lib/data/pricing';
import { BillingCadence, PlanId, PricingTier } from '@/lib/types/pricing';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Lock,
  RotateCcw,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react';

export interface CreativePricingProps {
  onSelectPlan?: (planId: PlanId) => void;
  onStartAssessment?: () => void;
  onViewScore?: () => void;
  hasCompletedAssessment?: boolean;
  userScore?: number | null;
  currentPlan?: PlanId;
  className?: string;
  showComparisonTable?: boolean;
  showFAQ?: boolean;
}

const LOCAL_STORAGE_PLAN_KEY = 'copyscore_active_plan_v1';

export function CreativePricing({
  onSelectPlan,
  onStartAssessment,
  onViewScore,
  hasCompletedAssessment = false,
  userScore = null,
  currentPlan: initialCurrentPlan = 'free',
  className = '',
  showComparisonTable = true,
  showFAQ = true,
}: CreativePricingProps) {
  const [billingCadence, setBillingCadence] = useState<BillingCadence>('yearly');
  const [activePlan, setActivePlan] = useState<PlanId>(() => {
    if (typeof window === 'undefined') return initialCurrentPlan;
    try {
      const savedPlan = localStorage.getItem(LOCAL_STORAGE_PLAN_KEY) as PlanId;
      if (savedPlan && ['free', 'pro', 'team'].includes(savedPlan)) {
        return savedPlan;
      }
    } catch {
      // Ignore
    }
    return initialCurrentPlan;
  });
  const [expandedMobileTier, setExpandedMobileTier] = useState<PlanId | null>('pro');
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Modals state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState<string | null>(null);

  // Team Form State
  const [teamForm, setTeamForm] = useState({
    companyName: '',
    workEmail: '',
    teamSize: '5-10',
    useCase: 'Agency Skill Benchmarking',
    notes: '',
  });
  const [isTeamSubmitted, setIsTeamSubmitted] = useState<boolean>(false);

  const handleSetPlan = (plan: PlanId) => {
    setActivePlan(plan);
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAN_KEY, plan);
    } catch {
      // Ignore
    }
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  const handlePlanAction = (tier: PricingTier) => {
    if (tier.id === 'free') {
      if (activePlan === 'free') {
        if (hasCompletedAssessment && onViewScore) {
          onViewScore();
        } else if (onStartAssessment) {
          onStartAssessment();
        }
      } else {
        // Downgrade / switch to free
        handleSetPlan('free');
        setIsSuccessToastOpen('Switched to Free Tier');
        setTimeout(() => setIsSuccessToastOpen(null), 3000);
      }
    } else if (tier.id === 'pro') {
      if (activePlan === 'pro') {
        setIsSuccessToastOpen('You are currently on the Pro plan');
        setTimeout(() => setIsSuccessToastOpen(null), 3000);
      } else {
        setIsUpgradeModalOpen(true);
      }
    } else if (tier.id === 'team') {
      setIsTeamModalOpen(true);
    }
  };

  const handleConfirmProUpgrade = () => {
    handleSetPlan('pro');
    setIsUpgradeModalOpen(false);
    setIsSuccessToastOpen('Pro Membership Activated! Unlimited assessments unlocked.');
    setTimeout(() => setIsSuccessToastOpen(null), 4000);
  };

  const handleTeamFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTeamSubmitted(true);
    setTimeout(() => {
      setIsTeamSubmitted(false);
      setIsTeamModalOpen(false);
      setIsSuccessToastOpen('Team workspace request submitted. Our team will contact you shortly.');
      setTimeout(() => setIsSuccessToastOpen(null), 4000);
    }, 1500);
  };

  const renderCtaLabel = (tier: PricingTier) => {
    if (activePlan === tier.id) {
      return 'CURRENT PLAN';
    }
    if (tier.id === 'free') {
      if (hasCompletedAssessment) {
        return userScore ? `VIEW MY SCORE (${userScore})` : 'VIEW MY BENCHMARK';
      }
      return 'TAKE THE ASSESSMENT';
    }
    if (tier.id === 'pro') {
      return billingCadence === 'yearly' ? 'GO PRO (SAVE $36/YR)' : 'GO PRO';
    }
    return 'CREATE A TEAM';
  };

  return (
    <section
      id="pricing-section"
      className={`py-8 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16 ${className}`}
      aria-label="Pricing and Plan Options"
    >
      {/* Toast Notification */}
      {isSuccessToastOpen && (
        <div className="fixed bottom-6 right-6 z-50 patter-card bg-[#0f0f11] text-white p-4 shadow-[4px_4px_0px_#df9367] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#df9367] shrink-0" />
          <p className="text-xs sm:text-sm font-mono">{isSuccessToastOpen}</p>
        </div>
      )}

      {/* SECTION 1: HEADER */}
      <header className="max-w-4xl mx-auto text-center space-y-4">
        {/* Telemetry pill */}
        <div className="inline-flex items-center gap-2 patter-pill bg-[#0f0f11] text-white text-xs shadow-[2px_2px_0px_#0f0f11]">
          <span className="h-2 w-2 rounded-full bg-[#df9367] animate-pulse-subtle" />
          <span>PRICING & PROGRESSION MATRIX • V1.4.2</span>
        </div>

        {/* Strong Patter Display Typography */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0f0f11] tracking-tight leading-[1.1] uppercase">
          FIND OUT HOW GOOD YOU ARE <br className="hidden sm:inline" />
          <span className="bg-[#df9367] px-2.5 py-0.5 border-[1.5px] border-[#0f0f11] inline-block mt-1 sm:mt-2 shadow-[2px_2px_0px_#0f0f11]">
            THEN GET BETTER
          </span>
        </h2>

        {/* Value Proposition Description */}
        <p className="text-sm sm:text-base md:text-lg text-[#52525b] max-w-2xl mx-auto leading-relaxed pt-1">
          Take the assessment for free. Upgrade when you want deeper mistake diagnostics,
          unlimited attempts, specialized domain assessments, and serious skill tracking.
        </p>

        {/* Active plan status indicator */}
        <div className="pt-1 flex items-center justify-center gap-2 text-xs font-mono text-[#52525b]">
          <span>Your current tier:</span>
          <span className="patter-pill bg-[#eeece4] text-[#0f0f11] font-bold uppercase">
            {activePlan} PLAN
          </span>
          {activePlan !== 'free' && (
            <button
              onClick={() => {
                handleSetPlan('free');
                setIsSuccessToastOpen('Reverted to Free tier');
                setTimeout(() => setIsSuccessToastOpen(null), 3000);
              }}
              className="text-[11px] underline hover:text-[#0f0f11] cursor-pointer ml-1"
            >
              (Reset to Free)
            </button>
          )}
        </div>

        {/* SECTION 2: BILLING CADENCE TOGGLE */}
        <div className="pt-4 flex items-center justify-center">
          <div className="p-1 bg-[#eeece4] border-[1.5px] border-[#0f0f11] inline-flex items-center gap-1 shadow-[2px_2px_0px_#0f0f11]">
            <button
              type="button"
              id="billing-monthly-toggle"
              onClick={() => setBillingCadence('monthly')}
              className={`px-4 py-2 text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                billingCadence === 'monthly'
                  ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#52525b]'
                  : 'text-[#52525b] hover:text-[#0f0f11]'
              }`}
              aria-pressed={billingCadence === 'monthly'}
            >
              MONTHLY BILLING
            </button>
            <button
              type="button"
              id="billing-yearly-toggle"
              onClick={() => setBillingCadence('yearly')}
              className={`px-4 py-2 text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCadence === 'yearly'
                  ? 'bg-[#df9367] text-[#0f0f11] shadow-[1px_1px_0px_#0f0f11]'
                  : 'text-[#52525b] hover:text-[#0f0f11]'
              }`}
              aria-pressed={billingCadence === 'yearly'}
            >
              <span>YEARLY BILLING</span>
              <span className="bg-[#0f0f11] text-white text-[10px] px-1.5 py-0.2 tracking-wider">
                SAVE $36 / YR
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 3: UNIFIED PRICING MATRIX (PATTER BORDERED GRID) */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop / Tablet Matrix (3 Columns with shared borders) */}
        <div className="hidden md:grid md:grid-cols-3 border-[2px] border-[#0f0f11] bg-[#0f0f11] shadow-[6px_6px_0px_#0f0f11]">
          {PRICING_TIERS.map((tier) => {
            const isPro = tier.emphasis;
            const isCurrent = activePlan === tier.id;
            const priceDisplay =
              tier.id === 'free'
                ? '$0'
                : billingCadence === 'yearly'
                ? `$${tier.yearlyPriceMonthly}`
                : `$${tier.monthlyPrice}`;

            const intervalDisplay =
              tier.id === 'free'
                ? '/FOREVER'
                : tier.id === 'pro'
                ? billingCadence === 'yearly'
                  ? '/MO (BILLED $144/YR)'
                  : '/MONTH'
                : billingCadence === 'yearly'
                ? '/SEAT/MO (BILLED $468/YR)'
                : '/SEAT / MONTH';

            return (
              <div
                key={tier.id}
                id={`pricing-card-${tier.id}`}
                className={`flex flex-col justify-between p-6 lg:p-8 relative ${
                  isPro
                    ? 'bg-[#fcf4ee] z-10'
                    : 'bg-white'
                }`}
              >
                {/* Pro Top Strip */}
                {isPro && (
                  <div className="absolute top-0 left-0 right-0 h-2 bg-[#df9367] border-b-[1.5px] border-[#0f0f11]" />
                )}

                <div className="space-y-6">
                  {/* Top Tier Identity */}
                  <div className="space-y-2 border-b-[1.5px] border-[#0f0f11] pb-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider text-[#52525b]">
                        {tier.badge}
                      </span>
                      {isPro && (
                        <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[10px] font-bold shadow-[1px_1px_0px_#0f0f11]">
                          FOR PROFESSIONALS
                        </span>
                      )}
                      {isCurrent && !isPro && (
                        <span className="patter-pill bg-[#0f0f11] text-white text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-extrabold text-[#0f0f11] tracking-tight">
                      {tier.name}
                    </h3>

                    <p className="text-xs text-[#52525b] font-mono leading-relaxed min-h-[32px]">
                      {tier.tagline}
                    </p>

                    {/* Price Block */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-extrabold text-4xl lg:text-5xl text-[#0f0f11] tracking-tight">
                          {priceDisplay}
                        </span>
                        <span className="font-mono text-[11px] lg:text-xs text-[#52525b] font-bold">
                          {intervalDisplay}
                        </span>
                      </div>

                      {/* Precise Limit Badge */}
                      <div className="mt-3">
                        <span className="inline-block px-2 py-1 bg-[#eeece4] border border-[#0f0f11] font-mono text-[10px] font-bold text-[#0f0f11]">
                          {tier.limitsBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Groups (Categorized by Outcomes) */}
                  <div className="space-y-5 pt-1">
                    {tier.groups.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#0f0f11] uppercase tracking-wider">
                            {group.title}
                          </span>
                          <div className="h-[1px] bg-[#eeece4] grow" />
                        </div>

                        <ul className="space-y-2 text-xs">
                          {group.features.map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className={`flex items-start gap-2 leading-relaxed ${
                                feat.included ? 'text-[#0f0f11]' : 'text-[#8c8b85]'
                              }`}
                            >
                              {feat.included ? (
                                <span className="font-mono text-[#15803d] font-bold shrink-0 mt-0.5">
                                  ✓
                                </span>
                              ) : (
                                <span className="font-mono text-[#8c8b85] shrink-0 mt-0.5">
                                  —
                                </span>
                              )}
                              <span className="grow">
                                {feat.label}
                                {feat.limit && (
                                  <span className="font-mono text-[10px] font-bold ml-1.5 px-1 py-0.2 bg-[#eeece4] border border-[#0f0f11] text-[#0f0f11]">
                                    {feat.limit}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-8 border-t-[1.5px] border-[#0f0f11] mt-8 space-y-2">
                  <Button
                    id={`cta-btn-${tier.id}`}
                    onClick={() => handlePlanAction(tier)}
                    variant={isPro ? 'peach' : isCurrent ? 'secondary' : tier.id === 'free' ? 'outline' : 'default'}
                    size="lg"
                    className="w-full font-mono text-xs sm:text-sm font-bold tracking-tight"
                    disabled={isCurrent && tier.id === 'pro'}
                  >
                    <span>{renderCtaLabel(tier)}</span>
                    {!isCurrent && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>

                  <p className="text-[10px] font-mono text-center text-[#8c8b85]">
                    {tier.id === 'free'
                      ? 'No card required • Instant evaluation'
                      : tier.id === 'pro'
                      ? '1-click upgrade • Cancel anytime'
                      : 'Candidate links & team analytics'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Accordion & Card Stack (Optimized for 320px - 767px) */}
        <div className="md:hidden space-y-4">
          {PRICING_TIERS.map((tier) => {
            const isPro = tier.emphasis;
            const isCurrent = activePlan === tier.id;
            const isExpanded = expandedMobileTier === tier.id;
            const priceDisplay =
              tier.id === 'free'
                ? '$0'
                : billingCadence === 'yearly'
                ? `$${tier.yearlyPriceMonthly}`
                : `$${tier.monthlyPrice}`;

            const intervalDisplay =
              tier.id === 'free'
                ? '/FOREVER'
                : tier.id === 'pro'
                ? billingCadence === 'yearly'
                  ? '/MO (BILLED YEARLY)'
                  : '/MONTH'
                : billingCadence === 'yearly'
                ? '/SEAT/MO (BILLED YEARLY)'
                : '/SEAT / MO';

            return (
              <div
                key={tier.id}
                id={`pricing-card-mobile-${tier.id}`}
                className={`patter-card border-[2px] ${
                  isPro
                    ? 'bg-[#fcf4ee] shadow-[4px_4px_0px_#0f0f11]'
                    : 'bg-white shadow-[3px_3px_0px_#0f0f11]'
                }`}
              >
                {/* Pro top accent */}
                {isPro && (
                  <div className="h-1.5 bg-[#df9367] border-b-[1.5px] border-[#0f0f11]" />
                )}

                <div className="p-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#52525b] block">
                        {tier.badge}
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#0f0f11]">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[#52525b] font-mono mt-0.5">
                        {tier.tagline}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-extrabold text-3xl text-[#0f0f11]">
                        {priceDisplay}
                      </div>
                      <span className="font-mono text-[10px] text-[#52525b] block font-bold">
                        {intervalDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Limit pill */}
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 bg-[#eeece4] border border-[#0f0f11] font-mono text-[10px] font-bold text-[#0f0f11]">
                      {tier.limitsBadge}
                    </span>
                    {isPro && (
                      <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[10px] font-bold">
                        FOR PROFESSIONALS
                      </span>
                    )}
                  </div>

                  {/* Primary CTA */}
                  <Button
                    id={`mobile-cta-${tier.id}`}
                    onClick={() => handlePlanAction(tier)}
                    variant={isPro ? 'peach' : isCurrent ? 'secondary' : tier.id === 'free' ? 'outline' : 'default'}
                    size="default"
                    className="w-full font-mono text-xs font-bold"
                    disabled={isCurrent && tier.id === 'pro'}
                  >
                    <span>{renderCtaLabel(tier)}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                  </Button>

                  {/* Toggle Features View */}
                  <button
                    type="button"
                    onClick={() => setExpandedMobileTier(isExpanded ? null : tier.id)}
                    className="w-full pt-2 text-xs font-mono font-bold text-[#0f0f11] flex items-center justify-between border-t border-[#eeece4] cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide feature breakdown' : 'View full feature breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Expandable Feature List */}
                  {isExpanded && (
                    <div className="pt-2 space-y-4 border-t border-[#eeece4] animate-in fade-in duration-200">
                      {tier.groups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-2">
                          <span className="font-mono text-[10px] font-bold text-[#0f0f11] uppercase tracking-wider block bg-[#eeece4] px-2 py-0.5">
                            {group.title}
                          </span>
                          <ul className="space-y-1.5 text-xs">
                            {group.features.map((feat, fIdx) => (
                              <li
                                key={fIdx}
                                className={`flex items-start gap-2 ${
                                  feat.included ? 'text-[#0f0f11]' : 'text-[#8c8b85]'
                                }`}
                              >
                                {feat.included ? (
                                  <span className="font-mono text-[#15803d] font-bold shrink-0">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="font-mono text-[#8c8b85] shrink-0">—</span>
                                )}
                                <span>
                                  {feat.label}
                                  {feat.limit && (
                                    <span className="font-mono text-[9px] font-bold ml-1 px-1 bg-[#eeece4] border border-[#0f0f11] text-[#0f0f11]">
                                      {feat.limit}
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TRUST & CLARIFICATION BAR */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="patter-card bg-white p-4 flex items-center gap-3 shadow-[2px_2px_0px_#0f0f11]">
          <div className="h-8 w-8 bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-[#0f0f11] uppercase">
              NO CARD REQUIRED
            </h4>
            <p className="text-[11px] text-[#52525b]">
              Take your first adaptive benchmark instantly for free.
            </p>
          </div>
        </div>

        <div className="patter-card bg-white p-4 flex items-center gap-3 shadow-[2px_2px_0px_#0f0f11]">
          <div className="h-8 w-8 bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4 text-[#df9367]" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-[#0f0f11] uppercase">
              CANCEL ANYTIME
            </h4>
            <p className="text-[11px] text-[#52525b]">
              1-click self-service cancellation with zero lock-in.
            </p>
          </div>
        </div>

        <div className="patter-card bg-white p-4 flex items-center gap-3 shadow-[2px_2px_0px_#0f0f11]">
          <div className="h-8 w-8 bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-[#0f0f11]" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-[#0f0f11] uppercase">
              RESPONSES STAY PRIVATE
            </h4>
            <p className="text-[11px] text-[#52525b]">
              Your individual test mistakes and telemetry are confidential.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: GRANULAR FEATURE COMPARISON MATRIX */}
      {showComparisonTable && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[1.5px] border-[#0f0f11] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 patter-pill bg-[#eeece4] text-[#0f0f11] text-[10px] font-bold mb-1">
                <Layers className="w-3 h-3 text-[#df9367]" />
                <span>TECHNICAL AUDIT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
                Detailed Feature & Limits Matrix
              </h3>
            </div>

            <button
              type="button"
              id="toggle-comparison-matrix"
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono font-semibold self-start sm:self-auto cursor-pointer"
            >
              <span>{isComparisonOpen ? 'Collapse Matrix' : 'Expand Full Comparison'}</span>
              {isComparisonOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>

          {isComparisonOpen && (
            <div className="patter-card bg-white shadow-[4px_4px_0px_#0f0f11] overflow-x-auto border-[2px] animate-in fade-in duration-200">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b-[1.5px] border-[#0f0f11] bg-[#f7f6f0] font-mono text-xs">
                    <th className="p-3.5 font-bold text-[#0f0f11] w-2/5">
                      CAPABILITY / METRIC
                    </th>
                    <th className="p-3.5 font-bold text-[#0f0f11] text-center w-1/5">
                      FREE ($0)
                    </th>
                    <th className="p-3.5 font-bold text-[#0f0f11] text-center w-1/5 bg-[#fcf4ee] border-x border-[#0f0f11]">
                      PRO ($15/mo)
                    </th>
                    <th className="p-3.5 font-bold text-[#0f0f11] text-center w-1/5">
                      TEAM ($49/seat)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeece4] text-xs">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#faf9f6] transition-colors font-mono"
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-[#0f0f11] font-sans">
                          {row.name}
                        </div>
                        {row.description && (
                          <div className="text-[11px] text-[#52525b] font-mono mt-0.5">
                            {row.description}
                          </div>
                        )}
                      </td>
                      {/* Free Col */}
                      <td className="p-3.5 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <span className="text-[#15803d] font-bold">✓ Included</span>
                          ) : (
                            <span className="text-[#8c8b85]">—</span>
                          )
                        ) : (
                          <span className="font-bold text-[#0f0f11]">{row.free}</span>
                        )}
                      </td>
                      {/* Pro Col */}
                      <td className="p-3.5 text-center bg-[#fcf4ee]/60 border-x border-[#eeece4]">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <span className="text-[#15803d] font-bold">✓ Included</span>
                          ) : (
                            <span className="text-[#8c8b85]">—</span>
                          )
                        ) : (
                          <span className="font-bold text-[#0f0f11]">{row.pro}</span>
                        )}
                      </td>
                      {/* Team Col */}
                      <td className="p-3.5 text-center">
                        {typeof row.team === 'boolean' ? (
                          row.team ? (
                            <span className="text-[#15803d] font-bold">✓ Included</span>
                          ) : (
                            <span className="text-[#8c8b85]">—</span>
                          )
                        ) : (
                          <span className="font-bold text-[#0f0f11]">{row.team}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: PRICING FAQ */}
      {showFAQ && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="patter-pill bg-[#0f0f11] text-white text-xs">
              FREQUENT QUESTIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
              Transparent Pricing & Subscription Rules
            </h3>
          </div>

          <div className="space-y-3">
            {PRICING_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  id={`faq-item-${idx}`}
                  className="patter-card bg-white border-[1.5px] shadow-[2px_2px_0px_#0f0f11]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-mono font-bold text-sm sm:text-base text-[#0f0f11]">
                      {faq.question}
                    </span>
                    <span className="h-6 w-6 rounded-none bg-[#eeece4] border border-[#0f0f11] flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#52525b] leading-relaxed border-t border-[#eeece4]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: PRO UPGRADE CHECKOUT / SIMULATION */}
      {isUpgradeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="patter-card bg-white w-full max-w-lg shadow-[6px_6px_0px_#0f0f11] border-[2px] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="patter-terminal-header">
              <span>COPYSCORE // PRO MEMBERSHIP ACTIVATION</span>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="hover:text-[#df9367] text-white font-mono text-sm cursor-pointer"
              >
                [ESC / X]
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="inline-block patter-pill bg-[#df9367] text-[#0f0f11] text-xs font-bold">
                  INSTANT ACCESS
                </div>
                <h3 id="upgrade-modal-title" className="text-2xl font-extrabold text-[#0f0f11] tracking-tight">
                  Upgrade to CopyScore Pro
                </h3>
                <p className="text-xs text-[#52525b] font-mono">
                  Unlock unlimited adaptive attempts, 4 specialized monthly tests, and deep mistake diagnostics.
                </p>
              </div>

              {/* Cadence Selector inside Modal */}
              <div className="p-3 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>Selected Billing Cadence:</span>
                  <span className="text-[#df9367] bg-[#0f0f11] px-1.5 py-0.5">
                    {billingCadence === 'yearly' ? '$12/mo ($144 billed annually)' : '$15/mo'}
                  </span>
                </div>
                <div className="text-[11px] text-[#52525b] font-mono">
                  {billingCadence === 'yearly'
                    ? '✓ Includes $36 yearly discount compared to monthly plan.'
                    : 'Flexible monthly billing. Cancel anytime with 1 click.'}
                </div>
              </div>

              {/* Included Highlights */}
              <div className="space-y-2 text-xs font-mono border-t border-[#eeece4] pt-3">
                <span className="font-bold text-[#0f0f11] block">Included in your Pro upgrade:</span>
                <ul className="space-y-1 text-[#52525b]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#15803d] font-bold">✓</span>
                    <span>Unlimited full adaptive benchmarks (no 30-day limit)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#15803d] font-bold">✓</span>
                    <span>4 specialized tests: Conversion Copy, Performance Ads, CRO & Content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#15803d] font-bold">✓</span>
                    <span>Question-by-question mistake deduction telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#15803d] font-bold">✓</span>
                    <span>Historical skill progression tracking & verified badge</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  id="confirm-pro-upgrade-btn"
                  onClick={handleConfirmProUpgrade}
                  variant="peach"
                  size="lg"
                  className="w-full font-mono text-sm font-bold"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Activate Pro Plan Now</span>
                </Button>

                <Button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-mono text-xs"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-[10px] font-mono text-[#8c8b85] text-center">
                Secure sandbox billing • Instant entitlement activation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TEAM & HIRING WORKSPACE INQUIRY */}
      {isTeamModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="patter-card bg-white w-full max-w-lg shadow-[6px_6px_0px_#0f0f11] border-[2px] overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="patter-terminal-header">
              <span>COPYSCORE // TEAM & HIRING WORKSPACE</span>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="hover:text-[#df9367] text-white font-mono text-sm cursor-pointer"
              >
                [ESC / X]
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="inline-block patter-pill bg-[#0f0f11] text-white text-xs">
                  ORGANIZATIONS & AGENCIES
                </div>
                <h3 id="team-modal-title" className="text-2xl font-extrabold text-[#0f0f11] tracking-tight">
                  Configure Team Workspace
                </h3>
                <p className="text-xs text-[#52525b] font-mono">
                  Benchmark your marketing team, screen copywriting candidates, and track skill gaps.
                </p>
              </div>

              <form onSubmit={handleTeamFormSubmit} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label htmlFor="companyName" className="block font-bold text-[#0f0f11] mb-1">
                    Organization / Company Name:
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    placeholder="e.g. Acme Media or Growth Agency"
                    value={teamForm.companyName}
                    onChange={(e) => setTeamForm({ ...teamForm, companyName: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] font-mono text-xs focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="workEmail" className="block font-bold text-[#0f0f11] mb-1">
                      Work Email:
                    </label>
                    <input
                      id="workEmail"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={teamForm.workEmail}
                      onChange={(e) => setTeamForm({ ...teamForm, workEmail: e.target.value })}
                      className="w-full p-2.5 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] font-mono text-xs focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="teamSize" className="block font-bold text-[#0f0f11] mb-1">
                      Seats Needed:
                    </label>
                    <select
                      id="teamSize"
                      value={teamForm.teamSize}
                      onChange={(e) => setTeamForm({ ...teamForm, teamSize: e.target.value })}
                      className="w-full p-2.5 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] font-mono text-xs focus:outline-none focus:bg-white cursor-pointer"
                    >
                      <option value="5-10">5 – 10 Seats ($49/seat)</option>
                      <option value="11-25">11 – 25 Seats</option>
                      <option value="26-50">26 – 50 Seats</option>
                      <option value="50+">50+ Enterprise Seats</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="useCase" className="block font-bold text-[#0f0f11] mb-1">
                    Primary Use Case:
                  </label>
                  <select
                    id="useCase"
                    value={teamForm.useCase}
                    onChange={(e) => setTeamForm({ ...teamForm, useCase: e.target.value })}
                    className="w-full p-2.5 bg-[#f7f6f0] border-[1.5px] border-[#0f0f11] font-mono text-xs focus:outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="Candidate Screening">Candidate Screening & Copywriter Hiring</option>
                    <option value="Agency Skill Benchmarking">Agency Skill Benchmarking & Client Pitch Proof</option>
                    <option value="Internal Team Development">Internal Team Training & Skill-Gap Analysis</option>
                    <option value="Bootcamp/Cohort">Cohort / Bootcamp Certification</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    id="submit-team-request-btn"
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full font-mono text-xs font-bold"
                    disabled={isTeamSubmitted}
                  >
                    {isTeamSubmitted ? 'Creating Workspace Request...' : 'Submit Workspace Request'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsTeamModalOpen(false)}
                    variant="outline"
                    size="lg"
                    className="w-auto font-mono text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CreativePricing;

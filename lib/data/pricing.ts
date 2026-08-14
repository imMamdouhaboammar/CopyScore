import { PricingTier, ComparisonRow, FAQItem } from '@/lib/types/pricing';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'FREE',
    badge: '01 / INDIVIDUAL',
    tagline: 'Find out where you stand',
    purpose: 'Get your baseline Copy Score and discover your primary copywriting archetype at zero cost.',
    monthlyPrice: 0,
    yearlyPriceMonthly: 0,
    yearlyTotalPrice: 0,
    yearlySavingsDollars: 0,
    billingIntervalText: '/FOREVER',
    emphasis: false,
    limitsBadge: '1 BENCHMARK / 30 DAYS',
    groups: [
      {
        category: 'ASSESS',
        title: 'ASSESS',
        features: [
          { label: 'Full adaptive assessment', included: true, limit: '1 / 30 days' },
          { label: 'Standard Copy Score (0-100)', included: true },
          { label: 'Weekly public challenge', included: true },
          { label: 'Specialized domain tests', included: false },
          { label: 'Private unranked mode', included: false },
        ],
      },
      {
        category: 'UNDERSTAND',
        title: 'UNDERSTAND',
        features: [
          { label: 'Core 4-domain skill breakdown', included: true },
          { label: 'Basic improvement recommendations', included: true },
          { label: 'General percentile calculation', included: true },
          { label: 'Deep mistake diagnostics & deductions', included: false },
          { label: 'Cognitive error pattern analysis', included: false },
        ],
      },
      {
        category: 'TRACK',
        title: 'TRACK & COMPETE',
        features: [
          { label: 'Public skill profile (/u/handle)', included: true },
          { label: 'Public leaderboard eligibility', included: true },
          { label: 'Standard result share card', included: true },
          { label: 'Head-to-head challenge links', included: true, limit: '1 link' },
          { label: 'Historical score tracking & progression', included: false },
        ],
      },
    ],
    cta: {
      label: 'TAKE THE ASSESSMENT',
      action: 'start_free',
    },
  },
  {
    id: 'pro',
    name: 'PRO',
    badge: '02 / FOR PROFESSIONALS',
    tagline: 'Understand why + improve over time',
    purpose: 'Continuous skill progression, mistake diagnostics, unlimited retakes, and specialized domain assessments.',
    monthlyPrice: 15,
    yearlyPriceMonthly: 12,
    yearlyTotalPrice: 144,
    yearlySavingsDollars: 36,
    billingIntervalText: '/MONTH',
    emphasis: true,
    highlightStrip: 'FOR PROFESSIONALS',
    limitsBadge: 'UNLIMITED BENCHMARKS • 4 SPECIALIZED / MO',
    groups: [
      {
        category: 'ASSESS',
        title: 'ASSESS',
        features: [
          { label: 'Full adaptive assessments', included: true, limit: 'Unlimited' },
          { label: 'Conversion Copy deep assessment', included: true, limit: 'Monthly' },
          { label: 'Performance Ads angle assessment', included: true, limit: 'Monthly' },
          { label: 'CRO Experimentation assessment', included: true, limit: 'Monthly' },
          { label: 'Content Judgment & Hook assessment', included: true, limit: 'Monthly' },
          { label: 'Private unranked practice mode', included: true },
        ],
      },
      {
        category: 'UNDERSTAND',
        title: 'UNDERSTAND',
        features: [
          { label: 'Deep mistake diagnostics & deduction breakdown', included: true },
          { label: 'Cognitive error pattern & blind spot analysis', included: true },
          { label: 'Advanced cohort & percentile distributions', included: true },
          { label: 'Personalized 3-step growth action plan', included: true },
          { label: 'Targeted practice question recommendations', included: true },
        ],
      },
      {
        category: 'TRACK',
        title: 'TRACK',
        features: [
          { label: 'Historical score tracking & delta trends', included: true },
          { label: 'Skill progression curves over time', included: true },
          { label: 'Side-by-side attempt comparison', included: true },
          { label: 'Extended verified public profile & badge', included: true },
        ],
      },
      {
        category: 'COMPETE',
        title: 'COMPETE',
        features: [
          { label: 'Priority leaderboard ranking with verified badge', included: true },
          { label: 'Unlimited head-to-head duels (/beat/code)', included: true },
          { label: 'High-resolution exportable share cards', included: true },
          { label: 'Custom challenge parameters & rules', included: true },
        ],
      },
    ],
    cta: {
      label: 'GO PRO',
      action: 'checkout_pro',
    },
  },
  {
    id: 'team',
    name: 'TEAM',
    badge: '03 / ORGANIZATIONS',
    tagline: 'Measure and calibrate multiple writers',
    purpose: 'Assess marketing teams, screen copywriting candidates, and benchmark agency talent objectively.',
    monthlyPrice: 49,
    yearlyPriceMonthly: 39,
    yearlyTotalPrice: 468,
    yearlySavingsDollars: 120,
    billingIntervalText: '/SEAT / MONTH',
    emphasis: false,
    limitsBadge: 'MIN 5 SEATS • CANDIDATE SCREENING',
    groups: [
      {
        category: 'MEASURE',
        title: 'MEASURE',
        features: [
          { label: 'Everything in Pro for all team members', included: true },
          { label: 'Candidate assessment screening links', included: true, limit: '25 / mo' },
          { label: 'Team skill matrix & multi-writer radar', included: true },
          { label: 'Role-based benchmarks (Junior vs Senior vs Lead)', included: true },
          { label: 'Private team leaderboard & rankings', included: true },
        ],
      },
      {
        category: 'MANAGE',
        title: 'MANAGE',
        features: [
          { label: 'Multi-seat workspace & invite management', included: true },
          { label: 'Assessment assignment & completion deadlines', included: true },
          { label: 'Private team challenge lobbies', included: true },
          { label: 'Hiring pipeline applicant tracking', included: true },
        ],
      },
      {
        category: 'REPORT',
        title: 'REPORT',
        features: [
          { label: 'Team skill-gap diagnostics & radar analysis', included: true },
          { label: 'Exportable candidate evaluation dossiers (PDF & CSV)', included: true },
          { label: 'Manager hiring & team performance dashboard', included: true },
          { label: 'Dedicated psychometric onboarding & support', included: true },
        ],
      },
    ],
    cta: {
      label: 'CREATE A TEAM',
      action: 'contact_team',
    },
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  // Assessment Category
  {
    name: 'Full Adaptive Assessment',
    category: 'Assessment & Testing',
    free: '1 / 30 days',
    pro: 'Unlimited',
    team: 'Unlimited for team',
    description: '10-12 calibrated questions testing all 4 commercial writing disciplines.',
  },
  {
    name: 'Specialized Domain Assessments',
    category: 'Assessment & Testing',
    free: false,
    pro: '4 assessments / month',
    team: 'Unlimited / seat',
    description: 'Deep dive into Conversion Copy, Performance Ads, CRO, or Content Judgment.',
  },
  {
    name: 'Private Practice Mode',
    category: 'Assessment & Testing',
    free: false,
    pro: true,
    team: true,
    description: 'Take tests unranked without updating your public score or leaderboard position.',
  },
  {
    name: 'Candidate Screening Links',
    category: 'Assessment & Testing',
    free: false,
    pro: false,
    team: '25 candidates / mo',
    description: 'Send timed, anti-cheat assessments to job applicants before interviews.',
  },

  // Diagnostics Category
  {
    name: 'Overall Copy Score (0-100)',
    category: 'Diagnostics & Feedback',
    free: true,
    pro: true,
    team: true,
    description: 'Psychometrically validated score calibrated via Item Response Theory.',
  },
  {
    name: 'Primary Archetype Diagnosis',
    category: 'Diagnostics & Feedback',
    free: true,
    pro: true,
    team: true,
    description: 'Classification into commercial archetypes (e.g., Conversion Architect).',
  },
  {
    name: 'Question-by-Question Mistake Telemetry',
    category: 'Diagnostics & Feedback',
    free: 'Basic Summary',
    pro: 'Full Diagnostic Engine',
    team: 'Full Diagnostic Engine',
    description: 'Exact breakdown of cognitive deductions, flawed choices, and root causes.',
  },
  {
    name: 'Cohort Percentile Distribution',
    category: 'Diagnostics & Feedback',
    free: 'General median',
    pro: 'Granular peer cohort',
    team: 'Role & industry benchmarks',
    description: 'Compare against junior, senior, CRO specialists, and conversion writers.',
  },
  {
    name: 'Personalized 3-Step Growth Plan',
    category: 'Diagnostics & Feedback',
    free: 'General advice',
    pro: 'Custom priority roadmap',
    team: 'Team skill-gap plan',
    description: 'Targeted actions based on exact missed decision branches.',
  },

  // Progression & Tracking
  {
    name: 'Historical Score Progression',
    category: 'Progression & Tracking',
    free: 'Latest score only',
    pro: 'Full history & trends',
    team: 'Full history & team analytics',
    description: 'Track your delta improvements over months of practice.',
  },
  {
    name: 'Attempt-over-Attempt Comparison',
    category: 'Progression & Tracking',
    free: false,
    pro: true,
    team: true,
    description: 'Side-by-side radar and score diff across all 4 domains.',
  },
  {
    name: 'Public Skill Profile',
    category: 'Progression & Tracking',
    free: 'Standard (/u/handle)',
    pro: 'Verified Pro Badge',
    team: 'Team member showcase',
    description: 'Shareable proof of your verified commercial copywriting standard.',
  },

  // Social & Competition
  {
    name: 'Public Leaderboard Ranking',
    category: 'Competition & Challenges',
    free: 'Standard',
    pro: 'Priority Verified',
    team: 'Private & Public',
    description: 'Compete with top commercial copywriters globally.',
  },
  {
    name: 'Head-to-Head Duels (/beat/code)',
    category: 'Competition & Challenges',
    free: '1 active challenge',
    pro: 'Unlimited duels',
    team: 'Private team lobbies',
    description: 'Direct challenger links with side-by-side domain score battles.',
  },
  {
    name: 'Exportable Reports & Share Cards',
    category: 'Competition & Challenges',
    free: 'Standard Web card',
    pro: 'High-Res PNG & PDF',
    team: 'Branded PDF & CSV dossiers',
    description: 'Professional assets for resumes, portfolios, and hiring reviews.',
  },
];

export const PRICING_FAQS: FAQItem[] = [
  {
    question: 'Can I take the assessment for free?',
    answer:
      'Yes. You can take the full adaptive benchmark for free with no credit card required. You will receive your verified Copy Score, primary archetype, 4-domain skill breakdown, and public profile eligibility immediately upon completion.',
  },
  {
    question: 'Why should I upgrade to Pro after getting my first score?',
    answer:
      'The free assessment tells you where you stand today. Pro helps you understand why and get measurably better. Pro unlocks deep mistake diagnostics, granular deduction telemetry, unlimited benchmark retakes, 4 specialized domain assessments per month (Conversion Copy, Performance Ads, CRO, and Content Judgment), and historical progression tracking.',
  },
  {
    question: 'How often can I retake the assessment?',
    answer:
      'On the Free plan, you can calibrate your official benchmark once every 30 days. Pro members can take unlimited adaptive benchmarks, retake tests in private unranked mode, and take 4 specialized domain assessments each month.',
  },
  {
    question: 'What happens to my score and profile if I cancel Pro?',
    answer:
      'Your verified scores, historical records, and public profile remain intact forever. You will simply revert to the Free tier limits (1 assessment per 30 days) when your current billing period ends.',
  },
  {
    question: 'Are my assessment responses and mistakes kept private?',
    answer:
      'Yes. Your individual question choices, time-per-question, and detailed mistake telemetry are completely private to you. Only your high-level Copy Score and archetype are visible on the public leaderboard and your public profile (which you can also set to unlisted).',
  },
  {
    question: 'Can I use CopyScore for hiring and candidate screening?',
    answer:
      'Yes! The Team plan is designed specifically for agencies, marketing departments, and hiring managers. It includes candidate assessment screening links, role-based hiring benchmarks (Junior vs Senior vs Lead), team skill matrices, and exportable PDF/CSV candidate dossiers.',
  },
  {
    question: 'How does annual billing work?',
    answer:
      'When you choose annual billing for Pro, you pay $144 upfront for the full year ($12/month equivalent) instead of $15/month, saving you $36 per year. Team plans save $120 per seat annually.',
  },
];

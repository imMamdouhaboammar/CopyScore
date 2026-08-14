export type BillingCadence = 'monthly' | 'yearly';

export type PlanId = 'free' | 'pro' | 'team';

export interface PricingFeature {
  label: string;
  included: boolean;
  limit?: string;
  note?: string;
}

export interface PricingFeatureGroup {
  category: 'ASSESS' | 'UNDERSTAND' | 'TRACK' | 'COMPETE' | 'MEASURE' | 'MANAGE' | 'REPORT';
  title: string;
  features: PricingFeature[];
}

export interface PricingTier {
  id: PlanId;
  name: string;
  badge?: string;
  tagline: string;
  purpose: string;
  monthlyPrice: number;
  yearlyPriceMonthly: number; // Monthly price when billed yearly
  yearlyTotalPrice: number;
  yearlySavingsDollars: number;
  billingIntervalText: string;
  emphasis?: boolean;
  highlightStrip?: string;
  limitsBadge: string;
  groups: PricingFeatureGroup[];
  cta: {
    label: string;
    action: string;
  };
}

export interface ComparisonRow {
  name: string;
  category: string;
  free: string | boolean;
  pro: string | boolean;
  team: string | boolean;
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

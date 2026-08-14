'use client';

import React from 'react';
import {
  MessageSquare,
  Search,
  Zap,
  Target,
  FileText,
  Mail,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface StartWithJobGridProps {
  onSelectJob: (jobQuery: string, categorySlug?: string) => void;
  activeJob?: string;
}

const JOBS = [
  {
    id: 'find-objections',
    label: 'FIND CUSTOMER OBJECTIONS',
    category: 'customer-research',
    query: 'objections',
    tagline: 'Extract hidden anxieties and hesitations from reviews and calls.',
    icon: MessageSquare,
  },
  {
    id: 'audit-landing-page',
    label: 'AUDIT A LANDING PAGE',
    category: 'cro',
    query: 'landing page audit',
    tagline: 'Diagnose clarity, cognitive load, and value proposition gaps.',
    icon: Zap,
  },
  {
    id: 'write-better-ads',
    label: 'WRITE BETTER META ADS',
    category: 'paid-media',
    query: 'write Meta ads',
    tagline: 'Generate 12 diverse psychological angles and hook scripts.',
    icon: Target,
  },
  {
    id: 'mine-reviews',
    label: 'MINE CUSTOMER REVIEWS',
    category: 'customer-research',
    query: 'customer reviews',
    tagline: 'Turn raw G2/Amazon reviews into word-for-word copy swipe files.',
    icon: Users,
  },
  {
    id: 'improve-positioning',
    label: 'IMPROVE POSITIONING',
    category: 'positioning',
    query: 'positioning canvas',
    tagline: 'Apply Dunford frameworks to isolate your product from rivals.',
    icon: Compass,
  },
  {
    id: 'build-content-brief',
    label: 'BUILD A CONTENT BRIEF',
    category: 'content',
    query: 'SEO brief',
    tagline: 'Satisfy search intent with in-depth entity outlines.',
    icon: FileText,
  },
  {
    id: 'create-email-sequences',
    label: 'CREATE EMAIL SEQUENCES',
    category: 'email',
    query: 'email sequence',
    tagline: 'Structure 5-part onboarding and trial-to-paid retention flows.',
    icon: Mail,
  },
  {
    id: 'research-competitors',
    label: 'RESEARCH COMPETITORS',
    category: 'positioning',
    query: 'competitor research',
    tagline: 'Dissect rival claims, pricing models, and Reddit vulnerabilities.',
    icon: Search,
  },
];

export function StartWithJobGrid({ onSelectJob, activeJob }: StartWithJobGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-none bg-[#df9367]" />
            <h2 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase tracking-wider">
              Start With Your Job
            </h2>
          </div>
          <p className="text-xs text-[#52525b] mt-0.5">
            Select the specific marketing task you need to accomplish today
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#8c8b85]">
          USE CASE FIRST → PLATFORM SECOND
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {JOBS.map((job) => {
          const Icon = job.icon;
          const isActive = activeJob === job.query;

          return (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.query, job.category)}
              className={`patter-card text-left p-4 transition-all group flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#0f0f11] text-white shadow-[4px_4px_0px_#df9367]'
                  : 'bg-white text-[#0f0f11] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f0f11]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-8 w-8 flex items-center justify-center border border-[#0f0f11] ${
                      isActive ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-[#f7f6f0] text-[#0f0f11]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#27272a] text-[#df9367]'
                        : 'bg-[#eeece4] text-[#52525b]'
                    }`}
                  >
                    {job.category.replace('-', ' ')}
                  </span>
                </div>

                <div className="font-mono font-extrabold text-xs sm:text-sm tracking-tight leading-tight">
                  {job.label}
                </div>

                <p
                  className={`text-[11px] leading-relaxed line-clamp-2 ${
                    isActive ? 'text-[#d4d4d8]' : 'text-[#52525b]'
                  }`}
                >
                  {job.tagline}
                </p>
              </div>

              <div
                className={`pt-3 mt-3 border-t flex items-center justify-between text-[11px] font-mono font-bold ${
                  isActive
                    ? 'border-[#27272a] text-[#df9367]'
                    : 'border-[#f0eee6] text-[#0f0f11] group-hover:text-[#df9367]'
                }`}
              >
                <span>EXPLORE SKILLS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Search, Sparkles, SlidersHorizontal, PlusCircle, Terminal, HelpCircle } from 'lucide-react';
import { AIResource } from '@/lib/types/ai-upscale';

interface AiUpscaleHeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  onOpenFinder: () => void;
  onOpenSubmit: () => void;
  totalResourcesCount: number;
}

const QUICK_SEARCH_CHIPS = [
  'customer research',
  'landing page audit',
  'write Meta ads',
  'objection demolition',
  'SEO brief',
  'email sequence',
  'claude skill',
  'mcp server',
];

export function AiUpscaleHero({
  query,
  onQueryChange,
  onOpenFinder,
  onOpenSubmit,
  totalResourcesCount,
}: AiUpscaleHeroProps) {
  return (
    <div className="patter-card bg-[#fcfbf8] p-6 sm:p-8 space-y-6 relative overflow-hidden border-[2px] border-[#0f0f11] shadow-[6px_6px_0px_#0f0f11]">
      {/* Editorial Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f0f11] pb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#df9367]" />
          <span className="font-mono text-xs font-bold text-[#0f0f11] uppercase tracking-wider">
            AI UPSCALE // MARKETING INTELLIGENCE DIRECTORY
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-[#0f0f11] text-white px-2 py-0.5 font-bold">
            {totalResourcesCount} TESTED SKILLS & WORKFLOWS
          </span>
          <span className="text-[11px] font-mono bg-[#eaf8ee] border border-[#15803d] text-[#15803d] px-2 py-0.5 font-bold hidden sm:inline">
            100% AUDITED
          </span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-2 max-w-3xl">
        <h1 className="font-mono font-black text-2xl sm:text-4xl text-[#0f0f11] tracking-tight leading-tight uppercase">
          Use Better AI For Better Marketing Work.
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] leading-relaxed">
          The curated, tested directory of AI skills, MCP servers, and prompt packs for Claude Code, Codex, ChatGPT, and Gemini CLI. Build real customer research, audit pages, and write winning direct response copy.
        </p>
      </div>

      {/* Search Bar & Action Buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8b85]" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by job, keyword, tool (e.g. 'find customer objections', 'claude skill', 'Meta ads')..."
              className="w-full bg-white border-[1.5px] border-[#0f0f11] pl-10 pr-10 py-3 text-xs sm:text-sm font-mono text-[#0f0f11] placeholder:text-[#8c8b85] focus:outline-none focus:ring-2 focus:ring-[#df9367] shadow-[2px_2px_0px_#0f0f11]"
            />
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8c8b85] hover:text-[#0f0f11]"
              >
                [x]
              </button>
            )}
          </div>

          {/* Smart Finder Button */}
          <button
            onClick={onOpenFinder}
            className="patter-btn patter-btn-peach px-4 py-3 text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-[2px_2px_0px_#0f0f11]"
          >
            <Sparkles className="w-4 h-4 text-[#0f0f11]" />
            <span>SMART MATCHER</span>
          </button>

          {/* Submit Resource Button */}
          <button
            onClick={onOpenSubmit}
            className="patter-btn px-4 py-3 text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-2 bg-white text-[#0f0f11] hover:bg-[#f7f6f0] shrink-0 cursor-pointer shadow-[2px_2px_0px_#0f0f11]"
          >
            <PlusCircle className="w-4 h-4 text-[#df9367]" />
            <span>SUBMIT SKILL</span>
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono font-bold text-[#8c8b85] uppercase mr-1">
            POPULAR INTENTS:
          </span>
          {QUICK_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onQueryChange(chip)}
              className={`text-[10px] font-mono px-2 py-0.5 border transition-all cursor-pointer ${
                query.toLowerCase() === chip.toLowerCase()
                  ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                  : 'bg-white text-[#52525b] border-[#e5e4dc] hover:border-[#0f0f11] hover:text-[#0f0f11]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { TimeframeFilter, SkillCategoryFilter } from '@/lib/types/assessment';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface LeaderboardFiltersProps {
  timeframe: TimeframeFilter;
  onTimeframeChange: (timeframe: TimeframeFilter) => void;
  category: SkillCategoryFilter;
  onCategoryChange: (category: SkillCategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFiltered: number;
}

export function LeaderboardFilters({
  timeframe,
  onTimeframeChange,
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalFiltered,
}: LeaderboardFiltersProps) {
  const timeframes: { id: TimeframeFilter; label: string }[] = [
    { id: 'global', label: 'GLOBAL' },
    { id: 'weekly', label: 'THIS WEEK' },
    { id: 'monthly', label: 'THIS MONTH' },
  ];

  const categories: { id: SkillCategoryFilter; label: string }[] = [
    { id: 'all', label: 'OVERALL' },
    { id: 'conversion', label: 'CONVERSION COPY' },
    { id: 'content', label: 'CONTENT & HOOKS' },
    { id: 'performance', label: 'PERFORMANCE ADS' },
    { id: 'cro', label: 'CRO & FUNNELS' },
  ];

  return (
    <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Row 1: Timeframe segmented tabs + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Timeframe Group */}
          <div className="flex items-center gap-1.5 p-1 bg-[#eeece4] border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] self-start">
            <span className="px-2 text-[10px] font-mono font-bold text-[#52525b] uppercase hidden sm:inline-block">
              WINDOW:
            </span>
            {timeframes.map((tf) => {
              const isActive = timeframe === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => onTimeframeChange(tf.id)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#df9367] text-[#0f0f11] border border-[#0f0f11] shadow-[1px_1px_0px_#0f0f11]'
                      : 'bg-white text-[#52525b] hover:text-[#0f0f11] hover:bg-[#faf9f6]'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#8c8b85] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH PLAYER / ARCHETYPE..."
              className="w-full bg-white border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] pl-9 pr-8 py-1.5 text-xs font-mono text-[#0f0f11] placeholder:text-[#8c8b85] focus:outline-none focus:bg-[#fcf4ee]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8b85] hover:text-[#0f0f11] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Skill Domain Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-[#8c8b85] uppercase shrink-0 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" />
            SKILL DOMAIN:
          </span>
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-tight whitespace-nowrap border-[1.5px] transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#df9367] text-[#0f0f11] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] font-bold'
                    : 'bg-white text-[#52525b] border-[#0f0f11] hover:text-[#0f0f11] hover:bg-[#faf9f6]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          <div className="ml-auto text-[11px] font-mono text-[#8c8b85] hidden md:block shrink-0">
            {totalFiltered} PROFILES ON BOARD
          </div>
        </div>
      </div>
    </div>
  );
}

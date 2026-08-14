'use client';

import React from 'react';
import { PlatformId } from '@/lib/types/ai-upscale';
import { AI_PLATFORMS } from '@/lib/data/ai-upscale-seed';
import { PlatformIcon } from './PlatformIcon';

interface PlatformSelectorProps {
  selectedPlatform?: PlatformId | 'all';
  onSelectPlatform: (platformId: PlatformId | 'all') => void;
  resourceCounts?: Record<string, number>;
}

export function PlatformSelector({
  selectedPlatform = 'all',
  onSelectPlatform,
  resourceCounts,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#52525b]">
          FILTER BY YOUR AI ENVIRONMENT:
        </span>
        {selectedPlatform !== 'all' && (
          <button
            onClick={() => onSelectPlatform('all')}
            className="text-[10px] font-mono text-[#df9367] hover:underline cursor-pointer"
          >
            Clear platform filter [x]
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectPlatform('all')}
          className={`patter-btn px-3 py-1.5 text-xs font-mono transition-all ${
            selectedPlatform === 'all'
              ? 'bg-[#0f0f11] text-white shadow-[2px_2px_0px_#52525b]'
              : 'bg-white text-[#0f0f11] hover:bg-[#fcfbf8]'
          }`}
        >
          <span>ALL PLATFORMS</span>
        </button>

        {AI_PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          const count = resourceCounts?.[platform.id];

          return (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={`patter-btn px-3 py-1.5 text-xs font-mono flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-[#0f0f11] text-white shadow-[2px_2px_0px_#df9367]'
                  : 'bg-white text-[#0f0f11] hover:bg-[#fcfbf8]'
              }`}
            >
              <PlatformIcon platformId={platform.id} size={14} />
              <span className="font-semibold">{platform.name}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] px-1 py-0.2 ${
                    isSelected ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-[#eeece4] text-[#52525b]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

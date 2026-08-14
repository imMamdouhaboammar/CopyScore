'use client';

import React from 'react';
import Link from 'next/link';
import { AIResource, PlatformId } from '@/lib/types/ai-upscale';
import { PlatformIcon } from './PlatformIcon';
import { ArrowRight, Bookmark, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface ResourceCardProps {
  resource: AIResource;
  onToggleCompare?: (slug: string) => void;
  isCompared?: boolean;
  onSaveToStack?: (slug: string) => void;
  isSaved?: boolean;
}

export function ResourceCard({
  resource,
  onToggleCompare,
  isCompared = false,
  onSaveToStack,
  isSaved = false,
}: ResourceCardProps) {
  // Top compatibility items (max 4)
  const topPlatforms = resource.compatibility
    .filter((c) => c.status === 'native' || c.status === 'supported' || c.status === 'adaptable')
    .slice(0, 4);

  const isEditorPick = resource.curationStatus === 'editor_pick';

  return (
    <div className="patter-card bg-white p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f0f11] transition-all relative group">
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="patter-pill bg-[#f7f6f0] text-[#0f0f11] text-[10px] uppercase font-bold py-0.5 px-2">
              {resource.categories[0]?.replace('-', ' ')}
            </span>
            <span className="patter-pill bg-[#0f0f11] text-[#f7f6f0] text-[10px] uppercase font-mono py-0.5 px-1.5">
              {resource.resourceType.toUpperCase()}
            </span>
          </div>

          {resource.curationScore ? (
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold bg-[#fcf4ee] border border-[#df9367] text-[#c47648] px-1.5 py-0.5">
              <Sparkles className="w-3 h-3 text-[#df9367]" />
              <span>{resource.curationScore.overall.toFixed(1)}</span>
            </div>
          ) : isEditorPick ? (
            <span className="text-[10px] font-mono font-bold bg-[#df9367] text-[#0f0f11] px-1.5 py-0.5">
              EDITOR PICK
            </span>
          ) : null}
        </div>

        {/* Title */}
        <Link href={`/ai-upscale/${resource.slug}`} className="block group-hover:text-[#df9367] transition-colors">
          <h3 className="font-mono font-extrabold text-base text-[#0f0f11] leading-tight">
            {resource.name}
          </h3>
        </Link>

        {/* One-Sentence Job Description */}
        <p className="text-xs text-[#52525b] mt-2 leading-relaxed line-clamp-2">
          {resource.tagline}
        </p>

        {/* Use Case Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {resource.useCases.slice(0, 2).map((useCase) => (
            <span
              key={useCase}
              className="text-[10px] font-mono text-[#52525b] bg-[#f7f6f0] px-1.5 py-0.5 border border-[#e5e4dc]"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section: Platform compatibility & Actions */}
      <div className="pt-4 mt-4 border-t border-[#f0eee6] space-y-3">
        {/* Platform compatibility bar */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#8c8b85] text-[10px] uppercase">COMPATIBILITY:</span>
          <div className="flex items-center gap-1.5">
            {topPlatforms.map((plat) => (
              <div
                key={plat.platformId}
                className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border ${
                  plat.status === 'native'
                    ? 'bg-[#eaf8ee] border-[#15803d] text-[#15803d]'
                    : plat.status === 'supported'
                    ? 'bg-[#f7f6f0] border-[#0f0f11] text-[#0f0f11]'
                    : 'bg-[#fef4e6] border-[#b45309] text-[#b45309]'
                }`}
                title={`${plat.platformName}: ${plat.status.toUpperCase()}`}
              >
                <PlatformIcon platformId={plat.platformId} size={11} />
                <span className="hidden sm:inline">
                  {plat.platformId === 'claude_code'
                    ? 'Claude'
                    : plat.platformId === 'codex'
                    ? 'Codex'
                    : plat.platformId === 'chatgpt'
                    ? 'GPT'
                    : plat.platformId === 'gemini_cli'
                    ? 'Gemini'
                    : plat.platformId === 'mcp_clients'
                    ? 'MCP'
                    : plat.platformName}
                </span>
                <span className="font-bold">
                  {plat.status === 'native' ? '●' : plat.status === 'supported' ? '●' : '◐'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex items-center justify-between gap-2">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(resource.slug)}
              className={`text-[10px] font-mono py-1 px-2 border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                  : 'bg-white text-[#52525b] border-[#e5e4dc] hover:border-[#0f0f11]'
              }`}
            >
              {isCompared ? 'Compared [✓]' : '+ Compare'}
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {onSaveToStack && (
              <button
                onClick={() => onSaveToStack(resource.slug)}
                className={`patter-btn p-1.5 text-xs ${
                  isSaved
                    ? 'bg-[#df9367] text-[#0f0f11]'
                    : 'bg-white text-[#52525b] hover:text-[#0f0f11]'
                }`}
                title={isSaved ? 'Saved in your AI Stack' : 'Save to My AI Stack'}
              >
                <Bookmark className="w-3.5 h-3.5" fill={isSaved ? '#0f0f11' : 'none'} />
              </button>
            )}

            <Link
              href={`/ai-upscale/${resource.slug}`}
              className="patter-btn patter-btn-peach text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-1.5"
            >
              <span>VIEW GUIDE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

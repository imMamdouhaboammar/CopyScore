'use client';

import React from 'react';
import { AIResource } from '@/lib/types/ai-upscale';
import { X, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PlatformIcon } from './PlatformIcon';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResources: AIResource[];
  onRemoveResource: (slug: string) => void;
  onClearAll: () => void;
}

export function CompareDrawer({
  isOpen,
  onClose,
  comparedResources,
  onRemoveResource,
  onClearAll,
}: CompareDrawerProps) {
  if (!isOpen || comparedResources.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t-[2px] border-[#0f0f11] shadow-[0_-8px_24px_rgba(15,15,17,0.15)] max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0f0f11] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#df9367]" />
            <h3 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
              Side-by-Side Comparison ({comparedResources.length} of 3)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-mono text-[#52525b] hover:text-[#0f0f11] underline cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#f7f6f0] border border-[#0f0f11] cursor-pointer"
            >
              <X className="w-4 h-4 text-[#0f0f11]" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {comparedResources.map((res) => (
            <div key={res.slug} className="patter-card bg-[#fcfbf8] p-4 space-y-4 relative">
              <button
                onClick={() => onRemoveResource(res.slug)}
                className="absolute top-3 right-3 p-1 hover:bg-[#eeece4] border border-[#0f0f11] cursor-pointer"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5 text-[#0f0f11]" />
              </button>

              {/* Title & Tagline */}
              <div>
                <span className="text-[10px] uppercase font-bold bg-[#0f0f11] text-white px-1.5 py-0.2">
                  {res.resourceType.toUpperCase()}
                </span>
                <h4 className="font-bold text-sm text-[#0f0f11] mt-1.5 pr-6">{res.name}</h4>
                <p className="text-[11px] text-[#52525b] mt-1 line-clamp-2">{res.tagline}</p>
              </div>

              {/* Specs */}
              <div className="space-y-2 border-t border-[#e5e4dc] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#8c8b85]">DIFFICULTY:</span>
                  <span className="font-bold text-[#0f0f11] uppercase">
                    {res.installDifficulty}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8c8b85]">PRICING:</span>
                  <span className="font-bold text-[#0f0f11] uppercase">{res.pricing}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8c8b85]">CURATION:</span>
                  <span className="font-bold text-[#df9367]">
                    {res.curationScore?.overall.toFixed(1) || 'EDITORIAL'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8c8b85]">PROMPTS:</span>
                  <span className="font-bold text-[#0f0f11]">
                    {res.prompts?.length || 0} Ready
                  </span>
                </div>

                {/* Compatibility */}
                <div className="space-y-1 pt-1">
                  <span className="text-[#8c8b85] text-[10px]">COMPATIBLE WITH:</span>
                  <div className="flex flex-wrap gap-1">
                    {res.compatibility
                      .filter((c) => c.status === 'native' || c.status === 'supported')
                      .map((c) => (
                        <span
                          key={c.platformId}
                          className="flex items-center gap-1 text-[10px] bg-white border border-[#0f0f11] px-1.5 py-0.5"
                        >
                          <PlatformIcon platformId={c.platformId} size={10} />
                          <span>{c.platformName}</span>
                        </span>
                      ))}
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-1 pt-1">
                  <span className="text-[#8c8b85] text-[10px]">SECURITY AUDIT:</span>
                  <div className="text-[10px] text-[#52525b]">
                    {res.security.runsLocalCode ? '• Runs local code' : '• Prompt sandbox only'}
                    <br />
                    {res.security.networkAccess ? '• Outbound network' : '• Fully offline'}
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/ai-upscale/${res.slug}`}
                onClick={onClose}
                className="patter-btn patter-btn-peach w-full py-1.5 text-center block font-bold"
              >
                OPEN FULL GUIDE →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { AICollection } from '@/lib/types/ai-upscale';
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface CollectionsShowcaseProps {
  collections: AICollection[];
  onSelectCollection: (slug: string) => void;
  activeCollectionSlug?: string;
}

export function CollectionsShowcase({
  collections,
  onSelectCollection,
  activeCollectionSlug,
}: CollectionsShowcaseProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#df9367]" />
            <h2 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase tracking-wider">
              Curated Workflow Stacks
            </h2>
          </div>
          <p className="text-xs text-[#52525b] mt-0.5">
            Pre-assembled multi-skill pipelines designed to execute full end-to-end marketing deliverables
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#8c8b85]">
          END-TO-END PIPELINES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((coll) => {
          const isActive = activeCollectionSlug === coll.slug;

          return (
            <div
              key={coll.id}
              className={`patter-card p-5 space-y-4 flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-[#0f0f11] text-white shadow-[4px_4px_0px_#df9367]'
                  : 'bg-white text-[#0f0f11] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f0f11]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
                      isActive ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-[#eeece4] text-[#52525b]'
                    }`}
                  >
                    {coll.resourceSlugs.length} SKILLS BUNDLE
                  </span>

                  <span className="text-xs font-mono text-[#8c8b85]">
                    EST: {coll.estimatedTime}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono font-extrabold text-base tracking-tight leading-tight">
                    {coll.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      isActive ? 'text-[#d4d4d8]' : 'text-[#52525b]'
                    }`}
                  >
                    {coll.description}
                  </p>
                </div>

                {/* Workflow Steps Preview */}
                <div
                  className={`p-3 border font-mono text-xs space-y-1.5 ${
                    isActive ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#fcfbf8] border-[#e5e4dc]'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-[#8c8b85]">
                    PIPELINE STEPS:
                  </div>
                  {coll.workflowSteps.map((step) => (
                    <div key={step.step} className="flex items-start gap-2">
                      <span className="text-[#df9367] font-bold">0{step.step}.</span>
                      <div className="flex-1">
                        <span className="font-bold">{step.title}</span>
                        <span className="text-[11px] text-[#8c8b85] ml-1.5">({step.tool})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#f0eee6] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8c8b85]">
                  BY: {coll.curatedBy.toUpperCase()}
                </span>
                <button
                  onClick={() => onSelectCollection(coll.slug)}
                  className={`patter-btn text-xs font-mono font-bold py-1.5 px-3 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#df9367] text-[#0f0f11]'
                      : 'patter-btn-peach'
                  }`}
                >
                  <span>{isActive ? 'FILTERING BY STACK [✓]' : 'VIEW BUNDLE SKILLS'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

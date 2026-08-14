'use client';

import React from 'react';
import Link from 'next/link';
import { AI_CATEGORIES, AI_RESOURCES } from '@/lib/data/ai-upscale-seed';
import { ArrowLeft, ArrowRight, Sparkles, Folder, Layers } from 'lucide-react';

export default function AICategoriesIndexPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#0f0f11] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Link href="/ai-upscale" className="text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>AI UPSCALE DIRECTORY</span>
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold text-[#0f0f11]">CATEGORIES & DOMAINS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Hero Header */}
        <div className="patter-card bg-white p-6 sm:p-8 space-y-3 shadow-[6px_6px_0px_#0f0f11] border-[2px] border-[#0f0f11]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#df9367]" />
            <span className="font-mono text-xs font-bold text-[#0f0f11] uppercase tracking-wider">
              MARKETING DOMAIN INDEX
            </span>
          </div>
          <h1 className="font-mono font-black text-2xl sm:text-4xl text-[#0f0f11] tracking-tight leading-tight uppercase">
            Browse AI Skills by Marketing Discipline
          </h1>
          <p className="text-sm sm:text-base text-[#52525b] max-w-3xl leading-relaxed">
            Every category contains tested skills, prompts, and MCP servers structured for specific marketing outcomes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AI_CATEGORIES.map((cat) => {
            const count = AI_RESOURCES.filter((r) => r.categories.includes(cat.slug)).length;
            const topResources = AI_RESOURCES.filter((r) => r.categories.includes(cat.slug)).slice(0, 3);

            return (
              <div
                key={cat.id}
                className="patter-card bg-white p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f0f11] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 uppercase bg-[#f7f6f0] border border-[#e5e4dc]">
                      {count} SKILLS AVAILABLE
                    </span>
                  </div>

                  <h3 className="font-mono font-extrabold text-base text-[#0f0f11]">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#52525b] leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Sample skills */}
                  <div className="pt-2 border-t border-[#f0eee6] space-y-1 text-xs font-mono">
                    <span className="text-[10px] text-[#8c8b85] uppercase">TOP SKILLS:</span>
                    {topResources.map((res) => (
                      <Link
                        key={res.slug}
                        href={`/ai-upscale/${res.slug}`}
                        className="block text-[#0f0f11] hover:text-[#df9367] truncate text-[11px]"
                      >
                        • {res.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f0eee6]">
                  <Link
                    href={`/ai-upscale?category=${cat.slug}`}
                    className="patter-btn patter-btn-peach w-full py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>VIEW {cat.name.toUpperCase()} SKILLS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

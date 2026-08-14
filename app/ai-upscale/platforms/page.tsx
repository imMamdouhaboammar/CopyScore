'use client';

import React from 'react';
import Link from 'next/link';
import { AI_PLATFORMS, AI_RESOURCES } from '@/lib/data/ai-upscale-seed';
import { PlatformIcon } from '@/components/ai-upscale/PlatformIcon';
import { ArrowLeft, ArrowRight, ExternalLink, Terminal, CheckCircle2 } from 'lucide-react';

export default function AIPlatformsIndexPage() {
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
            <span className="font-bold text-[#0f0f11]">AI ENVIRONMENTS & PLATFORMS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Hero Header */}
        <div className="patter-card bg-white p-6 sm:p-8 space-y-3 shadow-[6px_6px_0px_#0f0f11] border-[2px] border-[#0f0f11]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#df9367]" />
            <span className="font-mono text-xs font-bold text-[#0f0f11] uppercase tracking-wider">
              ENVIRONMENT COMPATIBILITY HUB
            </span>
          </div>
          <h1 className="font-mono font-black text-2xl sm:text-4xl text-[#0f0f11] tracking-tight leading-tight uppercase">
            AI Platform Integration & Skill Systems
          </h1>
          <p className="text-sm sm:text-base text-[#52525b] max-w-3xl leading-relaxed">
            Understand how skills, CLI utilities, and MCP servers differ across AI coding clients and chat interfaces.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="space-y-6">
          {AI_PLATFORMS.map((plat) => {
            const compatibleResources = AI_RESOURCES.filter((r) =>
              r.compatibility.some((c) => c.platformId === plat.id && c.status === 'native')
            );

            return (
              <div
                key={plat.id}
                className="patter-card bg-white p-6 space-y-5 shadow-[4px_4px_0px_#0f0f11] border-[1.5px] border-[#0f0f11]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0f0f11] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#f7f6f0] border border-[#0f0f11] flex items-center justify-center">
                      <PlatformIcon platformId={plat.id} size={22} />
                    </div>
                    <div>
                      <h2 className="font-mono font-black text-lg text-[#0f0f11]">
                        {plat.name}
                      </h2>
                      <span className="text-xs font-mono text-[#8c8b85]">
                        NATIVE ARCHITECTURE: {plat.skillMechanism.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[#eaf8ee] text-[#15803d] px-2 py-0.5 border border-[#15803d] font-bold">
                      {compatibleResources.length} NATIVE SKILLS
                    </span>

                    <a
                      href={plat.officialDocsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="patter-btn px-2.5 py-1 text-xs font-mono bg-white flex items-center gap-1"
                    >
                      <span>Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Description & Setup Notes */}
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                      {plat.description}
                    </p>

                    <div className="p-3 bg-[#fcfbf8] border border-[#0f0f11] text-xs font-mono space-y-1">
                      <span className="font-bold text-[#0f0f11]">HOW TO INSTALL SKILLS HERE:</span>
                      <p className="text-[#52525b]">{plat.installLocationHelp}</p>
                    </div>
                  </div>

                  {/* Right: Native Skills Preview */}
                  <div className="space-y-2 font-mono text-xs">
                    <span className="text-[10px] text-[#8c8b85] uppercase font-bold">
                      FEATURED COMPATIBLE SKILLS:
                    </span>
                    <div className="space-y-1.5">
                      {compatibleResources.slice(0, 3).map((res) => (
                        <Link
                          key={res.slug}
                          href={`/ai-upscale/${res.slug}`}
                          className="p-2 bg-[#f7f6f0] border border-[#e5e4dc] hover:border-[#0f0f11] flex items-center justify-between group transition-colors block"
                        >
                          <span className="font-bold text-[#0f0f11] group-hover:text-[#df9367]">
                            {res.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#52525b] group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/ai-upscale?platform=${plat.id}`}
                        className="patter-btn patter-btn-peach w-full py-1.5 text-center block font-bold"
                      >
                        FILTER ALL {plat.name.toUpperCase()} SKILLS →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

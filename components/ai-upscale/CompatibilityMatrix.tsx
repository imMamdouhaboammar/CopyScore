'use client';

import React from 'react';
import { PlatformCompatibility, PlatformId } from '@/lib/types/ai-upscale';
import { PlatformIcon } from './PlatformIcon';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface CompatibilityMatrixProps {
  compatibility: PlatformCompatibility[];
  onSelectPlatformTab?: (platformId: PlatformId) => void;
}

export function CompatibilityMatrix({
  compatibility,
  onSelectPlatformTab,
}: CompatibilityMatrixProps) {
  const statusBadge = (status: PlatformCompatibility['status']) => {
    switch (status) {
      case 'native':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-[#eaf8ee] text-[#15803d] border border-[#15803d]">
            <CheckCircle2 className="w-3 h-3" />
            <span>NATIVE FIRST-CLASS</span>
          </span>
        );
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-[#f7f6f0] text-[#0f0f11] border border-[#0f0f11]">
            <span>SUPPORTED</span>
          </span>
        );
      case 'adaptable':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-[#fef4e6] text-[#b45309] border border-[#b45309]">
            <AlertCircle className="w-3 h-3" />
            <span>ADAPTABLE VIA PROMPT</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-[#f4f4f5] text-[#71717a] border border-[#d4d4d8]">
            <span>UNTESTED</span>
          </span>
        );
    }
  };

  return (
    <section className="patter-card bg-white shadow-[4px_4px_0px_#0f0f11] overflow-hidden" id="compatibility">
      <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#df9367]" />
          <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-[#0f0f11]">
            Platform Compatibility Matrix
          </h2>
        </div>
        <span className="text-xs font-mono text-[#52525b]">
          ACTUAL TESTED ARCHITECTURE
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-[#0f0f11] bg-[#f7f6f0] text-[#52525b] text-[11px]">
              <th className="p-3.5 font-bold text-[#0f0f11]">AI PLATFORM</th>
              <th className="p-3.5 font-bold text-[#0f0f11]">COMPATIBILITY STATUS</th>
              <th className="p-3.5 font-bold text-[#0f0f11]">NATIVE PACKAGING</th>
              <th className="p-3.5 font-bold text-[#0f0f11]">TESTED VERSION</th>
              <th className="p-3.5 font-bold text-[#0f0f11] text-right">INSTALLATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eee6]">
            {compatibility.map((item) => (
              <tr
                key={item.platformId}
                className="hover:bg-[#fcfbf8] transition-colors"
              >
                {/* Platform Name */}
                <td className="p-3.5">
                  <div className="flex items-center gap-2 font-bold text-[#0f0f11]">
                    <PlatformIcon platformId={item.platformId} size={16} />
                    <span>{item.platformName}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-3.5">{statusBadge(item.status)}</td>

                {/* Native Type */}
                <td className="p-3.5 text-[#52525b]">
                  <span className="bg-[#f7f6f0] px-2 py-0.5 border border-[#e5e4dc] text-[11px]">
                    {item.nativeType}
                  </span>
                </td>

                {/* Minimum Tested Version */}
                <td className="p-3.5 text-[#52525b] text-[11px]">
                  {item.minTestedVersion || 'Latest Stable'}
                </td>

                {/* Action */}
                <td className="p-3.5 text-right">
                  {item.status !== 'untested' && item.status !== 'incompatible' ? (
                    <a
                      href="#installation"
                      onClick={() => onSelectPlatformTab?.(item.platformId)}
                      className="patter-btn px-2.5 py-1 text-[10px] inline-flex items-center gap-1 bg-[#df9367] text-[#0f0f11] hover:bg-[#e59d74]"
                    >
                      <span>INSTALL</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#a1a1aa]">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

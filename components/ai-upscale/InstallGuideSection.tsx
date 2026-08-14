'use client';

import React, { useState } from 'react';
import { InstallGuide, PlatformId } from '@/lib/types/ai-upscale';
import { PlatformIcon } from './PlatformIcon';
import {
  Copy,
  Check,
  Terminal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface InstallGuideSectionProps {
  guides: Partial<Record<PlatformId, InstallGuide>>;
  initialPlatform?: PlatformId;
}

export function InstallGuideSection({ guides, initialPlatform }: InstallGuideSectionProps) {
  const availablePlatforms = Object.keys(guides) as PlatformId[];
  const [activePlatform, setActivePlatform] = useState<PlatformId>(
    initialPlatform && guides[initialPlatform]
      ? initialPlatform
      : availablePlatforms[0] || 'claude_code'
  );
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const activeGuide = guides[activePlatform];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  if (availablePlatforms.length === 0 || !activeGuide) {
    return (
      <div className="patter-card bg-white p-6 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-[#b45309] mx-auto" />
        <h3 className="font-mono font-bold text-sm text-[#0f0f11]">
          No Automated Terminal Installation Available
        </h3>
        <p className="text-xs text-[#52525b] max-w-md mx-auto">
          This capability uses standard instructions or workflow prompts. Review the Prompt Library below to run it directly inside your AI client.
        </p>
      </div>
    );
  }

  return (
    <section className="patter-card bg-white shadow-[4px_4px_0px_#0f0f11] overflow-hidden" id="installation">
      {/* Top Header / Platform Tabs */}
      <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#df9367]" />
          <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-[#0f0f11]">
            Installation Center
          </h2>
          <span className="text-[10px] font-mono bg-[#eeece4] text-[#52525b] px-1.5 py-0.5">
            VERIFIED {activeGuide.lastVerifiedAt}
          </span>
        </div>

        {/* Beginner vs Advanced Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#eeece4] p-0.5 border border-[#0f0f11] text-xs font-mono">
          <button
            onClick={() => setMode('beginner')}
            className={`px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'beginner'
                ? 'bg-[#0f0f11] text-white'
                : 'text-[#52525b] hover:text-[#0f0f11]'
            }`}
          >
            Step-by-Step Walkthrough
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'advanced'
                ? 'bg-[#0f0f11] text-white'
                : 'text-[#52525b] hover:text-[#0f0f11]'
            }`}
          >
            Quick Commands
          </button>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex border-b-[1.5px] border-[#0f0f11] bg-[#f7f6f0] overflow-x-auto">
        {availablePlatforms.map((platId) => {
          const guide = guides[platId]!;
          const isActive = activePlatform === platId;

          return (
            <button
              key={platId}
              onClick={() => setActivePlatform(platId)}
              className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-r-[1.5px] border-[#0f0f11] whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-white text-[#0f0f11] border-b-2 border-b-white -mb-[1.5px]'
                  : 'bg-[#f7f6f0] text-[#52525b] hover:bg-[#eeece4]'
              }`}
            >
              <PlatformIcon platformId={platId} size={14} />
              <span>{guide.platformName.toUpperCase()}</span>
              <span className="text-[9px] px-1 py-0.2 bg-[#df9367] text-[#0f0f11]">
                {guide.nativeType.split(' ')[1] || 'SKILL'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guide Content */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Prerequisites Banner */}
        <div className="patter-card bg-[#fcfbf8] p-4 space-y-2 border-[#0f0f11]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0f0f11]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
            <span>PREREQUISITES & ENVIRONMENT REQUIREMENTS:</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#52525b]">
            {activeGuide.prerequisites.map((prereq, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-mono text-[#df9367] font-bold">✓</span>
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {activeGuide.steps.map((step) => {
            const copyKey = `step_${step.stepNumber}`;
            const isCopied = copiedMap[copyKey] || false;

            return (
              <div key={step.stepNumber} className="border border-[#0f0f11] bg-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 bg-[#0f0f11] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                      0{step.stepNumber}
                    </span>
                    <h4 className="font-mono font-bold text-xs sm:text-sm text-[#0f0f11]">
                      {step.title}
                    </h4>
                  </div>
                </div>

                {mode === 'beginner' && step.explanation && (
                  <p className="text-xs text-[#52525b] pl-7">{step.explanation}</p>
                )}

                {step.command && (
                  <div className="patter-card bg-[#0f0f11] text-[#f7f6f0] p-3 flex items-center justify-between gap-3 font-mono text-xs overflow-x-auto shadow-none">
                    <code className="text-[#df9367] select-all whitespace-pre">
                      {step.command}
                    </code>
                    <button
                      onClick={() => handleCopy(step.command!, copyKey)}
                      className={`patter-btn px-2.5 py-1 text-[10px] font-mono shrink-0 transition-colors ${
                        isCopied
                          ? 'bg-[#15803d] text-white border-[#15803d]'
                          : 'bg-[#df9367] text-[#0f0f11] hover:bg-[#e59d74]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Verification Box */}
        {activeGuide.verification && (
          <div className="border-[1.5px] border-[#15803d] bg-[#eaf8ee] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#15803d]">
              <CheckCircle2 className="w-4 h-4" />
              <span>HOW DO I KNOW IT WORKED?</span>
            </div>
            <p className="text-xs text-[#14532d]">
              {activeGuide.verification.instructions}
            </p>
            {activeGuide.verification.command && (
              <div className="bg-[#0f0f11] text-[#f7f6f0] p-2.5 flex items-center justify-between text-xs font-mono">
                <code className="text-[#df9367]">{activeGuide.verification.command}</code>
                <button
                  onClick={() => handleCopy(activeGuide.verification.command!, 'verify_cmd')}
                  className="text-[10px] font-mono bg-[#df9367] text-[#0f0f11] px-2 py-0.5"
                >
                  {copiedMap['verify_cmd'] ? 'COPIED' : 'COPY'}
                </button>
              </div>
            )}
            <p className="text-[11px] font-mono text-[#15803d] pt-1">
              Expected output: {activeGuide.verification.expectedBehavior}
            </p>
          </div>
        )}

        {/* Uninstall & Documentation Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f0eee6] text-xs font-mono">
          {activeGuide.uninstall ? (
            <div className="flex items-center gap-1.5 text-[#8c8b85]">
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                To remove:{' '}
                <code className="bg-[#f7f6f0] px-1 py-0.5 text-[#0f0f11]">
                  {activeGuide.uninstall.command || activeGuide.uninstall.steps[0]}
                </code>
              </span>
            </div>
          ) : (
            <span className="text-[#8c8b85]">Standard directory deletion to remove.</span>
          )}

          {activeGuide.officialSources?.length > 0 && (
            <a
              href={activeGuide.officialSources[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#df9367] hover:underline"
            >
              <span>Official {activeGuide.platformName} Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

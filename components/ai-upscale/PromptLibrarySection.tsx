'use client';

import React, { useState } from 'react';
import { ResourcePrompt, PromptLevel } from '@/lib/types/ai-upscale';
import {
  Copy,
  Check,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Terminal,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface PromptLibrarySectionProps {
  prompts: ResourcePrompt[];
  resourceSlug: string;
  onSaveCustomPrompt?: (promptId: string, customText: string) => void;
}

export function PromptLibrarySection({
  prompts,
  resourceSlug,
  onSaveCustomPrompt,
}: PromptLibrarySectionProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0]?.id || '');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});
  const [customizingMap, setCustomizingMap] = useState<Record<string, boolean>>({});
  const [savedSuccessMap, setSavedSuccessMap] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();

  const activePrompt = prompts.find((p) => p.id === selectedPromptId) || prompts[0];

  const handleVariableChange = (varName: string, val: string) => {
    setVariableValues((prev) => ({ ...prev, [varName]: val }));
  };

  const getInterpolatedPrompt = (prompt: ResourcePrompt): string => {
    let text = prompt.prompt;
    for (const v of prompt.variables) {
      const val = variableValues[v.name] || v.defaultValue || `{{${v.name}}}`;
      text = text.replaceAll(`{{${v.name}}}`, val);
    }
    return text;
  };

  const handleCopy = (prompt: ResourcePrompt) => {
    const textToCopy = getInterpolatedPrompt(prompt);
    navigator.clipboard.writeText(textToCopy);
    setCopiedPromptId(prompt.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleSaveToStack = (prompt: ResourcePrompt) => {
    if (!onSaveCustomPrompt) return;
    const interpolated = getInterpolatedPrompt(prompt);
    onSaveCustomPrompt(prompt.id, interpolated);
    setSavedSuccessMap((prev) => ({ ...prev, [prompt.id]: true }));
    setTimeout(() => {
      setSavedSuccessMap((prev) => ({ ...prev, [prompt.id]: false }));
    }, 2500);
  };

  if (!prompts || prompts.length === 0) return null;

  return (
    <section className="patter-card bg-white shadow-[4px_4px_0px_#0f0f11] overflow-hidden" id="prompts">
      {/* Top Header */}
      <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#df9367]" />
          <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-[#0f0f11]">
            Prompt Library & Workflows
          </h2>
          <span className="text-[10px] font-mono bg-[#df9367] text-[#0f0f11] px-1.5 py-0.5 font-bold">
            {prompts.length} CURATED PROMPTS
          </span>
        </div>

        <span className="text-xs font-mono text-[#52525b]">
          DETERMINISTIC VARIABLE INTERPOLATION
        </span>
      </div>

      {/* Prompts Navigation Tabs */}
      <div className="flex border-b-[1.5px] border-[#0f0f11] bg-[#f7f6f0] overflow-x-auto">
        {prompts.map((p) => {
          const isActive = (activePrompt?.id === p.id);
          const levelColors: Record<PromptLevel, string> = {
            quick_start: 'bg-[#eaf8ee] text-[#15803d]',
            real_work: 'bg-[#fcf4ee] text-[#c47648]',
            advanced: 'bg-[#fef4e6] text-[#b45309]',
            power_user: 'bg-[#0f0f11] text-white',
          };

          return (
            <button
              key={p.id}
              onClick={() => setSelectedPromptId(p.id)}
              className={`px-4 py-3 text-xs font-mono font-bold flex items-center gap-2 border-r-[1.5px] border-[#0f0f11] whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-white text-[#0f0f11] border-b-2 border-b-white -mb-[1.5px]'
                  : 'bg-[#f7f6f0] text-[#52525b] hover:bg-[#eeece4]'
              }`}
            >
              <span className={`text-[9px] px-1.5 py-0.2 uppercase ${levelColors[p.level]}`}>
                {p.level.replace('_', ' ')}
              </span>
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Prompt View */}
      {activePrompt && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono font-bold text-base text-[#0f0f11]">
                {activePrompt.title}
              </h3>
              <span className="text-[11px] font-mono text-[#8c8b85]">
                USE CASE: {activePrompt.useCase.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#52525b]">{activePrompt.description}</p>
          </div>

          {/* Variables Customization Panel */}
          {activePrompt.variables.length > 0 && (
            <div className="border border-[#0f0f11] bg-[#fcfbf8] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0f0f11]">
                  <Sliders className="w-3.5 h-3.5 text-[#df9367]" />
                  <span>CUSTOMIZE PROMPT VARIABLES</span>
                </div>
                <span className="text-[10px] font-mono text-[#8c8b85]">
                  Instant live interpolation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePrompt.variables.map((v) => (
                  <div key={v.name} className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-[#0f0f11] flex items-center justify-between">
                      <span>{v.label}</span>
                      <code className="text-[#df9367] text-[10px]">{`{{${v.name}}}`}</code>
                    </label>
                    {v.name.includes('REVIEWS') || v.name.includes('COPY') || v.name.includes('TRANSCRIPT') ? (
                      <textarea
                        rows={3}
                        value={variableValues[v.name] ?? v.defaultValue ?? ''}
                        onChange={(e) => handleVariableChange(v.name, e.target.value)}
                        placeholder={v.placeholder}
                        className="w-full bg-white border border-[#0f0f11] p-2 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={variableValues[v.name] ?? v.defaultValue ?? ''}
                        onChange={(e) => handleVariableChange(v.name, e.target.value)}
                        placeholder={v.placeholder}
                        className="w-full bg-white border border-[#0f0f11] p-2 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interpolated Prompt Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#0f0f11]">READY-TO-RUN PROMPT:</span>
              <span className="text-[10px] text-[#8c8b85]">CLICK COPY TO RUN IN YOUR CLIENT</span>
            </div>

            <div className="relative border-[1.5px] border-[#0f0f11] bg-[#0f0f11] text-[#f7f6f0] p-4 sm:p-5 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap select-all text-[#e4e4e7]">
                {getInterpolatedPrompt(activePrompt)}
              </pre>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(activePrompt)}
                className={`patter-btn px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  copiedPromptId === activePrompt.id
                    ? 'bg-[#15803d] text-white border-[#15803d] shadow-[2px_2px_0px_#0f0f11]'
                    : 'patter-btn-peach'
                }`}
              >
                {copiedPromptId === activePrompt.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY READY PROMPT</span>
                  </>
                )}
              </button>

              {onSaveCustomPrompt && isAuthenticated && (
                <button
                  onClick={() => handleSaveToStack(activePrompt)}
                  className={`patter-btn px-3 py-2 text-xs font-mono transition-colors ${
                    savedSuccessMap[activePrompt.id]
                      ? 'bg-[#0f0f11] text-white'
                      : 'bg-white text-[#0f0f11] hover:bg-[#f7f6f0]'
                  }`}
                  title="Save this prompt configuration to your My AI Stack"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1 text-[#df9367]" />
                  <span>
                    {savedSuccessMap[activePrompt.id] ? 'Saved to Stack [✓]' : 'Save Custom Prompt'}
                  </span>
                </button>
              )}
            </div>

            {/* Expand Why It Works */}
            <button
              onClick={() =>
                setExpandedWhy((prev) => ({
                  ...prev,
                  [activePrompt.id]: !prev[activePrompt.id],
                }))
              }
              className="text-xs font-mono text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1 cursor-pointer"
            >
              <span>Why this prompt works</span>
              {expandedWhy[activePrompt.id] ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Expandable Why It Works Box */}
          {expandedWhy[activePrompt.id] && (
            <div className="p-3.5 bg-[#fcf4ee] border border-[#df9367] text-xs font-mono text-[#78350f] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#df9367]" />
                <span>EDITORIAL RATIONALE:</span>
              </div>
              <p className="leading-relaxed">{activePrompt.whyItWorks}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

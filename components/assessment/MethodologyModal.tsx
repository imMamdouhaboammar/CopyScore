'use client';

import React from 'react';
import { X, ShieldCheck, Target, BarChart2 } from 'lucide-react';
import { DOMAINS } from '@/lib/types/assessment';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="patter-card bg-white max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_#0f0f11] border-[2px] p-6 sm:p-8 space-y-6 relative">
        <div className="flex items-center justify-between border-b-[1.5px] border-[#0f0f11] pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-[#df9367] border border-[#0f0f11] flex items-center justify-center font-mono font-bold text-xs">
              M
            </div>
            <div>
              <h2 className="font-mono font-bold text-base sm:text-lg text-[#0f0f11] uppercase tracking-tight">
                Assessment Methodology
              </h2>
              <span className="text-[11px] font-mono text-[#52525b]">
                VERSION 1.4.2 ADAPTIVE STANDARD
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="patter-btn p-1.5 bg-[#eeece4] hover:bg-[#df9367]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-[#0f0f11] leading-relaxed">
          <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] space-y-2">
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-[#df9367]">
              <Target className="w-4 h-4 text-[#0f0f11]" />
              <span className="text-[#0f0f11]">1. Adaptive Scenario Weighting</span>
            </div>
            <p className="text-[#52525b]">
              CopyScore is not a simple percentage quiz. Responses are weighted by question difficulty and discrimination values defined in the assessment bank. The adaptive flow uses prior responses to select later scenarios, so the final score reflects both answer quality and the difficulty of the scenarios attempted.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono font-bold text-xs uppercase text-[#0f0f11]">
              2. Evaluated Competency Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(DOMAINS).map((d) => (
                <div key={d.id} className="p-3 bg-white border border-[#0f0f11] space-y-1">
                  <span className="font-mono font-bold text-xs block text-[#0f0f11]" style={{ color: d.color }}>
                    {d.name}
                  </span>
                  <p className="text-[11px] text-[#52525b]">{d.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] space-y-2">
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-[#0f0f11]">
              <BarChart2 className="w-4 h-4 text-[#df9367]" />
              <span>3. Score Interpretation</span>
            </div>
            <p className="text-xs text-[#52525b]">
              The 0–100 score and tier labels are CopyScore rubric outputs for this assessment version. They are not claims about your percentile among all commercial writers. Population percentile claims require a sufficiently large, representative, verified cohort; CopyScore does not present modeled percentiles as observed population rankings.
            </p>
          </div>

          <div className="p-3 bg-[#f7f6f0] border border-[#0f0f11] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-[#52525b]">
              Final scores are evaluated server-authoritatively and cryptographically signed before they are published as verified results. Correct answer keys are not delivered to the client bundle.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t-[1.5px] border-[#0f0f11] flex justify-end">
          <button
            onClick={onClose}
            className="patter-btn patter-btn-peach px-6 py-2 text-xs font-mono font-bold"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { AIResource, PlatformId } from '@/lib/types/ai-upscale';
import { AI_PLATFORMS, AI_CATEGORIES } from '@/lib/data/ai-upscale-seed';
import { PlatformIcon } from './PlatformIcon';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Target,
  FileText,
  Users,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

interface SmartFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: AIResource[];
}

export function SmartFinderModal({ isOpen, onClose, resources }: SmartFinderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'any'>('any');
  const [selectedType, setSelectedType] = useState<string>('any');

  if (!isOpen) return null;

  const GOALS = [
    {
      id: 'voc',
      title: 'Customer Voice & Review Mining',
      desc: 'Extract genuine pain points and verbatim words from reviews',
      category: 'customer-research',
      icon: Users,
    },
    {
      id: 'cro',
      title: 'Landing Page & Conversion Audits',
      desc: 'Identify friction points, headline clarity, and bounce risks',
      category: 'cro',
      icon: Zap,
    },
    {
      id: 'ads',
      title: 'Paid Social & Meta Ad Angles',
      desc: 'Generate high-performing direct-response hooks and scripts',
      category: 'paid-media',
      icon: Target,
    },
    {
      id: 'positioning',
      title: 'Differentiation & Positioning',
      desc: 'Find clear white-space separation from competitors',
      category: 'positioning',
      icon: Compass,
    },
    {
      id: 'seo',
      title: 'SEO Content Outlines & Briefs',
      desc: 'Build search intent architectures and entity frameworks',
      category: 'content',
      icon: FileText,
    },
  ];

  // Calculate top recommendations based on selections
  const getRecommendations = (): AIResource[] => {
    return resources
      .filter((r) => {
        if (selectedGoal) {
          const goalObj = GOALS.find((g) => g.id === selectedGoal);
          if (goalObj && !r.categories.includes(goalObj.category)) {
            // Check use cases too
            const hasMatch = r.useCases.some((u) =>
              u.toLowerCase().includes(goalObj.title.toLowerCase())
            );
            if (!hasMatch) return false;
          }
        }

        if (selectedPlatform !== 'any') {
          const compat = r.compatibility.find(
            (c) =>
              c.platformId === selectedPlatform &&
              (c.status === 'native' || c.status === 'supported' || c.status === 'adaptable')
          );
          if (!compat) return false;
        }

        if (selectedType !== 'any') {
          if (r.resourceType !== selectedType) return false;
        }

        return true;
      })
      .slice(0, 3);
  };

  const recommendations = getRecommendations();

  const resetFinder = () => {
    setStep(1);
    setSelectedGoal('');
    setSelectedPlatform('any');
    setSelectedType('any');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="patter-card bg-white max-w-2xl w-full shadow-[8px_8px_0px_#0f0f11] overflow-hidden">
        {/* Header */}
        <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#df9367]" />
            <h3 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
              Smart Marketing AI Matcher (Step {step} of 3)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f7f6f0] border border-transparent hover:border-[#0f0f11] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0f0f11]" />
          </button>
        </div>

        {/* Body Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-mono font-bold text-base text-[#0f0f11]">
                  What is your primary marketing objective right now?
                </h4>
                <p className="text-xs text-[#52525b] mt-1">
                  Choose the core work bottleneck you want your AI assistant to solve.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;

                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-3.5 border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f0f11] text-white border-[#0f0f11] shadow-[2px_2px_0px_#df9367]'
                          : 'bg-white text-[#0f0f11] border-[#0f0f11] hover:bg-[#fcfbf8]'
                      }`}
                    >
                      <div
                        className={`p-2 border border-[#0f0f11] shrink-0 ${
                          isSelected ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-[#f7f6f0]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-xs">{goal.title}</div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            isSelected ? 'text-[#d4d4d8]' : 'text-[#52525b]'
                          }`}
                        >
                          {goal.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-mono font-bold text-base text-[#0f0f11]">
                  Where do you run your AI workflows?
                </h4>
                <p className="text-xs text-[#52525b] mt-1">
                  We will filter for first-class native compatibility with your client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedPlatform('any')}
                  className={`p-3 border text-left font-mono text-xs cursor-pointer ${
                    selectedPlatform === 'any'
                      ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                      : 'bg-white text-[#0f0f11] border-[#0f0f11] hover:bg-[#fcfbf8]'
                  }`}
                >
                  <div className="font-bold">Any Platform / Prompts</div>
                  <div className="text-[10px] text-[#8c8b85] mt-0.5">Show all options</div>
                </button>

                {AI_PLATFORMS.map((plat) => {
                  const isSelected = selectedPlatform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      onClick={() => setSelectedPlatform(plat.id)}
                      className={`p-3 border text-left flex items-center gap-2.5 font-mono text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                          : 'bg-white text-[#0f0f11] border-[#0f0f11] hover:bg-[#fcfbf8]'
                      }`}
                    >
                      <PlatformIcon platformId={plat.id} size={16} />
                      <div>
                        <div className="font-bold">{plat.name}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-[#d4d4d8]' : 'text-[#52525b]'
                          }`}
                        >
                          {plat.description.substring(0, 40)}...
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-mono font-bold text-base text-[#0f0f11]">
                  Top Matched AI Skills & Workflows
                </h4>
                <p className="text-xs text-[#52525b] mt-1">
                  Hand-picked based on your specific job requirement and platform.
                </p>
              </div>

              {recommendations.length === 0 ? (
                <div className="p-6 bg-[#fcfbf8] border border-[#0f0f11] text-center space-y-2">
                  <p className="font-mono text-xs text-[#0f0f11] font-bold">
                    No exact combination found for this strict filter.
                  </p>
                  <button
                    onClick={resetFinder}
                    className="patter-btn patter-btn-peach text-xs font-mono py-1 px-3"
                  >
                    Reset and explore all skills
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 border border-[#0f0f11] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#f7f6f0] border border-[#e5e4dc]">
                            {rec.resourceType.toUpperCase()}
                          </span>
                          <span className="font-mono font-bold text-sm text-[#0f0f11]">
                            {rec.name}
                          </span>
                        </div>
                        <p className="text-xs text-[#52525b] mt-1 line-clamp-1">{rec.tagline}</p>
                      </div>

                      <Link
                        href={`/ai-upscale/${rec.slug}`}
                        onClick={onClose}
                        className="patter-btn patter-btn-peach text-xs font-mono font-bold py-1.5 px-3 whitespace-nowrap inline-flex items-center gap-1 shrink-0"
                      >
                        <span>VIEW GUIDE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-[#0f0f11] bg-[#fcfbf8] p-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="patter-btn px-3 py-1.5 text-xs font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              disabled={step === 1 && !selectedGoal}
              onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
              className={`patter-btn patter-btn-peach px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 ${
                step === 1 && !selectedGoal ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={resetFinder}
              className="text-xs font-mono text-[#52525b] hover:text-[#0f0f11] underline cursor-pointer"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

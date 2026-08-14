'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AssessmentStage,
  ClientQuestion,
  ChoiceOption,
  DOMAINS,
  DIFFICULTY_LABELS,
} from '@/lib/types/assessment';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MoveUp,
  MoveDown,
  Sparkles,
  Zap,
  Info,
  CornerDownLeft,
} from 'lucide-react';

interface QuestionArenaProps {
  question: ClientQuestion;
  stage: AssessmentStage;
  questionNumber: number;
  totalQuestions: number;
  estimatedConfidence: number;
  challengeOrigin?: {
    challengerHandle: string;
    challengerScore: number;
  };
  onSubmitAnswer: (userAnswer: string | string[], timeSpentMs: number) => Promise<void>;
  isSubmitting: boolean;
}

export function QuestionArena({
  question,
  stage,
  questionNumber,
  totalQuestions,
  estimatedConfidence,
  challengeOrigin,
  onSubmitAnswer,
  isSubmitting,
}: QuestionArenaProps) {
  const [startTime] = useState<number>(() => Date.now());
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [orderedItems, setOrderedItems] = useState<{ id: string; label: string; detail?: string }[]>(() => {
    if (question.itemsToOrder && question.itemsToOrder.length > 0) {
      return [...question.itemsToOrder].sort(() => Math.random() - 0.5);
    }
    return [];
  });
  const [rewriteText, setRewriteText] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(() => question.estimatedSeconds || 60);

  // Countdown timer for diagnostic pace
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const domainMeta = DOMAINS[question.domain] || DOMAINS.conversion_copywriting;

  // Move item up in ranking/sequence
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...orderedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setOrderedItems(newItems);
  };

  // Move item down in ranking/sequence
  const handleMoveDown = (index: number) => {
    if (index === orderedItems.length - 1) return;
    const newItems = [...orderedItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setOrderedItems(newItems);
  };

  // Toggle multiple selection
  const handleToggleMultiple = (id: string) => {
    setSelectedMultiple((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle final submission
  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    const timeSpentMs = Date.now() - startTime;

    if (question.type === 'ranking' || question.type === 'sequence') {
      const orderIds = orderedItems.map((item) => item.id);
      onSubmitAnswer(orderIds, timeSpentMs);
    } else if (question.type === 'multiple_selection') {
      if (selectedMultiple.length === 0) return;
      onSubmitAnswer(selectedMultiple, timeSpentMs);
    } else if (question.type === 'rewrite_constraint') {
      if (!rewriteText.trim()) return;
      onSubmitAnswer(rewriteText.trim(), timeSpentMs);
    } else {
      if (!selectedSingle) return;
      onSubmitAnswer(selectedSingle, timeSpentMs);
    }
  }, [
    isSubmitting,
    startTime,
    question.type,
    orderedItems,
    selectedMultiple,
    rewriteText,
    selectedSingle,
    onSubmitAnswer,
  ]);

  // Keyboard shortcut listeners (1, 2, 3, 4, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (question.options && question.options.length > 0) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= question.options.length) {
          e.preventDefault();
          const option = question.options[num - 1];
          if (question.type === 'multiple_selection') {
            handleToggleMultiple(option.id);
          } else {
            setSelectedSingle(option.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.options, question.type, handleSubmit]);

  const canSubmit =
    (question.type === 'ranking' || question.type === 'sequence') ||
    (question.type === 'multiple_selection' && selectedMultiple.length > 0) ||
    (question.type === 'rewrite_constraint' && rewriteText.trim().length > 5) ||
    (selectedSingle !== null);

  const wordCount = rewriteText.trim().split(/\s+/).filter(Boolean).length;
  const maxWords = question.context?.maxWords || 15;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Top Telemetry & Stage Tracker */}
      <div className="patter-card bg-white p-3 sm:p-4 mb-5 shadow-[3px_3px_0px_#0f0f11]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Stage badge */}
          <div className="flex items-center gap-2">
            <span className="patter-pill bg-[#0f0f11] text-white">
              STAGE: {stage.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-[#52525b]">
              Question <strong className="text-[#0f0f11]">{questionNumber}</strong> of {totalQuestions}
            </span>
          </div>

          {/* Challenger indicator if active */}
          {challengeOrigin && (
            <div className="patter-pill bg-[#fcf4ee] text-[#0f0f11] border-[#df9367]">
              <Zap className="w-3 h-3 text-[#df9367]" />
              <span>VS {challengeOrigin.challengerHandle} ({challengeOrigin.challengerScore} pts)</span>
            </div>
          )}

          {/* Model confidence meter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#52525b] hidden sm:inline">Diagnostic Confidence:</span>
            <div className="w-16 sm:w-24 h-2.5 bg-[#eeece4] border border-[#0f0f11] overflow-hidden">
              <div
                className="h-full bg-[#df9367] transition-all duration-500"
                style={{ width: `${estimatedConfidence}%` }}
              />
            </div>
            <span className="font-bold text-[#0f0f11]">{estimatedConfidence}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#eeece4] border border-[#0f0f11] relative overflow-hidden">
          <div
            className="h-full bg-[#0f0f11] transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="patter-card bg-white p-4 sm:p-6 mb-5 shadow-[4px_4px_0px_#0f0f11]">
        {/* Question Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#0f0f11] pb-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Domain Pill */}
            <span
              className="patter-pill text-white"
              style={{ backgroundColor: domainMeta.color }}
            >
              {domainMeta.shortName}
            </span>

            {/* Code */}
            <span className="patter-pill bg-[#eeece4] text-[#0f0f11]">
              {question.code}
            </span>

            {/* Subskill */}
            <span className="text-xs font-mono font-medium text-[#52525b] hidden xs:inline">
              {question.subskill}
            </span>
          </div>

          {/* Difficulty and Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono">
              <span className="text-[#52525b] hidden sm:inline">Difficulty:</span>
              <span className="font-bold text-[#0f0f11]">
                {DIFFICULTY_LABELS[question.difficulty]}
              </span>
              <span className="text-[#df9367] font-bold">
                {'●'.repeat(question.difficulty)}
                <span className="text-[#d3d0c5]">{'○'.repeat(5 - question.difficulty)}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs text-[#52525b]">
              <Clock className="w-3.5 h-3.5 text-[#0f0f11]" />
              <span className="font-bold text-[#0f0f11]">{timeRemaining}s</span>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0f0f11] mb-4 leading-snug">
          {question.prompt}
        </h2>

        {/* Scenario Context Card (if present) */}
        {question.context && (
          <div className="border-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-3 sm:p-4 mb-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-[#df9367]" />
              <span>Assessment Context & Signals</span>
            </div>

            {question.context.targetAudience && (
              <div className="text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-4 gap-1">
                <span className="font-mono text-[#52525b]">Target Audience:</span>
                <span className="sm:col-span-3 font-semibold text-[#0f0f11]">
                  {question.context.targetAudience}
                </span>
              </div>
            )}

            {question.context.awarenessStage && (
              <div className="text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-4 gap-1">
                <span className="font-mono text-[#52525b]">Awareness Stage:</span>
                <span className="sm:col-span-3 font-semibold text-[#0f0f11]">
                  {question.context.awarenessStage}
                </span>
              </div>
            )}

            {question.context.trafficSource && (
              <div className="text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-4 gap-1">
                <span className="font-mono text-[#52525b]">Traffic Source:</span>
                <span className="sm:col-span-3 text-[#0f0f11]">
                  {question.context.trafficSource}
                </span>
              </div>
            )}

            {question.context.currentMetrics && (
              <div className="pt-1.5 border-t border-[#eeece4] flex flex-wrap gap-3 font-mono text-xs">
                {Object.entries(question.context.currentMetrics).map(([key, val]) => (
                  <span key={key} className="bg-[#eeece4] px-2 py-0.5 border border-[#0f0f11]">
                    {key}: <strong className="text-[#0f0f11]">{val}</strong>
                  </span>
                ))}
              </div>
            )}

            {question.context.copySnippet && (
              <div className="p-2.5 bg-[#ffffff] border-[1.5px] border-[#0f0f11] font-mono text-xs sm:text-sm whitespace-pre-wrap text-[#0f0f11]">
                {question.context.copySnippet}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Interaction Modes */}

        {/* MODE A: Single Choice, Copy Diagnosis, Variant, Scenario, Pressure Test */}
        {(question.type === 'single_choice' ||
          question.type === 'copy_diagnosis' ||
          question.type === 'variant_selection' ||
          question.type === 'scenario_decision' ||
          question.type === 'pressure_test' ||
          question.type === 'cro_diagnosis') &&
          question.options && (
            <div className="space-y-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedSingle === option.id;
                const shortcutNum = idx + 1;

                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedSingle(option.id)}
                    className={`w-full text-left p-3 sm:p-4 border-[1.5px] transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#0f0f11] bg-[#fcf4ee] shadow-[3px_3px_0px_#0f0f11] translate-x-0.5 translate-y-0.5'
                        : 'border-[#0f0f11] bg-white hover:bg-[#faf9f6] shadow-[2px_2px_0px_#0f0f11]'
                    }`}
                  >
                    {/* Shortcut Badge */}
                    <span
                      className={`h-6 w-6 shrink-0 flex items-center justify-center font-mono text-xs font-bold border ${
                        isSelected
                          ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                          : 'bg-[#eeece4] text-[#0f0f11] border-[#0f0f11]'
                      }`}
                    >
                      {shortcutNum}
                    </span>

                    {/* Option Text */}
                    <div className="grow">
                      <p className="text-sm sm:text-base text-[#0f0f11] font-medium leading-relaxed">
                        {option.text}
                      </p>
                      {option.annotation && (
                        <p className="text-xs font-mono text-[#52525b] mt-1">
                          {option.annotation}
                        </p>
                      )}
                    </div>

                    {/* Check indicator */}
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#df9367] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

        {/* MODE B: Multiple Selection */}
        {question.type === 'multiple_selection' && question.options && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#52525b] mb-1">
              <span>Select all that apply:</span>
              <span>Selected: <strong>{selectedMultiple.length}</strong></span>
            </div>
            {question.options.map((option, idx) => {
              const isSelected = selectedMultiple.includes(option.id);
              const shortcutNum = idx + 1;

              return (
                <button
                  key={option.id}
                  onClick={() => handleToggleMultiple(option.id)}
                  className={`w-full text-left p-3 sm:p-4 border-[1.5px] transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#0f0f11] bg-[#fcf4ee] shadow-[3px_3px_0px_#0f0f11]'
                      : 'border-[#0f0f11] bg-white hover:bg-[#faf9f6] shadow-[2px_2px_0px_#0f0f11]'
                  }`}
                >
                  <span
                    className={`h-6 w-6 shrink-0 flex items-center justify-center font-mono text-xs font-bold border ${
                      isSelected
                        ? 'bg-[#df9367] text-[#0f0f11] border-[#0f0f11]'
                        : 'bg-[#eeece4] text-[#0f0f11] border-[#0f0f11]'
                    }`}
                  >
                    {shortcutNum}
                  </span>
                  <div className="grow">
                    <p className="text-sm sm:text-base text-[#0f0f11] font-medium leading-relaxed">
                      {option.text}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 border-[1.5px] border-[#0f0f11] flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0f0f11]' : 'bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* MODE C: Ranking & Sequence Ordering */}
        {(question.type === 'ranking' || question.type === 'sequence') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#52525b] mb-1">
              <span>Arrange from HIGHEST priority (top) to LOWEST (bottom):</span>
              <span>Use arrows to reorder</span>
            </div>
            {orderedItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 sm:p-4 border-[1.5px] border-[#0f0f11] bg-white shadow-[2px_2px_0px_#0f0f11] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 grow">
                  <span className="h-7 w-7 shrink-0 bg-[#0f0f11] text-white font-mono font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-sm sm:text-base text-[#0f0f11]">{item.label}</p>
                    {item.detail && (
                      <p className="text-xs text-[#52525b] mt-0.5">{item.detail}</p>
                    )}
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="patter-btn p-1.5 bg-[#eeece4] disabled:opacity-30"
                    title="Move up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === orderedItems.length - 1}
                    className="patter-btn p-1.5 bg-[#eeece4] disabled:opacity-30"
                    title="Move down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE D: Rewrite under constraints */}
        {question.type === 'rewrite_constraint' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#52525b]">
              <span>Compose rewrite meeting all constraints:</span>
              <span className={wordCount > maxWords ? 'text-red-600 font-bold' : 'text-[#0f0f11]'}>
                Words: {wordCount} / {maxWords} max
              </span>
            </div>
            <textarea
              value={rewriteText}
              onChange={(e) => setRewriteText(e.target.value)}
              rows={4}
              placeholder="Type your strategic copy rewrite here..."
              className="w-full p-3 border-[1.5px] border-[#0f0f11] bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#df9367]"
            />
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="patter-card bg-white p-3 sm:p-4 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#0f0f11]">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#52525b]">
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>Press [Enter] or click button to confirm decision</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`patter-btn patter-btn-peach px-5 sm:px-8 py-2.5 text-sm sm:text-base font-mono font-bold tracking-tight ml-auto ${
            !canSubmit || isSubmitting ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⟳</span>
              <span>Evaluating Decision...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Lock Decision</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

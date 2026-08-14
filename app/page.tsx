'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/assessment/Navbar';
import { LandingHero } from '@/components/assessment/LandingHero';
import { QuestionArena } from '@/components/assessment/QuestionArena';
import { ResultReveal } from '@/components/assessment/ResultReveal';
import { ResultsDashboard } from '@/components/assessment/ResultsDashboard';
import { LeaderboardView } from '@/components/assessment/LeaderboardView';
import { ChallengeView } from '@/components/assessment/ChallengeView';
import { MethodologyModal } from '@/components/assessment/MethodologyModal';
import { CreativePricing } from '@/components/pricing/CreativePricing';
import {
  AssessmentStage,
  ClientQuestion,
  FinalAssessmentScore,
} from '@/lib/types/assessment';

const LOCAL_STORAGE_SESSION_KEY = 'copyscore_active_session_v1';
const LOCAL_STORAGE_SCORE_KEY = 'copyscore_last_score_v1';

export default function Home() {
  const [currentView, setCurrentView] = useState<
    'landing' | 'assessment' | 'reveal' | 'results' | 'leaderboard' | 'challenge' | 'pricing'
  >(() => {
    if (typeof window === 'undefined') return 'landing';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('challenge')) return 'challenge';
      if (searchParams.get('view') === 'leaderboard') return 'leaderboard';
      if (searchParams.get('view') === 'pricing') return 'pricing';
    } catch {
      // Ignore
    }
    return 'landing';
  });
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // Active Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(null);
  const [currentStage, setCurrentStage] = useState<AssessmentStage>('CALIBRATION');
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [estimatedConfidence, setEstimatedConfidence] = useState<number>(45);
  const [challengeOrigin, setChallengeOrigin] = useState<{
    challengerHandle: string;
    challengerScore: number;
    challengeCode: string;
  } | undefined>(undefined);

  // Results State
  const [finalScore, setFinalScore] = useState<FinalAssessmentScore | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedScore = localStorage.getItem(LOCAL_STORAGE_SCORE_KEY);
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        if (parsed.overallScore) return parsed;
      }
    } catch {
      // Ignore localStorage error
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Challenge Code to view
  const [viewingChallengeCode, setViewingChallengeCode] = useState<string>(() => {
    if (typeof window === 'undefined') return 'mamdouh';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('challenge');
      if (code) return code;
    } catch {
      // Ignore
    }
    return 'mamdouh';
  });

  // Handler: Start new assessment
  const handleStartAssessment = async (challengeCode?: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeCode }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        setSessionId(data.sessionId);
        setCurrentQuestion(data.question);
        setCurrentStage(data.stage);
        setQuestionNumber(data.questionNumber || 1);
        setTotalQuestions(data.totalEstimatedQuestions || 10);
        setEstimatedConfidence(data.estimatedConfidence || 45);
        setChallengeOrigin(data.challengeOrigin);
        setCurrentView('assessment');

        // Save session ID locally
        localStorage.setItem(
          LOCAL_STORAGE_SESSION_KEY,
          JSON.stringify({ sessionId: data.sessionId, challengeOrigin: data.challengeOrigin })
        );
      }
    } catch (err) {
      console.error('Failed to start assessment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Submit Question Answer
  const handleSubmitAnswer = async (userAnswer: string | string[], timeSpentMs: number) => {
    if (!sessionId || !currentQuestion) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/assessment/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          userAnswer,
          timeSpentMs,
        }),
      });

      const data = await res.json();

      if (data.isCompleted) {
        // Finalize assessment on server
        await handleFinalizeScore(sessionId);
      } else if (data.question) {
        setCurrentQuestion(data.question);
        setCurrentStage(data.stage);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalEstimatedQuestions);
        setEstimatedConfidence(data.estimatedConfidence);
      }
    } catch (err) {
      console.error('Error advancing assessment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Finalize Score
  const handleFinalizeScore = async (activeSessionId: string) => {
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSessionId }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setFinalScore(data.result);
        localStorage.setItem(LOCAL_STORAGE_SCORE_KEY, JSON.stringify(data.result));
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        setCurrentView('reveal');
      }
    } catch (err) {
      console.error('Error finalizing score', err);
    }
  };

  // Handler: Retake
  const handleRetake = () => {
    setSessionId(null);
    setCurrentQuestion(null);
    handleStartAssessment();
  };

  // Handler: Open Challenge
  const handleChallengeUser = (handle: string) => {
    setViewingChallengeCode(handle);
    setCurrentView('challenge');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'assessment') {
            if (sessionId && currentQuestion) {
              setCurrentView('assessment');
            } else {
              handleStartAssessment();
            }
          } else {
            setCurrentView(view);
          }
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        hasActiveSession={!!(sessionId && currentQuestion && currentView !== 'assessment')}
      />

      {/* Main Content Area */}
      <main className="grow">
        {/* VIEW 1: LANDING */}
        {currentView === 'landing' && (
          <LandingHero
            onStartAssessment={() => handleStartAssessment()}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
            onOpenPricing={() => setCurrentView('pricing')}
          />
        )}

        {/* VIEW 2: ACTIVE QUESTION ARENA */}
        {currentView === 'assessment' && currentQuestion && (
          <QuestionArena
            key={currentQuestion.id}
            question={currentQuestion}
            stage={currentStage}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            estimatedConfidence={estimatedConfidence}
            challengeOrigin={challengeOrigin}
            onSubmitAnswer={handleSubmitAnswer}
            isSubmitting={isSubmitting}
          />
        )}

        {/* VIEW 3: RESULT REVEAL SEQUENCE */}
        {currentView === 'reveal' && finalScore && (
          <ResultReveal
            score={finalScore}
            onFinishReveal={() => setCurrentView('results')}
          />
        )}

        {/* VIEW 4: RESULTS DASHBOARD */}
        {currentView === 'results' && finalScore && (
          <ResultsDashboard
            score={finalScore}
            onRetake={handleRetake}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
            onOpenChallenge={handleChallengeUser}
            onOpenPricing={() => setCurrentView('pricing')}
          />
        )}

        {/* VIEW 5: LEADERBOARD */}
        {currentView === 'leaderboard' && (
          <LeaderboardView
            onStartAssessment={() => handleStartAssessment()}
            onChallengeUser={handleChallengeUser}
          />
        )}

        {/* VIEW 6: HEAD-TO-HEAD CHALLENGE DUEL */}
        {currentView === 'challenge' && (
          <ChallengeView
            challengeCode={viewingChallengeCode}
            onAcceptChallenge={(code) => handleStartAssessment(code)}
            userCompletedScore={finalScore || undefined}
          />
        )}

        {/* VIEW 7: PRICING & PROGRESSION MATRIX */}
        {currentView === 'pricing' && (
          <div className="bg-[#f7f6f0] patter-dot-grid min-h-[calc(100vh-8rem)]">
            <CreativePricing
              onStartAssessment={() => handleStartAssessment()}
              onViewScore={() => {
                if (finalScore) setCurrentView('results');
                else handleStartAssessment();
              }}
              hasCompletedAssessment={!!finalScore}
              userScore={finalScore?.overallScore}
            />
          </div>
        )}
      </main>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t-[1.5px] border-[#0f0f11] bg-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#52525b]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#df9367]" />
            <span className="font-bold text-[#0f0f11]">COPYSCORE</span>
            <span>— The Adaptive Assessment Standard for Commercial Copy</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentView('pricing')}
              className="hover:text-[#0f0f11] underline cursor-pointer font-bold text-[#0f0f11]"
            >
              Pricing & Plans
            </button>
            <span>•</span>
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-[#0f0f11] underline cursor-pointer"
            >
              Psychometric Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="hover:text-[#0f0f11] underline cursor-pointer"
            >
              Verified Rankings
            </button>
            <span>•</span>
            <span>Version 1.4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

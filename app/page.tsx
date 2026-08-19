'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavViewType } from '@/components/assessment/Navbar';
import { LandingHero } from '@/components/assessment/LandingHero';
import { QuestionArena } from '@/components/assessment/QuestionArena';
import { ResultReveal } from '@/components/assessment/ResultReveal';
import { ResultsDashboard } from '@/components/assessment/ResultsDashboard';
import { LeaderboardView } from '@/components/assessment/LeaderboardView';
import { ChallengeView } from '@/components/assessment/ChallengeView';
import { CreativePricing } from '@/components/pricing/CreativePricing';
import { MethodologyModal } from '@/components/assessment/MethodologyModal';
import {
  AssessmentStage,
  ClientQuestion,
  FinalAssessmentScore,
} from '@/lib/types/assessment';

const LOCAL_STORAGE_SESSION_KEY = 'copyscore_active_session_v1';
const LOCAL_STORAGE_SCORE_KEY = 'copyscore_last_score_v1';

export default function Home() {
  const [currentView, setCurrentView] = useState<NavViewType>(() => {
    if (typeof window === 'undefined') return 'landing';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('challenge')) return 'challenge';
      if (searchParams.get('view') === 'leaderboard') return 'leaderboard';
      if (searchParams.get('view') === 'pricing') return 'pricing';
      if (searchParams.get('view') === 'challenge') return 'challenge';
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

  // Switch view with smooth URL state sync (no full reload)
  const navigateToView = useCallback((view: 'landing' | 'assessment' | 'leaderboard' | 'challenge' | 'pricing' | 'results' | 'reveal') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (view === 'landing') {
          url.searchParams.delete('view');
          url.searchParams.delete('challenge');
        } else if (view === 'leaderboard' || view === 'pricing' || view === 'challenge') {
          url.searchParams.set('view', view);
        }
        window.history.pushState({ view }, '', url.toString());
      } catch {
        // ignore
      }
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const viewParam = searchParams.get('view');
        if (viewParam === 'leaderboard' || viewParam === 'pricing' || viewParam === 'challenge') {
          setCurrentView(viewParam as NavViewType);
        } else if (searchParams.get('challenge')) {
          setCurrentView('challenge');
        } else {
          setCurrentView('landing');
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Handler: Finalize Score
  const handleFinalizeScore = useCallback(async (activeSessionId: string) => {
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSessionId }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setFinalScore(data.result);
        setSessionId(null);
        setCurrentQuestion(null);
        localStorage.setItem(LOCAL_STORAGE_SCORE_KEY, JSON.stringify(data.result));
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        setCurrentView('reveal');
      }
    } catch (err) {
      console.error('Error finalizing score', err);
    }
  }, []);

  // Recover an active server-owned assessment after refresh, process restart, or
  // a crash between the last answer and score finalization.
  useEffect(() => {
    let cancelled = false;

    const recoverSession = async () => {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (!raw) return;

      let activeSessionId: string | undefined;
      try {
        const saved = JSON.parse(raw) as { sessionId?: string };
        activeSessionId = saved.sessionId;
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        return;
      }

      if (!activeSessionId) {
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
        return;
      }

      try {
        const res = await fetch(
          `/api/assessment/session?sessionId=${encodeURIComponent(activeSessionId)}`,
          { cache: 'no-store' }
        );

        if ([403, 404, 410].includes(res.status)) {
          localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
          return;
        }
        if (!res.ok) return;

        const data = await res.json();
        if (cancelled || !data?.success) return;

        if (data.isCompleted && data.result) {
          setFinalScore(data.result);
          setSessionId(null);
          setCurrentQuestion(null);
          localStorage.setItem(LOCAL_STORAGE_SCORE_KEY, JSON.stringify(data.result));
          localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
          setCurrentView('results');
          return;
        }

        if (data.readyForFinalization) {
          setSessionId(activeSessionId);
          await handleFinalizeScore(activeSessionId);
          return;
        }

        if (data.question) {
          setSessionId(activeSessionId);
          setCurrentQuestion(data.question);
          setCurrentStage(data.stage);
          setQuestionNumber(data.questionNumber || 1);
          setTotalQuestions(data.totalEstimatedQuestions || 10);
          setEstimatedConfidence(data.estimatedConfidence || 45);
          setChallengeOrigin(data.challengeOrigin);

          const searchParams = new URLSearchParams(window.location.search);
          const hasExplicitDestination =
            !!searchParams.get('challenge') || !!searchParams.get('view');
          if (!hasExplicitDestination) {
            setCurrentView('assessment');
          }
        }
      } catch (err) {
        console.error('Failed to recover assessment session', err);
      }
    };

    void recoverSession();
    return () => {
      cancelled = true;
    };
  }, [handleFinalizeScore]);

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

  // Handler: Retake
  const handleRetake = () => {
    setSessionId(null);
    setCurrentQuestion(null);
    handleStartAssessment();
  };

  // Handler: Open Challenge
  const handleChallengeUser = (handle: string) => {
    setViewingChallengeCode(handle);
    navigateToView('challenge');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
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
            navigateToView(view);
          }
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        hasActiveSession={!!(sessionId && currentQuestion && currentView !== 'assessment')}
      />

      <main className="grow">
        {currentView === 'landing' && (
          <LandingHero
            onStartAssessment={() => handleStartAssessment()}
            onViewLeaderboard={() => navigateToView('leaderboard')}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
            onOpenPricing={() => navigateToView('pricing')}
          />
        )}

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

        {currentView === 'reveal' && finalScore && (
          <ResultReveal
            score={finalScore}
            onFinishReveal={() => setCurrentView('results')}
          />
        )}

        {currentView === 'results' && finalScore && (
          <ResultsDashboard
            score={finalScore}
            onRetake={handleRetake}
            onViewLeaderboard={() => navigateToView('leaderboard')}
            onOpenChallenge={handleChallengeUser}
            onOpenPricing={() => navigateToView('pricing')}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            onStartAssessment={() => handleStartAssessment()}
            onChallengeUser={handleChallengeUser}
          />
        )}

        {currentView === 'challenge' && (
          <ChallengeView
            challengeCode={viewingChallengeCode}
            onAcceptChallenge={(code) => handleStartAssessment(code)}
            userCompletedScore={finalScore || undefined}
          />
        )}

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

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <footer className="border-t-[1.5px] border-[#0f0f11] bg-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#52525b]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#df9367]" />
            <span className="font-bold text-[#0f0f11]">COPYSCORE</span>
            <span>The Adaptive Assessment Standard for Commercial Copy</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigateToView('pricing')}
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
              onClick={() => navigateToView('leaderboard')}
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

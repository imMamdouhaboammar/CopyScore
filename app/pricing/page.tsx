'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/assessment/Navbar';
import { CreativePricing } from '@/components/pricing/CreativePricing';
import { MethodologyModal } from '@/components/assessment/MethodologyModal';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [userScore] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedScore = localStorage.getItem('copyscore_last_score_v1');
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        if (parsed.overallScore) {
          return parsed.overallScore;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  });

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] flex flex-col font-sans patter-dot-grid">
      <Navbar
        currentView="pricing"
        onNavigate={(view) => {
          if (view === 'pricing') return;
          if (view === 'leaderboard') {
            router.push('/leaderboard');
          } else if (view === 'challenge') {
            router.push('/beat/mamdouh');
          } else {
            router.push('/');
          }
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <main className="flex-1">
        <CreativePricing
          onStartAssessment={() => router.push('/')}
          onViewScore={() => router.push('/')}
          hasCompletedAssessment={userScore !== null}
          userScore={userScore}
        />
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
            <span>— The Adaptive Assessment Standard for Commercial Copy</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-[#0f0f11] underline cursor-pointer"
            >
              Psychometric Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => router.push('/leaderboard')}
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

'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/assessment/Navbar';
import { LeaderboardView } from '@/components/assessment/LeaderboardView';
import { MethodologyModal } from '@/components/assessment/MethodologyModal';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const router = useRouter();
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const handleStartAssessment = () => {
    router.push('/?action=start');
  };

  const handleChallengeUser = (handle: string) => {
    router.push(`/beat/${handle}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#0f0f11] flex flex-col font-sans selection:bg-[#df9367] selection:text-[#0f0f11]">
      <Navbar
        currentView="leaderboard"
        onNavigate={(view) => {
          if (view === 'leaderboard') return;
          router.push('/');
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      <main className="flex-1">
        <LeaderboardView
          onStartAssessment={handleStartAssessment}
          onChallengeUser={handleChallengeUser}
        />
      </main>

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}

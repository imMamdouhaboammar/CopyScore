'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChallengeView } from '@/components/assessment/ChallengeView';
import { Navbar } from '@/components/assessment/Navbar';

export default function BeatChallengerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
      <Navbar
        currentView="challenge"
        onNavigate={(view) => {
          if (view === 'landing') router.push('/');
          else if (view === 'assessment') router.push('/');
          else if (view === 'leaderboard') router.push('/');
        }}
        onOpenMethodology={() => {}}
      />
      <main className="grow">
        <ChallengeView
          challengeCode={id}
          onAcceptChallenge={(code) => {
            router.push(`/?challenge=${encodeURIComponent(code)}`);
          }}
        />
      </main>
    </div>
  );
}

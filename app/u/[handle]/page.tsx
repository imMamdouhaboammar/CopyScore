'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/assessment/Navbar';
import { ResultsDashboard } from '@/components/assessment/ResultsDashboard';
import { FinalAssessmentScore } from '@/lib/types/assessment';

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const router = useRouter();
  const [profileScore, setProfileScore] = useState<FinalAssessmentScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/${handle}`);
        const data = await res.json();
        if (data.profile?.bestScore) {
          setProfileScore(data.profile.bestScore);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [handle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
      <Navbar
        currentView="profile"
        onNavigate={(view) => {
          if (view === 'landing') router.push('/');
          else if (view === 'assessment') router.push('/');
          else if (view === 'leaderboard') router.push('/leaderboard');
          else if (view === 'pricing') router.push('/pricing');
          else router.push('/');
        }}
        onOpenMethodology={() => {}}
      />
      <main className="grow">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className="font-mono text-sm text-[#0f0f11] flex items-center gap-2">
              <span className="animate-spin">⟳</span>
              <span>Loading Public Benchmark Profile...</span>
            </div>
          </div>
        ) : profileScore ? (
          <ResultsDashboard
            score={profileScore}
            onRetake={() => router.push('/')}
            onViewLeaderboard={() => router.push('/')}
            onOpenChallenge={(chCode) => router.push(`/beat/${chCode}`)}
          />
        ) : (
          <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
            <div className="patter-card bg-white p-8 shadow-[4px_4px_0px_#0f0f11]">
              <h2 className="font-mono font-bold text-xl text-[#0f0f11]">Writer Profile Not Found</h2>
              <p className="text-xs font-mono text-[#52525b] mt-2">
                No verified benchmark score found for @{handle}.
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 patter-btn patter-btn-peach px-6 py-2 text-xs font-mono font-bold"
              >
                Take the Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

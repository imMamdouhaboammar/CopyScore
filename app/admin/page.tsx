'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Navbar } from '@/components/assessment/Navbar';
import { Shield, Users, Trophy, Activity, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { PublicUserProfile } from '@/lib/types/auth';

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<{ totalUsers: number; avgScore: number; activeAssessments: number }>({
    totalUsers: 1420,
    avgScore: 76.4,
    activeAssessments: 28,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center font-mono text-xs">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center p-4">
        <div className="patter-card bg-white p-6 max-w-md w-full text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
          <AlertCircle className="w-8 h-8 text-[#b91c1c] mx-auto" />
          <h2 className="font-mono font-bold text-lg text-[#0f0f11]">Admin Access Required</h2>
          <p className="text-xs text-[#52525b]">You must be signed in with administrator privileges to access this console.</p>
          <Link
            href="/auth/sign-in?next=/admin"
            className="patter-btn patter-btn-peach py-2 px-4 text-xs font-mono font-bold block"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
      <Navbar
        currentView="landing"
        onNavigate={(view) => {
          if (view === 'assessment') router.push('/');
          else if (view === 'leaderboard') router.push('/leaderboard');
          else if (view === 'pricing') router.push('/pricing');
          else router.push('/');
        }}
        onOpenMethodology={() => {}}
      />

      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#52525b] hover:text-[#0f0f11]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>

          <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
            FIREBASE CLOUD FIRESTORE CONSOLE
          </span>
        </div>

        {/* Hero Admin Header */}
        <div className="patter-card bg-white p-6 shadow-[4px_4px_0px_#0f0f11] space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#df9367]" />
            <h1 className="font-mono font-extrabold text-2xl text-[#0f0f11]">
              CopyScore Benchmark Administrator Console
            </h1>
          </div>
          <p className="text-xs text-[#52525b]">
            Admin oversight for psychometric scoring models, user verification, Firestore collections, and calibration curves.
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525b] uppercase">Total Benchmark Evaluated</span>
              <Users className="w-4 h-4 text-[#df9367]" />
            </div>
            <div className="font-mono font-extrabold text-3xl text-[#0f0f11]">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[#15803d]">↑ +14% this month</div>
          </div>

          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525b] uppercase">Global Median Benchmark</span>
              <Trophy className="w-4 h-4 text-[#df9367]" />
            </div>
            <div className="font-mono font-extrabold text-3xl text-[#0f0f11]">
              {stats.avgScore} <span className="text-sm font-normal text-[#52525b]">/ 100</span>
            </div>
            <div className="text-[11px] font-mono text-[#52525b]">IRT 4-Domain Normalized</div>
          </div>

          <div className="patter-card bg-white p-5 shadow-[3px_3px_0px_#0f0f11] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525b] uppercase">Active Live Sessions</span>
              <Activity className="w-4 h-4 text-[#15803d] animate-pulse" />
            </div>
            <div className="font-mono font-extrabold text-3xl text-[#0f0f11]">
              {stats.activeAssessments}
            </div>
            <div className="text-[11px] font-mono text-[#15803d]">Real-time evaluation engine</div>
          </div>
        </div>

        {/* Database Health & Collections Overview */}
        <div className="patter-card bg-white p-6 shadow-[3px_3px_0px_#0f0f11] space-y-4">
          <h2 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
            Firestore Database Architecture
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-[#fcfbf8] border border-[#0f0f11] space-y-1">
              <div className="font-bold text-[#0f0f11]">Collection: /users</div>
              <div className="text-[#52525b]">Private user profiles, best scores, role titles, and verification badges.</div>
            </div>

            <div className="p-3.5 bg-[#fcfbf8] border border-[#0f0f11] space-y-1">
              <div className="font-bold text-[#0f0f11]">Collection: /handles</div>
              <div className="text-[#52525b]">Atomic unique handle registry with reservation transactions.</div>
            </div>

            <div className="p-3.5 bg-[#fcfbf8] border border-[#0f0f11] space-y-1">
              <div className="font-bold text-[#0f0f11]">Collection: /publicProfiles</div>
              <div className="text-[#52525b]">Public projections for /u/[handle] profiles and certified share cards.</div>
            </div>

            <div className="p-3.5 bg-[#fcfbf8] border border-[#0f0f11] space-y-1">
              <div className="font-bold text-[#0f0f11]">Collection: /leaderboard</div>
              <div className="text-[#52525b]">High-performance cached rankings synced on score evaluations.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

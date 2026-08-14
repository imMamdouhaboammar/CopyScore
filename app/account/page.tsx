'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AccountNav } from '@/components/account/AccountNav';
import { Navbar } from '@/components/assessment/Navbar';
import {
  Trophy,
  ShieldCheck,
  Swords,
  ExternalLink,
  RotateCcw,
  Sparkles,
  User,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export default function AccountOverviewPage() {
  const router = useRouter();
  const { user, profile, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center font-mono text-xs">
        Loading Account Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex flex-col items-center justify-center p-4">
        <div className="patter-card bg-white p-8 max-w-md w-full text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
          <h2 className="font-mono font-bold text-lg text-[#0f0f11]">Authentication Required</h2>
          <p className="text-xs text-[#52525b]">Please sign in to view your account overview and scores.</p>
          <Link
            href="/auth/sign-in?next=/account"
            className="patter-btn patter-btn-peach py-2 px-4 text-xs font-mono font-bold block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const bestScore = profile?.bestScore;

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

      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Navigation */}
          <div className="md:col-span-4 lg:col-span-3">
            <AccountNav />
          </div>

          {/* Right Main Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Header */}
            <div className="patter-card bg-white p-6 shadow-[3px_3px_0px_#0f0f11] space-y-2">
              <div className="flex items-center justify-between">
                <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
                  WRITER DASHBOARD
                </span>
                <span className="text-xs font-mono text-[#52525b]">
                  UID: <span className="font-bold">{user?.uid.slice(0, 8)}...</span>
                </span>
              </div>
              <h1 className="font-mono font-extrabold text-2xl text-[#0f0f11]">
                Hello, {profile?.displayName || 'Writer'}
              </h1>
              <p className="text-xs sm:text-sm text-[#52525b]">
                Manage your verified benchmarks, public challenge profile, and security preferences.
              </p>
            </div>

            {/* Verified Benchmark Status Card */}
            {bestScore ? (
              <div className="patter-card bg-[#fcf4ee] p-6 shadow-[4px_4px_0px_#0f0f11] border-[1.5px] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0f0f11] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#15803d]" />
                    <h3 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
                      Active Verified Benchmark
                    </h3>
                  </div>
                  <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-xs font-bold">
                    {bestScore.archetype.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-white border border-[#0f0f11]">
                    <span className="text-[10px] font-mono text-[#52525b] uppercase block">
                      Overall Score
                    </span>
                    <span className="font-mono font-extrabold text-3xl text-[#0f0f11]">
                      {bestScore.overallScore}
                    </span>
                    <span className="text-xs font-mono text-[#52525b]"> / 100</span>
                  </div>

                  <div className="p-3 bg-white border border-[#0f0f11]">
                    <span className="text-[10px] font-mono text-[#52525b] uppercase block">
                      Percentile Rank
                    </span>
                    <span className="font-mono font-extrabold text-3xl text-[#0f0f11]">
                      Top {100 - bestScore.percentile}%
                    </span>
                    <span className="text-xs font-mono text-[#52525b]"> ({bestScore.percentile}th pct)</span>
                  </div>

                  <div className="p-3 bg-white border border-[#0f0f11]">
                    <span className="text-[10px] font-mono text-[#52525b] uppercase block">
                      Total Attempts
                    </span>
                    <span className="font-mono font-extrabold text-3xl text-[#0f0f11]">
                      {profile?.totalAttempts || 1}
                    </span>
                    <span className="text-xs font-mono text-[#52525b]"> evaluations</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Link
                    href={`/u/${profile?.handle || user?.uid}`}
                    className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Public Profile</span>
                    <ExternalLink className="w-3 h-3 text-[#52525b]" />
                  </Link>

                  <Link
                    href={`/beat/${profile?.handle || user?.uid}`}
                    className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <Swords className="w-3.5 h-3.5 text-[#df9367]" />
                    <span>Challenge URL</span>
                  </Link>

                  <Link
                    href="/"
                    className="patter-btn patter-btn-peach px-4 py-1.5 text-xs font-mono font-bold ml-auto flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Take Retake Assessment</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="patter-card bg-white p-6 shadow-[3px_3px_0px_#0f0f11] text-center space-y-4">
                <div className="h-12 w-12 bg-[#fcf4ee] border border-[#0f0f11] mx-auto flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#df9367]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono font-bold text-base text-[#0f0f11]">
                    No Benchmark Recorded Yet
                  </h3>
                  <p className="text-xs text-[#52525b] max-w-sm mx-auto">
                    Take the 10-minute adaptive copywriting & CRO assessment to establish your baseline benchmark.
                  </p>
                </div>
                <Link
                  href="/"
                  className="patter-btn patter-btn-peach px-6 py-2 text-xs font-mono font-bold inline-flex items-center gap-2"
                >
                  <span>Start Assessment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Account Checklist / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/account/profile"
                className="patter-card bg-white p-4 shadow-[2px_2px_0px_#0f0f11] hover:translate-x-0.5 hover:translate-y-0.5 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#0f0f11] uppercase tracking-wider">
                    Profile & Public Handle
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-[#df9367]" />
                </div>
                <p className="text-xs text-[#52525b]">
                  Set your custom <strong className="font-mono">@{profile?.handle}</strong>, bio, role title, and avatar.
                </p>
              </Link>

              <Link
                href="/account/security"
                className="patter-card bg-white p-4 shadow-[2px_2px_0px_#0f0f11] hover:translate-x-0.5 hover:translate-y-0.5 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#0f0f11] uppercase tracking-wider">
                    Security & Credentials
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-[#df9367]" />
                </div>
                <p className="text-xs text-[#52525b]">
                  Change password, manage linked OAuth providers, or delete account.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

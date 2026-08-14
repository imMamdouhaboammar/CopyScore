'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Trophy, Swords, BookOpen, ShieldCheck, User, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface NavbarProps {
  currentView: 'landing' | 'assessment' | 'reveal' | 'results' | 'leaderboard' | 'challenge' | 'profile' | 'pricing';
  onNavigate: (view: 'landing' | 'assessment' | 'leaderboard' | 'challenge' | 'pricing') => void;
  onOpenMethodology: () => void;
  hasActiveSession?: boolean;
}

export function Navbar({ currentView, onNavigate, onOpenMethodology, hasActiveSession }: NavbarProps) {
  const { user, profile, isAuthenticated, pendingGuestScore } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b-[1.5px] border-[#0f0f11] bg-[#f7f6f0]/95 backdrop-blur-xs">
      {/* Top telemetry bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1 bg-[#0f0f11] text-[#f7f6f0] text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#df9367] animate-pulse-subtle" />
            <span>ENGINE V1.4.2: ADAPTIVE</span>
          </span>
          <span className="text-[#8c8b85]">|</span>
          <span>CALIBRATION: IRT 4-DOMAIN</span>
        </div>
        <div className="flex items-center gap-4 text-[#d3d0c5]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#df9367]" />
            <span>SERVER-AUTHORITATIVE & FIREBASE BACKED</span>
          </span>
          <span className="text-[#8c8b85]">|</span>
          <span>LATENCY: 18ms</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="h-8 w-8 rounded-none border-[1.5px] border-[#0f0f11] bg-[#df9367] flex items-center justify-center shadow-[2px_2px_0px_#0f0f11] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#0f0f11] transition-all">
            <Target className="w-4 h-4 text-[#0f0f11]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold tracking-tight text-base sm:text-lg text-[#0f0f11]">
                COPY<span className="text-[#df9367]">SCORE</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 bg-[#0f0f11] text-[#f7f6f0] text-[9px] font-mono font-bold uppercase tracking-widest">
                BENCHMARK
              </span>
            </div>
            <p className="hidden md:block text-[10px] font-mono text-[#52525b] -mt-0.5">
              ADAPTIVE COPYWRITING & CRO ENGINE
            </p>
          </div>
        </button>

        {/* Center / Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('pricing')}
            className={`patter-btn px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium ${
              currentView === 'pricing'
                ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#0f0f11]'
                : 'bg-white text-[#0f0f11]'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#df9367] mr-1.5 hidden xs:inline-block" />
            <span>Pricing</span>
          </button>

          <button
            onClick={() => onNavigate('leaderboard')}
            className={`patter-btn px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium ${
              currentView === 'leaderboard'
                ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#0f0f11]'
                : 'bg-white text-[#0f0f11]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 mr-1.5 text-[#df9367]" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => onNavigate('challenge')}
            className={`hidden sm:inline-flex patter-btn px-3 py-1.5 text-xs font-mono font-medium ${
              currentView === 'challenge'
                ? 'bg-[#0f0f11] text-white shadow-[1px_1px_0px_#0f0f11]'
                : 'bg-white text-[#0f0f11]'
            }`}
          >
            <Swords className="w-3.5 h-3.5 mr-1.5 text-[#df9367]" />
            <span>Head-to-Head</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="hidden md:inline-flex patter-btn bg-[#fcfbf8] px-3 py-1.5 text-xs font-mono text-[#52525b] hover:text-[#0f0f11]"
            title="View psychometric and scoring methodology"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            <span>Methodology</span>
          </button>

          {/* Auth Button or Account Link */}
          {isAuthenticated ? (
            <Link
              href="/account"
              className="patter-btn bg-[#0f0f11] text-white px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-2 hover:bg-[#27272a] transition-colors"
            >
              <div className="h-4 w-4 bg-[#df9367] text-[#0f0f11] flex items-center justify-center text-[10px] font-extrabold">
                {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline-block max-w-[90px] truncate">
                {profile?.handle ? `@${profile.handle}` : profile?.displayName || 'Account'}
              </span>
            </Link>
          ) : pendingGuestScore ? (
            <Link
              href="/auth/sign-up"
              className="patter-btn bg-[#df9367] text-[#0f0f11] px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse-subtle shadow-[2px_2px_0px_#0f0f11]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Score ({pendingGuestScore.overallScore})</span>
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="patter-btn patter-btn-white px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#df9367]" />
              <span>Sign In</span>
            </Link>
          )}

          {currentView !== 'assessment' && (
            <button
              onClick={() => onNavigate('assessment')}
              className="patter-btn patter-btn-peach px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-mono font-bold tracking-tight"
            >
              {hasActiveSession ? 'Resume Assessment' : 'Take Assessment'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

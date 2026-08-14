'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';
import { FinalAssessmentScore } from '@/lib/types/assessment';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  guestScore?: FinalAssessmentScore | null;
  backHref?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  badgeText = 'BENCHMARK IDENTITY',
  guestScore,
  backHref = '/',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f7f6f0] patter-dot-grid text-[#0f0f11]">
      {/* Top bar */}
      <header className="px-4 sm:px-8 py-4 border-b-[1.5px] border-[#0f0f11] bg-white/90 backdrop-blur-xs flex items-center justify-between">
        <Link
          href={backHref}
          className="flex items-center gap-2 group text-xs font-mono font-bold text-[#0f0f11] hover:text-[#df9367] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Assessment</span>
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-none border-[1.5px] border-[#0f0f11] bg-[#df9367] flex items-center justify-center shadow-[1.5px_1.5px_0px_#0f0f11]">
            <Target className="w-3.5 h-3.5 text-[#0f0f11]" />
          </div>
          <span className="font-mono font-bold tracking-tight text-base text-[#0f0f11]">
            COPY<span className="text-[#df9367]">SCORE</span>
          </span>
        </Link>
      </header>

      {/* Main card container */}
      <main className="grow flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          {/* Guest Score Banner Callout if user already took the test */}
          {guestScore && (
            <div className="patter-card bg-[#fcf4ee] p-4 sm:p-5 shadow-[4px_4px_0px_#0f0f11] border-[1.5px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[10px] font-bold">
                  UNSAVED RESULT DETECTED
                </span>
                <span className="font-mono font-bold text-xs text-[#15803d] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PRESERVED</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-extrabold text-3xl sm:text-4xl text-[#0f0f11]">
                  {guestScore.overallScore}
                </span>
                <span className="font-mono text-xs text-[#52525b]">/ 100 PTS</span>
                <span className="font-mono text-xs font-bold text-[#df9367] ml-auto">
                  {guestScore.archetype.name}
                </span>
              </div>
              <p className="text-xs text-[#52525b] leading-relaxed">
                Create or sign into your account now to claim your verified score, claim your custom handle, and join the public rankings.
              </p>
            </div>
          )}

          {/* Primary Form Card */}
          <div className="patter-card bg-white p-6 sm:p-8 shadow-[5px_5px_0px_#0f0f11] space-y-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="patter-pill bg-[#0f0f11] text-white text-[10px] uppercase tracking-widest">
                  {badgeText}
                </span>
              </div>
              <h1 className="font-mono font-extrabold text-2xl sm:text-3xl text-[#0f0f11] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="border-t-[1.5px] border-[#0f0f11] bg-white py-4 px-4 text-center text-xs font-mono text-[#52525b]">
        <span>Protected by Firebase Auth & Cloud Firestore. Server-authoritative integrity.</span>
      </footer>
    </div>
  );
}

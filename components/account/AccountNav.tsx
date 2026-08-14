'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Lock, Eye, ArrowLeft, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

export function AccountNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const links = [
    { href: '/account', label: 'Overview', icon: Trophy },
    { href: '/account/profile', label: 'Profile & Handle', icon: User },
    { href: '/account/security', label: 'Security & Auth', icon: Lock },
    { href: '/account/privacy', label: 'Privacy & Visibility', icon: Eye },
  ];

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#52525b] hover:text-[#0f0f11]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Benchmarks</span>
      </Link>

      {/* User summary card */}
      <div className="patter-card bg-white p-4 shadow-[3px_3px_0px_#0f0f11] space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#0f0f11] text-white flex items-center justify-center font-mono font-bold text-sm border border-[#0f0f11]">
            {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="font-mono font-bold text-sm text-[#0f0f11] truncate">
              {profile?.displayName || 'User Profile'}
            </div>
            <div className="font-mono text-xs text-[#52525b] truncate">
              @{profile?.handle || 'writer'}
            </div>
          </div>
        </div>

        {profile?.bestScore && (
          <div className="pt-2 border-t border-[#eeece4] flex items-center justify-between text-xs font-mono">
            <span className="text-[#52525b]">Verified Score:</span>
            <span className="font-bold text-[#df9367]">{profile.bestScore.overallScore}/100</span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="patter-card bg-white p-1.5 shadow-[3px_3px_0px_#0f0f11] flex flex-col space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium transition-colors ${
                isActive
                  ? 'bg-[#0f0f11] text-white font-bold'
                  : 'text-[#0f0f11] hover:bg-[#f7f6f0]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#df9367]' : 'text-[#52525b]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { normalizeAuthError } from '@/lib/auth/errors';
import { getSafeRedirectUrl } from '@/lib/auth/redirects';
import { AlertCircle, Check, Loader2, Lock, Mail, User as UserIcon, AtSign } from 'lucide-react';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTarget = getSafeRedirectUrl(nextParam, '/');

  const { signUpWithEmail, pendingGuestScore, claimPendingGuestScore } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [handleMessage, setHandleMessage] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced handle validation
  useEffect(() => {
    if (!handle || handle.length < 3) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setHandleStatus('checking');
      try {
        const res = await fetch(`/api/auth/handle/check?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        if (!isMounted) return;
        if (data.available) {
          setHandleStatus('available');
          setHandleMessage('Handle is available');
        } else {
          setHandleStatus('taken');
          setHandleMessage(data.reason || 'Handle is already taken');
        }
      } catch {
        if (isMounted) setHandleStatus('idle');
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [handle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (handleStatus === 'taken') {
      setError('Please choose an available handle');
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(email, password, displayName, handle || undefined);
      if (pendingGuestScore) {
        await claimPendingGuestScore();
      }
      router.push(redirectTarget);
    } catch (err: unknown) {
      const errRes = normalizeAuthError(err);
      setError(errRes.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSuccess = () => {
    router.push(redirectTarget);
  };

  const pageTitle = pendingGuestScore ? `Save Your ${pendingGuestScore.overallScore} Score` : 'Create Your Account';
  const pageSubtitle = pendingGuestScore
    ? 'Create your permanent account to verify your score, enter the official leaderboard, and issue head-to-head challenges.'
    : 'Join the commercial copywriting and CRO benchmark standard.';

  return (
    <AuthLayout
      title={pageTitle}
      subtitle={pageSubtitle}
      badgeText={pendingGuestScore ? 'SAVE ASSESSMENT RESULT' : 'NEW WRITER REGISTRATION'}
      guestScore={pendingGuestScore}
    >
      {error && (
        <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Social Logins */}
      <SocialAuthButtons onSuccess={handleSocialSuccess} onError={(msg) => setError(msg)} />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#0f0f11] w-full" />
        <span className="bg-white px-3 font-mono text-[10px] text-[#52525b] uppercase tracking-wider shrink-0">
          Or register with email
        </span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
            Full Name / Display Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Elena Rostova"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <UserIcon className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Public Handle (Optional)
            </label>
            {handleStatus === 'checking' && (
              <span className="text-[10px] font-mono text-[#52525b]">Checking...</span>
            )}
            {handleStatus === 'available' && (
              <span className="text-[10px] font-mono text-[#15803d] font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Available
              </span>
            )}
            {handleStatus === 'taken' && (
              <span className="text-[10px] font-mono text-[#b91c1c] font-bold">
                {handleMessage}
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-xs font-mono font-bold text-[#52525b]">@</div>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="elena_cro"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] pl-7 pr-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <AtSign className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@growthagency.com"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <Mail className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
            Password (min. 8 chars)
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <Lock className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || handleStatus === 'checking'}
          className="w-full patter-btn patter-btn-peach py-2.5 px-4 text-xs sm:text-sm font-mono font-bold tracking-tight shadow-[3px_3px_0px_#0f0f11] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
          <span>{pendingGuestScore ? 'Save Score & Create Account' : 'Create CopyScore Account'}</span>
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="pt-2 text-center text-xs font-mono text-[#52525b] border-t border-[#eeece4]">
        <span>Already have an account? </span>
        <Link
          href={nextParam ? `/auth/sign-in?next=${encodeURIComponent(nextParam)}` : '/auth/sign-in'}
          className="font-bold text-[#0f0f11] underline hover:text-[#df9367]"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f6f0]" />}>
      <SignUpContent />
    </Suspense>
  );
}

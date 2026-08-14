'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { normalizeAuthError } from '@/lib/auth/errors';
import { getSafeRedirectUrl } from '@/lib/auth/redirects';
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTarget = getSafeRedirectUrl(nextParam, '/');

  const { signInWithEmail, pendingGuestScore, claimPendingGuestScore } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password, rememberMe);
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

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your verified score, challenges, and ranking."
      badgeText="AUTHENTICATION"
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
          Or sign in with email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="you@domain.com"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <Mail className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] font-mono text-[#52525b] hover:text-[#0f0f11] underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
            <Lock className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#52525b]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-none border-[#0f0f11] text-[#df9367] focus:ring-0 accent-[#df9367]"
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full patter-btn patter-btn-peach py-2.5 px-4 text-xs sm:text-sm font-mono font-bold tracking-tight shadow-[3px_3px_0px_#0f0f11] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
          <span>Sign In to CopyScore</span>
        </button>
      </form>

      {/* Switch to Sign Up */}
      <div className="pt-2 text-center text-xs font-mono text-[#52525b] border-t border-[#eeece4]">
        <span>New to CopyScore? </span>
        <Link
          href={nextParam ? `/auth/sign-up?next=${encodeURIComponent(nextParam)}` : '/auth/sign-up'}
          className="font-bold text-[#0f0f11] underline hover:text-[#df9367]"
        >
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f6f0]" />}>
      <SignInContent />
    </Suspense>
  );
}

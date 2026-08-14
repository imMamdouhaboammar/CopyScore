'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { confirmNewPassword } from '@/lib/firebase/auth';
import { normalizeAuthError } from '@/lib/auth/errors';
import { AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oobCode) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await confirmNewPassword(oobCode, password);
      setSubmitted(true);
    } catch (err: unknown) {
      const errRes = normalizeAuthError(err);
      setError(errRes.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a secure password with at least 8 characters."
      badgeText="SECURITY UPDATE"
      backHref="/auth/sign-in"
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 bg-[#eaf8ee] border-[1.5px] border-[#15803d] space-y-2">
            <div className="flex items-center gap-2 text-[#15803d]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider">
                Password Updated Successfully
              </h3>
            </div>
            <p className="text-xs text-[#0f0f11] leading-relaxed">
              Your password has been changed. You can now sign into your CopyScore account using your new credentials.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/auth/sign-in"
              className="patter-btn patter-btn-peach py-2.5 px-6 text-xs font-mono font-bold w-full"
            >
              Sign In With New Password
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!oobCode && (
            <div className="p-3 bg-[#fef4e6] border border-[#b45309] text-[#b45309] text-xs font-mono">
              Missing action code in URL. Please use the exact link sent to your email address.
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              New Password (min. 8 chars)
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

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
              />
              <Lock className="w-4 h-4 text-[#52525b] absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !oobCode}
            className="w-full patter-btn patter-btn-peach py-2.5 px-4 text-xs sm:text-sm font-mono font-bold tracking-tight shadow-[3px_3px_0px_#0f0f11] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
            <span>Update Password</span>
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f6f0]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

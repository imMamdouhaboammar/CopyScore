'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/lib/auth/context';
import { normalizeAuthError } from '@/lib/auth/errors';
import { AlertCircle, CheckCircle2, Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSubmitted(true);
    } catch (err: unknown) {
      // Show neutral confirmation message or rate limited warning
      const errRes = normalizeAuthError(err);
      if (errRes.code === 'rate_limited') {
        setError(errRes.message);
      } else {
        // Neutral UX prevents email enumeration
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the email address associated with your account to receive a reset link."
      badgeText="ACCOUNT RECOVERY"
      backHref="/auth/sign-in"
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 bg-[#eaf8ee] border-[1.5px] border-[#15803d] space-y-2">
            <div className="flex items-center gap-2 text-[#15803d]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider">
                Reset Link Dispatched
              </h3>
            </div>
            <p className="text-xs text-[#0f0f11] leading-relaxed">
              If an account exists for <strong className="font-mono">{email}</strong>, we have sent instructions to reset your password. Please check your inbox and spam folders.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/auth/sign-in"
              className="patter-btn patter-btn-black py-2.5 px-6 text-xs font-mono font-bold w-full"
            >
              Return to Sign In
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

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Account Email Address
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

          <button
            type="submit"
            disabled={loading}
            className="w-full patter-btn patter-btn-peach py-2.5 px-4 text-xs sm:text-sm font-mono font-bold tracking-tight shadow-[3px_3px_0px_#0f0f11] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
            <span>Send Password Reset Link</span>
          </button>

          <div className="text-center pt-2 border-t border-[#eeece4]">
            <Link
              href="/auth/sign-in"
              className="text-xs font-mono text-[#52525b] hover:text-[#0f0f11] flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

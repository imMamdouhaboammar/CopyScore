'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/lib/auth/context';
import { resendVerificationEmail } from '@/lib/firebase/auth';
import { normalizeAuthError } from '@/lib/auth/errors';
import { CheckCircle2, Mail, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const { user, refreshProfile } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setResent(false);
    try {
      await resendVerificationEmail();
      setResent(true);
    } catch (err: unknown) {
      const errRes = normalizeAuthError(err);
      setError(errRes.message);
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    if (user) {
      await user.reload();
      await refreshProfile();
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We sent a verification link to your registered email address."
      badgeText="EMAIL CONFIRMATION"
    >
      <div className="space-y-5">
        <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#df9367] border border-[#0f0f11] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#0f0f11]" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#52525b]">Destination Address:</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-[#0f0f11]">
                {user?.email || 'Your email address'}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#0f0f11] leading-relaxed">
            Click the link inside the confirmation email to verify your ownership. Verified accounts receive the official benchmark badge on the public leaderboard.
          </p>
        </div>

        {resent && (
          <div className="p-3 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Verification email resent successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full patter-btn patter-btn-peach py-2.5 px-4 text-xs sm:text-sm font-mono font-bold shadow-[2px_2px_0px_#0f0f11] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {resending ? <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" /> : <RefreshCw className="w-4 h-4" />}
            <span>Resend Verification Email</span>
          </button>

          <button
            onClick={handleCheckStatus}
            className="w-full patter-btn patter-btn-white py-2 px-4 text-xs font-mono"
          >
            I have verified — Refresh Status
          </button>
        </div>

        <div className="pt-2 text-center text-xs font-mono text-[#52525b] border-t border-[#eeece4]">
          <Link href="/account" className="underline hover:text-[#0f0f11]">
            Continue to Account Settings
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

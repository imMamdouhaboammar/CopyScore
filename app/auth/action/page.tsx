'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { applyEmailVerification } from '@/lib/firebase/auth';
import { normalizeAuthError } from '@/lib/auth/errors';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

function AuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const isInvalidMode = Boolean(mode && mode !== 'resetPassword' && mode !== 'verifyEmail');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() => {
    if (!mode || !oobCode || isInvalidMode) return 'error';
    return 'loading';
  });
  const [errorMessage, setErrorMessage] = useState<string>(() => {
    if (!mode || !oobCode) return 'Missing parameters in action URL.';
    if (isInvalidMode) return `Unsupported action mode: ${mode}`;
    return '';
  });

  useEffect(() => {
    if (!mode || !oobCode || isInvalidMode) {
      return;
    }

    if (mode === 'resetPassword') {
      router.replace(`/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`);
      return;
    }

    if (mode === 'verifyEmail') {
      applyEmailVerification(oobCode)
        .then(() => {
          setStatus('success');
        })
        .catch((err) => {
          const errRes = normalizeAuthError(err);
          setStatus('error');
          setErrorMessage(errRes.message);
        });
    }
  }, [mode, oobCode, isInvalidMode, router]);

  return (
    <AuthLayout
      title={mode === 'verifyEmail' ? 'Email Verification' : 'Processing Request'}
      badgeText="SECURITY HANDLER"
    >
      {status === 'loading' && (
        <div className="py-8 flex flex-col items-center justify-center space-y-3 font-mono text-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#df9367]" />
          <span>Verifying security credentials with Firebase...</span>
        </div>
      )}

      {status === 'success' && mode === 'verifyEmail' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] text-xs font-mono flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">Email Verified Successfully</p>
              <p className="mt-1">
                Your email address has been confirmed. Your account benchmark certificate is now marked as verified.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/account"
              className="patter-btn patter-btn-dark w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#df9367]"
            >
              <span>Go to Account Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">Verification Error</p>
              <p className="mt-1">{errorMessage || 'The action link is invalid, expired, or has already been used.'}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/sign-in"
              className="patter-btn patter-btn-dark w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#df9367]"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center font-mono text-xs">
          Loading security action...
        </div>
      }
    >
      <AuthActionContent />
    </Suspense>
  );
}

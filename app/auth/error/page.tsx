'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AlertCircle } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An error occurred during authentication.';

  return (
    <AuthLayout
      title="Authentication Issue"
      subtitle="We encountered a problem while processing your login credentials."
      badgeText="AUTH ERROR"
      backHref="/auth/sign-in"
    >
      <div className="space-y-5">
        <div className="p-4 bg-[#feeceb] border-[1.5px] border-[#b91c1c] space-y-2">
          <div className="flex items-center gap-2 text-[#b91c1c]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider">
              Verification Notice
            </h3>
          </div>
          <p className="text-xs text-[#0f0f11] font-mono leading-relaxed">
            {error}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/auth/sign-in"
            className="patter-btn patter-btn-peach py-2.5 px-4 text-xs font-mono font-bold w-full text-center"
          >
            Try Signing In Again
          </Link>
          <Link
            href="/"
            className="patter-btn patter-btn-white py-2 px-4 text-xs font-mono w-full text-center"
          >
            Return to Assessment Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f6f0]" />}>
      <AuthErrorContent />
    </Suspense>
  );
}

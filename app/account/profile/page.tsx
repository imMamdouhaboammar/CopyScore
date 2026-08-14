'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AccountNav } from '@/components/account/AccountNav';
import { Navbar } from '@/components/assessment/Navbar';
import { updateUserProfile, isHandleAvailable } from '@/lib/firebase/firestore';
import { normalizeHandle, isHandleReserved } from '@/lib/auth/schemas';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/lib/types/auth';

function ProfileForm({ profile, uid, onRefresh }: { profile: UserProfile; uid: string; onRefresh: () => Promise<void> }) {
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [handle, setHandle] = useState(profile.handle || '');
  const [roleTitle, setRoleTitle] = useState(profile.roleTitle || '');
  const [company, setCompany] = useState(profile.company || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [countryCode] = useState(profile.countryCode || 'US');

  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle availability check
  useEffect(() => {
    if (!handle || handle === profile.handle) {
      return;
    }

    if (handle.length < 3 || isHandleReserved(handle)) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!isMounted) return;
      setHandleStatus('checking');
      try {
        const available = await isHandleAvailable(handle, uid);
        if (isMounted) {
          setHandleStatus(available ? 'available' : 'taken');
        }
      } catch {
        if (isMounted) {
          setHandleStatus('idle');
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [handle, profile.handle, uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (handleStatus === 'taken') {
      setError('Selected handle is unavailable. Please choose another.');
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(uid, {
        displayName,
        handle: normalizeHandle(handle),
        roleTitle,
        company,
        bio,
        countryCode,
      });
      await onRefresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="patter-card bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#0f0f11] space-y-6">
      <div>
        <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
          PROFILE CONFIGURATION
        </span>
        <h1 className="font-mono font-extrabold text-2xl text-[#0f0f11] mt-2">
          Public Identity & Handle
        </h1>
        <p className="text-xs text-[#52525b]">
          Customize how your verified evaluations appear on public leaderboards and challenge duels.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile updated and synchronized with Firestore successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Marcus Sterling"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
          </div>

          {/* Public Handle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
                Public Handle
              </label>
              {handleStatus === 'available' && (
                <span className="text-[10px] font-mono text-[#15803d] font-bold">
                  ✓ Available
                </span>
              )}
              {handleStatus === 'taken' && (
                <span className="text-[10px] font-mono text-[#b91c1c] font-bold">
                  ✗ Taken
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2 text-xs font-mono font-bold text-[#52525b]">@</div>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  setHandle(val);
                  if (!val || val === profile.handle) {
                    setHandleStatus('idle');
                  } else if (val.length < 3 || isHandleReserved(val)) {
                    setHandleStatus('taken');
                  }
                }}
                placeholder="marcus_copy"
                className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] pl-7 pr-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
              />
            </div>
          </div>
        </div>

        {/* Professional Title & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Role Title
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Principal Conversion Copywriter"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
              Company / Agency (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Growth Lab"
              className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-[#0f0f11] uppercase tracking-wider">
            Short Bio (max 280 chars)
          </label>
          <textarea
            rows={3}
            maxLength={280}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Focusing on B2B SaaS messaging hierarchy, friction removal, and high-intent paid acquisition copy."
            className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f0f11]"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving || handleStatus === 'checking'}
            className="patter-btn patter-btn-peach py-2.5 px-6 text-xs sm:text-sm font-mono font-bold shadow-[2px_2px_0px_#0f0f11] disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, profile, loading, isAuthenticated, refreshProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center font-mono text-xs">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/auth/sign-in?next=/account/profile');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f0] text-[#0f0f11] patter-dot-grid">
      <Navbar
        currentView="landing"
        onNavigate={(view) => {
          if (view === 'assessment') router.push('/');
          else if (view === 'leaderboard') router.push('/leaderboard');
          else if (view === 'pricing') router.push('/pricing');
          else router.push('/');
        }}
        onOpenMethodology={() => {}}
      />

      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 lg:col-span-3">
            <AccountNav />
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {profile && (
              <ProfileForm
                key={profile.uid}
                profile={profile}
                uid={user.uid}
                onRefresh={refreshProfile}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

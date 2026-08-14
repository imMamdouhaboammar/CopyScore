'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AccountNav } from '@/components/account/AccountNav';
import { Navbar } from '@/components/assessment/Navbar';
import { updateUserProfile } from '@/lib/firebase/firestore';
import { CheckCircle2, Loader2, Eye, Trophy, Swords, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/lib/types/auth';

function PrivacyForm({ profile, uid, onRefresh }: { profile: UserProfile; uid: string; onRefresh: () => Promise<void> }) {
  const [isPublic, setIsPublic] = useState(profile.isPublic !== false);
  const [allowChallenges, setAllowChallenges] = useState(profile.allowChallenges !== false);
  const [showRankOnLeaderboard, setShowRankOnLeaderboard] = useState(profile.showRankOnLeaderboard !== false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(uid, {
        isPublic,
        publicProfile: isPublic,
        allowChallenges,
        showRankOnLeaderboard,
        leaderboardVisible: showRankOnLeaderboard,
      });
      await onRefresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="patter-card bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#0f0f11] space-y-6">
      <div>
        <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
          VISIBILITY CONTROLS
        </span>
        <h1 className="font-mono font-extrabold text-2xl text-[#0f0f11] mt-2">
          Privacy & Benchmark Visibility
        </h1>
        <p className="text-xs text-[#52525b]">
          Control whether your profile, benchmark score, and challenge links are public.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Privacy settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Option 1: Public Profile */}
        <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#0f0f11] uppercase">
              <Eye className="w-4 h-4 text-[#df9367]" />
              <span>Public Profile Page (/u/@{profile.handle})</span>
            </div>
            <p className="text-xs text-[#52525b]">
              When enabled, anyone with your handle URL can view your certified archetype, dimension breakdown, and score.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#df9367] border border-[#0f0f11]"></div>
          </label>
        </div>

        {/* Option 2: Leaderboard Inclusion */}
        <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#0f0f11] uppercase">
              <Trophy className="w-4 h-4 text-[#df9367]" />
              <span>Display on Global Leaderboard</span>
            </div>
            <p className="text-xs text-[#52525b]">
              List your best assessment score on the public Top Copywriters ranking table.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={showRankOnLeaderboard}
              onChange={(e) => setShowRankOnLeaderboard(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#df9367] border border-[#0f0f11]"></div>
          </label>
        </div>

        {/* Option 3: Direct Head-to-Head Challenges */}
        <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#0f0f11] uppercase">
              <Swords className="w-4 h-4 text-[#df9367]" />
              <span>Allow Head-to-Head Challenges (/beat/@{profile.handle})</span>
            </div>
            <p className="text-xs text-[#52525b]">
              Allow peers to challenge your score on the exact question sequence you answered.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={allowChallenges}
              onChange={(e) => setAllowChallenges(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#df9367] border border-[#0f0f11]"></div>
          </label>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="patter-btn patter-btn-peach py-2.5 px-6 text-xs sm:text-sm font-mono font-bold shadow-[2px_2px_0px_#0f0f11] disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin text-[#0f0f11]" />}
          <span>Save Privacy Settings</span>
        </button>
      </div>
    </div>
  );
}

export default function AccountPrivacyPage() {
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
    router.push('/auth/sign-in?next=/account/privacy');
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
              <PrivacyForm
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

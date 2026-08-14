'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AccountNav } from '@/components/account/AccountNav';
import { Navbar } from '@/components/assessment/Navbar';
import { changeUserPassword } from '@/lib/firebase/auth';
import { normalizeAuthError } from '@/lib/auth/errors';
import {
  Lock,
  Shield,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  Key,
} from 'lucide-react';

export default function AccountSecurityPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, signOut } = useAuth();

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await changeUserPassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: unknown) {
      const errRes = normalizeAuthError(err);
      setPasswordError(errRes.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account removal');
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
      if (res.ok) {
        await signOut();
        router.push('/?message=account_deleted');
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Network error during account deletion');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center font-mono text-xs">
        Loading Security Hub...
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/sign-in?next=/account/security');
    return null;
  }

  const providers = user?.providerData || [];

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
            {/* Header */}
            <div className="patter-card bg-white p-6 shadow-[4px_4px_0px_#0f0f11] space-y-2">
              <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">
                CREDENTIALS & ACCESS
              </span>
              <h1 className="font-mono font-extrabold text-2xl text-[#0f0f11] mt-2">
                Security & Authentication
              </h1>
              <p className="text-xs text-[#52525b]">
                Manage authentication methods, passwords, and sensitive account operations.
              </p>
            </div>

            {/* Linked Providers */}
            <div className="patter-card bg-white p-6 shadow-[3px_3px_0px_#0f0f11] space-y-4">
              <h2 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
                Connected Authentication Methods
              </h2>

              <div className="space-y-2">
                {providers.map((p) => (
                  <div
                    key={p.providerId}
                    className="p-3 bg-[#fcfbf8] border border-[#0f0f11] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-[#df9367]" />
                      <div>
                        <div className="text-xs font-mono font-bold text-[#0f0f11] uppercase">
                          {p.providerId === 'password'
                            ? 'Email & Password'
                            : p.providerId === 'google.com'
                            ? 'Google OAuth'
                            : p.providerId === 'github.com'
                            ? 'GitHub OAuth'
                            : p.providerId}
                        </div>
                        <div className="text-[11px] font-mono text-[#52525b]">{p.email || user?.email}</div>
                      </div>
                    </div>

                    <span className="patter-pill bg-[#eaf8ee] text-[#15803d] text-[10px]">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="patter-card bg-white p-6 shadow-[3px_3px_0px_#0f0f11] space-y-4">
              <h2 className="font-mono font-bold text-sm text-[#0f0f11] uppercase tracking-wider">
                Change Account Password
              </h2>

              {passwordSuccess && (
                <div className="p-3 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Password updated successfully!</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-[#0f0f11]">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-[#0f0f11]">
                    New Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-bold text-[#0f0f11]">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="patter-btn patter-btn-peach py-2 px-4 text-xs font-mono font-bold disabled:opacity-60 flex items-center gap-2"
                >
                  {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Update Password</span>
                </button>
              </form>
            </div>

            {/* Sign Out and Danger Zone */}
            <div className="patter-card bg-[#feeceb] p-6 shadow-[3px_3px_0px_#0f0f11] border-[1.5px] border-[#b91c1c] space-y-4">
              <div className="flex items-center gap-2 text-[#b91c1c]">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider">
                  Session & Danger Zone
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <div className="font-mono font-bold text-xs text-[#0f0f11]">Sign Out Everywhere</div>
                  <div className="text-xs text-[#52525b]">
                    Clears client tokens and server-side HttpOnly session cookies.
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    router.push('/');
                  }}
                  className="patter-btn patter-btn-white py-2 px-4 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="border-t border-[#b91c1c]/30 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-mono font-bold text-xs text-[#b91c1c]">Permanent Account Deletion</div>
                  <div className="text-xs text-[#52525b]">
                    Permanently removes your profile, handles, assessment attempts, and leaderboard scores from Firestore and Firebase Auth.
                  </div>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="patter-btn bg-[#b91c1c] text-white hover:bg-red-700 py-2 px-4 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="patter-card bg-white p-6 max-w-md w-full shadow-[5px_5px_0px_#0f0f11] space-y-4">
            <div className="flex items-center gap-2 text-[#b91c1c]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-mono font-bold text-base uppercase">Confirm Account Deletion</h3>
            </div>

            <p className="text-xs text-[#0f0f11] leading-relaxed">
              This action cannot be undone. All your benchmark scores, custom handle <strong className="font-mono">@{user?.displayName}</strong>, and evaluations will be permanently purged.
            </p>

            {deleteError && (
              <div className="p-2.5 bg-[#feeceb] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono">
                {deleteError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-[#0f0f11]">
                Type <strong className="text-[#b91c1c]">DELETE</strong> below:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation('');
                  setDeleteError(null);
                }}
                className="patter-btn patter-btn-white py-2 px-4 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                className="patter-btn bg-[#b91c1c] text-white hover:bg-red-700 py-2 px-4 text-xs font-mono font-bold disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

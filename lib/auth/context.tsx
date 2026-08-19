'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onIdTokenChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase/client';
import {
  signUpWithEmail as fbSignUpWithEmail,
  signInWithEmail as fbSignInWithEmail,
  signInWithGoogle as fbSignInWithGoogle,
  signInWithGithub as fbSignInWithGithub,
  signOutUser as fbSignOutUser,
  sendPasswordReset as fbSendPasswordReset,
  syncServerSession,
  getCurrentServerProfile,
} from '../firebase/auth';
import { UserProfile } from '../types/auth';
import { FinalAssessmentScore } from '../types/assessment';

const GUEST_SCORE_KEY = 'copyscore_last_score_v1';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  emailVerified: boolean;
  pendingGuestScore: FinalAssessmentScore | null;
  clearPendingGuestScore: () => void;
  claimPendingGuestScore: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  signInWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<UserProfile>;
  signUpWithEmail: (email: string, pass: string, displayName: string, handle?: string) => Promise<UserProfile>;
  signInWithGoogle: () => Promise<UserProfile>;
  signInWithGithub: () => Promise<UserProfile>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingGuestScore, setPendingGuestScore] = useState<FinalAssessmentScore | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(GUEST_SCORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.overallScore && parsed.attemptId) return parsed;
      }
    } catch {
      // Ignore invalid local cache.
    }
    return null;
  });

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      setProfile(await getCurrentServerProfile());
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const auth = getFirebaseAuth();

    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (!mounted) return;
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const synced = await syncServerSession(currentUser, true);
        if (!synced) throw new Error('Failed to establish server session');
        const currentProfile = await getCurrentServerProfile();
        if (mounted) setProfile(currentProfile);
      } catch (err) {
        console.error('Error synchronizing user on auth change', err);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const clearPendingGuestScore = useCallback(() => {
    setPendingGuestScore(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_SCORE_KEY);
    }
  }, []);

  const claimPendingGuestScore = useCallback(async (): Promise<boolean> => {
    if (!user || !pendingGuestScore?.attemptId) return false;

    try {
      const response = await fetch('/api/auth/guest/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: pendingGuestScore.attemptId }),
      });

      if (!response.ok) return false;
      const data = await response.json();
      if (!data?.success || !data.profile) return false;

      setProfile(data.profile as UserProfile);
      setPendingGuestScore(null);
      localStorage.removeItem(GUEST_SCORE_KEY);
      return true;
    } catch (err) {
      console.error('Failed to claim guest score', err);
      return false;
    }
  }, [user, pendingGuestScore]);

  const signInWithEmail = useCallback(async (
    email: string,
    pass: string,
    rememberMe: boolean = true
  ) => {
    const { profile: nextProfile } = await fbSignInWithEmail(email, pass, rememberMe);
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string,
    pass: string,
    displayName: string,
    handle?: string
  ) => {
    const { profile: nextProfile } = await fbSignUpWithEmail(email, pass, displayName, handle);
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { profile: nextProfile } = await fbSignInWithGoogle();
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  const signInWithGithub = useCallback(async () => {
    const { profile: nextProfile } = await fbSignInWithGithub();
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOutUser();
    setUser(null);
    setProfile(null);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await fbSendPasswordReset(email);
  }, []);

  const value: AuthContextType = React.useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      isAdmin: profile?.role === 'admin',
      emailVerified: !!user?.emailVerified,
      pendingGuestScore,
      clearPendingGuestScore,
      claimPendingGuestScore,
      refreshProfile,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      sendPasswordReset,
    }),
    [
      user,
      profile,
      loading,
      pendingGuestScore,
      clearPendingGuestScore,
      claimPendingGuestScore,
      refreshProfile,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      sendPasswordReset,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

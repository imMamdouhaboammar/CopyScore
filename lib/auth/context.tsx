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
} from '../firebase/auth';
import { ensureUserProfile, getUserProfile, claimGuestAssessment } from '../firebase/firestore';
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
        if (parsed.overallScore) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      const p = await getUserProfile(user.uid);
      if (p) {
        setProfile(p);
      } else {
        const newP = await ensureUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });
        setProfile(newP);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  }, [user]);

  // Listen to Firebase ID token changes (tokens, signins, token refreshes)
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncServerSession(currentUser, true);
          const p = await ensureUserProfile(currentUser.uid, {
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            emailVerified: currentUser.emailVerified,
          });
          setProfile(p);
        } catch (err) {
          console.error('Error synchronizing user on auth change', err);
        }
      } else {
        setProfile(null);
        await syncServerSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearPendingGuestScore = useCallback(() => {
    setPendingGuestScore(null);
  }, []);

  const claimPendingGuestScore = useCallback(async (): Promise<boolean> => {
    if (!user || !pendingGuestScore) return false;
    try {
      const { profile: updatedProfile } = await claimGuestAssessment(user.uid, pendingGuestScore);
      setProfile(updatedProfile);
      setPendingGuestScore(null);
      return true;
    } catch (err) {
      console.error('Failed to claim guest score', err);
      return false;
    }
  }, [user, pendingGuestScore]);

  const signInWithEmail = async (email: string, pass: string, rememberMe: boolean = true) => {
    const { profile: p } = await fbSignInWithEmail(email, pass, rememberMe);
    setProfile(p);
    return p;
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string, handle?: string) => {
    const { profile: p } = await fbSignUpWithEmail(email, pass, displayName, handle);
    setProfile(p);
    return p;
  };

  const signInWithGoogle = async () => {
    const { profile: p } = await fbSignInWithGoogle();
    setProfile(p);
    return p;
  };

  const signInWithGithub = async () => {
    const { profile: p } = await fbSignInWithGithub();
    setProfile(p);
    return p;
  };

  const signOut = async () => {
    await fbSignOutUser();
    setUser(null);
    setProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await fbSendPasswordReset(email);
  };

  const value: AuthContextType = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

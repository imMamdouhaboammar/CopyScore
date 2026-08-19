import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, googleProvider, githubProvider } from './client';
import { UserProfile } from '../types/auth';

export interface ProfilePatchInput {
  displayName?: string;
  handle?: string;
  avatarUrl?: string;
  roleTitle?: string;
  company?: string;
  bio?: string;
  countryCode?: string;
  publicProfile?: boolean;
  isPublic?: boolean;
  leaderboardVisible?: boolean;
  showRankOnLeaderboard?: boolean;
  allowChallenges?: boolean;
}

export async function syncServerSession(
  user: User | null,
  rememberMe: boolean = true
): Promise<boolean> {
  try {
    if (!user) {
      await fetch('/api/auth/session', { method: 'DELETE' });
      return true;
    }

    const idToken = await user.getIdToken();
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, rememberMe }),
    });

    return response.ok;
  } catch (err) {
    console.error('Failed to sync server session', err);
    return false;
  }
}

export async function getCurrentServerProfile(): Promise<UserProfile | null> {
  const response = await fetch('/api/auth/profile', { cache: 'no-store' });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Failed to load profile');

  const data = await response.json();
  return (data.profile as UserProfile | null) || null;
}

export async function patchCurrentServerProfile(
  updates: ProfilePatchInput
): Promise<UserProfile> {
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok || !data.profile) {
    throw new Error(data.error || 'Failed to update profile');
  }
  return data.profile as UserProfile;
}

export async function checkServerHandleAvailability(handle: string): Promise<boolean> {
  const response = await fetch(`/api/auth/handle/check?handle=${encodeURIComponent(handle)}`, {
    cache: 'no-store',
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.available === true;
}

async function establishAuthenticatedProfile(
  user: User,
  rememberMe: boolean
): Promise<UserProfile> {
  const synced = await syncServerSession(user, rememberMe);
  if (!synced) throw new Error('Failed to establish secure session');

  const profile = await getCurrentServerProfile();
  if (!profile) throw new Error('Failed to provision user profile');
  return profile;
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  handle?: string
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = credential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  let profile = await establishAuthenticatedProfile(user, true);
  profile = await patchCurrentServerProfile({
    displayName: displayName || profile.displayName,
    ...(handle ? { handle } : {}),
  });

  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Initial verification email failed to send', err);
  }

  return { user, profile };
}

export async function signInWithEmail(
  email: string,
  pass: string,
  rememberMe: boolean = true
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const user = credential.user;
  const profile = await establishAuthenticatedProfile(user, rememberMe);
  return { user, profile };
}

export async function signInWithGoogle(): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;
  const profile = await establishAuthenticatedProfile(user, true);
  return { user, profile };
}

export async function signInWithGithub(): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithPopup(auth, githubProvider);
  const user = credential.user;
  const profile = await establishAuthenticatedProfile(user, true);
  return { user, profile };
}

export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

export async function confirmNewPassword(code: string, newPass: string): Promise<void> {
  const auth = getFirebaseAuth();
  await confirmPasswordReset(auth, code, newPass);
}

export async function applyEmailVerification(actionCode: string): Promise<void> {
  const auth = getFirebaseAuth();
  await applyActionCode(auth, actionCode);
  if (auth.currentUser) {
    await auth.currentUser.reload();
  }
}

export async function resendVerificationEmail(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user is currently signed in');
  }
}

export async function reauthenticateWithPassword(password: string): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error('No user is currently signed in');
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await reauthenticateWithPassword(currentPassword);
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase client sign out error', err);
  }

  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (err) {
    console.warn('Server session deletion error', err);
  }
}

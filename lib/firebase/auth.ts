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
  AuthError,
} from 'firebase/auth';
import { getFirebaseAuth, googleProvider, githubProvider } from './client';
import { ensureUserProfile } from './firestore';
import { UserProfile } from '../types/auth';

/**
 * Exchange ID token with Next.js server endpoint to set secure HttpOnly session cookie
 */
export async function syncServerSession(user: User | null, rememberMe: boolean = true): Promise<boolean> {
  try {
    if (!user) {
      await fetch('/api/auth/session', { method: 'DELETE' });
      return true;
    }

    const idToken = await user.getIdToken();
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, rememberMe }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to sync server session', err);
    return false;
  }
}

/**
 * Register with Email & Password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  handle?: string
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = credential.user;

  // Update display name in Firebase Auth
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Provision Firestore profile
  const profile = await ensureUserProfile(user.uid, {
    email: user.email,
    displayName: displayName || user.email?.split('@')[0],
    handle,
    emailVerified: user.emailVerified,
  });

  // Send verification email
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Initial verification email failed to send', err);
  }

  // Establish server session
  await syncServerSession(user, true);

  return { user, profile };
}

/**
 * Sign In with Email & Password
 */
export async function signInWithEmail(
  email: string,
  pass: string,
  rememberMe: boolean = true
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const user = credential.user;

  // Provision / fetch profile
  const profile = await ensureUserProfile(user.uid, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  });

  // Establish server session
  await syncServerSession(user, rememberMe);

  return { user, profile };
}

/**
 * Sign In with Google OAuth popup
 */
export async function signInWithGoogle(): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  const profile = await ensureUserProfile(user.uid, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  });

  await syncServerSession(user, true);

  return { user, profile };
}

/**
 * Sign In with GitHub OAuth popup
 */
export async function signInWithGithub(): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithPopup(auth, githubProvider);
  const user = credential.user;

  const profile = await ensureUserProfile(user.uid, {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  });

  await syncServerSession(user, true);

  return { user, profile };
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Confirm password reset with action code
 */
export async function confirmNewPassword(code: string, newPass: string): Promise<void> {
  const auth = getFirebaseAuth();
  await confirmPasswordReset(auth, code, newPass);
}

/**
 * Apply email verification action code
 */
export async function applyEmailVerification(actionCode: string): Promise<void> {
  const auth = getFirebaseAuth();
  await applyActionCode(auth, actionCode);
  if (auth.currentUser) {
    await auth.currentUser.reload();
  }
}

/**
 * Resend verification email to current user
 */
export async function resendVerificationEmail(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user is currently signed in');
  }
}

/**
 * Reauthenticate current user with password (for sensitive operations)
 */
export async function reauthenticateWithPassword(password: string): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user is currently signed in');
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
}

/**
 * Change current user password
 */
export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  await reauthenticateWithPassword(currentPassword);
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
}

/**
 * Full Sign Out: clears client state and server HttpOnly cookie
 */
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

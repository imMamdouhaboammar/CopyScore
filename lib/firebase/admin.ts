import 'server-only';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseClientConfig } from './config';

let adminApp: App;

export function getAdminApp(): App {
  if (!adminApp) {
    const apps = getApps();
    if (apps.length > 0 && apps[0]) {
      adminApp = apps[0];
    } else {
      adminApp = initializeApp({
        projectId: firebaseClientConfig.projectId,
      });
    }
  }
  return adminApp;
}

export function getAdminAuth(): Auth {
  const app = getAdminApp();
  return getAuth(app);
}

export function getAdminFirestore(): Firestore {
  const app = getAdminApp();
  const dbId = firebaseClientConfig.firestoreDatabaseId;
  if (dbId && dbId !== '(default)') {
    return getFirestore(app, dbId);
  }
  return getFirestore(app);
}

export async function verifyAdminIdToken(idToken: string) {
  const auth = getAdminAuth();
  return await auth.verifyIdToken(idToken, true);
}

export async function createAdminSessionCookie(idToken: string, expiresInMs: number = 60 * 60 * 24 * 5 * 1000) {
  const auth = getAdminAuth();
  return await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
}

export async function verifyAdminSessionCookie(sessionCookie: string, checkRevoked: boolean = true) {
  const auth = getAdminAuth();
  return await auth.verifySessionCookie(sessionCookie, checkRevoked);
}

export async function revokeUserSessions(uid: string) {
  const auth = getAdminAuth();
  return await auth.revokeRefreshTokens(uid);
}

export async function setAdminUserRole(uid: string, role: 'admin' | 'user') {
  const auth = getAdminAuth();
  return await auth.setCustomUserClaims(uid, {
    role,
    admin: role === 'admin',
  });
}

export async function deleteAdminUser(uid: string) {
  const auth = getAdminAuth();
  return await auth.deleteUser(uid);
}

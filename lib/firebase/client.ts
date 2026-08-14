import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseClientConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
    } else {
      app = initializeApp(firebaseClientConfig);
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    const firebaseApp = getFirebaseApp();
    const dbId = firebaseClientConfig.firestoreDatabaseId;
    if (dbId && dbId !== '(default)') {
      db = getFirestore(firebaseApp, dbId);
    } else {
      db = getFirestore(firebaseApp);
    }
  }
  return db;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

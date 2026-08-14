import rawAppletConfig from '@/firebase-applet-config.json';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export const firebaseClientConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || rawAppletConfig.apiKey || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || rawAppletConfig.authDomain || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || rawAppletConfig.projectId || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || rawAppletConfig.storageBucket || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || rawAppletConfig.messagingSenderId || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || rawAppletConfig.appId || '',
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || rawAppletConfig.firestoreDatabaseId || '(default)',
};

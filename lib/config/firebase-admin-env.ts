export type FirebaseAdminCredentialConfig =
  | {
      mode: 'service-account';
      projectId: string;
      clientEmail: string;
      privateKey: string;
    }
  | {
      mode: 'application-default';
      projectId: string;
    };

export class FirebaseAdminConfigurationError extends Error {
  readonly code = 'FIREBASE_ADMIN_CONFIGURATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAdminConfigurationError';
  }
}

export function resolveFirebaseAdminCredentialConfig(
  env: NodeJS.ProcessEnv = process.env,
  fallbackProjectId: string = ''
): FirebaseAdminCredentialConfig {
  const projectId = (env.FIREBASE_ADMIN_PROJECT_ID || fallbackProjectId).trim();
  const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim() || '';
  const privateKeyRaw = env.FIREBASE_ADMIN_PRIVATE_KEY || '';
  const hasClientEmail = clientEmail.length > 0;
  const hasPrivateKey = privateKeyRaw.trim().length > 0;

  if (hasClientEmail !== hasPrivateKey) {
    throw new FirebaseAdminConfigurationError(
      'FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY must be configured together'
    );
  }

  if (hasClientEmail && hasPrivateKey) {
    if (!projectId) {
      throw new FirebaseAdminConfigurationError(
        'A Firebase Admin project id is required for service-account credentials'
      );
    }

    return {
      mode: 'service-account',
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKeyRaw),
    };
  }

  const useApplicationDefault =
    env.FIREBASE_ADMIN_USE_ADC?.trim().toLowerCase() === 'true' ||
    Boolean(env.GOOGLE_APPLICATION_CREDENTIALS?.trim());

  if (env.NODE_ENV === 'production' && !useApplicationDefault) {
    throw new FirebaseAdminConfigurationError(
      'Production requires either Firebase Admin service-account credentials or explicit Application Default Credentials'
    );
  }

  if (!projectId) {
    throw new FirebaseAdminConfigurationError(
      'A Firebase project id is required for Firebase Admin initialization'
    );
  }

  return {
    mode: 'application-default',
    projectId,
  };
}

function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, '\n');
}

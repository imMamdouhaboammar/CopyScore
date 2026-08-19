import { describe, expect, it } from 'vitest';
import {
  FirebaseAdminConfigurationError,
  resolveFirebaseAdminCredentialConfig,
} from '../../lib/config/firebase-admin-env';

describe('Firebase Admin credential configuration', () => {
  it('normalizes an explicit service-account configuration for generic hosting', () => {
    const config = resolveFirebaseAdminCredentialConfig(
      {
        NODE_ENV: 'production',
        FIREBASE_ADMIN_PROJECT_ID: 'copyscore-prod',
        FIREBASE_ADMIN_CLIENT_EMAIL: 'firebase-adminsdk@example.iam.gserviceaccount.com',
        FIREBASE_ADMIN_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n',
      } as NodeJS.ProcessEnv,
      'fallback-project'
    );

    expect(config).toEqual({
      mode: 'service-account',
      projectId: 'copyscore-prod',
      clientEmail: 'firebase-adminsdk@example.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nabc123\n-----END PRIVATE KEY-----\n',
    });
  });

  it('allows explicit ADC opt-in in production', () => {
    expect(
      resolveFirebaseAdminCredentialConfig(
        {
          NODE_ENV: 'production',
          FIREBASE_ADMIN_USE_ADC: 'true',
        } as NodeJS.ProcessEnv,
        'copyscore-prod'
      )
    ).toEqual({ mode: 'application-default', projectId: 'copyscore-prod' });
  });

  it('accepts GOOGLE_APPLICATION_CREDENTIALS as an explicit ADC signal', () => {
    expect(
      resolveFirebaseAdminCredentialConfig(
        {
          NODE_ENV: 'production',
          GOOGLE_APPLICATION_CREDENTIALS: '/secrets/firebase.json',
        } as NodeJS.ProcessEnv,
        'copyscore-prod'
      )
    ).toEqual({ mode: 'application-default', projectId: 'copyscore-prod' });
  });

  it('rejects incomplete service-account credentials', () => {
    expect(() =>
      resolveFirebaseAdminCredentialConfig(
        {
          NODE_ENV: 'production',
          FIREBASE_ADMIN_CLIENT_EMAIL: 'firebase-adminsdk@example.iam.gserviceaccount.com',
        } as NodeJS.ProcessEnv,
        'copyscore-prod'
      )
    ).toThrow(FirebaseAdminConfigurationError);
  });

  it('rejects production startup configuration with no server credentials', () => {
    expect(() =>
      resolveFirebaseAdminCredentialConfig(
        { NODE_ENV: 'production' } as NodeJS.ProcessEnv,
        'copyscore-prod'
      )
    ).toThrow(FirebaseAdminConfigurationError);
  });

  it('preserves ADC as the development fallback', () => {
    expect(
      resolveFirebaseAdminCredentialConfig(
        { NODE_ENV: 'development' } as NodeJS.ProcessEnv,
        'copyscore-dev'
      )
    ).toEqual({ mode: 'application-default', projectId: 'copyscore-dev' });
  });
});

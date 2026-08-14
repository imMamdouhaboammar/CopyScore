export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_in_use'
  | 'email_unverified'
  | 'weak_password'
  | 'user_not_found'
  | 'wrong_password'
  | 'provider_conflict'
  | 'popup_closed'
  | 'expired_action'
  | 'invalid_action'
  | 'rate_limited'
  | 'network_error'
  | 'requires_recent_login'
  | 'handle_taken'
  | 'invalid_handle'
  | 'unknown';

export interface AuthErrorResponse {
  code: AuthErrorCode;
  message: string;
  field?: 'email' | 'password' | 'displayName' | 'handle';
}

export function normalizeAuthError(err: unknown): AuthErrorResponse {
  const message = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string })?.code || '';

  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return {
        code: 'invalid_credentials',
        message: 'Invalid email or password. Please verify your credentials.',
      };

    case 'auth/email-already-in-use':
      return {
        code: 'email_in_use',
        message: 'An account with this email address already exists. Please sign in instead.',
        field: 'email',
      };

    case 'auth/weak-password':
      return {
        code: 'weak_password',
        message: 'Password must be at least 8 characters with numbers and letters.',
        field: 'password',
      };

    case 'auth/invalid-email':
      return {
        code: 'invalid_credentials',
        message: 'Please provide a valid email address.',
        field: 'email',
      };

    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        code: 'popup_closed',
        message: 'Sign in popup was closed before completing. Please try again.',
      };

    case 'auth/account-exists-with-different-credential':
      return {
        code: 'provider_conflict',
        message: 'An account already exists with the same email using a different sign-in method.',
      };

    case 'auth/expired-action-code':
      return {
        code: 'expired_action',
        message: 'This link has expired. Please request a new verification or reset link.',
      };

    case 'auth/invalid-action-code':
      return {
        code: 'invalid_action',
        message: 'This link is invalid or has already been used.',
      };

    case 'auth/too-many-requests':
      return {
        code: 'rate_limited',
        message: 'Too many unsuccessful attempts. Please wait a few moments and try again.',
      };

    case 'auth/network-request-failed':
      return {
        code: 'network_error',
        message: 'Network connection issue. Please check your internet connection.',
      };

    case 'auth/requires-recent-login':
      return {
        code: 'requires_recent_login',
        message: 'This sensitive action requires recent authentication. Please sign in again.',
      };

    default:
      return {
        code: 'unknown',
        message: message.replace(/^Firebase:\s*/, '') || 'An unexpected authentication error occurred.',
      };
  }
}

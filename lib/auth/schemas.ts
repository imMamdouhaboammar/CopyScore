import { z } from 'zod';

export const RESERVED_HANDLES = new Set([
  'admin',
  'administrator',
  'api',
  'auth',
  'account',
  'leaderboard',
  'pricing',
  'settings',
  'support',
  'login',
  'signup',
  'register',
  'copyscore',
  'root',
  'benchmark',
  'beat',
  'u',
  'user',
  'users',
  'app',
  'system',
  'privacy',
  'terms',
  'security',
  'profile',
  'billing',
  'official',
  'verified',
]);

export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
}

export function isHandleReserved(handle: string): boolean {
  return RESERVED_HANDLES.has(normalizeHandle(handle));
}

export const handleSchema = z
  .string()
  .min(3, 'Handle must be at least 3 characters')
  .max(24, 'Handle cannot exceed 24 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores')
  .refine((val) => !isHandleReserved(val), {
    message: 'This handle is reserved by the platform',
  });

export const signUpSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(24, 'Handle cannot exceed 24 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores')
    .optional()
    .or(z.literal('')),
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
  rememberMe: z.boolean().default(true),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'New password must contain at least one letter')
      .regex(/[0-9]/, 'New password must contain at least one number'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  handle: handleSchema,
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  roleTitle: z.string().max(80).optional(),
  company: z.string().max(80).optional(),
  bio: z.string().max(280, 'Bio cannot exceed 280 characters').optional(),
  countryCode: z.string().max(3).optional(),
  publicProfile: z.boolean(),
  leaderboardVisible: z.boolean(),
});

export const profilePatchSchema = z
  .object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50).optional(),
    handle: handleSchema.optional(),
    avatarUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
    roleTitle: z.string().max(80).optional(),
    company: z.string().max(80).optional(),
    bio: z.string().max(280, 'Bio cannot exceed 280 characters').optional(),
    countryCode: z.string().max(3).optional(),
    publicProfile: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    leaderboardVisible: z.boolean().optional(),
    showRankOnLeaderboard: z.boolean().optional(),
    allowChallenges: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field is required',
  });

export const guestClaimSchema = z
  .object({
    attemptId: z.string().trim().min(1).max(128),
  })
  .strict();

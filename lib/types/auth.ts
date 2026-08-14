import { FinalAssessmentScore } from './assessment';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  handle: string | null;
  avatarUrl: string | null;
  roleTitle?: string;
  company?: string;
  bio?: string;
  countryCode?: string;
  publicProfile: boolean;
  isPublic?: boolean;
  leaderboardVisible: boolean;
  showRankOnLeaderboard?: boolean;
  allowChallenges?: boolean;
  role: UserRole;
  bestScore?: FinalAssessmentScore;
  totalAttempts: number;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PublicUserProfile {
  uid: string;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  roleTitle?: string;
  company?: string;
  bio?: string;
  countryCode?: string;
  bestScore?: FinalAssessmentScore;
  overallScore?: number;
  percentile?: number;
  archetype?: string;
  strongestSkill?: string;
  totalAttempts?: number;
  isVerified?: boolean;
  leaderboardVisible: boolean;
}

export interface AuthSessionUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isAdmin: boolean;
}

export type DomainId = 'conversion_copywriting' | 'content_creation' | 'performance_copy' | 'cro';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type QuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'ranking'
  | 'rewrite'
  | 'diagnostic'
  | 'scenario';

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface QuestionContext {
  brand?: string;
  industry?: string;
  audience?: string;
  objective?: string;
  channel?: string;
  funnelStage?: string;
  currentLandingPageBounce?: string;
  currentMetrics?: Record<string, string>;
  copySnippet?: string;
  constraints?: string[];
  maxWords?: number;
  [key: string]: unknown;
}

export interface QuestionItem {
  id: string;
  code: string;
  domain: DomainId;
  subskill: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  estimatedSeconds: number;
  discrimination: number;
  prompt: string;
  context?: QuestionContext;
  options?: ChoiceOption[];
  itemsToOrder?: { id: string; label: string; detail?: string }[];
  correctAnswer?: string | string[];
  correctOrder?: string[];
  rubricCriteria?: string[];
  explanation: string;
  diagnosticInsight: {
    goodOutcome: string;
    pitfall: string;
  };
}

export type ClientQuestion = Omit<QuestionItem, 'correctAnswer' | 'correctOrder'>;

export type AssessmentStage = 'CALIBRATION' | 'CORE' | 'DEEP_DIVE' | 'PRESSURE_TEST' | 'COMPLETED';

export interface UserResponse {
  questionId: string;
  userAnswer: string | string[];
  timeSpentMs: number;
  timestamp: number;
}

export interface EvaluatedResponse extends UserResponse {
  isCorrect: boolean;
  scoreRatio: number;
  domain: DomainId;
  difficulty: DifficultyLevel;
  discrimination: number;
  feedbackText?: string;
  rubricScores?: Record<string, number>;
}

export interface DomainScore {
  domain: DomainId;
  rawScore: number;
  scaledScore: number;
  questionsAttempted: number;
  accuracy: number;
  highestDifficultyCleared: DifficultyLevel;
  statusLabel: 'Expert' | 'Advanced' | 'Strong' | 'Competitive' | 'Needs Work';
}

export interface ArchetypeProfile {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  superpower: string;
  blindspot: string;
  dominantDomains: DomainId[];
}

export interface FinalAssessmentScore {
  attemptId: string;
  assessmentVersion: string;
  createdAt: number;
  completedAt: number;
  overallScore: number;
  percentile: number;
  confidenceLevel: number;
  rankTitle: string;
  maxDifficultyReached: DifficultyLevel;
  domainScores: Record<DomainId, DomainScore>;
  archetype: ArchetypeProfile;
  whatYouDidWell: string[];
  whatCostYouPoints: string[];
  growthActions: string[];
  totalTimeSeconds: number;
  verificationHash: string;
  isVerified: boolean;
  userHandle?: string;
}

export interface AssessmentSessionState {
  sessionId: string;
  userId?: string;
  userHandle?: string;
  ownerUid?: string;
  guestAccessHash?: string;
  claimedByUid?: string;
  createdAt?: number;
  expiresAt?: number;
  revision?: number;
  stage: AssessmentStage;
  questionIndex: number;
  totalEstimatedQuestions: number;
  answeredQuestionIds: string[];
  responses: EvaluatedResponse[];
  currentDifficulty: Record<DomainId, number>;
  currentQuestion?: ClientQuestion;
  startTime: number;
  lastActiveTime: number;
  isCompleted: boolean;
  finalScore?: FinalAssessmentScore;
  challengeOrigin?: {
    challengerHandle: string;
    challengerScore: number;
    challengeCode: string;
  };
}

export type VerificationStatus = 'verified' | 'pending' | 'practice';

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  displayName: string;
  handle: string;
  avatarUrl?: string;
  score: number;
  percentile: number;
  archetype: string;
  strongestSkill: string;
  domainScores?: Record<DomainId, number>;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  rankChange?: number;
  isNew?: boolean;
  assessmentVersion: string;
  date: string;
  completedAt?: string;
  isCurrentUser?: boolean;
  countryCode?: string;
  roleTitle?: string;
  role?: string;
  company?: string;
  bio?: string;
}

export type TimeframeFilter = 'global' | 'weekly' | 'monthly';
export type SkillCategoryFilter = 'all' | 'conversion' | 'content' | 'performance' | 'cro';

export interface LeaderboardMeta {
  totalAttempts: number;
  scoreToTop10: number;
  scoreToTop5: number;
  scoreToTop1: number;
  weeklyResetSeconds: number;
  competitionWeek: number;
  startDate: string;
  endDate: string;
  activeParticipants: number;
  assessmentVersion: string;
}

export interface HeadToHeadChallenge {
  challengeCode: string;
  creatorHandle: string;
  creatorScore: number;
  creatorArchetype: string;
  creatorDomainScores: Record<DomainId, number>;
  createdAt: number;
  participantCount: number;
  bestOpponent?: {
    handle: string;
    score: number;
  };
}

export interface ChallengeAttempt {
  challengeCode: string;
  challengerHandle: string;
  challengerScore: number;
  completedAt: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  meta: LeaderboardMeta;
  userPosition?: LeaderboardEntry;
  neighborhood?: LeaderboardEntry[];
}

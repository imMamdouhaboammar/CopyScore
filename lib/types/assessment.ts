export type DomainId = 'conversion_copywriting' | 'content_creation' | 'performance_copy' | 'cro';

export interface DomainMeta {
  id: DomainId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
}

export const DOMAINS: Record<DomainId, DomainMeta> = {
  conversion_copywriting: {
    id: 'conversion_copywriting',
    name: 'Conversion Copywriting',
    shortName: 'Conversion',
    tagline: 'Awareness, objections & value proposition hierarchy',
    description: 'Audience mindset, stage of awareness, proof architecture, friction removal, and compelling offer mechanics.',
    iconName: 'Target',
    color: '#df9367',
  },
  content_creation: {
    id: 'content_creation',
    name: 'Content Judgment & Hooks',
    shortName: 'Content',
    tagline: 'Retention, hooks, clarity & narrative flow',
    description: 'Idea filtering, scroll-stopping hooks, editorial rigor, cognitive pacing, and channel-appropriate framing.',
    iconName: 'Feather',
    color: '#3b82f6',
  },
  performance_copy: {
    id: 'performance_copy',
    name: 'Performance Copy & Ads',
    shortName: 'Performance',
    tagline: 'Ad angles, message-market fit & channel intent',
    description: 'Ad-to-landing page continuity, angle diversification, creative hypothesis testing, and intent matching.',
    iconName: 'Zap',
    color: '#10b981',
  },
  cro: {
    id: 'cro',
    name: 'CRO & Experimentation',
    shortName: 'CRO',
    tagline: 'Friction diagnosis, prioritization & hypothesis design',
    description: 'Quantitative/qualitative signal interpretation, test prioritization frameworks (PIE/ICE), and conversion barriers.',
    iconName: 'Activity',
    color: '#8b5cf6',
  },
};

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: 'Foundation',
  2: 'Competent',
  3: 'Professional',
  4: 'Advanced',
  5: 'Expert',
};

export type QuestionType =
  | 'single_choice'
  | 'multiple_selection'
  | 'ranking'
  | 'copy_diagnosis'
  | 'variant_selection'
  | 'editing'
  | 'rewrite_constraint'
  | 'scenario_decision'
  | 'cro_diagnosis'
  | 'sequence'
  | 'pressure_test';

export interface ChoiceOption {
  id: string;
  text: string;
  annotation?: string;
  contextTag?: string;
}

export interface QuestionContext {
  scenario?: string;
  targetAudience?: string;
  awarenessStage?: string;
  trafficSource?: string;
  channel?: string;
  adAngle?: string;
  adCTR?: string;
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
  discrimination: number; // 0.5 to 2.0 (Item Response discrimination index)
  prompt: string;
  context?: QuestionContext;
  options?: ChoiceOption[];
  // For ranking / sequence: initial options to order
  itemsToOrder?: { id: string; label: string; detail?: string }[];
  // Correct answers (stored server-side, stripped when sent to client during assessment)
  correctAnswer?: string | string[];
  correctOrder?: string[];
  // Rubric / explanation for feedback
  rubricCriteria?: string[];
  explanation: string;
  diagnosticInsight: {
    goodOutcome: string;
    pitfall: string;
  };
}

// Client-safe version of QuestionItem with sensitive answer keys omitted
export type ClientQuestion = Omit<QuestionItem, 'correctAnswer' | 'correctOrder'>;

export type AssessmentStage = 'CALIBRATION' | 'CORE' | 'DEEP_DIVE' | 'PRESSURE_TEST' | 'COMPLETED';

export interface UserResponse {
  questionId: string;
  userAnswer: string | string[]; // selected choice ID, array of IDs, or rewritten text
  timeSpentMs: number;
  timestamp: number;
}

export interface EvaluatedResponse extends UserResponse {
  isCorrect: boolean;
  scoreRatio: number; // 0.0 to 1.0
  domain: DomainId;
  difficulty: DifficultyLevel;
  discrimination: number;
  feedbackText?: string;
  rubricScores?: Record<string, number>;
}

export interface DomainScore {
  domain: DomainId;
  rawScore: number;
  scaledScore: number; // 0 - 100
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
  overallScore: number; // 0 - 100
  percentile: number; // e.g. 92% (Top 8%)
  confidenceLevel: number; // 0 - 100%
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
  currentDifficulty: Record<DomainId, number>; // floating skill estimate
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
  rankChange?: number; // e.g. +8, -3, 0, or undefined (new)
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
export type ResourceType =
  | 'skill'
  | 'plugin'
  | 'extension'
  | 'mcp'
  | 'agent'
  | 'marketplace'
  | 'prompt_pack'
  | 'workflow';

export type PlatformId =
  | 'claude_code'
  | 'codex'
  | 'chatgpt'
  | 'gemini_cli'
  | 'agent_skills'
  | 'mcp_clients'
  | 'other';

export type CompatibilityStatus =
  | 'native'
  | 'supported'
  | 'adaptable'
  | 'unsupported'
  | 'unknown';

export type InstallDifficulty = 'easy' | 'moderate' | 'technical';

export type PricingType = 'free' | 'freemium' | 'paid' | 'unknown';

export type CurationStatus =
  | 'editor_pick'
  | 'curated'
  | 'verified'
  | 'community'
  | 'under_review'
  | 'needs_recheck'
  | 'archived';

export type PromptLevel = 'quick_start' | 'real_work' | 'advanced' | 'power_user';

export interface PromptVariable {
  name: string; // e.g. "PRODUCT"
  label: string; // e.g. "Product / Service"
  placeholder: string; // e.g. "SaaS B2B invoicing tool"
  defaultValue?: string;
}

export interface ResourcePrompt {
  id: string;
  title: string;
  description: string;
  level: PromptLevel;
  useCase: string;
  prompt: string;
  variables: PromptVariable[];
  whyItWorks: string;
  testedPlatforms?: PlatformId[];
  version: number;
  lastReviewedAt: string;
}

export interface InstallStep {
  stepNumber: number;
  title: string;
  description?: string;
  command?: string;
  explanation?: string;
  expectedOutput?: string;
}

export interface InstallGuide {
  platformId: PlatformId;
  platformName: string;
  title: string;
  nativeType: string; // e.g. "Claude Code Skill", "Codex Plugin", "Gemini CLI Extension"
  prerequisites: string[];
  difficulty: InstallDifficulty;
  steps: InstallStep[];
  verification: {
    command?: string;
    instructions: string;
    expectedBehavior: string;
  };
  uninstall?: {
    command?: string;
    steps: string[];
  };
  tested: boolean;
  testedVersion?: string;
  officialSources: { name: string; url: string }[];
  lastVerifiedAt: string;
}

export interface PlatformCompatibility {
  platformId: PlatformId;
  platformName: string;
  status: CompatibilityStatus;
  nativeType?: string;
  tested: boolean;
  testedVersion?: string;
  verifiedAt?: string;
  evidenceUrls: string[];
  notes?: string;
}

export interface SecurityAccess {
  runsLocalCode: boolean;
  networkAccess: boolean;
  readsProjectFiles: boolean;
  writesProjectFiles: boolean;
  requiresApiKey: boolean;
  requiresOAuth: boolean;
  usesMcp: boolean;
  shellAccess: boolean;
  notes?: string;
}

export interface CurationScore {
  overall: number; // e.g. 9.4
  practicalValue: number;
  setupQuality: number;
  documentation: number;
  marketingRelevance: number;
  maintenance: number;
}

export interface AIResource {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  resourceType: ResourceType;
  categories: string[]; // category slugs: 'copywriting', 'cro', 'customer-research', 'content', 'paid-media', 'seo', 'email', 'social', 'positioning', 'brand', 'analytics', 'creative-strategy', 'automation'
  useCases: string[]; // specific jobs: "Review Mining", "Landing Page Audit", "Objection Handling", etc.
  tags: string[];

  author: {
    name: string;
    url?: string;
    handle?: string;
    verified?: boolean;
  };

  source: {
    url: string;
    type: 'official' | 'author' | 'community' | 'fork' | 'mirror';
  };

  repository?: {
    url: string;
    owner?: string;
    repo?: string;
    starsCount?: number;
    defaultBranch?: string;
  };

  license?: string;
  pricing: PricingType;
  installDifficulty: InstallDifficulty;
  curationStatus: CurationStatus;
  curationScore?: CurationScore;
  badges?: string[];

  compatibility: PlatformCompatibility[];
  strengths: string[];
  limitations: string[];
  bestFor: string[];
  notFor: string[];
  security: SecurityAccess;

  installGuides: Partial<Record<PlatformId, InstallGuide>>;
  prompts: ResourcePrompt[];
  alternatives?: {
    name: string;
    slug?: string;
    resourceId?: string;
    reason: string;
  }[];
  collections?: string[]; // collection slugs

  lastVerifiedAt: string; // YYYY-MM-DD
  publishedAt: string;
  updatedAt: string;
  archivedReason?: string;
}

export interface AICollection {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  badge?: string;
  platformId?: PlatformId;
  resourceSlugs: string[];
  workflowSteps?: {
    stepNumber: number;
    stage: string;
    title: string;
    description: string;
    resourceSlug: string;
  }[];
  curatorNote?: string;
  publishedAt: string;
  updatedAt: string;
}

export interface AICategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  jobs: {
    id: string;
    label: string;
    query: string;
  }[];
}

export interface AIPlatformMeta {
  id: PlatformId;
  slug: string;
  name: string;
  badge: string;
  nativeTerm: string;
  description: string;
  officialDocUrl: string;
  installPatternSummary: string;
  supportedTypes: ResourceType[];
}

export interface UserAIStack {
  userId: string;
  installedSlugs: string[];
  wantToTrySlugs: string[];
  favoriteSlugs: string[];
  customPromptPacks: {
    resourceSlug: string;
    promptId: string;
    interpolatedPrompt: string;
    savedAt: string;
  }[];
  preferredPlatform?: PlatformId;
  updatedAt: string;
}

export interface AISubmission {
  id: string;
  url: string;
  name: string;
  category: string;
  primaryPlatform: PlatformId;
  resourceType: ResourceType;
  whyUseful: string;
  submittedByEmail?: string;
  submittedByUid?: string;
  status: 'under_review' | 'accepted' | 'rejected';
  curatorNotes?: string;
  createdAt: string;
}

export interface SearchFilterParams {
  query?: string;
  category?: string;
  platform?: PlatformId;
  type?: ResourceType;
  difficulty?: InstallDifficulty;
  pricing?: PricingType;
  curationStatus?: CurationStatus;
  useCase?: string;
  collection?: string;
}

import {
  AIResource,
  AICollection,
  AICategory,
  AIPlatformMeta,
  UserAIStack,
  AISubmission,
  SearchFilterParams,
  PlatformId,
} from '@/lib/types/ai-upscale';
import {
  AI_RESOURCES,
  AI_COLLECTIONS,
  AI_CATEGORIES,
  AI_PLATFORMS,
} from '@/lib/data/ai-upscale-seed';
import { getFirebaseDb } from './client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// In-memory runtime cache / fallback for server components and instant initial rendering
let customResourcesCache: Map<string, AIResource> = new Map();

/**
 * Fetch all AI resources with fuzzy filtering by use case, category, platform, type, and keyword search
 */
export async function getAIResources(params?: SearchFilterParams): Promise<AIResource[]> {
  let allResources = [...AI_RESOURCES];

  // Try to load any additional dynamic resources from Firestore if in browser/supported environment
  try {
    if (typeof window !== 'undefined') {
      const db = getFirebaseDb();
      const snap = await getDocs(collection(db, 'aiResources'));
      snap.forEach((docSnap) => {
        const data = docSnap.data() as AIResource;
        const existingIdx = allResources.findIndex((r) => r.slug === data.slug || r.id === data.id);
        if (existingIdx >= 0) {
          allResources[existingIdx] = data;
        } else {
          allResources.push(data);
        }
      });
    }
  } catch {
    // Graceful fallback to static seed data
  }

  // Filter out archived resources by default unless specifically asked
  if (!params?.curationStatus || params.curationStatus !== 'archived') {
    allResources = allResources.filter((r) => r.curationStatus !== 'archived');
  }

  if (!params) return allResources;

  let filtered = allResources;

  // Category filter
  if (params.category) {
    filtered = filtered.filter((r) =>
      r.categories.some((c) => c.toLowerCase() === params.category!.toLowerCase())
    );
  }

  // Platform filter
  if (params.platform) {
    filtered = filtered.filter((r) =>
      r.compatibility.some(
        (c) =>
          c.platformId === params.platform &&
          (c.status === 'native' || c.status === 'supported' || c.status === 'adaptable')
      )
    );
  }

  // Technical type filter
  if (params.type) {
    filtered = filtered.filter((r) => r.resourceType === params.type);
  }

  // Install difficulty filter
  if (params.difficulty) {
    filtered = filtered.filter((r) => r.installDifficulty === params.difficulty);
  }

  // Pricing filter
  if (params.pricing) {
    filtered = filtered.filter((r) => r.pricing === params.pricing);
  }

  // Curation status filter
  if (params.curationStatus) {
    filtered = filtered.filter((r) => r.curationStatus === params.curationStatus);
  }

  // Use case filter
  if (params.useCase) {
    const ucLower = params.useCase.toLowerCase();
    filtered = filtered.filter((r) =>
      r.useCases.some((u) => u.toLowerCase().includes(ucLower)) ||
      r.tags.some((t) => t.toLowerCase().includes(ucLower))
    );
  }

  // Collection filter
  if (params.collection) {
    const coll = AI_COLLECTIONS.find(
      (c) => c.slug.toLowerCase() === params.collection!.toLowerCase() || c.id === params.collection
    );
    if (coll) {
      filtered = filtered.filter((r) => coll.resourceSlugs.includes(r.slug));
    }
  }

  // Broad semantic search query (across title, tagline, description, use cases, tags, author, prompts)
  if (params.query && params.query.trim() !== '') {
    const q = params.query.toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(Boolean);

    filtered = filtered.filter((r) => {
      const matchScore = calculateMatchScore(r, q, queryTokens);
      return matchScore > 0;
    });

    // Rank filtered results by relevance match score
    filtered.sort((a, b) => {
      const scoreA = calculateMatchScore(a, q, queryTokens);
      const scoreB = calculateMatchScore(b, q, queryTokens);
      return scoreB - scoreA;
    });
  }

  return filtered;
}

function calculateMatchScore(resource: AIResource, rawQuery: string, tokens: string[]): number {
  let score = 0;
  const nameLower = resource.name.toLowerCase();
  const taglineLower = resource.tagline.toLowerCase();
  const descLower = resource.description.toLowerCase();
  const useCasesLower = resource.useCases.map((u) => u.toLowerCase()).join(' ');
  const tagsLower = resource.tags.map((t) => t.toLowerCase()).join(' ');
  const categoriesLower = resource.categories.join(' ');
  const promptText = resource.prompts.map((p) => `${p.title} ${p.prompt} ${p.useCase}`).join(' ').toLowerCase();

  // Exact phrase match
  if (nameLower.includes(rawQuery)) score += 50;
  if (useCasesLower.includes(rawQuery)) score += 40;
  if (tagsLower.includes(rawQuery)) score += 30;
  if (taglineLower.includes(rawQuery)) score += 25;
  if (categoriesLower.includes(rawQuery)) score += 20;
  if (descLower.includes(rawQuery)) score += 15;
  if (promptText.includes(rawQuery)) score += 10;

  // Keyword token matches
  for (const token of tokens) {
    if (nameLower.includes(token)) score += 15;
    if (useCasesLower.includes(token)) score += 12;
    if (tagsLower.includes(token)) score += 10;
    if (taglineLower.includes(token)) score += 8;
    if (categoriesLower.includes(token)) score += 8;
    if (descLower.includes(token)) score += 5;
    if (promptText.includes(token)) score += 3;
  }

  // Synonym & Marketing intent expansions
  const synonymMap: Record<string, string[]> = {
    'facebook': ['meta', 'paid social', 'ads'],
    'meta': ['facebook', 'instagram', 'ad creative', 'paid social'],
    'reviews': ['customer reviews', 'voc', 'verbatims', 'mining'],
    'objection': ['anxieties', 'hesitation', 'demolition', 'faq'],
    'cro': ['conversion', 'heuristic', 'bounce', 'friction', 'landing page'],
    'landing page': ['hero', 'above the fold', 'headline', 'cro'],
    'seo': ['intent', 'brief', 'topical authority', 'content'],
    'email': ['lifecycle', 'onboarding', 'retention', 'sequence'],
  };

  for (const [key, syns] of Object.entries(synonymMap)) {
    if (rawQuery.includes(key)) {
      for (const syn of syns) {
        if (useCasesLower.includes(syn) || tagsLower.includes(syn) || descLower.includes(syn)) {
          score += 12;
        }
      }
    }
  }

  return score;
}

/**
 * Fetch a single resource by slug
 */
export async function getAIResourceBySlug(slug: string): Promise<AIResource | null> {
  const normalizedSlug = slug.toLowerCase();
  
  // Check static seed first
  const staticFound = AI_RESOURCES.find(
    (r) => r.slug.toLowerCase() === normalizedSlug || r.id.toLowerCase() === normalizedSlug
  );
  if (staticFound) return staticFound;

  // Check Firestore if available
  try {
    if (typeof window !== 'undefined') {
      const db = getFirebaseDb();
      const docRef = doc(db, 'aiResources', normalizedSlug);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as AIResource;
      }
    }
  } catch {
    // Fallback
  }

  return null;
}

export function getAICategories(): AICategory[] {
  return AI_CATEGORIES;
}

export function getAICategoryBySlug(slug: string): AICategory | null {
  const s = slug.toLowerCase();
  return AI_CATEGORIES.find((c) => c.slug.toLowerCase() === s || c.id.toLowerCase() === s) || null;
}

export function getAIPlatforms(): AIPlatformMeta[] {
  return AI_PLATFORMS;
}

export function getAIPlatformBySlug(slug: string): AIPlatformMeta | null {
  const s = slug.toLowerCase();
  return (
    AI_PLATFORMS.find(
      (p) => p.slug.toLowerCase() === s || p.id.toLowerCase() === s.replace('-', '_')
    ) || null
  );
}

export function getAICollections(): AICollection[] {
  return AI_COLLECTIONS;
}

export function getAICollectionBySlug(slug: string): AICollection | null {
  const s = slug.toLowerCase();
  return AI_COLLECTIONS.find((c) => c.slug.toLowerCase() === s || c.id.toLowerCase() === s) || null;
}

/**
 * Fetch User AI Stack (Saved, Installed, Want to Try, Custom Prompts)
 */
export async function getUserAIStack(userId: string): Promise<UserAIStack | null> {
  if (!userId) return null;
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, 'userAIStacks', userId));
    if (snap.exists()) {
      return snap.data() as UserAIStack;
    }
    // Return empty stack default
    return {
      userId,
      installedSlugs: [],
      wantToTrySlugs: [],
      favoriteSlugs: [],
      customPromptPacks: [],
      preferredPlatform: 'claude_code',
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Error fetching user AI stack from Firestore:', error);
    return null;
  }
}

/**
 * Toggle or update resource in user's saved stack
 */
export async function toggleSavedResource(
  userId: string,
  resourceSlug: string,
  list: 'installed' | 'wantToTry' | 'favorites'
): Promise<UserAIStack> {
  const db = getFirebaseDb();
  const stackRef = doc(db, 'userAIStacks', userId);
  const snap = await getDoc(stackRef);

  let stack: UserAIStack = snap.exists()
    ? (snap.data() as UserAIStack)
    : {
        userId,
        installedSlugs: [],
        wantToTrySlugs: [],
        favoriteSlugs: [],
        customPromptPacks: [],
        preferredPlatform: 'claude_code',
        updatedAt: new Date().toISOString(),
      };

  const keyMap = {
    installed: 'installedSlugs',
    wantToTry: 'wantToTrySlugs',
    favorites: 'favoriteSlugs',
  } as const;

  const fieldKey = keyMap[list];
  const currentList = stack[fieldKey] || [];

  if (currentList.includes(resourceSlug)) {
    stack[fieldKey] = currentList.filter((s) => s !== resourceSlug);
  } else {
    stack[fieldKey] = [...currentList, resourceSlug];
  }

  stack.updatedAt = new Date().toISOString();

  await setDoc(stackRef, stack, { merge: true });
  return stack;
}

/**
 * Save user custom prompt configuration
 */
export async function saveUserCustomPrompt(
  userId: string,
  resourceSlug: string,
  promptId: string,
  interpolatedPrompt: string
): Promise<UserAIStack> {
  const db = getFirebaseDb();
  const stackRef = doc(db, 'userAIStacks', userId);
  const snap = await getDoc(stackRef);

  let stack: UserAIStack = snap.exists()
    ? (snap.data() as UserAIStack)
    : {
        userId,
        installedSlugs: [],
        wantToTrySlugs: [],
        favoriteSlugs: [],
        customPromptPacks: [],
        preferredPlatform: 'claude_code',
        updatedAt: new Date().toISOString(),
      };

  const existingIdx = stack.customPromptPacks.findIndex(
    (p) => p.resourceSlug === resourceSlug && p.promptId === promptId
  );

  const newEntry = {
    resourceSlug,
    promptId,
    interpolatedPrompt,
    savedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    stack.customPromptPacks[existingIdx] = newEntry;
  } else {
    stack.customPromptPacks.unshift(newEntry);
  }

  stack.updatedAt = new Date().toISOString();
  await setDoc(stackRef, stack, { merge: true });
  return stack;
}

/**
 * Submit a community resource for review
 */
export async function submitCommunityResource(
  submission: Omit<AISubmission, 'id' | 'createdAt' | 'status'>
): Promise<AISubmission> {
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newSubmission: AISubmission = {
    ...submission,
    id,
    status: 'under_review',
    createdAt: new Date().toISOString(),
  };

  try {
    const db = getFirebaseDb();
    await setDoc(doc(db, 'aiSubmissions', id), newSubmission);
  } catch (error) {
    console.warn('Saved submission locally, firestore fallback:', error);
  }

  return newSubmission;
}

/**
 * Admin: Get all submissions
 */
export async function adminGetSubmissions(): Promise<AISubmission[]> {
  try {
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, 'aiSubmissions'));
    const submissions: AISubmission[] = [];
    snap.forEach((d) => submissions.push(d.data() as AISubmission));
    return submissions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Submissions query error:', error);
    return [];
  }
}

import {
  AIResource,
  AICollection,
  AICategory,
  AIPlatformMeta,
  UserAIStack,
  AISubmission,
  SearchFilterParams,
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
} from 'firebase/firestore';

export async function getAIResources(params?: SearchFilterParams): Promise<AIResource[]> {
  let allResources = [...AI_RESOURCES];

  try {
    if (typeof window !== 'undefined') {
      const db = getFirebaseDb();
      const snap = await getDocs(collection(db, 'aiResources'));
      snap.forEach((docSnap) => {
        const data = docSnap.data() as AIResource;
        const existingIdx = allResources.findIndex(
          (resource) => resource.slug === data.slug || resource.id === data.id
        );
        if (existingIdx >= 0) allResources[existingIdx] = data;
        else allResources.push(data);
      });
    }
  } catch {
    // Static seed remains the deterministic read fallback.
  }

  if (!params?.curationStatus || params.curationStatus !== 'archived') {
    allResources = allResources.filter((resource) => resource.curationStatus !== 'archived');
  }

  if (!params) return allResources;

  let filtered = allResources;

  if (params.category) {
    const category = params.category.toLowerCase();
    filtered = filtered.filter((resource) =>
      resource.categories.some((item) => item.toLowerCase() === category)
    );
  }

  if (params.platform) {
    filtered = filtered.filter((resource) =>
      resource.compatibility.some(
        (item) =>
          item.platformId === params.platform &&
          (item.status === 'native' || item.status === 'supported' || item.status === 'adaptable')
      )
    );
  }

  if (params.type) {
    filtered = filtered.filter((resource) => resource.resourceType === params.type);
  }

  if (params.difficulty) {
    filtered = filtered.filter((resource) => resource.installDifficulty === params.difficulty);
  }

  if (params.pricing) {
    filtered = filtered.filter((resource) => resource.pricing === params.pricing);
  }

  if (params.curationStatus) {
    filtered = filtered.filter((resource) => resource.curationStatus === params.curationStatus);
  }

  if (params.useCase) {
    const useCase = params.useCase.toLowerCase();
    filtered = filtered.filter(
      (resource) =>
        resource.useCases.some((item) => item.toLowerCase().includes(useCase)) ||
        resource.tags.some((item) => item.toLowerCase().includes(useCase))
    );
  }

  if (params.collection) {
    const collectionDefinition = AI_COLLECTIONS.find(
      (item) =>
        item.slug.toLowerCase() === params.collection!.toLowerCase() ||
        item.id === params.collection
    );
    if (collectionDefinition) {
      filtered = filtered.filter((resource) =>
        collectionDefinition.resourceSlugs.includes(resource.slug)
      );
    }
  }

  if (params.query?.trim()) {
    const query = params.query.toLowerCase().trim();
    const queryTokens = query.split(/\s+/).filter(Boolean);

    filtered = filtered
      .map((resource) => ({
        resource,
        score: calculateMatchScore(resource, query, queryTokens),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.resource);
  }

  return filtered;
}

function calculateMatchScore(resource: AIResource, rawQuery: string, tokens: string[]): number {
  let score = 0;
  const name = resource.name.toLowerCase();
  const tagline = resource.tagline.toLowerCase();
  const description = resource.description.toLowerCase();
  const useCases = resource.useCases.map((item) => item.toLowerCase()).join(' ');
  const tags = resource.tags.map((item) => item.toLowerCase()).join(' ');
  const categories = resource.categories.join(' ');
  const promptText = resource.prompts
    .map((prompt) => `${prompt.title} ${prompt.prompt} ${prompt.useCase}`)
    .join(' ')
    .toLowerCase();

  if (name.includes(rawQuery)) score += 50;
  if (useCases.includes(rawQuery)) score += 40;
  if (tags.includes(rawQuery)) score += 30;
  if (tagline.includes(rawQuery)) score += 25;
  if (categories.includes(rawQuery)) score += 20;
  if (description.includes(rawQuery)) score += 15;
  if (promptText.includes(rawQuery)) score += 10;

  for (const token of tokens) {
    if (name.includes(token)) score += 15;
    if (useCases.includes(token)) score += 12;
    if (tags.includes(token)) score += 10;
    if (tagline.includes(token)) score += 8;
    if (categories.includes(token)) score += 8;
    if (description.includes(token)) score += 5;
    if (promptText.includes(token)) score += 3;
  }

  const synonymMap: Record<string, string[]> = {
    facebook: ['meta', 'paid social', 'ads'],
    meta: ['facebook', 'instagram', 'ad creative', 'paid social'],
    reviews: ['customer reviews', 'voc', 'verbatims', 'mining'],
    objection: ['anxieties', 'hesitation', 'demolition', 'faq'],
    cro: ['conversion', 'heuristic', 'bounce', 'friction', 'landing page'],
    'landing page': ['hero', 'above the fold', 'headline', 'cro'],
    seo: ['intent', 'brief', 'topical authority', 'content'],
    email: ['lifecycle', 'onboarding', 'retention', 'sequence'],
  };

  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (!rawQuery.includes(key)) continue;
    for (const synonym of synonyms) {
      if (useCases.includes(synonym) || tags.includes(synonym) || description.includes(synonym)) {
        score += 12;
      }
    }
  }

  return score;
}

export async function getAIResourceBySlug(slug: string): Promise<AIResource | null> {
  const normalizedSlug = slug.toLowerCase();
  const staticFound = AI_RESOURCES.find(
    (resource) =>
      resource.slug.toLowerCase() === normalizedSlug ||
      resource.id.toLowerCase() === normalizedSlug
  );
  if (staticFound) return staticFound;

  try {
    if (typeof window !== 'undefined') {
      const db = getFirebaseDb();
      const snapshot = await getDoc(doc(db, 'aiResources', normalizedSlug));
      if (snapshot.exists()) return snapshot.data() as AIResource;
    }
  } catch {
    // No dynamic result, return null below.
  }

  return null;
}

export function getAICategories(): AICategory[] {
  return AI_CATEGORIES;
}

export function getAICategoryBySlug(slug: string): AICategory | null {
  const normalized = slug.toLowerCase();
  return (
    AI_CATEGORIES.find(
      (category) =>
        category.slug.toLowerCase() === normalized || category.id.toLowerCase() === normalized
    ) || null
  );
}

export function getAIPlatforms(): AIPlatformMeta[] {
  return AI_PLATFORMS;
}

export function getAIPlatformBySlug(slug: string): AIPlatformMeta | null {
  const normalized = slug.toLowerCase();
  return (
    AI_PLATFORMS.find(
      (platform) =>
        platform.slug.toLowerCase() === normalized ||
        platform.id.toLowerCase() === normalized.replace('-', '_')
    ) || null
  );
}

export function getAICollections(): AICollection[] {
  return AI_COLLECTIONS;
}

export function getAICollectionBySlug(slug: string): AICollection | null {
  const normalized = slug.toLowerCase();
  return (
    AI_COLLECTIONS.find(
      (collectionDefinition) =>
        collectionDefinition.slug.toLowerCase() === normalized ||
        collectionDefinition.id.toLowerCase() === normalized
    ) || null
  );
}

export async function getUserAIStack(userId: string): Promise<UserAIStack | null> {
  if (!userId) return null;
  try {
    const db = getFirebaseDb();
    const snapshot = await getDoc(doc(db, 'userAIStacks', userId));
    if (snapshot.exists()) return snapshot.data() as UserAIStack;

    return createEmptyStack(userId);
  } catch (error) {
    console.warn('Error fetching user AI stack from Firestore:', error);
    return null;
  }
}

export async function toggleSavedResource(
  userId: string,
  resourceSlug: string,
  list: 'installed' | 'wantToTry' | 'favorites'
): Promise<UserAIStack> {
  const db = getFirebaseDb();
  const stackRef = doc(db, 'userAIStacks', userId);
  const snapshot = await getDoc(stackRef);
  const stack: UserAIStack = snapshot.exists()
    ? (snapshot.data() as UserAIStack)
    : createEmptyStack(userId);

  const keyMap = {
    installed: 'installedSlugs',
    wantToTry: 'wantToTrySlugs',
    favorites: 'favoriteSlugs',
  } as const;

  const field = keyMap[list];
  const current = stack[field] || [];
  stack[field] = current.includes(resourceSlug)
    ? current.filter((slug) => slug !== resourceSlug)
    : [...current, resourceSlug];
  stack.updatedAt = new Date().toISOString();

  await setDoc(stackRef, stack, { merge: true });
  return stack;
}

export async function saveUserCustomPrompt(
  userId: string,
  resourceSlug: string,
  promptId: string,
  interpolatedPrompt: string
): Promise<UserAIStack> {
  const db = getFirebaseDb();
  const stackRef = doc(db, 'userAIStacks', userId);
  const snapshot = await getDoc(stackRef);
  const stack: UserAIStack = snapshot.exists()
    ? (snapshot.data() as UserAIStack)
    : createEmptyStack(userId);

  const existingIndex = stack.customPromptPacks.findIndex(
    (prompt) => prompt.resourceSlug === resourceSlug && prompt.promptId === promptId
  );
  const newEntry = {
    resourceSlug,
    promptId,
    interpolatedPrompt,
    savedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) stack.customPromptPacks[existingIndex] = newEntry;
  else stack.customPromptPacks.unshift(newEntry);

  stack.updatedAt = new Date().toISOString();
  await setDoc(stackRef, stack, { merge: true });
  return stack;
}

export async function submitCommunityResource(
  submission: Omit<AISubmission, 'id' | 'createdAt' | 'status'>
): Promise<AISubmission> {
  if (!submission.submittedByUid) {
    throw new Error('Sign in before submitting a community resource');
  }

  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newSubmission: AISubmission = {
    ...submission,
    id,
    status: 'under_review',
    createdAt: new Date().toISOString(),
  };

  const db = getFirebaseDb();
  await setDoc(doc(db, 'aiSubmissions', id), newSubmission);
  return newSubmission;
}

export async function adminGetSubmissions(): Promise<AISubmission[]> {
  try {
    const db = getFirebaseDb();
    const snapshot = await getDocs(collection(db, 'aiSubmissions'));
    const submissions: AISubmission[] = [];
    snapshot.forEach((item) => submissions.push(item.data() as AISubmission));
    return submissions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Submissions query error:', error);
    return [];
  }
}

function createEmptyStack(userId: string): UserAIStack {
  return {
    userId,
    installedSlugs: [],
    wantToTrySlugs: [],
    favoriteSlugs: [],
    customPromptPacks: [],
    preferredPlatform: 'claude_code',
    updatedAt: new Date().toISOString(),
  };
}

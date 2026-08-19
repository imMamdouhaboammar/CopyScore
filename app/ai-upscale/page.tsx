'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AICollection,
  AIResource,
  InstallDifficulty,
  PlatformId,
  PricingType,
  ResourceType,
} from '@/lib/types/ai-upscale';
import { getAIResources, getUserAIStack, toggleSavedResource } from '@/lib/firebase/ai-upscale';
import {
  AI_CATEGORIES,
  AI_COLLECTIONS,
  AI_PLATFORMS,
  AI_RESOURCES,
} from '@/lib/data/ai-upscale-seed';
import { AiUpscaleHero } from '@/components/ai-upscale/AiUpscaleHero';
import { PlatformSelector } from '@/components/ai-upscale/PlatformSelector';
import { StartWithJobGrid } from '@/components/ai-upscale/StartWithJobGrid';
import { ResourceCard } from '@/components/ai-upscale/ResourceCard';
import { CollectionsShowcase } from '@/components/ai-upscale/CollectionsShowcase';
import { SmartFinderModal } from '@/components/ai-upscale/SmartFinderModal';
import { SubmitResourceModal } from '@/components/ai-upscale/SubmitResourceModal';
import { CompareDrawer } from '@/components/ai-upscale/CompareDrawer';
import { useAuth } from '@/lib/auth/context';
import { Bookmark, SlidersHorizontal, Sparkles } from 'lucide-react';

const RESOURCE_TYPES: Array<{ value: ResourceType; label: string }> = [
  { value: 'skill', label: 'Skill' },
  { value: 'plugin', label: 'Plugin' },
  { value: 'extension', label: 'Extension' },
  { value: 'mcp', label: 'MCP Server' },
  { value: 'agent', label: 'Agent' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'prompt_pack', label: 'Prompt Pack' },
  { value: 'workflow', label: 'Workflow' },
];

const DIFFICULTIES: InstallDifficulty[] = ['easy', 'moderate', 'technical'];
const PRICING: PricingType[] = ['free', 'freemium', 'paid', 'unknown'];

export default function AiUpscaleDirectoryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<AIResource[]>(AI_RESOURCES);
  const [collections] = useState<AICollection[]>(AI_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<InstallDifficulty | 'all'>('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingType | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [activeJobQuery, setActiveJobQuery] = useState<string | undefined>();
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      const loadedResources = await getAIResources();
      setResources(loadedResources);

      if (user?.uid) {
        const stack = await getUserAIStack(user.uid);
        if (stack) setSavedSlugs([...stack.installedSlugs, ...stack.favoriteSlugs]);
      }
    }

    void loadData();
  }, [user?.uid]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const platform of AI_PLATFORMS) {
      counts[platform.id] = resources.filter((resource) =>
        resource.compatibility.some(
          (compatibility) =>
            compatibility.platformId === platform.id &&
            ['native', 'supported', 'adaptable'].includes(compatibility.status)
        )
      ).length;
    }
    return counts;
  }, [resources]);

  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    if (selectedCollection) {
      const collection = collections.find((item) => item.slug === selectedCollection);
      if (collection) {
        filtered = filtered.filter((resource) => collection.resourceSlugs.includes(resource.slug));
      }
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter((resource) =>
        resource.compatibility.some(
          (compatibility) =>
            compatibility.platformId === selectedPlatform &&
            ['native', 'supported', 'adaptable'].includes(compatibility.status)
        )
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((resource) => resource.categories.includes(selectedCategory));
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((resource) => resource.resourceType === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((resource) => resource.installDifficulty === selectedDifficulty);
    }

    if (selectedPricing !== 'all') {
      filtered = filtered.filter((resource) => resource.pricing === selectedPricing);
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      filtered = filtered.filter((resource) => {
        const searchable = [
          resource.name,
          resource.tagline,
          resource.description,
          ...resource.useCases,
          ...resource.tags,
          ...resource.categories,
        ]
          .join(' ')
          .toLowerCase();
        return searchable.includes(normalizedQuery);
      });
    }

    return filtered;
  }, [
    collections,
    resources,
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedDifficulty,
    selectedPlatform,
    selectedPricing,
    selectedType,
  ]);

  const comparedResources = useMemo(
    () => resources.filter((resource) => comparedSlugs.includes(resource.slug)),
    [comparedSlugs, resources]
  );

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedPlatform !== 'all' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedPricing !== 'all' ||
    selectedCollection !== null;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedPricing('all');
    setSelectedCollection(null);
    setActiveJobQuery(undefined);
  };

  const handleSelectJob = (jobQuery: string, categorySlug?: string) => {
    setSearchQuery(jobQuery);
    setActiveJobQuery(jobQuery);
    if (categorySlug) setSelectedCategory(categorySlug);
  };

  const handleToggleCompare = (slug: string) => {
    setComparedSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  };

  const handleSaveToStack = async (slug: string) => {
    if (!user?.uid) {
      setSavedSlugs((current) =>
        current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
      );
      return;
    }

    const updated = await toggleSavedResource(user.uid, slug, 'favorites');
    setSavedSlugs([...updated.installedSlugs, ...updated.favoriteSlugs]);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      <div className="border-b border-[#0f0f11] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#df9367] transition-colors">
              COPYSCORE
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold">AI UPSCALE DIRECTORY</span>
          </div>
          <Link
            href="/ai-upscale/my-stack"
            className="flex items-center gap-1.5 hover:text-[#df9367]"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#df9367]" />
            <span>MY AI STACK ({savedSlugs.length})</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        <AiUpscaleHero
          query={searchQuery}
          onQueryChange={(query) => {
            setSearchQuery(query);
            if (activeJobQuery && query !== activeJobQuery) setActiveJobQuery(undefined);
          }}
          onOpenFinder={() => setIsFinderOpen(true)}
          onOpenSubmit={() => setIsSubmitOpen(true)}
          totalResourcesCount={resources.length}
        />

        <div className="patter-card bg-white p-4">
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            resourceCounts={platformCounts}
          />
        </div>

        <StartWithJobGrid onSelectJob={handleSelectJob} activeJob={activeJobQuery} />

        <CollectionsShowcase
          collections={collections}
          onSelectCollection={(slug) =>
            setSelectedCollection((current) => (current === slug ? null : slug))
          }
          activeCollectionSlug={selectedCollection || undefined}
        />

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0f0f11] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[#0f0f11]" />
              <h2 className="font-mono font-bold text-sm sm:text-base uppercase tracking-wider">
                Curated Resource Catalog
              </h2>
              <span className="text-xs font-mono bg-[#df9367] px-2 py-0.5 font-bold">
                {filteredResources.length} RESULTS
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-mono text-[#c47648] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters((value) => !value)}
                className={`patter-btn px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                  showAdvancedFilters ? 'bg-[#0f0f11] text-white' : 'bg-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <FilterButton active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
              All categories
            </FilterButton>
            {AI_CATEGORIES.map((category) => (
              <FilterButton
                key={category.id}
                active={selectedCategory === category.slug}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </FilterButton>
            ))}
          </div>

          {showAdvancedFilters && (
            <div className="patter-card bg-[#fcfbf8] p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <FilterSelect
                label="Resource type"
                value={selectedType}
                onChange={(value) => setSelectedType(value as ResourceType | 'all')}
                options={RESOURCE_TYPES.map((item) => ({ value: item.value, label: item.label }))}
              />
              <FilterSelect
                label="Install difficulty"
                value={selectedDifficulty}
                onChange={(value) => setSelectedDifficulty(value as InstallDifficulty | 'all')}
                options={DIFFICULTIES.map((value) => ({ value, label: value }))}
              />
              <FilterSelect
                label="Pricing"
                value={selectedPricing}
                onChange={(value) => setSelectedPricing(value as PricingType | 'all')}
                options={PRICING.map((value) => ({ value, label: value }))}
              />
            </div>
          )}
        </section>

        {filteredResources.length === 0 ? (
          <div className="patter-card bg-white p-12 text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
            <Sparkles className="w-8 h-8 text-[#df9367] mx-auto" />
            <h3 className="font-mono font-bold text-base">No resources match these filters</h3>
            <p className="text-xs text-[#52525b] max-w-md mx-auto">
              Clear one or more filters, or submit a resource for review.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={resetFilters} className="patter-btn px-4 py-2 text-xs font-mono">
                Reset filters
              </button>
              <button
                onClick={() => setIsSubmitOpen(true)}
                className="patter-btn patter-btn-peach px-4 py-2 text-xs font-mono font-bold"
              >
                Submit resource
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onToggleCompare={handleToggleCompare}
                isCompared={comparedSlugs.includes(resource.slug)}
                onSaveToStack={handleSaveToStack}
                isSaved={savedSlugs.includes(resource.slug)}
              />
            ))}
          </div>
        )}
      </div>

      <CompareDrawer
        isOpen={comparedSlugs.length > 0}
        onClose={() => setComparedSlugs([])}
        comparedResources={comparedResources}
        onRemoveResource={handleToggleCompare}
        onClearAll={() => setComparedSlugs([])}
      />
      <SmartFinderModal
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        resources={resources}
      />
      <SubmitResourceModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`patter-btn px-3 py-1.5 text-xs font-mono whitespace-nowrap cursor-pointer ${
        active ? 'bg-[#0f0f11] text-white' : 'bg-white hover:bg-[#fcfbf8]'
      }`}
    >
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="font-bold text-[11px] uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white border border-[#0f0f11] p-2 text-xs focus:outline-none"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

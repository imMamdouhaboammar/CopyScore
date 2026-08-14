'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AIResource,
  AICollection,
  PlatformId,
  ResourceType,
  InstallDifficulty,
  PricingModel,
} from '@/lib/types/ai-upscale';
import {
  getAIResources,
  getAICollections,
  getAICategories,
  getAIPlatforms,
  getUserAIStack,
  toggleSavedResource,
} from '@/lib/firebase/ai-upscale';
import {
  AI_RESOURCES,
  AI_COLLECTIONS,
  AI_CATEGORIES,
  AI_PLATFORMS,
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
import {
  Filter,
  Layers,
  Sparkles,
  SlidersHorizontal,
  X,
  Bookmark,
  ExternalLink,
  Cpu,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AiUpscaleDirectoryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<AIResource[]>(AI_RESOURCES);
  const [collections] = useState<AICollection[]>(AI_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<InstallDifficulty | 'all'>('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [activeJobQuery, setActiveJobQuery] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Load resources & user stack
  useEffect(() => {
    async function loadData() {
      const res = await getAIResources();
      setResources(res);

      if (user?.uid) {
        const stack = await getUserAIStack(user.uid);
        if (stack) {
          setSavedSlugs([...stack.installedSlugs, ...stack.favoriteSlugs]);
        }
      }
    }
    loadData();
  }, [user?.uid]);

  // Compute resource counts per platform
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of AI_PLATFORMS) {
      counts[p.id] = resources.filter((r) =>
        r.compatibility.some(
          (c) =>
            c.platformId === p.id &&
            (c.status === 'native' || c.status === 'supported' || c.status === 'adaptable')
        )
      ).length;
    }
    return counts;
  }, [resources]);

  // Handle Job selection
  const handleSelectJob = (jobQuery: string, categorySlug?: string) => {
    setSearchQuery(jobQuery);
    setActiveJobQuery(jobQuery);
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  };

  // Handle Collection toggle
  const handleSelectCollection = (slug: string) => {
    if (selectedCollection === slug) {
      setSelectedCollection(null);
    } else {
      setSelectedCollection(slug);
    }
  };

  // Compare handlers
  const handleToggleCompare = (slug: string) => {
    if (comparedSlugs.includes(slug)) {
      setComparedSlugs(comparedSlugs.filter((s) => s !== slug));
    } else {
      if (comparedSlugs.length >= 3) {
        alert('You can compare up to 3 resources simultaneously.');
        return;
      }
      setComparedSlugs([...comparedSlugs, slug]);
    }
  };

  // Save to stack handler
  const handleSaveToStack = async (slug: string) => {
    if (!user?.uid) {
      // Local optimistic toggle for anonymous guests
      if (savedSlugs.includes(slug)) {
        setSavedSlugs(savedSlugs.filter((s) => s !== slug));
      } else {
        setSavedSlugs([...savedSlugs, slug]);
      }
      return;
    }

    try {
      const updated = await toggleSavedResource(user.uid, slug, 'favorites');
      setSavedSlugs([...updated.installedSlugs, ...updated.favoriteSlugs]);
    } catch (err) {
      console.error('Error saving resource:', err);
    }
  };

  // Filtered resources pipeline
  const filteredResources = useMemo(() => {
    let list = [...resources];

    // Collection filter
    if (selectedCollection) {
      const coll = collections.find((c) => c.slug === selectedCollection);
      if (coll) {
        list = list.filter((r) => coll.resourceSlugs.includes(r.slug));
      }
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      list = list.filter((r) =>
        r.compatibility.some(
          (c) =>
            c.platformId === selectedPlatform &&
            (c.status === 'native' || c.status === 'supported' || c.status === 'adaptable')
        )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((r) => r.categories.includes(selectedCategory));
    }

    // Resource type filter
    if (selectedType !== 'all') {
      list = list.filter((r) => r.resourceType === selectedType);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      list = list.filter((r) => r.installDifficulty === selectedDifficulty);
    }

    // Pricing filter
    if (selectedPricing !== 'all') {
      list = list.filter((r) => r.pricing === selectedPricing);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        return (
          r.name.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.useCases.some((u) => u.toLowerCase().includes(q)) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.categories.some((c) => c.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [
    resources,
    collections,
    selectedCollection,
    selectedPlatform,
    selectedCategory,
    selectedType,
    selectedDifficulty,
    selectedPricing,
    searchQuery,
  ]);

  const comparedResourcesList = useMemo(() => {
    return resources.filter((r) => comparedSlugs.includes(r.slug));
  }, [resources, comparedSlugs]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedPricing('all');
    setSelectedCollection(null);
    setActiveJobQuery(undefined);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedPlatform !== 'all' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedPricing !== 'all' ||
    selectedCollection !== null;

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      {/* Subheader Utility Breadcrumb */}
      <div className="border-b border-[#0f0f11] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#df9367] transition-colors">
              REMIX COPYSCORE
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold text-[#0f0f11]">AI UPSCALE DIRECTORY</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/ai-upscale/my-stack"
              className="flex items-center gap-1.5 text-[#0f0f11] hover:text-[#df9367] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#df9367]" />
              <span>MY AI STACK ({savedSlugs.length})</span>
            </Link>

            <Link
              href="/ai-upscale/categories"
              className="text-[#52525b] hover:text-[#0f0f11] transition-colors hidden sm:inline"
            >
              CATEGORIES
            </Link>

            <Link
              href="/ai-upscale/platforms"
              className="text-[#52525b] hover:text-[#0f0f11] transition-colors hidden sm:inline"
            >
              PLATFORMS
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Hero & Fast Search */}
        <AiUpscaleHero
          query={searchQuery}
          onQueryChange={(q) => {
            setSearchQuery(q);
            if (activeJobQuery && q !== activeJobQuery) {
              setActiveJobQuery(undefined);
            }
          }}
          onOpenFinder={() => setIsFinderOpen(true)}
          onOpenSubmit={() => setIsSubmitOpen(true)}
          totalResourcesCount={resources.length}
        />

        {/* Platform Selector */}
        <div className="patter-card bg-white p-4">
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onSelectPlatform={setSelectedPlatform}
            resourceCounts={platformCounts}
          />
        </div>

        {/* Start With Your Job Interactive Discovery Grid */}
        <StartWithJobGrid onSelectJob={handleSelectJob} activeJob={activeJobQuery} />

        {/* Curated Workflow Stacks / Bundles */}
        <CollectionsShowcase
          collections={collections}
          onSelectCollection={handleSelectCollection}
          activeCollectionSlug={selectedCollection || undefined}
        />

        {/* Directory Controls & Categories Navigation */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0f0f11] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[#0f0f11]" />
              <h2 className="font-mono font-bold text-sm sm:text-base uppercase tracking-wider text-[#0f0f11]">
                Curated Skill & Tool Catalog
              </h2>
              <span className="text-xs font-mono bg-[#df9367] text-[#0f0f11] px-2 py-0.5 font-bold">
                {filteredResources.length} RESULTS
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-mono text-[#df9367] hover:underline cursor-pointer"
                >
                  Reset All Filters [x]
                </button>
              )}

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`patter-btn px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAdvancedFilters ? 'bg-[#0f0f11] text-white' : 'bg-white text-[#0f0f11]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {showAdvancedFilters ? '▲' : '▼'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`patter-btn px-3 py-1.5 text-xs font-mono whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0f0f11] text-white shadow-[2px_2px_0px_#52525b]'
                  : 'bg-white text-[#0f0f11] hover:bg-[#fcfbf8]'
              }`}
            >
              ALL CATEGORIES
            </button>
            {AI_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`patter-btn px-3 py-1.5 text-xs font-mono whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f0f11] text-white shadow-[2px_2px_0px_#df9367]'
                      : 'bg-white text-[#0f0f11] hover:bg-[#fcfbf8]'
                  }`}
                >
                  {cat.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Expandable Advanced Filters Row */}
          {showAdvancedFilters && (
            <div className="patter-card bg-[#fcfbf8] p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs border-[#0f0f11]">
              {/* Type Filter */}
              <div className="space-y-1">
                <label className="font-bold text-[#0f0f11] text-[11px]">TECHNICAL TYPE:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ResourceType | 'all')}
                  className="w-full bg-white border border-[#0f0f11] p-2 text-xs text-[#0f0f11] focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="claude_skill">Claude Skill</option>
                  <option value="mcp_server">MCP Server</option>
                  <option value="prompt_pack">Prompt Pack</option>
                  <option value="cli_tool">CLI Tool</option>
                  <option value="browser_extension">Browser Extension</option>
                  <option value="custom_gpt">Custom GPT</option>
                </select>
              </div>

              {/* Install Difficulty */}
              <div className="space-y-1">
                <label className="font-bold text-[#0f0f11] text-[11px]">INSTALL DIFFICULTY:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) =>
                    setSelectedDifficulty(e.target.value as InstallDifficulty | 'all')
                  }
                  className="w-full bg-white border border-[#0f0f11] p-2 text-xs text-[#0f0f11] focus:outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="zero_install">Zero Install (Copy & Run)</option>
                  <option value="one_command">One Command</option>
                  <option value="configuration">Config File / Env Required</option>
                </select>
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                <label className="font-bold text-[#0f0f11] text-[11px]">PRICING / LICENSING:</label>
                <select
                  value={selectedPricing}
                  onChange={(e) => setSelectedPricing(e.target.value as PricingModel | 'all')}
                  className="w-full bg-white border border-[#0f0f11] p-2 text-xs text-[#0f0f11] focus:outline-none"
                >
                  <option value="all">All Pricing</option>
                  <option value="free_open_source">100% Free & Open Source</option>
                  <option value="freemium">Freemium</option>
                  <option value="byok">BYOK (Bring Your Own Key)</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-mono">
              <span className="text-[#8c8b85] text-[11px]">ACTIVE FILTERS:</span>
              {selectedPlatform !== 'all' && (
                <span className="bg-[#0f0f11] text-white px-2 py-0.5 flex items-center gap-1">
                  Platform: {selectedPlatform}
                  <button onClick={() => setSelectedPlatform('all')}>×</button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-[#0f0f11] text-white px-2 py-0.5 flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {selectedCollection && (
                <span className="bg-[#df9367] text-[#0f0f11] font-bold px-2 py-0.5 flex items-center gap-1">
                  Bundle: {selectedCollection}
                  <button onClick={() => setSelectedCollection(null)}>×</button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-white border border-[#0f0f11] px-2 py-0.5 flex items-center gap-1">
                  Query: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="patter-card bg-white p-12 text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
            <Sparkles className="w-8 h-8 text-[#df9367] mx-auto" />
            <h3 className="font-mono font-bold text-base text-[#0f0f11]">
              No AI Resources Match Your Active Filter Criteria
            </h3>
            <p className="text-xs text-[#52525b] max-w-md mx-auto">
              Try clearing specific platform or difficulty filters, or submit a request for our team to research and audit this tool.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={resetAllFilters}
                className="patter-btn patter-btn-peach px-4 py-2 text-xs font-mono font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsSubmitOpen(true)}
                className="patter-btn px-4 py-2 text-xs font-mono font-bold bg-white cursor-pointer"
              >
                Submit New Skill
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onToggleCompare={handleToggleCompare}
                isCompared={comparedSlugs.includes(res.slug)}
                onSaveToStack={handleSaveToStack}
                isSaved={savedSlugs.includes(res.slug)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Compare Drawer */}
      <CompareDrawer
        isOpen={comparedSlugs.length > 0}
        onClose={() => setComparedSlugs([])}
        comparedResources={comparedResourcesList}
        onRemoveResource={handleToggleCompare}
        onClearAll={() => setComparedSlugs([])}
      />

      {/* Smart Matcher Modal */}
      <SmartFinderModal
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        resources={resources}
      />

      {/* Submit Skill Modal */}
      <SubmitResourceModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AIResource,
  PlatformId,
  UserAIStack,
} from '@/lib/types/ai-upscale';
import {
  getAIResourceBySlug,
  getAIResources,
  getUserAIStack,
  toggleSavedResource,
  saveUserCustomPrompt,
} from '@/lib/firebase/ai-upscale';
import { InstallGuideSection } from '@/components/ai-upscale/InstallGuideSection';
import { PromptLibrarySection } from '@/components/ai-upscale/PromptLibrarySection';
import { SecurityAccessPanel } from '@/components/ai-upscale/SecurityAccessPanel';
import { CompatibilityMatrix } from '@/components/ai-upscale/CompatibilityMatrix';
import { ResourceCard } from '@/components/ai-upscale/ResourceCard';
import { PlatformIcon } from '@/components/ai-upscale/PlatformIcon';
import { useAuth } from '@/lib/auth/context';
import {
  Bookmark,
  Check,
  Share2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal,
  FileText,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function AIResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();

  const [resource, setResource] = useState<AIResource | null>(null);
  const [relatedResources, setRelatedResources] = useState<AIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<PlatformId>('claude_code');

  useEffect(() => {
    async function loadResourceData() {
      if (!slug) return;
      setLoading(true);
      const data = await getAIResourceBySlug(slug);
      setResource(data);

      if (data) {
        // Load related resources from same category
        const all = await getAIResources({ category: data.categories[0] });
        setRelatedResources(all.filter((r) => r.slug !== data.slug).slice(0, 3));
      }

      if (user?.uid) {
        const stack = await getUserAIStack(user.uid);
        if (stack) {
          setIsSaved(stack.favoriteSlugs.includes(slug));
          setIsInstalled(stack.installedSlugs.includes(slug));
        }
      }
      setLoading(false);
    }
    loadResourceData();
  }, [slug, user?.uid]);

  const handleToggleFavorite = async () => {
    if (!resource) return;
    if (!user?.uid) {
      setIsSaved(!isSaved);
      return;
    }
    try {
      const updated = await toggleSavedResource(user.uid, resource.slug, 'favorites');
      setIsSaved(updated.favoriteSlugs.includes(resource.slug));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleInstalled = async () => {
    if (!resource) return;
    if (!user?.uid) {
      setIsInstalled(!isInstalled);
      return;
    }
    try {
      const updated = await toggleSavedResource(user.uid, resource.slug, 'installed');
      setIsInstalled(updated.installedSlugs.includes(resource.slug));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSaveCustomPrompt = async (promptId: string, customText: string) => {
    if (!user?.uid || !resource) return;
    try {
      await saveUserCustomPrompt(user.uid, resource.slug, promptId, customText);
    } catch (err) {
      console.error('Error saving prompt:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center p-6">
        <div className="patter-card bg-white p-8 text-center space-y-3 font-mono text-xs shadow-[4px_4px_0px_#0f0f11]">
          <div className="h-6 w-6 border-2 border-[#df9367] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold text-[#0f0f11]">LOADING VERIFIED AI SKILL GUIDE...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center p-6">
        <div className="patter-card bg-white max-w-md w-full p-8 text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
          <AlertTriangle className="w-8 h-8 text-[#df9367] mx-auto" />
          <h2 className="font-mono font-bold text-lg text-[#0f0f11]">AI Skill Not Found</h2>
          <p className="text-xs text-[#52525b]">
            The requested marketing AI skill or workflow &ldquo;{slug}&rdquo; could not be located in our verified catalog.
          </p>
          <Link
            href="/ai-upscale"
            className="patter-btn patter-btn-peach text-xs font-mono font-bold py-2 px-4 inline-block"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      {/* Breadcrumbs Header */}
      <div className="border-b border-[#0f0f11] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/ai-upscale" className="text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>DIRECTORY</span>
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="text-[#52525b] uppercase">{resource.categories[0]}</span>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold text-[#0f0f11] uppercase">{resource.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-[#15803d]" /> : <Share2 className="w-3 h-3" />}
              <span>{copiedLink ? 'COPIED LINK' : 'SHARE'}</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                isSaved ? 'bg-[#df9367] text-[#0f0f11]' : 'bg-white text-[#0f0f11]'
              }`}
            >
              <Bookmark className="w-3 h-3" fill={isSaved ? '#0f0f11' : 'none'} />
              <span>{isSaved ? 'SAVED TO STACK' : 'SAVE TO STACK'}</span>
            </button>

            <button
              onClick={handleToggleInstalled}
              className={`patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                isInstalled
                  ? 'bg-[#15803d] text-white border-[#15803d]'
                  : 'bg-[#0f0f11] text-white'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{isInstalled ? 'INSTALLED [✓]' : 'MARK INSTALLED'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Main Hero Card */}
        <div className="patter-card bg-white p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#0f0f11] border-[2px] border-[#0f0f11]">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="patter-pill bg-[#0f0f11] text-white text-xs font-mono uppercase font-bold py-0.5 px-2.5">
                {resource.resourceType.toUpperCase()}
              </span>
              <span className="patter-pill bg-[#f7f6f0] text-[#0f0f11] text-xs font-mono uppercase font-bold py-0.5 px-2.5 border border-[#0f0f11]">
                {resource.categories[0]?.replace('-', ' ')}
              </span>
              <span className="patter-pill bg-[#eaf8ee] text-[#15803d] text-xs font-mono uppercase font-bold py-0.5 px-2.5 border border-[#15803d]">
                {resource.pricing.toUpperCase()}
              </span>
              <span className="patter-pill bg-[#eeece4] text-[#52525b] text-xs font-mono uppercase py-0.5 px-2">
                DIFFICULTY: {resource.installDifficulty.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {resource.curationScore && (
              <div className="flex items-center gap-2 bg-[#fcf4ee] border border-[#df9367] px-3 py-1 font-mono text-xs">
                <Sparkles className="w-4 h-4 text-[#df9367]" />
                <span className="font-bold text-[#c47648]">EDITORIAL SCORE:</span>
                <span className="font-extrabold text-sm text-[#0f0f11]">
                  {resource.curationScore.overall.toFixed(1)} / 10
                </span>
              </div>
            )}
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="font-mono font-black text-2xl sm:text-4xl text-[#0f0f11] tracking-tight leading-tight">
              {resource.name}
            </h1>
            <p className="text-base sm:text-lg text-[#52525b] font-medium leading-relaxed max-w-4xl">
              {resource.tagline}
            </p>
          </div>

          {/* Direct Platform Quick Navigation */}
          <div className="border-t border-b border-[#f0eee6] py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#8c8b85] font-bold">COMPATIBLE ENVIRONMENTS:</span>
              <div className="flex flex-wrap gap-1.5">
                {resource.compatibility.map((c) => (
                  <a
                    key={c.platformId}
                    href="#installation"
                    onClick={() => setSelectedPlatformTab(c.platformId)}
                    className={`flex items-center gap-1 px-2 py-0.5 border transition-all ${
                      c.status === 'native'
                        ? 'bg-[#eaf8ee] border-[#15803d] text-[#15803d] hover:bg-[#dcf3e2]'
                        : c.status === 'supported'
                        ? 'bg-white border-[#0f0f11] text-[#0f0f11] hover:bg-[#f7f6f0]'
                        : 'bg-[#fef4e6] border-[#b45309] text-[#b45309]'
                    }`}
                  >
                    <PlatformIcon platformId={c.platformId} size={13} />
                    <span className="font-bold">{c.platformName}</span>
                    <span className="text-[10px]">
                      {c.status === 'native' ? '● NATIVE' : c.status === 'supported' ? '●' : '◐'}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {resource.sourceUrl && (
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#df9367] hover:underline font-bold"
              >
                <span>Official Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick jump navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[#8c8b85] mr-1">QUICK JUMP:</span>
            <a
              href="#installation"
              className="patter-btn px-3 py-1 bg-[#f7f6f0] text-[#0f0f11] hover:bg-[#eeece4]"
            >
              Installation Steps ↓
            </a>
            <a
              href="#prompts"
              className="patter-btn px-3 py-1 bg-[#f7f6f0] text-[#0f0f11] hover:bg-[#eeece4]"
            >
              Prompt Library ({resource.prompts?.length || 0}) ↓
            </a>
            <a
              href="#security"
              className="patter-btn px-3 py-1 bg-[#f7f6f0] text-[#0f0f11] hover:bg-[#eeece4]"
            >
              Security Audit ↓
            </a>
            <a
              href="#compatibility"
              className="patter-btn px-3 py-1 bg-[#f7f6f0] text-[#0f0f11] hover:bg-[#eeece4]"
            >
              Matrix ↓
            </a>
          </div>
        </div>

        {/* Detailed Architecture & Job Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Description & Real Use Cases */}
          <div className="lg:col-span-2 space-y-6">
            <div className="patter-card bg-white p-6 space-y-4 shadow-[4px_4px_0px_#0f0f11]">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#df9367]" />
                <h2 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
                  What It Does & Architecture Overview
                </h2>
              </div>
              <p className="text-sm text-[#52525b] leading-relaxed whitespace-pre-line">
                {resource.description}
              </p>

              {/* Primary Use Cases */}
              <div className="pt-3 border-t border-[#f0eee6] space-y-2">
                <h3 className="font-mono font-bold text-xs uppercase text-[#0f0f11]">
                  Target Marketing Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resource.useCases.map((uc, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#fcfbf8] border border-[#0f0f11] flex items-start gap-2 text-xs"
                    >
                      <span className="font-mono font-bold text-[#df9367]">0{i + 1}.</span>
                      <span className="text-[#0f0f11] font-medium">{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expected Input vs Output Example */}
            {resource.exampleOutput && (
              <div className="patter-card bg-white p-6 space-y-4 shadow-[4px_4px_0px_#0f0f11]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#df9367]" />
                    <h2 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
                      Real-World Sample Deliverable
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono bg-[#eaf8ee] text-[#15803d] px-2 py-0.5 border border-[#15803d] font-bold">
                    VERIFIED OUTPUT
                  </span>
                </div>

                <p className="text-xs text-[#52525b]">{resource.exampleOutput.scenario}</p>

                <div className="border-[1.5px] border-[#0f0f11] bg-[#0f0f11] text-[#f7f6f0] p-4 font-mono text-xs leading-relaxed max-h-80 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-[#e4e4e7]">
                    {resource.exampleOutput.outputSnippet}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Score Breakdown & Curators Notes */}
          <div className="space-y-6">
            {/* Scorecard */}
            {resource.curationScore && (
              <div className="patter-card bg-white p-5 space-y-4 shadow-[4px_4px_0px_#0f0f11]">
                <div className="flex items-center justify-between border-b border-[#0f0f11] pb-3">
                  <h3 className="font-mono font-bold text-xs uppercase text-[#0f0f11]">
                    Audited Evaluation
                  </h3>
                  <span className="font-mono font-bold text-base text-[#df9367]">
                    {resource.curationScore.overall.toFixed(1)} / 10
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#52525b]">PRACTICAL UTILITY</span>
                      <span className="font-bold text-[#0f0f11]">
                        {resource.curationScore.utilityScore} / 10
                      </span>
                    </div>
                    <div className="h-2 bg-[#eeece4] border border-[#0f0f11]">
                      <div
                        className="h-full bg-[#df9367]"
                        style={{ width: `${resource.curationScore.utilityScore * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#52525b]">RELIABILITY & STABILITY</span>
                      <span className="font-bold text-[#0f0f11]">
                        {resource.curationScore.reliabilityScore} / 10
                      </span>
                    </div>
                    <div className="h-2 bg-[#eeece4] border border-[#0f0f11]">
                      <div
                        className="h-full bg-[#df9367]"
                        style={{ width: `${resource.curationScore.reliabilityScore * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#52525b]">DOCUMENTATION QUALITY</span>
                      <span className="font-bold text-[#0f0f11]">
                        {resource.curationScore.docsScore} / 10
                      </span>
                    </div>
                    <div className="h-2 bg-[#eeece4] border border-[#0f0f11]">
                      <div
                        className="h-full bg-[#df9367]"
                        style={{ width: `${resource.curationScore.docsScore * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#52525b]">SECURITY & SANDBOXING</span>
                      <span className="font-bold text-[#0f0f11]">
                        {resource.curationScore.securityScore} / 10
                      </span>
                    </div>
                    <div className="h-2 bg-[#eeece4] border border-[#0f0f11]">
                      <div
                        className="h-full bg-[#15803d]"
                        style={{ width: `${resource.curationScore.securityScore * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#fcfbf8] border border-[#0f0f11] text-[11px] text-[#52525b] leading-relaxed">
                  <span className="font-mono font-bold text-[#0f0f11] block mb-1">
                    EDITORIAL VERDICT:
                  </span>
                  {resource.curationScore.editorialReview}
                </div>
              </div>
            )}

            {/* Author / Maintainer Info */}
            <div className="patter-card bg-white p-5 space-y-3 shadow-[4px_4px_0px_#0f0f11] text-xs font-mono">
              <h3 className="font-bold uppercase text-[#0f0f11]">Resource Metadata</h3>
              <div className="space-y-2 text-[#52525b]">
                <div className="flex justify-between">
                  <span>MAINTAINER:</span>
                  <span className="font-bold text-[#0f0f11]">{resource.author.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>LAST VERIFIED:</span>
                  <span className="font-bold text-[#0f0f11]">{resource.lastVerifiedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>LICENSE:</span>
                  <span className="font-bold text-[#0f0f11]">{resource.license || 'MIT'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Center Section */}
        <InstallGuideSection
          guides={resource.installGuides}
          initialPlatform={selectedPlatformTab}
        />

        {/* Prompt Library & Interactive Customizer */}
        <PromptLibrarySection
          prompts={resource.prompts}
          resourceSlug={resource.slug}
          onSaveCustomPrompt={handleSaveCustomPrompt}
        />

        {/* Security Access Panel */}
        <SecurityAccessPanel security={resource.security} sourceUrl={resource.sourceUrl} />

        {/* Compatibility Matrix */}
        <CompatibilityMatrix
          compatibility={resource.compatibility}
          onSelectPlatformTab={(plat) => setSelectedPlatformTab(plat)}
        />

        {/* Related AI Skills in same category */}
        {relatedResources.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#df9367]" />
              <h2 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
                Related Marketing Skills in {resource.categories[0]}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedResources.map((rel) => (
                <ResourceCard key={rel.id} resource={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { AIResource, PlatformId } from '@/lib/types/ai-upscale';
import {
  getAIResourceBySlug,
  getAIResources,
  getUserAIStack,
  saveUserCustomPrompt,
  toggleSavedResource,
} from '@/lib/firebase/ai-upscale';
import { InstallGuideSection } from '@/components/ai-upscale/InstallGuideSection';
import { PromptLibrarySection } from '@/components/ai-upscale/PromptLibrarySection';
import { SecurityAccessPanel } from '@/components/ai-upscale/SecurityAccessPanel';
import { CompatibilityMatrix } from '@/components/ai-upscale/CompatibilityMatrix';
import { ResourceCard } from '@/components/ai-upscale/ResourceCard';
import { PlatformIcon } from '@/components/ai-upscale/PlatformIcon';
import { useAuth } from '@/lib/auth/context';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  ExternalLink,
  Lightbulb,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function AIResourceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { user } = useAuth();
  const [resource, setResource] = useState<AIResource | null>(null);
  const [relatedResources, setRelatedResources] = useState<AIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('claude_code');

  useEffect(() => {
    async function loadResource() {
      if (!slug) return;
      setLoading(true);

      const data = await getAIResourceBySlug(slug);
      setResource(data);

      if (data) {
        const primaryCategory = data.categories[0];
        const all = primaryCategory ? await getAIResources({ category: primaryCategory }) : [];
        setRelatedResources(all.filter((item) => item.slug !== data.slug).slice(0, 3));

        const firstInstallable = data.compatibility.find(
          (item) => item.status !== 'unknown' && item.status !== 'unsupported'
        );
        if (firstInstallable) setSelectedPlatform(firstInstallable.platformId);
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

    void loadResource();
  }, [slug, user?.uid]);

  const handleToggleFavorite = async () => {
    if (!resource) return;
    if (!user?.uid) {
      setIsSaved((value) => !value);
      return;
    }

    const updated = await toggleSavedResource(user.uid, resource.slug, 'favorites');
    setIsSaved(updated.favoriteSlugs.includes(resource.slug));
  };

  const handleToggleInstalled = async () => {
    if (!resource) return;
    if (!user?.uid) {
      setIsInstalled((value) => !value);
      return;
    }

    const updated = await toggleSavedResource(user.uid, resource.slug, 'installed');
    setIsInstalled(updated.installedSlugs.includes(resource.slug));
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveCustomPrompt = async (promptId: string, customText: string) => {
    if (!user?.uid || !resource) return;
    await saveUserCustomPrompt(user.uid, resource.slug, promptId, customText);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center p-6">
        <div className="patter-card bg-white p-8 text-center space-y-3 font-mono text-xs shadow-[4px_4px_0px_#0f0f11]">
          <div className="h-6 w-6 border-2 border-[#df9367] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold">LOADING RESOURCE...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] flex items-center justify-center p-6">
        <div className="patter-card bg-white max-w-md w-full p-8 text-center space-y-4 shadow-[4px_4px_0px_#0f0f11]">
          <AlertTriangle className="w-8 h-8 text-[#df9367] mx-auto" />
          <h1 className="font-mono font-bold text-lg">AI Resource Not Found</h1>
          <p className="text-xs text-[#52525b]">
            The requested resource could not be located in the curated catalog.
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

  const score = resource.curationScore;

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      <div className="border-b border-[#0f0f11] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/ai-upscale" className="text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>DIRECTORY</span>
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold uppercase">{resource.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 text-[#15803d]" /> : <Share2 className="w-3 h-3" />}
              <span>{copiedLink ? 'COPIED' : 'SHARE'}</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                isSaved ? 'bg-[#df9367]' : 'bg-white'
              }`}
            >
              <Bookmark className="w-3 h-3" fill={isSaved ? '#0f0f11' : 'none'} />
              <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
            </button>
            <button
              onClick={handleToggleInstalled}
              className={`patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                isInstalled ? 'bg-[#15803d] text-white border-[#15803d]' : 'bg-[#0f0f11] text-white'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{isInstalled ? 'INSTALLED' : 'MARK INSTALLED'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        <section className="patter-card bg-white p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#0f0f11] border-[2px] border-[#0f0f11]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="patter-pill bg-[#0f0f11] text-white text-xs font-mono uppercase font-bold py-0.5 px-2.5">
                {resource.resourceType}
              </span>
              {resource.categories[0] && (
                <span className="patter-pill bg-[#f7f6f0] text-xs font-mono uppercase font-bold py-0.5 px-2.5 border border-[#0f0f11]">
                  {resource.categories[0].replaceAll('-', ' ')}
                </span>
              )}
              <span className="patter-pill bg-[#eaf8ee] text-[#15803d] text-xs font-mono uppercase font-bold py-0.5 px-2.5 border border-[#15803d]">
                {resource.pricing}
              </span>
            </div>

            {score && (
              <div className="flex items-center gap-2 bg-[#fcf4ee] border border-[#df9367] px-3 py-1 font-mono text-xs">
                <Sparkles className="w-4 h-4 text-[#df9367]" />
                <span className="font-bold text-[#c47648]">EDITORIAL SCORE</span>
                <span className="font-extrabold text-sm">{score.overall.toFixed(1)} / 10</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-mono font-black text-2xl sm:text-4xl tracking-tight leading-tight">
              {resource.name}
            </h1>
            <p className="text-base sm:text-lg text-[#52525b] font-medium leading-relaxed max-w-4xl">
              {resource.tagline}
            </p>
          </div>

          <div className="border-t border-b border-[#f0eee6] py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#8c8b85] font-bold">COMPATIBILITY:</span>
              {resource.compatibility.map((item) => (
                <button
                  key={item.platformId}
                  onClick={() => setSelectedPlatform(item.platformId)}
                  className="flex items-center gap-1 px-2 py-0.5 border border-[#0f0f11] bg-white cursor-pointer"
                >
                  <PlatformIcon platformId={item.platformId} size={13} />
                  <span>{item.platformName}</span>
                  <span className="text-[10px] text-[#8c8b85]">{item.status.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <a
              href={resource.source.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#c47648] hover:underline font-bold"
            >
              <span>Open source/reference</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="patter-card bg-white p-6 space-y-4 shadow-[4px_4px_0px_#0f0f11]">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#df9367]" />
                <h2 className="font-mono font-bold text-sm uppercase">What it does</h2>
              </div>
              <p className="text-sm text-[#52525b] leading-relaxed whitespace-pre-line">
                {resource.description}
              </p>
              <div className="pt-3 border-t border-[#f0eee6] space-y-2">
                <h3 className="font-mono font-bold text-xs uppercase">Best for</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resource.bestFor.map((item) => (
                    <li key={item} className="p-2.5 bg-[#fcfbf8] border border-[#0f0f11] text-xs">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="patter-card bg-white p-6 space-y-4 shadow-[4px_4px_0px_#0f0f11]">
              <h2 className="font-mono font-bold text-sm uppercase">Strengths & limitations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 className="font-mono font-bold mb-2 text-[#15803d]">STRENGTHS</h3>
                  <ul className="space-y-2">
                    {resource.strengths.map((item) => (
                      <li key={item} className="border-l-2 border-[#15803d] pl-2">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono font-bold mb-2 text-[#b45309]">LIMITATIONS</h3>
                  <ul className="space-y-2">
                    {resource.limitations.map((item) => (
                      <li key={item} className="border-l-2 border-[#b45309] pl-2">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {score && (
              <section className="patter-card bg-white p-5 space-y-3 shadow-[4px_4px_0px_#0f0f11]">
                <h2 className="font-mono font-bold text-xs uppercase">Editorial Evaluation</h2>
                <ScoreRow label="Practical value" value={score.practicalValue} />
                <ScoreRow label="Setup quality" value={score.setupQuality} />
                <ScoreRow label="Documentation" value={score.documentation} />
                <ScoreRow label="Marketing relevance" value={score.marketingRelevance} />
                <ScoreRow label="Maintenance" value={score.maintenance} />
              </section>
            )}

            <section className="patter-card bg-white p-5 space-y-3 shadow-[4px_4px_0px_#0f0f11] text-xs font-mono">
              <h2 className="font-bold uppercase">Resource Metadata</h2>
              <MetaRow label="Maintainer" value={resource.author.name} />
              <MetaRow label="Last verified" value={resource.lastVerifiedAt} />
              <MetaRow label="License" value={resource.license || 'Not recorded'} />
              <MetaRow label="Difficulty" value={resource.installDifficulty} />
            </section>
          </aside>
        </div>

        <InstallGuideSection guides={resource.installGuides} initialPlatform={selectedPlatform} />

        <PromptLibrarySection
          prompts={resource.prompts}
          resourceSlug={resource.slug}
          onSaveCustomPrompt={handleSaveCustomPrompt}
        />

        <SecurityAccessPanel security={resource.security} sourceUrl={resource.source.url} />

        <CompatibilityMatrix
          compatibility={resource.compatibility}
          onSelectPlatformTab={setSelectedPlatform}
        />

        {relatedResources.length > 0 && (
          <section className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#df9367]" />
              <h2 className="font-mono font-bold text-sm uppercase">Related Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedResources.map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1 font-mono">
        <span className="text-[#52525b]">{label.toUpperCase()}</span>
        <span className="font-bold">{value.toFixed(1)} / 10</span>
      </div>
      <div className="h-2 bg-[#eeece4] border border-[#0f0f11]">
        <div className="h-full bg-[#df9367]" style={{ width: `${Math.min(100, value * 10)}%` }} />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[#52525b]">{label.toUpperCase()}:</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}

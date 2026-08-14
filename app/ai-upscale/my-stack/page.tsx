'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AIResource, UserAIStack } from '@/lib/types/ai-upscale';
import { AI_RESOURCES } from '@/lib/data/ai-upscale-seed';
import { getUserAIStack, toggleSavedResource } from '@/lib/firebase/ai-upscale';
import { ResourceCard } from '@/components/ai-upscale/ResourceCard';
import { useAuth } from '@/lib/auth/context';
import {
  Bookmark,
  Check,
  ArrowLeft,
  Download,
  Copy,
  Terminal,
  Trash2,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function MyAIStackPage() {
  const { user, isAuthenticated } = useAuth();
  const [userStack, setUserStack] = useState<UserAIStack | null>(null);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [installedSlugs, setInstalledSlugs] = useState<string[]>([]);
  const [copiedExport, setCopiedExport] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  useEffect(() => {
    async function loadStack() {
      if (user?.uid) {
        const stack = await getUserAIStack(user.uid);
        if (stack) {
          setUserStack(stack);
          setFavoriteSlugs(stack.favoriteSlugs || []);
          setInstalledSlugs(stack.installedSlugs || []);
        }
      } else {
        // Mock default for anonymous previews
        setFavoriteSlugs(['voc-research-pro', 'cro-landing-page-auditor']);
        setInstalledSlugs(['voc-research-pro']);
      }
    }
    loadStack();
  }, [user?.uid]);

  const handleRemoveFavorite = async (slug: string) => {
    if (!user?.uid) {
      setFavoriteSlugs(favoriteSlugs.filter((s) => s !== slug));
      return;
    }
    const updated = await toggleSavedResource(user.uid, slug, 'favorites');
    setFavoriteSlugs(updated.favoriteSlugs || []);
  };

  const handleRemoveInstalled = async (slug: string) => {
    if (!user?.uid) {
      setInstalledSlugs(installedSlugs.filter((s) => s !== slug));
      return;
    }
    const updated = await toggleSavedResource(user.uid, slug, 'installed');
    setInstalledSlugs(updated.installedSlugs || []);
  };

  const installedResources = AI_RESOURCES.filter((r) => installedSlugs.includes(r.slug));
  const savedResources = AI_RESOURCES.filter((r) => favoriteSlugs.includes(r.slug));

  const generateMarkdownExport = () => {
    let md = `# My Marketing AI Stack\nGenerated via Remix CopyScore AI Upscale on ${new Date().toLocaleDateString()}\n\n`;

    md += `## 1. Active Installed Skills\n`;
    if (installedResources.length === 0) {
      md += `*No installed skills yet.*\n\n`;
    } else {
      installedResources.forEach((r) => {
        md += `### ${r.name} (${r.resourceType})\n`;
        md += `* ${r.tagline}\n`;
        md += `* Categories: ${r.categories.join(', ')}\n`;
        if (r.sourceUrl) md += `* Source: ${r.sourceUrl}\n`;
        md += `\n`;
      });
    }

    md += `## 2. Saved / Want to Try\n`;
    if (savedResources.length === 0) {
      md += `*No saved skills yet.*\n\n`;
    } else {
      savedResources.forEach((r) => {
        md += `* **${r.name}** - ${r.tagline}\n`;
      });
    }

    return md;
  };

  const generateBashInstallScript = () => {
    let bash = `#!/usr/bin/env bash\n# Install script for My Marketing AI Stack\nset -e\n\n`;
    installedResources.forEach((r) => {
      const guide = r.installGuides.claude_code || Object.values(r.installGuides)[0];
      if (guide) {
        bash += `# --- Install ${r.name} ---\n`;
        guide.steps.forEach((step) => {
          if (step.command) {
            bash += `${step.command}\n`;
          }
        });
        bash += `\n`;
      }
    });
    return bash;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownExport();
    navigator.clipboard.writeText(md);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleCopyBash = () => {
    const bash = generateBashInstallScript();
    navigator.clipboard.writeText(bash);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownExport();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MY_MARKETING_AI_STACK.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#0f0f11] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Link href="/ai-upscale" className="text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>AI UPSCALE DIRECTORY</span>
            </Link>
            <span className="text-[#8c8b85]">/</span>
            <span className="font-bold text-[#0f0f11]">MY AI WORKFLOW STACK</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBash}
              className="patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              {copiedBash ? <Check className="w-3 h-3 text-[#15803d]" /> : <Terminal className="w-3 h-3" />}
              <span>{copiedBash ? 'COPIED SCRIPT' : 'COPY BASH SCRIPT'}</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              {copiedExport ? <Check className="w-3 h-3 text-[#15803d]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedExport ? 'COPIED MD' : 'COPY MARKDOWN'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="patter-btn patter-btn-peach px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>EXPORT STACK</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Header Hero */}
        <div className="patter-card bg-white p-6 sm:p-8 space-y-3 shadow-[6px_6px_0px_#0f0f11] border-[2px] border-[#0f0f11]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#df9367]" />
            <span className="font-mono text-xs font-bold text-[#0f0f11] uppercase tracking-wider">
              PERSONAL MARKETING TOOLKIT
            </span>
          </div>
          <h1 className="font-mono font-black text-2xl sm:text-4xl text-[#0f0f11] tracking-tight leading-tight uppercase">
            My Custom Marketing AI Stack
          </h1>
          <p className="text-sm sm:text-base text-[#52525b] max-w-3xl leading-relaxed">
            Manage your installed skills, saved workflows, and customized prompt packs. Export as a unified markdown or bash setup file for new machines.
          </p>
        </div>

        {/* Section 1: Active Installed Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#0f0f11] pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#15803d]" />
              <h2 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase">
                Active Installed Skills ({installedResources.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8c8b85]">
              VERIFIED IN YOUR LOCAL CONTAINER / AI CLIENT
            </span>
          </div>

          {installedResources.length === 0 ? (
            <div className="patter-card bg-white p-8 text-center space-y-2 text-xs font-mono border-[#0f0f11]">
              <p className="text-[#52525b]">You haven&apos;t marked any skills as installed yet.</p>
              <Link href="/ai-upscale" className="text-[#df9367] font-bold underline inline-block">
                Browse catalog and install skills →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {installedResources.map((res) => (
                <div key={res.id} className="relative group">
                  <ResourceCard resource={res} />
                  <button
                    onClick={() => handleRemoveInstalled(res.slug)}
                    className="absolute top-2 right-2 p-1 bg-white border border-[#0f0f11] hover:bg-[#fdf2f2] text-[#b91c1c] text-xs font-mono z-10 cursor-pointer"
                    title="Remove from installed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Saved / Want to Try */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#0f0f11] pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#df9367]" />
              <h2 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase">
                Saved / Want to Try ({savedResources.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8c8b85]">BOOKMARKED CAPABILITIES</span>
          </div>

          {savedResources.length === 0 ? (
            <div className="patter-card bg-white p-8 text-center space-y-2 text-xs font-mono border-[#0f0f11]">
              <p className="text-[#52525b]">No bookmarked skills saved.</p>
              <Link href="/ai-upscale" className="text-[#df9367] font-bold underline inline-block">
                Explore skills to bookmark →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResources.map((res) => (
                <div key={res.id} className="relative group">
                  <ResourceCard resource={res} />
                  <button
                    onClick={() => handleRemoveFavorite(res.slug)}
                    className="absolute top-2 right-2 p-1 bg-white border border-[#0f0f11] hover:bg-[#fdf2f2] text-[#b91c1c] text-xs font-mono z-10 cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

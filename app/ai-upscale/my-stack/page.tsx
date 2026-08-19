'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

export default function MyAIStackPage() {
  const { user } = useAuth();
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [installedSlugs, setInstalledSlugs] = useState<string[]>([]);
  const [copiedExport, setCopiedExport] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  useEffect(() => {
    async function loadStack() {
      if (user?.uid) {
        const stack = await getUserAIStack(user.uid);
        if (stack) {
          setFavoriteSlugs(stack.favoriteSlugs || []);
          setInstalledSlugs(stack.installedSlugs || []);
        }
      } else {
        setFavoriteSlugs(['voice-of-customer-research', 'landing-page-cro-audit']);
        setInstalledSlugs(['voice-of-customer-research']);
      }
    }
    loadStack();
  }, [user?.uid]);

  const handleRemoveFavorite = async (slug: string) => {
    if (!user?.uid) {
      setFavoriteSlugs(favoriteSlugs.filter((item) => item !== slug));
      return;
    }
    const updated = await toggleSavedResource(user.uid, slug, 'favorites');
    setFavoriteSlugs(updated.favoriteSlugs || []);
  };

  const handleRemoveInstalled = async (slug: string) => {
    if (!user?.uid) {
      setInstalledSlugs(installedSlugs.filter((item) => item !== slug));
      return;
    }
    const updated = await toggleSavedResource(user.uid, slug, 'installed');
    setInstalledSlugs(updated.installedSlugs || []);
  };

  const installedResources = AI_RESOURCES.filter((resource) =>
    installedSlugs.includes(resource.slug)
  );
  const savedResources = AI_RESOURCES.filter((resource) => favoriteSlugs.includes(resource.slug));

  const generateMarkdownExport = () => {
    let markdown = `# My Marketing AI Stack\nGenerated via CopyScore AI Upscale on ${new Date().toLocaleDateString()}\n\n`;

    markdown += `## 1. Active Installed Skills\n`;
    if (installedResources.length === 0) {
      markdown += `*No installed skills yet.*\n\n`;
    } else {
      installedResources.forEach((resource) => {
        markdown += `### ${resource.name} (${resource.resourceType})\n`;
        markdown += `* ${resource.tagline}\n`;
        markdown += `* Categories: ${resource.categories.join(', ')}\n`;
        markdown += `* Source: ${resource.source.url}\n\n`;
      });
    }

    markdown += `## 2. Saved / Want to Try\n`;
    if (savedResources.length === 0) {
      markdown += `*No saved skills yet.*\n\n`;
    } else {
      savedResources.forEach((resource) => {
        markdown += `* **${resource.name}** - ${resource.tagline}\n`;
      });
    }

    return markdown;
  };

  const generateBashInstallScript = () => {
    let script = `#!/usr/bin/env bash\n# Install script for My Marketing AI Stack\nset -e\n\n`;
    installedResources.forEach((resource) => {
      const guide = resource.installGuides.claude_code || Object.values(resource.installGuides)[0];
      if (guide) {
        script += `# --- Install ${resource.name} ---\n`;
        guide.steps.forEach((step) => {
          if (step.command) script += `${step.command}\n`;
        });
        script += `\n`;
      }
    });
    return script;
  };

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(generateMarkdownExport());
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleCopyBash = async () => {
    await navigator.clipboard.writeText(generateBashInstallScript());
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generateMarkdownExport()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'MY_MARKETING_AI_STACK.md';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#0f0f11] font-sans pb-24">
      <div className="border-b border-[#0f0f11] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Link
              href="/ai-upscale"
              className="text-[#52525b] hover:text-[#0f0f11] flex items-center gap-1"
            >
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
              {copiedBash ? (
                <Check className="w-3 h-3 text-[#15803d]" />
              ) : (
                <Terminal className="w-3 h-3" />
              )}
              <span>{copiedBash ? 'COPIED SCRIPT' : 'COPY BASH SCRIPT'}</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="patter-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1 bg-white cursor-pointer"
            >
              {copiedExport ? (
                <Check className="w-3 h-3 text-[#15803d]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
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
            Manage installed resources and saved workflows. Export the current stack as Markdown or a setup script.
          </p>
        </div>

        <StackSection
          title="Active Installed Skills"
          count={installedResources.length}
          indicatorClass="bg-[#15803d]"
          emptyCopy="You haven't marked any skills as installed yet."
          emptyLinkCopy="Browse catalog and install skills →"
        >
          {installedResources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />
              <button
                onClick={() => handleRemoveInstalled(resource.slug)}
                className="absolute top-2 right-2 p-1 bg-white border border-[#0f0f11] hover:bg-[#fdf2f2] text-[#b91c1c] z-10 cursor-pointer"
                title="Remove from installed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </StackSection>

        <StackSection
          title="Saved / Want to Try"
          count={savedResources.length}
          indicatorClass="bg-[#df9367]"
          emptyCopy="No bookmarked skills saved."
          emptyLinkCopy="Explore skills to bookmark →"
        >
          {savedResources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />
              <button
                onClick={() => handleRemoveFavorite(resource.slug)}
                className="absolute top-2 right-2 p-1 bg-white border border-[#0f0f11] hover:bg-[#fdf2f2] text-[#b91c1c] z-10 cursor-pointer"
                title="Remove bookmark"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </StackSection>
      </div>
    </div>
  );
}

function StackSection({
  title,
  count,
  indicatorClass,
  emptyCopy,
  emptyLinkCopy,
  children,
}: {
  title: string;
  count: number;
  indicatorClass: string;
  emptyCopy: string;
  emptyLinkCopy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between border-b border-[#0f0f11] pb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 ${indicatorClass}`} />
          <h2 className="font-mono font-bold text-sm sm:text-base text-[#0f0f11] uppercase">
            {title} ({count})
          </h2>
        </div>
      </div>

      {count === 0 ? (
        <div className="patter-card bg-white p-8 text-center space-y-2 text-xs font-mono border-[#0f0f11]">
          <p className="text-[#52525b]">{emptyCopy}</p>
          <Link href="/ai-upscale" className="text-[#df9367] font-bold underline inline-block">
            {emptyLinkCopy}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
      )}
    </div>
  );
}

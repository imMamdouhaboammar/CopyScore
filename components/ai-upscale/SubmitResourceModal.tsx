'use client';

import React, { useState } from 'react';
import { submitCommunityResource } from '@/lib/firebase/ai-upscale';
import { ResourceType, PlatformId } from '@/lib/types/ai-upscale';
import { AI_PLATFORMS, AI_CATEGORIES } from '@/lib/data/ai-upscale-seed';
import { X, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface SubmitResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitResourceModal({ isOpen, onClose }: SubmitResourceModalProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [whyUseful, setWhyUseful] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('claude_skill');
  const [testedPlatforms, setTestedPlatforms] = useState<PlatformId[]>(['claude_code']);
  const [categories, setCategories] = useState<string[]>(['customer-research']);
  const [submitterEmail, setSubmitterEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !name.trim() || !whyUseful.trim()) {
      setError('Please fill in all required fields (Name, URL, Why Useful).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitCommunityResource({
        url: url.trim(),
        name: name.trim(),
        whyUseful: whyUseful.trim(),
        resourceType,
        testedPlatforms,
        categories,
        submitterEmail: submitterEmail.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platId: PlatformId) => {
    if (testedPlatforms.includes(platId)) {
      if (testedPlatforms.length > 1) {
        setTestedPlatforms(testedPlatforms.filter((p) => p !== platId));
      }
    } else {
      setTestedPlatforms([...testedPlatforms, platId]);
    }
  };

  const toggleCategory = (catSlug: string) => {
    if (categories.includes(catSlug)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== catSlug));
      }
    } else {
      setCategories([...categories, catSlug]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="patter-card bg-white max-w-xl w-full shadow-[8px_8px_0px_#0f0f11] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#df9367]" />
            <h3 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
              Submit Marketing AI Skill or Prompt Pack
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f7f6f0] border border-transparent hover:border-[#0f0f11] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0f0f11]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-12 w-12 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-mono font-bold text-base text-[#0f0f11]">
                Submission Received for Editorial Review!
              </h4>
              <p className="text-xs text-[#52525b] max-w-md mx-auto leading-relaxed">
                Thank you for contributing. Our editorial team verifies all installation scripts,
                runs security audits, and writes deterministic test prompts before publishing to the
                directory.
              </p>
              <button
                onClick={onClose}
                className="patter-btn patter-btn-peach text-xs font-mono font-bold py-2 px-4 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-[#fdf2f2] border border-[#b91c1c] text-[#b91c1c] text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11] flex items-center justify-between">
                  <span>Resource Name *</span>
                  <span className="text-[10px] text-[#8c8b85]">e.g. CRO Heuristic Auditor</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Official or package name"
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11] flex items-center justify-between">
                  <span>Repository or Documentation URL *</span>
                  <span className="text-[10px] text-[#8c8b85]">GitHub, Gist, or docs</span>
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Technical Resource Type
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as ResourceType)}
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                >
                  <option value="claude_skill">Claude Skill / Agent Skill</option>
                  <option value="mcp_server">MCP Server (Model Context Protocol)</option>
                  <option value="prompt_pack">Prompt Pack / System Instructions</option>
                  <option value="cli_tool">CLI Tool / Terminal Utility</option>
                  <option value="browser_extension">Browser Extension</option>
                  <option value="custom_gpt">Custom GPT / Assistant</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Tested AI Platform(s)
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AI_PLATFORMS.map((p) => {
                    const isChecked = testedPlatforms.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`px-2.5 py-1 text-[11px] font-mono border cursor-pointer ${
                          isChecked
                            ? 'bg-[#0f0f11] text-white border-[#0f0f11]'
                            : 'bg-[#f7f6f0] text-[#52525b] border-[#e5e4dc]'
                        }`}
                      >
                        {p.name} {isChecked ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Marketing Category
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AI_CATEGORIES.map((c) => {
                    const isChecked = categories.includes(c.slug);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCategory(c.slug)}
                        className={`px-2.5 py-1 text-[11px] font-mono border cursor-pointer ${
                          isChecked
                            ? 'bg-[#df9367] text-[#0f0f11] border-[#0f0f11] font-bold'
                            : 'bg-[#f7f6f0] text-[#52525b] border-[#e5e4dc]'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Why is this useful for marketers and copywriters? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={whyUseful}
                  onChange={(e) => setWhyUseful(e.target.value)}
                  placeholder="Describe the specific marketing bottleneck it solves..."
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11] flex items-center justify-between">
                  <span>Your Email (Optional)</span>
                  <span className="text-[10px] text-[#8c8b85]">To notify upon approval</span>
                </label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="pt-3 border-t border-[#0f0f11] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="patter-btn px-3 py-1.5 text-xs font-mono bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="patter-btn patter-btn-peach px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

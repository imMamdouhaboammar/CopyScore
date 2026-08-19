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
  const [resourceType, setResourceType] = useState<ResourceType>('skill');
  const [primaryPlatform, setPrimaryPlatform] = useState<PlatformId>('claude_code');
  const [category, setCategory] = useState('customer-research');
  const [submitterEmail, setSubmitterEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        primaryPlatform,
        category,
        submittedByEmail: submitterEmail.trim() || undefined,
        submittedByUid: user?.uid,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f11]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="patter-card bg-white max-w-xl w-full shadow-[8px_8px_0px_#0f0f11] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#df9367]" />
            <h3 className="font-mono font-bold text-sm uppercase text-[#0f0f11]">
              Submit Marketing AI Resource
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f7f6f0] border border-transparent hover:border-[#0f0f11] cursor-pointer"
            aria-label="Close submission modal"
          >
            <X className="w-4 h-4 text-[#0f0f11]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-12 w-12 bg-[#eaf8ee] border border-[#15803d] text-[#15803d] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-mono font-bold text-base text-[#0f0f11]">
                Submission Received for Review
              </h4>
              <p className="text-xs text-[#52525b] max-w-md mx-auto leading-relaxed">
                The resource will remain unpublished until its source, installation guidance, and declared access are reviewed.
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
                <label className="text-xs font-mono font-bold text-[#0f0f11]">Resource Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Official or package name"
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Repository or Documentation URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#0f0f11]">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(event) => setResourceType(event.target.value as ResourceType)}
                    className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                  >
                    <option value="skill">Skill</option>
                    <option value="plugin">Plugin</option>
                    <option value="extension">Extension</option>
                    <option value="mcp">MCP Server</option>
                    <option value="agent">Agent</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="prompt_pack">Prompt Pack</option>
                    <option value="workflow">Workflow</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#0f0f11]">Primary Platform</label>
                  <select
                    value={primaryPlatform}
                    onChange={(event) => setPrimaryPlatform(event.target.value as PlatformId)}
                    className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                  >
                    {AI_PLATFORMS.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">Primary Marketing Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                >
                  {AI_CATEGORIES.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">
                  Why is this useful for marketers and copywriters? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={whyUseful}
                  onChange={(event) => setWhyUseful(event.target.value)}
                  placeholder="Describe the specific marketing bottleneck it solves..."
                  className="w-full bg-white border border-[#0f0f11] p-2.5 text-xs font-mono text-[#0f0f11] focus:outline-none focus:ring-1 focus:ring-[#df9367]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#0f0f11]">Your Email (Optional)</label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(event) => setSubmitterEmail(event.target.value)}
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
                  className="patter-btn patter-btn-peach px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
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

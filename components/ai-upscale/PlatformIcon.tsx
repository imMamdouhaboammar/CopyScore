'use client';

import React from 'react';
import { PlatformId } from '@/lib/types/ai-upscale';
import { Terminal, Cpu, Sparkles, Box, Layers, Globe } from 'lucide-react';
import { Claude, OpenAI, Gemini, Anthropic } from '@lobehub/icons';

interface PlatformIconProps {
  platformId: PlatformId | string;
  className?: string;
  size?: number;
}

export function PlatformIcon({ platformId, className = 'w-4 h-4', size = 16 }: PlatformIconProps) {
  const norm = platformId.toLowerCase().replace('-', '_');

  if (norm === 'claude_code' || norm === 'claude') {
    return <Claude size={size} className={className} />;
  }

  if (norm === 'codex' || norm === 'openai') {
    return <OpenAI size={size} className={className} />;
  }

  if (norm === 'chatgpt') {
    return <OpenAI size={size} className={className} />;
  }

  if (norm === 'gemini_cli' || norm === 'gemini') {
    return <Gemini size={size} className={className} />;
  }

  if (norm === 'agent_skills') {
    return <Anthropic size={size} className={className} />;
  }

  if (norm === 'mcp_clients' || norm === 'mcp') {
    return <Layers className={className} style={{ width: size, height: size }} />;
  }

  return <Terminal className={className} style={{ width: size, height: size }} />;
}

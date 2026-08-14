import React from 'react';
import { PlusIcon } from 'lucide-react';
import {
  OpenAI,
  Claude,
  Gemini,
  DeepSeek,
  Meta,
  Mistral,
  Qwen,
  XAI,
} from '@lobehub/icons';
import { cn } from '@/lib/utils';

export interface LogoItem {
  id: string;
  name: string;
  Icon: React.ComponentType<{
    size?: string | number;
    className?: string;
    color?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
  }>;
  Text?: React.ComponentType<{
    size?: string | number;
    className?: string;
    color?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
  }>;
  href?: string;
  ariaLabel?: string;
}

export const DEFAULT_AI_LOGOS: LogoItem[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    Icon: OpenAI,
    Text: OpenAI.Text,
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    Icon: Claude,
    Text: Claude.Text,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    Icon: Gemini,
    Text: Gemini.Text,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    Icon: DeepSeek,
    Text: DeepSeek.Text,
  },
  {
    id: 'meta',
    name: 'Meta AI',
    Icon: Meta,
    Text: Meta.Text,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    Icon: Mistral,
    Text: Mistral.Text,
  },
  {
    id: 'qwen',
    name: 'Alibaba Qwen',
    Icon: Qwen,
    Text: Qwen.Text,
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    Icon: XAI,
    Text: XAI.Text,
  },
];

interface LogoCardProps {
  item: LogoItem;
  index: number;
}

function LogoCard({ item, index }: LogoCardProps) {
  // Alternating background calculation:
  // Mobile (2 cols): checkerboard pattern
  const isMobileWhite = (Math.floor(index / 2) + (index % 2)) % 2 === 0;
  // Desktop (4 cols): checkerboard pattern
  const isDesktopWhite = (Math.floor(index / 4) + (index % 4)) % 2 === 0;

  // Responsive shared border calculation:
  // Mobile (2 cols):
  const mobileBorderR = index % 2 === 0 ? 'border-r border-[#0f0f11]' : '';
  const mobileBorderB = index < 6 ? 'border-b border-[#0f0f11]' : '';

  // Desktop (4 cols):
  const desktopBorderR = index % 4 !== 3 ? 'md:border-r md:border-[#0f0f11]' : 'md:border-r-0';
  const desktopBorderB = index < 4 ? 'md:border-b md:border-[#0f0f11]' : 'md:border-b-0';

  const CardContent = (
    <div
      className={cn(
        'relative flex items-center justify-center h-20 sm:h-24 md:h-28 px-4 transition-colors duration-150',
        isMobileWhite ? 'bg-white' : 'bg-[#faf9f6]',
        isDesktopWhite ? 'md:bg-white' : 'md:bg-[#faf9f6]',
        mobileBorderR,
        mobileBorderB,
        desktopBorderR,
        desktopBorderB,
        item.href && 'hover:bg-[#f2efe6] cursor-pointer'
      )}
    >
      <div
        className="flex items-center justify-center gap-2 sm:gap-2.5 text-[#0f0f11] select-none"
        title={item.name}
        aria-label={item.name}
      >
        {/* Brand Logo Mark */}
        <item.Icon
          size={24}
          className="shrink-0 text-[#0f0f11]"
          aria-hidden="true"
        />

        {/* Brand Official Wordmark (if available) */}
        {item.Text ? (
          <item.Text
            size={18}
            className="shrink-0 text-[#0f0f11] max-w-[90px] sm:max-w-[110px] md:max-w-[130px]"
            aria-hidden="true"
          />
        ) : (
          <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-[#0f0f11]">
            {item.name}
          </span>
        )}
      </div>
      <span className="sr-only">{item.name}</span>
    </div>
  );

  if (item.href) {
    return (
      <a
        id={`logo-cloud-item-${item.id}`}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.name}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f11] focus-visible:ring-inset"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div id={`logo-cloud-item-${item.id}`} role="group" aria-label={item.name}>
      {CardContent}
    </div>
  );
}

export interface LogoCloudProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  logos?: LogoItem[];
  className?: string;
  hideHeader?: boolean;
}

export function LogoCloud({
  title = 'MODELS & WRITING WORKFLOWS',
  subtitle = 'Built around the leading foundational models and AI tools shaping modern commercial copy.',
  badge = 'ECOSYSTEM BENCHMARK',
  logos = DEFAULT_AI_LOGOS,
  className,
  hideHeader = false,
}: LogoCloudProps) {
  return (
    <section
      id="logo-cloud-section"
      aria-label={title}
      className={cn('relative w-full overflow-hidden py-10 sm:py-16', className)}
    >
      {/* Full-width horizontal boundary lines extending to screen edges */}
      <div
        className="absolute top-0 left-1/2 w-screen -translate-x-1/2 border-t border-[#0f0f11] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 border-b border-[#0f0f11] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        {!hideHeader && (
          <div className="text-center space-y-2 mb-8 sm:mb-10">
            {badge && (
              <div className="inline-flex items-center gap-1.5 patter-pill bg-[#0f0f11] text-white text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#df9367]" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0f0f11] tracking-tight uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#52525b] max-w-xl mx-auto font-mono">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Logo Grid Container with Shared Outer Border */}
        <div className="relative border border-[#0f0f11] shadow-[3px_3px_0px_#0f0f11] bg-white">
          {/* Grid Layout: 2 cols on mobile, 4 cols on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {logos.slice(0, 8).map((logo, index) => (
              <LogoCard key={logo.id} item={logo} index={index} />
            ))}
          </div>

          {/* Desktop Intersection Markers (3 interior intersections at 25%, 50%, 75% X, and 50% Y) */}
          <div
            className="hidden md:flex absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div
            className="hidden md:flex absolute top-1/2 left-2/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div
            className="hidden md:flex absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>

          {/* Mobile Intersection Markers (3 interior intersections at 50% X, and 25%, 50%, 75% Y) */}
          <div
            className="flex md:hidden absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div
            className="flex md:hidden absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div
            className="flex md:hidden absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-[#0f0f11]"
            aria-hidden="true"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloud;

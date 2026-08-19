'use client';

import React from 'react';
import { SecurityAccess } from '@/lib/types/ai-upscale';
import {
  ShieldCheck,
  Lock,
  Globe,
  FileCode,
  HardDrive,
  Key,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface SecurityAccessPanelProps {
  security: SecurityAccess;
  sourceUrl?: string;
}

export function SecurityAccessPanel({ security, sourceUrl }: SecurityAccessPanelProps) {
  const items = [
    {
      id: 'local_code',
      label: 'Runs Local Code',
      icon: Terminal,
      allowed: security.runsLocalCode,
      note: security.runsLocalCode
        ? 'Executes scripts in local container/terminal'
        : 'Pure markdown / prompt-based only',
    },
    {
      id: 'network',
      label: 'Network Access',
      icon: Globe,
      allowed: security.networkAccess,
      note: security.networkAccess
        ? 'Connects to remote APIs / services'
        : 'No outbound network access declared',
    },
    {
      id: 'reads_files',
      label: 'Reads Project Files',
      icon: FileCode,
      allowed: security.readsProjectFiles,
      note: security.readsProjectFiles
        ? 'Reads workspace files for context'
        : 'Does not read project files automatically',
    },
    {
      id: 'writes_files',
      label: 'Writes Project Files',
      icon: HardDrive,
      allowed: security.writesProjectFiles,
      note: security.writesProjectFiles
        ? 'Can write output files to the project'
        : 'Does not write project files',
    },
    {
      id: 'api_key',
      label: 'API Key Required',
      icon: Key,
      allowed: security.requiresApiKey,
      note: security.requiresApiKey
        ? 'Requires a third-party API key'
        : 'No additional API key declared',
    },
    {
      id: 'shell',
      label: 'Shell / Terminal Access',
      icon: Lock,
      allowed: security.shellAccess,
      note: security.shellAccess
        ? 'Can run shell sub-processes'
        : 'No shell access declared',
    },
  ];

  const privacyLevelConfig = {
    safe: {
      bg: 'bg-[#eaf8ee]',
      border: 'border-[#15803d]',
      text: 'text-[#15803d]',
      label: 'LOW DECLARED ACCESS',
    },
    moderate: {
      bg: 'bg-[#fef4e6]',
      border: 'border-[#b45309]',
      text: 'text-[#b45309]',
      label: 'MODERATE DECLARED ACCESS',
    },
    elevated: {
      bg: 'bg-[#fdf2f2]',
      border: 'border-[#b91c1c]',
      text: 'text-[#b91c1c]',
      label: 'ELEVATED DECLARED ACCESS',
    },
  };

  const elevatedSignals = [
    security.shellAccess,
    security.writesProjectFiles,
    security.networkAccess,
    security.requiresOAuth,
    security.requiresApiKey,
  ].filter(Boolean).length;

  const privacyLevel: keyof typeof privacyLevelConfig =
    elevatedSignals <= 1 ? 'safe' : elevatedSignals <= 3 ? 'moderate' : 'elevated';
  const priv = privacyLevelConfig[privacyLevel];

  return (
    <section
      className="patter-card bg-white shadow-[4px_4px_0px_#0f0f11] overflow-hidden"
      id="security"
    >
      <div className="border-b-[1.5px] border-[#0f0f11] bg-[#fcfbf8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#15803d]" />
          <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-[#0f0f11]">
            Security & Permission Audit
          </h2>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 border text-xs font-mono font-bold ${priv.bg} ${priv.border} ${priv.text}`}
        >
          <Lock className="w-3 h-3" />
          <span>{priv.label}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3.5 border flex flex-col justify-between space-y-2 ${
                  item.allowed
                    ? 'bg-[#fcfbf8] border-[#0f0f11]'
                    : 'bg-[#fbfbfa] border-[#e5e4dc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-[#52525b]" />
                    <span className="font-mono font-bold text-xs text-[#0f0f11]">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 ${
                      item.allowed
                        ? 'bg-[#0f0f11] text-white'
                        : 'bg-[#eaf8ee] text-[#15803d] border border-[#15803d]'
                    }`}
                  >
                    {item.allowed ? 'YES' : 'NO'}
                  </span>
                </div>
                <p className="text-[11px] text-[#52525b] leading-tight">{item.note}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-[#f7f6f0] border border-[#0f0f11] space-y-2">
          <div className="text-xs font-mono font-bold text-[#0f0f11] flex items-center justify-between gap-3">
            <span>CURATOR SECURITY NOTE:</span>
            {sourceUrl && (
              <span className="text-[10px] bg-[#df9367] text-[#0f0f11] px-1.5 py-0.2">
                SOURCE LINK AVAILABLE
              </span>
            )}
          </div>
          <p className="text-xs text-[#52525b] leading-relaxed">
            {security.notes || 'No additional curator security notes were recorded.'}
          </p>
          {sourceUrl && (
            <div className="pt-2 border-t border-[#e5e4dc] flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-[#8c8b85]">
                Review the declared source before installation:
              </span>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#df9367] hover:underline flex items-center gap-1"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

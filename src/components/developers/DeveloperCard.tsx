'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Copy,
  Check,
  Mail,
  Globe,
  Maximize2,
  Sparkles,
  Cpu,
  Layers,
  Code2,
  X,
} from 'lucide-react';
import { Developer } from '@/types/developer';
import { FaGithub, FaLinkedin, FaTwitter } from '@/components/ui/SocialIcons';

interface DeveloperCardProps {
  developer: Developer;
  priority?: boolean;
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showAllContributions, setShowAllContributions] = useState(false);

  const accentColor = developer.accentColor || 'acid';

  const accentStyles = {
    acid: {
      borderHover: 'hover:border-acid',
      textAccent: 'text-acid',
      bgBadge: 'bg-acid/10 text-acid border-acid/30',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(216,255,61,0.25)]',
      indicator: 'bg-[#d8ff3d]',
    },
    cyan: {
      borderHover: 'hover:border-cyan-400',
      textAccent: 'text-cyan-400',
      bgBadge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]',
      indicator: 'bg-cyan-400',
    },
    amber: {
      borderHover: 'hover:border-amber-400',
      textAccent: 'text-amber-400',
      bgBadge: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.25)]',
      indicator: 'bg-amber-400',
    },
    emerald: {
      borderHover: 'hover:border-emerald-400',
      textAccent: 'text-emerald-400',
      bgBadge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
      glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.25)]',
      indicator: 'bg-emerald-400',
    },
  }[accentColor];

  const handleCopyImageUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!developer.imageUrl) return;
    navigator.clipboard.writeText(developer.imageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const visibleContributions = showAllContributions
    ? developer.contributions
    : developer.contributions.slice(0, 3);

  const truncatedUrl = developer.imageUrl.length > 34
    ? developer.imageUrl.slice(0, 31) + '...'
    : developer.imageUrl;

  return (
    <>
      <div
        className={`group relative card-brut rounded-3xl overflow-hidden border border-line/80 bg-gradient-to-b from-ink-2/95 via-ink-2/85 to-ink-3/95 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 shadow-xl hover:-translate-y-1.5 ${accentStyles.borderHover} ${accentStyles.glow}`}
      >
        {/* Cyberpunk corner decorative ticks */}
        <div className="absolute top-3 left-3 text-[11px] font-mono text-muted/30 select-none pointer-events-none group-hover:text-acid/40 transition-colors">
          +
        </div>
        <div className="absolute top-3 right-3 text-[11px] font-mono text-muted/30 select-none pointer-events-none group-hover:text-acid/40 transition-colors">
          +
        </div>

        <div>
          {/* Card Head / Terminal Bar */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-line/60">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentStyles.indicator}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${accentStyles.indicator}`} />
              </span>
              <span className="font-mono text-xs tracking-wider uppercase text-ivory font-medium">
                {developer.badgeCode || 'SYS // DEVELOPER'}
              </span>
            </div>
            <span
              className={`font-mono text-[11px] px-3 py-1 rounded-full border font-semibold tracking-wider ${accentStyles.bgBadge}`}
            >
              {developer.status}
            </span>
          </div>

          {/* Aesthetic Image Frame with Image URL controls */}
          <div className="relative">
            <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-line/80 bg-ink-3/80 group-hover:border-line-2 transition-all shadow-inner">
              {/* Scanline & ambient noise overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60 z-10 pointer-events-none"
              />

              {!imageError ? (
                <img
                  src={developer.imageUrl}
                  alt={developer.name}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100 filter-none' : 'opacity-0 blur-sm'
                  }`}
                />
              ) : (
                /* Aesthetic Terminal Fallback when URL fails */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-ink-3">
                  <div className="w-16 h-16 rounded-full border border-line flex items-center justify-center mb-3 bg-ink">
                    <span className={`display text-2xl ${accentStyles.textAccent}`}>
                      {developer.fallbackInitials || developer.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-ivory font-medium">{developer.name}</p>
                  <p className="font-mono text-[10px] text-muted mt-1">Image URL unavailable</p>
                </div>
              )}

              {/* Floating Image Action Overlay (Inspect & Copy URL) */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleCopyImageUrl}
                  title="Copy Image URL"
                  className="p-2 rounded-xl bg-ink/80 backdrop-blur-md border border-line/80 text-ivory-2 hover:text-acid hover:border-acid transition-all shadow-lg"
                  aria-label="Copy direct image URL"
                >
                  {copiedUrl ? (
                    <Check className="w-4 h-4 text-acid" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  title="Expand Full Photo"
                  className="p-2 rounded-xl bg-ink/80 backdrop-blur-md border border-line/80 text-ivory-2 hover:text-acid hover:border-acid transition-all shadow-lg"
                  aria-label="Expand image in modal"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* URL Pill overlay at bottom */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink/90 backdrop-blur-md border border-line/80 text-[11px] font-mono text-ivory-2 shadow-lg">
                  <Sparkles className={`w-3.5 h-3.5 ${accentStyles.textAccent}`} />
                  <span className="truncate max-w-[170px] sm:max-w-[220px] text-muted">
                    {developer.imageUrl}
                  </span>
                </div>
                {copiedUrl && (
                  <span className="px-2.5 py-1 rounded-lg bg-acid text-acid-ink font-mono text-[10px] font-bold shadow-md animate-fade-in">
                    COPIED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Core Content */}
          <div className="pt-5 pb-1 space-y-4">
            <div>
              <div className="tag-mono text-xs text-muted/90 mb-1.5 flex items-center gap-1.5">
                <span>{'//'}</span>
                <span>{developer.department}</span>
              </div>

              <h3 className="display text-2xl sm:text-3xl font-bold text-ivory tracking-tight group-hover:text-acid transition-colors">
                {developer.name}
              </h3>

              <p className={`font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider mt-1 ${accentStyles.textAccent}`}>
                {developer.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-ivory-2/90 leading-relaxed line-clamp-3 min-h-[3.6rem]">
              {developer.bio}
            </p>

            {/* Key Platform Contributions */}
            <div className="pt-5 border-t border-line/50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-acid" /> Shipped Contributions
                </span>
                {developer.contributions.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllContributions((v) => !v)}
                    className="font-mono text-[11px] text-acid hover:underline"
                  >
                    {showAllContributions ? 'Show Less' : `+${developer.contributions.length - 3} more`}
                  </button>
                )}
              </div>
              <ul className="space-y-2.5">
                {visibleContributions.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] text-ivory-2 font-mono leading-relaxed"
                  >
                    <span className="text-acid select-none shrink-0 font-bold">›</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Tech Stack Badges */}
            <div className="pt-5 border-t border-line/50">
              <span className="font-mono text-xs uppercase tracking-wider text-muted block mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-muted" /> Tech Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {developer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[11px] px-3 py-1 rounded-lg border border-line/70 bg-ink-3/80 text-ivory-2 hover:border-acid/60 hover:text-acid transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Image URL Inspector & Social Actions */}
        <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between gap-3">
          {/* Direct Image URL Quick Copy Button */}
          <button
            type="button"
            onClick={handleCopyImageUrl}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-line/80 bg-ink/80 hover:border-acid hover:text-acid font-mono text-xs text-ivory-2 transition-colors shadow-sm"
            title={`Copy: ${developer.imageUrl}`}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-acid" />
                <span className="text-acid font-bold">Copied URL</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-muted" />
                <span className="truncate max-w-[110px] sm:max-w-[140px]">{truncatedUrl}</span>
              </>
            )}
          </button>

          {/* Social Links Dock */}
          <div className="flex items-center gap-1.5 shrink-0">
            {developer.githubUrl && (
              <a
                href={developer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="p-2 rounded-xl border border-line/60 bg-ink/60 text-ivory-2 hover:text-acid hover:border-acid hover:bg-acid/10 transition-colors"
                aria-label={`${developer.name}'s GitHub`}
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}

            {developer.portfolioUrl && (
              <a
                href={developer.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Portfolio Website"
                className="p-2 rounded-xl border border-line/60 bg-ink/60 text-ivory-2 hover:text-acid hover:border-acid hover:bg-acid/10 transition-colors"
                aria-label={`${developer.name}'s Portfolio`}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}

            {developer.linkedinUrl && (
              <a
                href={developer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="p-2 rounded-xl border border-line/60 bg-ink/60 text-ivory-2 hover:text-acid hover:border-acid hover:bg-acid/10 transition-colors"
                aria-label={`${developer.name}'s LinkedIn`}
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}

            {developer.twitterUrl && (
              <a
                href={developer.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X"
                className="p-2 rounded-xl border border-line/60 bg-ink/60 text-ivory-2 hover:text-acid hover:border-acid hover:bg-acid/10 transition-colors"
                aria-label={`${developer.name}'s Twitter`}
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            )}

            {developer.email && (
              <a
                href={`mailto:${developer.email}`}
                title="Send Email"
                className="p-2 rounded-xl border border-line/60 bg-ink/60 text-ivory-2 hover:text-acid hover:border-acid hover:bg-acid/10 transition-colors"
                aria-label={`Email ${developer.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Res Image & URL Inspection */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full card-brut rounded-2xl overflow-hidden border border-line bg-ink-2 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <div>
                <div className="tag-mono-acid">{'// IMAGE INSPECTION'}</div>
                <h4 className="display text-xl text-ivory mt-0.5">{developer.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg border border-line text-ivory-2 hover:text-acid hover:border-acid transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden border border-line bg-ink-3 mb-4">
              <img
                src={developer.imageUrl}
                alt={developer.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-1">
                  Source Image URL
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={developer.imageUrl}
                    className="input-brut font-mono text-xs w-full py-2 px-3 rounded-lg bg-ink border-line select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyImageUrl}
                    className="btn-acid shrink-0 !py-2 !px-3 rounded-lg text-xs font-mono"
                  >
                    {copiedUrl ? 'Copied' : 'Copy URL'}
                  </button>
                  <a
                    href={developer.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brut shrink-0 !py-2 !px-3 rounded-lg text-xs font-mono flex items-center gap-1"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

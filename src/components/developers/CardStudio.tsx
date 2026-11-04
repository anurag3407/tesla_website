'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Link2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Palette,
  Terminal,
} from 'lucide-react';
import { Developer } from '@/types/developer';
import { DeveloperCard } from './DeveloperCard';
import { SAMPLE_IMAGE_PRESETS } from './DeveloperData';

export function CardStudio() {
  const [name, setName] = useState('Alex Rivera');
  const [role, setRole] = useState('Full Stack & Cloud Engineer');
  const [department, setDepartment] = useState('Electrical Engineering · NIT Patna');
  const [status, setStatus] = useState('Core Contributor');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );
  const [bio, setBio] = useState(
    'Passionate engineer designing resilient distributed systems, real-time client experiences, and modular UI architectures.'
  );
  const [contributionsText, setContributionsText] = useState(
    'Cloud Edge Deployment & Observability\nInteractive Dashboard Micro-Frontends\nAutomated Security & Auth Pipeline'
  );
  const [skillsText, setSkillsText] = useState('Next.js, TypeScript, Tailwind CSS, Docker, GraphQL, Redis');
  const [githubUrl, setGithubUrl] = useState('https://github.com');
  const [portfolioUrl, setPortfolioUrl] = useState('https://portfolio.dev');
  const [accentColor, setAccentColor] = useState<'acid' | 'cyan' | 'amber' | 'emerald'>('acid');
  const [copiedJson, setCopiedJson] = useState(false);

  const previewDeveloper: Developer = {
    id: 'studio-preview',
    name: name.trim() || 'Developer Name',
    role: role.trim() || 'Platform Engineer',
    designation: 'Specialist',
    department: department.trim() || 'NIT Patna',
    status: status.trim() || 'Active Contributor',
    imageUrl: imageUrl.trim() || 'https://github.com/anurag3407.png',
    fallbackInitials: (name.trim() || 'DV').slice(0, 2).toUpperCase(),
    badgeCode: 'STUDIO // LIVE_PREVIEW',
    accentColor,
    bio: bio.trim() || 'Building the future of student-led engineering at NIT Patna.',
    contributions: contributionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    skills: skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    githubUrl: githubUrl.trim() || undefined,
    portfolioUrl: portfolioUrl.trim() || undefined,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(previewDeveloper, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleReset = () => {
    setName('Alex Rivera');
    setRole('Full Stack & Cloud Engineer');
    setDepartment('Electrical Engineering · NIT Patna');
    setStatus('Core Contributor');
    setImageUrl(
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    );
    setBio(
      'Passionate engineer designing resilient distributed systems, real-time client experiences, and modular UI architectures.'
    );
    setContributionsText(
      'Cloud Edge Deployment & Observability\nInteractive Dashboard Micro-Frontends\nAutomated Security & Auth Pipeline'
    );
    setSkillsText('Next.js, TypeScript, Tailwind CSS, Docker, GraphQL, Redis');
    setGithubUrl('https://github.com');
    setPortfolioUrl('https://portfolio.dev');
    setAccentColor('acid');
  };

  return (
    <div className="card-brut rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-line gap-4">
        <div>
          <div className="tag-mono-acid flex items-center gap-1.5 mb-1">
            <Terminal className="w-3.5 h-3.5" /> {'// INTERACTIVE CARD STUDIO'}
          </div>
          <h3 className="display text-2xl sm:text-3xl text-ivory">
            Live Image URL & Card Generator
          </h3>
          <p className="text-xs sm:text-sm text-ivory-2 mt-1 max-w-xl">
            Test any custom image URL live. Paste a photo link or pick a preset to see the aesthetic developer card render with instant feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="btn-brut !py-2 !px-3 text-xs flex items-center gap-1 rounded-xl"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleCopyJson}
            className="btn-acid !py-2 !px-3 text-xs flex items-center gap-1 rounded-xl font-mono"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied JSON
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy JSON
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Side: Live Form & Image URL Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Image URL Section */}
          <div className="p-4 rounded-xl border border-line bg-ink-3/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-wider text-acid flex items-center gap-1.5 font-bold">
                <Link2 className="w-3.5 h-3.5" /> Image URL (Primary)
              </label>
              <span className="font-mono text-[10px] text-muted">Supports any HTTP/HTTPS URL</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="input-brut font-mono text-xs w-full py-2.5 px-3 rounded-lg bg-ink border-line text-ivory placeholder:text-muted/60"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="font-mono text-[10px] text-muted uppercase tracking-wider block mb-2">
                Quick Test Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`font-mono text-[10px] px-2.5 py-1 rounded-md border transition-colors ${
                      imageUrl === preset.url
                        ? 'border-acid text-acid bg-acid/10 font-bold'
                        : 'border-line text-ivory-2 hover:border-line-2 hover:text-ivory bg-ink'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2">
              <Palette className="w-3 h-3" /> Card Neon Accent
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['acid', 'cyan', 'amber', 'emerald'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className={`py-2 px-3 rounded-lg border font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    accentColor === color
                      ? 'border-ivory bg-ink-3 text-ivory font-bold shadow-md'
                      : 'border-line text-muted hover:text-ivory-2 bg-ink'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      color === 'acid'
                        ? 'bg-[#d8ff3d]'
                        : color === 'cyan'
                        ? 'bg-[#38bdf8]'
                        : color === 'amber'
                        ? 'bg-[#fbbf24]'
                        : 'bg-[#34d399]'
                    }`}
                  />
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Core Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                Developer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-brut text-sm w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-brut text-sm w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                Department / Institution
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-brut text-sm w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                Status Badge
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-brut text-sm w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Bio / Quote
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-brut text-sm w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Key Contributions (One per line)
            </label>
            <textarea
              rows={3}
              value={contributionsText}
              onChange={(e) => setContributionsText(e.target.value)}
              className="input-brut font-mono text-xs w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
              Skills / Technologies (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="input-brut font-mono text-xs w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="input-brut font-mono text-xs w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted block mb-1.5">
                Portfolio URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="input-brut font-mono text-xs w-full py-2 px-3 rounded-lg bg-ink border-line text-ivory"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Aesthetic Card Preview */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Live Rendered Card
              </span>
              <span className="font-mono text-[10px] text-muted">Realtime preview</span>
            </div>

            <DeveloperCard developer={previewDeveloper} />
          </div>
        </div>
      </div>
    </div>
  );
}

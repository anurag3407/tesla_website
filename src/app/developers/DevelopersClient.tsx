'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Code2,
  Terminal,
  Cpu,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ScrollReveal, StaggerGroup, StaggerItem } from '@/components/ui/ScrollReveal';
import { FaGithub } from '@/components/ui/SocialIcons';
import { DeveloperCard } from '@/components/developers/DeveloperCard';
import { CardStudio } from '@/components/developers/CardStudio';
import { CORE_DEVELOPERS } from '@/components/developers/DeveloperData';

const FILTER_TABS = [
  { id: 'all', label: 'All Engineers' },
  { id: 'arch', label: 'Architecture & Backend' },
  { id: 'ui', label: '3D UI & Frontend' },
] as const;

export function DevelopersClient() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'cards' | 'studio'>('cards');

  const filteredDevelopers = useMemo(() => {
    return CORE_DEVELOPERS.filter((dev) => {
      // Filter tab logic
      if (filter === 'arch' && !dev.role.toLowerCase().includes('architect') && !dev.role.toLowerCase().includes('full-stack')) {
        return false;
      }
      if (filter === 'ui' && !dev.role.toLowerCase().includes('ui') && !dev.role.toLowerCase().includes('frontend')) {
        return false;
      }

      // Search query logic
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        dev.name.toLowerCase().includes(q) ||
        dev.role.toLowerCase().includes(q) ||
        dev.department.toLowerCase().includes(q) ||
        dev.skills.some((s) => s.toLowerCase().includes(q)) ||
        dev.contributions.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [search, filter]);

  return (
    <div className="bg-ink min-h-screen text-ivory">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative border-b border-line overflow-hidden pt-12 pb-16 sm:pb-24">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--color-ivory) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-ink-2/80 text-acid font-mono text-[11px] uppercase tracking-wider mb-6">
              <Terminal className="w-3.5 h-3.5" />
              <span>{'// ENGINEERING GUILD · NIT PATNA'}</span>
            </div>

            <h1 className="display text-4xl sm:text-6xl lg:text-7xl max-w-4xl tracking-tight leading-[0.95]">
              The <span className="text-acid">Architects</span> Behind TESLA
            </h1>

            <p className="text-ivory-2 mt-5 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
              Meet the software engineers, designers, and systems architects who designed and built the TESLA Technical Club web platform from scratch.
            </p>

            {/* Architecture Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-3xl">
              <div className="card-brut rounded-xl p-4 border border-line bg-ink-2/60">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider">Engineers</div>
                <div className="display text-2xl sm:text-3xl text-acid mt-1">3 Core</div>
                <div className="text-[11px] text-ivory-2 mt-0.5">Students at NIT Patna</div>
              </div>

              <div className="card-brut rounded-xl p-4 border border-line bg-ink-2/60">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider">Core Stack</div>
                <div className="display text-2xl sm:text-3xl text-ivory mt-1">Next.js 16</div>
                <div className="text-[11px] text-ivory-2 mt-0.5">React 19 + TypeScript</div>
              </div>

              <div className="card-brut rounded-xl p-4 border border-line bg-ink-2/60">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider">Automated Tests</div>
                <div className="display text-2xl sm:text-3xl text-acid mt-1">40+ Vitest</div>
                <div className="text-[11px] text-ivory-2 mt-0.5">100% CI Passing</div>
              </div>

              <div className="card-brut rounded-xl p-4 border border-line bg-ink-2/60">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider">Provenance</div>
                <div className="display text-2xl sm:text-3xl text-ivory mt-1">100%</div>
                <div className="text-[11px] text-ivory-2 mt-0.5">Student Engineered</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── View Selector & Search Filter Bar ──────────────────────── */}
      <section className="border-b border-line bg-ink-2/40 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* View Switcher: Showcase vs Image URL Studio */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('cards')}
                className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeView === 'cards'
                    ? 'bg-acid text-acid-ink font-bold shadow-md'
                    : 'border border-line text-ivory-2 hover:border-line-2 hover:text-ivory bg-ink'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Core Developers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('studio')}
                className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeView === 'studio'
                    ? 'bg-acid text-acid-ink font-bold shadow-md'
                    : 'border border-line text-ivory-2 hover:border-line-2 hover:text-ivory bg-ink'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Image URL (Studio)</span>
              </button>
            </div>

            {/* Filter Tabs & Search Box (shown in cards view) */}
            {activeView === 'cards' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        filter === tab.id
                          ? 'border border-acid/50 bg-acid/10 text-acid font-medium'
                          : 'border border-line/60 text-muted hover:text-ivory hover:border-line-2'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search dev, stack, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-brut font-mono text-xs w-full py-1.5 pl-8 pr-3 rounded-lg bg-ink border-line text-ivory placeholder:text-muted/60"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {activeView === 'studio' ? (
            /* Live Image URL Tester & Card Studio */
            <ScrollReveal>
              <CardStudio />
            </ScrollReveal>
          ) : (
            /* Developer Cards Showcase Grid */
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="tag-mono-acid mb-1">{'// CORE CONTRIBUTORS'}</div>
                  <h2 className="display text-2xl sm:text-3xl text-ivory">
                    Engineered by NIT Patna Students
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted">
                  <span className="w-2 h-2 rounded-full bg-acid" />
                  <span>Interactive Cards with Image URLs</span>
                </div>
              </div>

              {filteredDevelopers.length === 0 ? (
                <div className="card-brut rounded-2xl p-12 text-center border border-line">
                  <SlidersHorizontal className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="display text-xl text-ivory">No developers match your query</p>
                  <p className="text-xs text-muted mt-1 font-mono">
                    Try searching for another technology or clear your filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setFilter('all');
                    }}
                    className="btn-brut !py-2 !px-4 text-xs font-mono mt-4 rounded-xl"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {filteredDevelopers.map((developer) => (
                    <StaggerItem key={developer.id} className="h-full">
                      <DeveloperCard developer={developer} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>
          )}

          {/* Quick Studio Callout Banner (when in cards view) */}
          {activeView === 'cards' && (
            <ScrollReveal className="mt-14">
              <div className="card-brut rounded-2xl border border-line bg-gradient-to-r from-ink-2 via-ink-3 to-ink-2 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="tag-mono-acid flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{'// IMAGE URL CARD STUDIO'}</span>
                  </div>
                  <h3 className="display text-2xl text-ivory">
                    Want to test your own Image URL?
                  </h3>
                  <p className="text-xs sm:text-sm text-ivory-2">
                    Use our interactive studio to paste any image URL, customize credentials and tech skills, and preview your aesthetic developer card in realtime.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('studio');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="btn-acid shrink-0 rounded-xl font-mono text-xs !py-3 !px-5"
                >
                  Launch Card Studio
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* ── Architecture & Engineering Highlights ───────────────── */}
          <ScrollReveal className="mt-20 pt-16 border-t border-line">
            <div className="max-w-2xl mb-10">
              <div className="tag-mono-acid mb-2">{'// UNDER THE HOOD'}</div>
              <h2 className="display text-3xl sm:text-4xl text-ivory">
                Engineering Pillars & Architecture
              </h2>
              <p className="text-sm text-ivory-2 mt-2">
                A look at the modern web standards, security protocols, and visual computing technologies powering this platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-brut rounded-xl p-5 border border-line bg-ink-2">
                <div className="w-8 h-8 rounded-lg border border-line bg-ink-3 flex items-center justify-center text-acid mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider">Pillar 01</div>
                <h4 className="display text-lg text-ivory mt-0.5">Next.js 16 App Router</h4>
                <p className="text-xs text-ivory-2/80 mt-2 leading-relaxed">
                  React 19 Server Components, streaming SSR, and edge middleware guarding protected admin and dashboard routes.
                </p>
              </div>

              <div className="card-brut rounded-xl p-5 border border-line bg-ink-2">
                <div className="w-8 h-8 rounded-lg border border-line bg-ink-3 flex items-center justify-center text-cyan-400 mb-3">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider">Pillar 02</div>
                <h4 className="display text-lg text-ivory mt-0.5">Three.js 3D Visualizer</h4>
                <p className="text-xs text-ivory-2/80 mt-2 leading-relaxed">
                  Hardware-accelerated WebGL energy turbine canvas with mouse-tracking inertia and dynamic lighting effects.
                </p>
              </div>

              <div className="card-brut rounded-xl p-5 border border-line bg-ink-2">
                <div className="w-8 h-8 rounded-lg border border-line bg-ink-3 flex items-center justify-center text-amber-400 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider">Pillar 03</div>
                <h4 className="display text-lg text-ivory mt-0.5">Jose & JWT Auth Guard</h4>
                <p className="text-xs text-ivory-2/80 mt-2 leading-relaxed">
                  Stateless encrypted JWT token validation, strict session expiration, bcryptjs hashing, and regex denial prevention.
                </p>
              </div>

              <div className="card-brut rounded-xl p-5 border border-line bg-ink-2">
                <div className="w-8 h-8 rounded-lg border border-line bg-ink-3 flex items-center justify-center text-emerald-400 mb-3">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-wider">Pillar 04</div>
                <h4 className="display text-lg text-ivory mt-0.5">Vitest Automated CI</h4>
                <p className="text-xs text-ivory-2/80 mt-2 leading-relaxed">
                  Over 40 automated unit and integration tests verifying authentication, API validation, database models, and security edge cases.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Open Source & Contribution Callout ──────────────────── */}
          <ScrollReveal className="mt-16 card-brut rounded-2xl border border-line bg-ink-2 p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <div className="w-12 h-12 rounded-full border border-line bg-ink-3 flex items-center justify-center text-acid mx-auto mb-4">
              <Code2 className="w-6 h-6" />
            </div>

            <div className="tag-mono-acid mb-2">{'// OPEN CONTRIBUTION'}</div>
            <h3 className="display text-3xl sm:text-4xl text-ivory">
              Want to Build with the TESLA Dev Guild?
            </h3>
            <p className="text-xs sm:text-sm text-ivory-2 mt-3 max-w-xl mx-auto leading-relaxed">
              We welcome pull requests, feature proposals, and bug reports from students and enthusiasts across all departments. Check out the open issues or drop a star on GitHub.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <a
                href="https://github.com/anurag3407/tesla_website"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-acid !py-3 !px-6 rounded-xl font-mono text-xs flex items-center gap-2"
              >
                <FaGithub className="w-4 h-4" />
                <span>View on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/contact"
                className="btn-brut !py-3 !px-6 rounded-xl font-mono text-xs flex items-center gap-2"
              >
                <span>Contact Tech Team</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

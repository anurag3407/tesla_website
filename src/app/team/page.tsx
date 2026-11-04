'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Search, ArrowRight, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from '@/components/ui/SocialIcons';
import { useApi } from '@/lib/api';
import { Avatar, EmptyState, ErrorState, SkeletonGrid } from '@/components/ui/States';
import { ScrollReveal, StaggerGroup, StaggerItem } from '@/components/ui/ScrollReveal';

const ROLE_TABS = ['all', 'Admin', 'PI', 'President', 'OfficeBearer', 'TeamLeader', 'TeamMember'] as const;
const PAGE_SIZE = 8;

type Member = {
  id: string;
  name: string;
  role?: string;
  designation?: string;
  team?: string;
  batch?: number;
  year?: string;
  bio?: string;
  profileImage?: string;
  portfolio?: string;
  skills?: string[];
  socialLinks?: { linkedin?: string; github?: string; instagram?: string; twitter?: string };
};

export default function TeamPage() {
  const [role, setRole] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const router = useRouter();

  // Whole card navigates to the detail page. Nested <a> social buttons stop
  // propagation so they keep working independently, and keyboard users get
  // Enter/Space via the role="link" + tabIndex pattern (an <a> can't wrap the
  // card because those social links are block-level children of it).
  const openMember = (id: string) => router.push(`/team/${id}`);
  const onCardKey = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMember(id);
    }
  };
  const stopNav = (e: MouseEvent<HTMLElement>) => e.stopPropagation();

  const { data, error, isLoading, mutate } = useApi<{ members: Member[] }>('/api/team');

  const members = useMemo(() => data?.members || [], [data]);
  const filtered = useMemo(
    () =>
      members.filter((m) => {
        if (role !== 'all' && m.role !== role) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          m.name?.toLowerCase().includes(q) ||
          m.designation?.toLowerCase().includes(q) ||
          m.team?.toLowerCase().includes(q)
        );
      }),
    [members, role, search]
  );
  const shown = filtered.slice(0, visible);

  return (
    <div className="bg-ink min-h-screen">
      <section className="border-b border-line bg-terminal">
        <ScrollReveal className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="tag-mono-acid mb-3">{'// THE TEAM'}</div>
          <h1 className="display text-4xl sm:text-5xl">People behind TESLA</h1>
          <p className="text-ivory-2 mt-3 max-w-2xl text-sm sm:text-base">
            The students and faculty driving every project, event and win. Live from the club database.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center py-6 border-b border-line mb-8">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {ROLE_TABS.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setVisible(PAGE_SIZE); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-[0.12em] border transition-colors ${
                    role === r
                      ? 'bg-acid text-acid-ink border-acid font-bold'
                      : 'border-line text-ivory-2 hover:border-acid hover:text-acid'
                  }`}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              ))}
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
                placeholder="Search name, team, skill..."
                className="input-brut rounded-md !pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <SkeletonGrid count={8} />
          ) : error ? (
            <ErrorState
              title="Unable to load team data"
              message="Please check your connection and try again."
              onRetry={() => mutate()}
            />
          ) : filtered.length === 0 ? (
            <EmptyState title="No members found" hint="Try a different filter or search term." />
          ) : (
            <>
              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
                {shown.map((member) => (
                  <StaggerItem key={member.id} className="h-full">
                  <div
                    role="link"
                    tabIndex={0}
                    aria-label={`View profile of ${member.name}`}
                    onClick={() => openMember(member.id)}
                    onKeyDown={(e) => onCardKey(e, member.id)}
                    className="card-brut rounded-2xl border border-line/80 bg-gradient-to-b from-ink-2/95 via-ink-2/70 to-ink-3/95 p-7 sm:p-8 flex flex-col items-center text-center h-full hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative group overflow-hidden shadow-lg hover:border-acid/60 hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(216,255,61,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {/* Decorative cyber corner ticks */}
                    <div className="absolute top-2.5 left-2.5 text-[10px] font-mono text-muted/30 select-none pointer-events-none group-hover:text-acid/40 transition-colors">
                      +
                    </div>
                    <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-muted/30 select-none pointer-events-none group-hover:text-acid/40 transition-colors">
                      +
                    </div>

                    {/* Elevated Avatar */}
                    <div className="relative p-1 rounded-2xl bg-ink-3/90 border border-line/80 group-hover:border-acid/60 group-hover:scale-105 transition-all duration-300 shadow-md">
                      <Avatar src={member.profileImage} name={member.name} className="w-24 h-24 text-2xl rounded-xl" />
                    </div>

                    {/* Member Identity */}
                    <h3 className="display text-xl sm:text-2xl mt-4 text-ivory group-hover:text-acid transition-colors font-bold tracking-tight">
                      {member.name}
                    </h3>

                    {/* Role Pill */}
                    <div className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.12em] font-semibold bg-acid/10 text-acid border border-acid/25">
                      {member.designation || member.role}
                    </div>

                    {/* Team & Batch */}
                    <p className="font-mono text-xs tracking-wider uppercase text-muted mt-2">
                      {[member.team, member.batch ? `Batch ${member.batch}` : member.year]
                        .filter(Boolean)
                        .join(' · ') || '\u00A0'}
                    </p>

                    {/* Bio */}
                    {member.bio ? (
                      <p className="text-xs sm:text-[13px] text-ivory-2/80 mt-3.5 line-clamp-3 leading-relaxed min-h-[3.6rem] px-1">
                        {member.bio}
                      </p>
                    ) : (
                      <div className="min-h-[3.6rem]" />
                    )}

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center mt-4 pt-3.5 border-t border-line/40 w-full">
                        {member.skills.slice(0, 3).map((s: string) => (
                          <span key={s} className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-line/70 bg-ink-3/70 text-muted group-hover:border-line-2 transition-colors">
                            {s}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-acid/40 bg-acid/10 text-acid">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Dock */}
                    <div className="flex items-center justify-between w-full mt-auto pt-5 border-t border-line/60">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted group-hover:text-acid transition-colors font-medium">
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>

                      <div className="flex items-center gap-1.5">
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            onClick={stopNav}
                            className="p-2 rounded-lg border border-line/70 bg-ink/70 hover:border-acid hover:text-acid hover:bg-acid/10 text-ivory-2 transition-colors"
                          >
                            <FaLinkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialLinks?.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            onClick={stopNav}
                            className="p-2 rounded-lg border border-line/70 bg-ink/70 hover:border-acid hover:text-acid hover:bg-acid/10 text-ivory-2 transition-colors"
                          >
                            <FaGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.portfolio && (
                          <a
                            href={member.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Portfolio Website"
                            onClick={stopNav}
                            className="p-2 rounded-lg border border-line/70 bg-ink/70 hover:border-acid hover:text-acid hover:bg-acid/10 text-ivory-2 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              {filtered.length > visible && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-brut">
                    Load more ({filtered.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
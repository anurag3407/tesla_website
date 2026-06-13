'use client';

import { motion, AnimatePresence, cubicBezier, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react';
import Link from 'next/link';
import {
  Calendar, Plus, RefreshCw, Search, Filter, Users, MapPin,
  Clock, ChevronDown, Eye, Pencil, Trash2, MoreHorizontal,
  TrendingUp, Zap, ArrowRight, CheckCircle2, XCircle,
  AlertCircle, Radio, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
type EventCategory = 'Workshop' | 'Hackathon' | 'Seminar' | 'Competition' | 'Social';

interface ClubEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  status: EventStatus;
  attendees: number;
  capacity: number;
  organizer: string;
  description: string;
}

interface EventsData {
  events: ClubEvent[];
  stats: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
    totalAttendees: number;
  };
  monthlyData: { name: string; events: number; attendees: number }[];
  categoryData: { name: string; count: number }[];
}

// ─── Mock fetch (swap with real API) ─────────────────────────────────────────
async function fetchEventsData(): Promise<EventsData> {
  // Replace with: const res = await fetch('/api/admin/events'); return res.json();
  await new Promise(r => setTimeout(r, 700));
  const events: ClubEvent[] = [
    { id: 1, title: 'AI & ML Workshop', date: '2025-06-20', time: '10:00 AM', location: 'Lab 3, Block B', category: 'Workshop', status: 'Upcoming', attendees: 38, capacity: 50, organizer: 'Ram', description: 'Hands-on neural networks with PyTorch.' },
    { id: 2, title: 'Tesla Hackathon 2025', date: '2025-06-25', time: '9:00 AM', location: 'Auditorium', category: 'Hackathon', status: 'Upcoming', attendees: 94, capacity: 100, organizer: 'Teena', description: '24-hour hackathon, top 3 teams win prizes.' },
    { id: 3, title: 'Open Source Drive', date: '2025-06-15', time: '2:00 PM', location: 'Online – Discord', category: 'Workshop', status: 'Ongoing', attendees: 22, capacity: 40, organizer: 'Meena', description: 'Live contributions to GitHub open-source projects.' },
    { id: 4, title: 'Cloud Computing Seminar', date: '2025-06-10', time: '11:00 AM', location: 'Seminar Hall A', category: 'Seminar', status: 'Completed', attendees: 60, capacity: 60, organizer: 'Ramu', description: 'AWS, GCP, and Azure for students.' },
    { id: 5, title: 'UI/UX Design Challenge', date: '2025-06-28', time: '1:00 PM', location: 'Design Studio', category: 'Competition', status: 'Upcoming', attendees: 17, capacity: 30, organizer: 'Somu', description: 'Redesign the college website in Figma.' },
    { id: 6, title: 'End-of-Semester Social', date: '2025-06-05', time: '5:00 PM', location: 'Cafeteria', category: 'Social', status: 'Completed', attendees: 85, capacity: 100, organizer: 'Ram', description: 'Certificates and informal networking.' },
    { id: 7, title: 'Cybersecurity CTF', date: '2025-07-05', time: '10:00 AM', location: 'Lab 1, Block A', category: 'Competition', status: 'Upcoming', attendees: 12, capacity: 25, organizer: 'Meena', description: 'Capture-the-flag from beginner to expert.' },
    { id: 8, title: 'Robotics Demo Day', date: '2025-05-30', time: '3:00 PM', location: 'Mechanical Block', category: 'Workshop', status: 'Cancelled', attendees: 0, capacity: 45, organizer: 'Ramu', description: 'Showcase of semester robot builds.' },
  ];
  return {
    events,
    stats: { total: 8, upcoming: 4, ongoing: 1, completed: 2, cancelled: 1, totalAttendees: 328 },
    monthlyData: [
      { name: 'Jan', events: 1, attendees: 45 }, { name: 'Feb', events: 2, attendees: 90 },
      { name: 'Mar', events: 1, attendees: 60 }, { name: 'Apr', events: 3, attendees: 140 },
      { name: 'May', events: 2, attendees: 85 }, { name: 'Jun', events: 4, attendees: 175 },
    ],
    categoryData: [
      { name: 'Workshop', count: 3 }, { name: 'Hackathon', count: 1 },
      { name: 'Seminar', count: 1 }, { name: 'Competition', count: 2 }, { name: 'Social', count: 1 },
    ],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function pct(a: number, b: number) { return b === 0 ? 0 : Math.round((a / b) * 100); }

const STATUS_META: Record<EventStatus, { color: string; bg: string; border: string; Icon: any; label: string }> = {
  Upcoming:  { color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)',  Icon: Clock,         label: 'Upcoming'  },
  Ongoing:   { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  Icon: Radio,         label: 'Ongoing'   },
  Completed: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', Icon: CheckCircle2,  label: 'Completed' },
  Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', Icon: XCircle,       label: 'Cancelled' },
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  Workshop: '#6366f1', Hackathon: '#f59e0b', Seminar: '#a78bfa',
  Competition: '#06b6d4', Social: '#fb7185',
};

const EVENT_GRADIENTS = [
  ['#6366f1', '#4f46e5'], ['#8b5cf6', '#7c3aed'],
  ['#3b82f6', '#2563eb'], ['#06b6d4', '#0891b2'],
];

// ─── Animated Number (same as overview) ──────────────────────────────────────
const AnimatedNumber = memo(function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const prevValue = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = prevValue.current;
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevValue.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);
  return <>{display.toLocaleString()}</>;
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}
function EventsSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="stat-grid">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="grid-2-1">
        <Skeleton className="h-60 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

// ─── Chart Tooltip (same as overview) ─────────────────────────────────────────
const ChartTooltip = memo(function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="tooltip-value">
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
});

// ─── itemVariants (same as overview) ─────────────────────────────────────────
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: cubicBezier(0.22, 1, 0.36, 1) } },
};

// ─── Stat Card (matches overview StatCard exactly) ────────────────────────────
const StatCard = memo(function StatCard({ s }: { s: any }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <div className="stat-card" style={{ '--accent': s.accent } as any}>
        <div className="stat-top">
          <div className="stat-icon-wrap">
            <s.Icon className="stat-icon" />
          </div>
        </div>
        <p className="stat-value"><AnimatedNumber value={s.value} /></p>
        <div className="stat-footer">
          <span className="stat-title">{s.title}</span>
        </div>
        <div className="stat-glow" />
      </div>
    </motion.div>
  );
});

// ─── Attendance Bar ───────────────────────────────────────────────────────────
function AttendeeBar({ attendees, capacity }: { attendees: number; capacity: number }) {
  const [width, setWidth] = useState('0%');
  const ref = useRef<HTMLDivElement>(null);
  const p = pct(attendees, capacity);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth(`${p}%`), 80); obs.disconnect(); }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [p]);
  const barColor = p >= 90 ? '#f87171' : p >= 60 ? '#f59e0b' : '#6366f1';
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
        <span>{attendees} / {capacity}</span>
        <span style={{ color: p >= 90 ? '#f87171' : '#9ca3af', fontWeight: 600 }}>{p}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width, background: barColor, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EventStatus }) {
  const m = STATUS_META[status];
  return (
    <span className="stat-badge" style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}`, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>
      {status === 'Ongoing'
        ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, display: 'inline-block', animation: 'ping 1.5s ease-out infinite' }} />
        : <m.Icon style={{ width: 11, height: 11 }} />}
      {m.label}
    </span>
  );
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ category }: { category: EventCategory }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span style={{ background: `color-mix(in srgb, ${c} 12%, transparent)`, color: c, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)`, fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
      {category}
    </span>
  );
}

// ─── Event Table Row ──────────────────────────────────────────────────────────
const EventRow = memo(function EventRow({ event, index }: { event: ClubEvent; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ delay: 0.04 * index, duration: 0.32, ease: cubicBezier(0.22, 1, 0.36, 1) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.15s' }}
    >
      <td className="td-cell">
        <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: 13, marginBottom: 3 }}>{event.title}</div>
        <div style={{ fontSize: 11, color: '#6b7280', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.description}</div>
      </td>
      <td className="td-cell">
        <div style={{ color: '#d1d5db', fontSize: 13 }}>{fmtDate(event.date)}</div>
        <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock style={{ width: 10, height: 10 }} />{event.time}
        </div>
      </td>
      <td className="td-cell"><CategoryPill category={event.category} /></td>
      <td className="td-cell" style={{ minWidth: 140 }}>
        <AttendeeBar attendees={event.attendees} capacity={event.capacity} />
      </td>
      <td className="td-cell"><StatusBadge status={event.status} /></td>
      <td className="td-cell">
        <div style={{ color: '#d1d5db', fontSize: 13 }}>{event.organizer}</div>
        <div style={{ color: '#6b7280', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin style={{ width: 10, height: 10 }} />{event.location}
        </div>
      </td>
      <td className="td-cell">
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { Icon: Eye, title: 'View' },
            { Icon: Pencil, title: 'Edit' },
            { Icon: Trash2, title: 'Delete', danger: true },
          ].map(({ Icon, title, danger }: { Icon: any; title: string; danger?: boolean }) => (
            <motion.button
              key={title}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              title={title}
              style={{
                width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
                background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: danger ? '#f87171' : '#6b7280',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = danger ? 'rgba(248,113,113,0.1)' : 'rgba(99,102,241,0.12)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = danger ? 'rgba(248,113,113,0.35)' : 'rgba(99,102,241,0.35)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <Icon style={{ width: 13, height: 13 }} />
            </motion.button>
          ))}
        </div>
      </td>
    </motion.tr>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [data, setData] = useState<EventsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'All'>('All');
  const lastFetchRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const d = await fetchEventsData();
      setData(d);
      setError('');
      setLastUpdated(new Date());
      lastFetchRef.current = Date.now();
      if (isRefresh) {
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 60_000);
    const onFocus = () => { if (Date.now() - lastFetchRef.current > 30_000) fetchData(true); };
    const onVis = () => { if (document.visibilityState === 'visible') onFocus(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(interval); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVis); };
  }, [fetchData]);

  const statCards = useMemo(() => {
    if (!data) return [];
    return [
      { title: 'Total Events',     value: data.stats.total,        Icon: Calendar,     accent: '#6366f1' },
      { title: 'Upcoming',         value: data.stats.upcoming,     Icon: Clock,        accent: '#818cf8' },
      { title: 'Ongoing',          value: data.stats.ongoing,      Icon: Radio,        accent: '#34d399' },
      { title: 'Completed',        value: data.stats.completed,    Icon: CheckCircle2, accent: '#a78bfa' },
      { title: 'Total Attendees',  value: data.stats.totalAttendees, Icon: Users,      accent: '#06b6d4' },
    ];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.events.filter(e => {
      const matchQ = e.title.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || e.status === statusFilter;
      const matchC = categoryFilter === 'All' || e.category === categoryFilter;
      return matchQ && matchS && matchC;
    });
  }, [data, search, statusFilter, categoryFilter]);

  const containerVariants = useMemo(() => ({
    hidden: {},
    show: { transition: prefersReducedMotion ? {} : { staggerChildren: 0.06, delayChildren: 0.06 } },
  }), [prefersReducedMotion]);

  const fade = useCallback((delay = 0) => prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay, ease: cubicBezier(0.22, 1, 0.36, 1) } }
  , [prefersReducedMotion]);

  if (loading) return <div className="dashboard-wrap"><style>{styles}</style><EventsSkeleton /></div>;
  if (error || !data) return (
    <div className="dashboard-wrap">
      <style>{styles}</style>
      <div className="error-state">
        <AlertCircle style={{ width: 36, height: 36, color: '#f87171' }} />
        <p className="error-title">Events couldn't load</p>
        <p className="error-sub">{error}</p>
        <button onClick={() => fetchData()} className="retry-btn">Try again</button>
      </div>
    </div>
  );

  const hasMonthly = data.monthlyData.some(d => d.events > 0);

  return (
    <div className={`dashboard-wrap ${justRefreshed ? 'just-refreshed' : ''}`}>
      <style>{styles}</style>

      {/* ── Hero Banner (matches overview) ── */}
      <motion.div {...fade(0)} className="hero-banner">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-sheen" />
        <div className="hero-inner">
          <div>
            <div className="hero-title-row">
              <Calendar className="sparkle-icon" style={{ color: '#818cf8' }} />
              <h1 className="hero-title">Event Management</h1>
            </div>
            <p className="hero-sub">View, create, and manage club events — track attendance and status</p>
            {lastUpdated && (
              <div className="live-row">
                <span className="live-dot-wrap">
                  <span className="live-ping" />
                  <span className="live-dot" />
                </span>
                <span className="live-text">
                  Live · Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          <div className="hero-right">
            <div className="hero-pills">
              <div className="hero-pill">
                <span className="pill-label">Next Event</span>
                <span className="pill-event">
                  {data.events.find(e => e.status === 'Upcoming')?.title || 'None scheduled'}
                </span>
              </div>
              <div className="hero-pill">
                <span className="pill-label">This Month</span>
                <span className="pill-value">
                  <AnimatedNumber value={data.stats.upcoming + data.stats.ongoing} />
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                whileTap={{ scale: 0.95 }}
                className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              >
                <RefreshCw className={`refresh-icon ${refreshing ? 'spin' : ''}`} />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="add-btn"
              >
                <Plus style={{ width: 15, height: 15 }} />
                Add Event
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div className="stat-grid-5" variants={containerVariants} initial="hidden" animate="show">
        {statCards.map(s => <StatCard key={s.title} s={s} />)}
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid-2-1">
        {/* Monthly Events Area Chart */}
        <motion.div {...fade(0.12)} className="card">
          <div className="card-header">
            <h3 className="card-title">Events Activity</h3>
            <span className="chip">Last 6 Months</span>
          </div>
          {!hasMonthly ? (
            <div className="empty-state">
              <BarChart3 className="empty-icon" />
              <p className="empty-title">No activity recorded yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAttendees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="events" stroke="#6366f1" fill="url(#gEvents)" strokeWidth={2.5} name="Events" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} isAnimationActive={!prefersReducedMotion} animationDuration={700} animationEasing="ease-out" />
                <Area type="monotone" dataKey="attendees" stroke="#06b6d4" fill="url(#gAttendees)" strokeWidth={2} name="Attendees" dot={false} activeDot={{ r: 4, fill: '#06b6d4' }} isAnimationActive={!prefersReducedMotion} animationDuration={900} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Category Bar Chart */}
        <motion.div {...fade(0.16)} className="card">
          <div className="card-header">
            <h3 className="card-title">By Category</h3>
            <span className="chip">All Time</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.categoryData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gCat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="count" fill="url(#gCat)" radius={[6, 6, 0, 0]} name="Events" isAnimationActive={!prefersReducedMotion} animationDuration={700} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Events Table ── */}
      <motion.div {...fade(0.22)} className="card">
        {/* Table header / filters */}
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 className="card-title">All Events</h3>
            <span className="activity-count">{filtered.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
            {/* Search */}
            <div className="search-wrap">
              <Search style={{ width: 13, height: 13, color: '#6b7280', flexShrink: 0 }} />
              <input
                className="search-input"
                placeholder="Search events…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Status filter */}
            <div className="select-wrap">
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                {['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(v => (
                  <option key={v} value={v}>{v === 'All' ? 'All Status' : v}</option>
                ))}
              </select>
              <ChevronDown style={{ width: 12, height: 12, color: '#6b7280', pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {/* Category filter */}
            <div className="select-wrap">
              <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)}>
                {['All', 'Workshop', 'Hackathon', 'Seminar', 'Competition', 'Social'].map(v => (
                  <option key={v} value={v}>{v === 'All' ? 'All Categories' : v}</option>
                ))}
              </select>
              <ChevronDown style={{ width: 12, height: 12, color: '#6b7280', pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Event', 'Date & Time', 'Category', 'Attendance', 'Status', 'Organizer', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <Calendar className="empty-icon" />
                      <p className="empty-title">No events match your filters</p>
                      <p className="empty-sub">Try adjusting the search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {filtered.map((ev, i) => <EventRow key={ev.id} event={ev} index={i} />)}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  .dashboard-wrap { --primary: #6366f1; font-family: system-ui, -apple-system, sans-serif; }
  .dashboard-wrap * { box-sizing: border-box; }
  .space-y-5 > * + * { margin-top: 1.25rem; }

  /* Skeleton */
  .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

  /* Error */
  .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 8px; text-align: center; }
  .error-title { color: #f87171; font-weight: 600; font-size: 1rem; }
  .error-sub { color: #6b7280; font-size: 0.875rem; max-width: 300px; }
  .retry-btn { margin-top: 8px; padding: 8px 20px; border-radius: 10px; background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); font-size: 0.875rem; font-weight: 500; cursor: pointer; }
  .retry-btn:hover { background: rgba(99,102,241,0.25); }
  .retry-btn:focus-visible { outline: 2px solid #818cf8; outline-offset: 2px; }

  /* Hero */
  .hero-banner { position: relative; overflow: hidden; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); padding: 28px 32px; transition: border-color 0.4s ease; }
  .hero-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
  .hero-blob-1 { width: 280px; height: 280px; top: -80px; right: -80px; background: rgba(99,102,241,0.18); animation: drift1 18s ease-in-out infinite; }
  .hero-blob-2 { width: 240px; height: 240px; bottom: -80px; left: -60px; background: rgba(139,92,246,0.15); animation: drift2 22s ease-in-out infinite; }
  @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,20px) scale(1.08); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-15px) scale(1.05); } }
  .hero-sheen { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg,transparent 40%,rgba(255,255,255,0.05) 50%,transparent 60%); background-size: 250% 250%; background-position: 100% 0; animation: sheen 6s ease-in-out infinite; }
  @keyframes sheen { 0%,100% { background-position: 120% 0; } 50% { background-position: -20% 0; } }
  .hero-inner { position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; }
  .hero-title-row { display: flex; align-items: center; gap: 10px; }
  .hero-title { font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; color: #fff; letter-spacing: -0.02em; margin: 0; }
  .sparkle-icon { width: 22px; height: 22px; flex-shrink: 0; display: block; }
  .hero-sub { color: #9ca3af; font-size: 0.9rem; margin: 6px 0 0; }
  .live-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
  .live-dot-wrap { position: relative; width: 10px; height: 10px; flex-shrink: 0; }
  .live-ping { position: absolute; inset: 0; border-radius: 50%; background: #4ade80; opacity: 0.6; animation: ping 1.5s ease-out infinite; }
  .live-dot { position: absolute; inset: 1px; border-radius: 50%; background: #4ade80; }
  @keyframes ping { 0% { transform: scale(1); opacity: 0.6 } 100% { transform: scale(2.2); opacity: 0 } }
  .live-text { font-size: 0.75rem; color: #6b7280; }
  .hero-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .hero-pills { display: flex; gap: 12px; }
  .hero-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 10px 16px; min-width: 120px; transition: background 0.2s, border-color 0.2s; }
  .hero-pill:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
  .pill-label { display: block; font-size: 0.65rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .pill-value { font-size: 1.5rem; font-weight: 800; color: #fff; line-height: 1; }
  .pill-event { font-size: 0.85rem; font-weight: 600; color: #e5e7eb; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
  .refresh-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; border-radius: 12px; background: rgba(99,102,241,0.12); color: #818cf8; border: 1px solid rgba(99,102,241,0.25); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .refresh-btn:hover:not(:disabled) { background: rgba(99,102,241,0.22); }
  .refresh-btn:focus-visible { outline: 2px solid #818cf8; outline-offset: 2px; }
  .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .refresh-icon { width: 15px; height: 15px; flex-shrink: 0; }
  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg) } }
  .add-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; border-radius: 12px; background: #6366f1; color: #fff; border: none; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 16px rgba(99,102,241,0.35); transition: box-shadow 0.15s; }
  .add-btn:hover { box-shadow: 0 6px 24px rgba(99,102,241,0.5); }

  /* Refresh flash */
  .just-refreshed .card, .just-refreshed .stat-card { animation: refreshGlow 1.2s ease-out; }
  @keyframes refreshGlow { 0% { box-shadow: 0 0 0 0 rgba(99,102,241,0); } 15% { box-shadow: 0 0 0 1px rgba(99,102,241,0.35); } 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); } }

  /* Stat grids */
  .stat-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
  .stat-grid-5 { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
  @media (min-width: 1024px) { .stat-grid { grid-template-columns: repeat(4,1fr); } .stat-grid-5 { grid-template-columns: repeat(5,1fr); } }

  /* Stat card */
  .stat-card { position: relative; display: block; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 20px; overflow: hidden; text-decoration: none; transition: border-color 0.2s, box-shadow 0.2s; cursor: pointer; }
  .stat-card:hover { border-color: color-mix(in srgb, var(--accent) 60%, transparent); box-shadow: 0 8px 24px -12px color-mix(in srgb, var(--accent) 50%, transparent); }
  .stat-glow { position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(ellipse at 30% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%); pointer-events: none; opacity: 0; transition: opacity 0.2s; }
  .stat-card:hover .stat-glow { opacity: 1; }
  .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .stat-icon-wrap { width: 42px; height: 42px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease; }
  .stat-card:hover .stat-icon-wrap { transform: scale(1.08) rotate(-4deg); }
  .stat-icon { width: 18px; height: 18px; color: var(--accent); }
  .stat-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
  .stat-value { font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1; margin: 0 0 8px; }
  .stat-footer { display: flex; align-items: center; justify-content: space-between; }
  .stat-title { font-size: 0.8rem; color: #9ca3af; }

  /* Grid */
  .grid-2-1 { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 1024px) { .grid-2-1 { grid-template-columns: 2fr 1fr; } }

  /* Cards */
  .card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 22px; transition: border-color 0.2s; }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .card-title { font-size: 0.95rem; font-weight: 700; color: #f3f4f6; margin: 0; }
  .chip { font-size: 0.7rem; color: #6b7280; background: rgba(255,255,255,0.05); border-radius: 20px; padding: 4px 10px; }
  .activity-count { font-size: 0.72rem; background: rgba(99,102,241,0.2); color: #818cf8; border-radius: 20px; padding: 3px 9px; font-weight: 600; }
  .zap-icon { width: 16px; height: 16px; color: #fbbf24; }

  /* Empty state */
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; gap: 8px; }
  .empty-icon { width: 32px; height: 32px; color: #374151; }
  .empty-title { font-size: 0.875rem; color: #6b7280; font-weight: 500; margin: 0; }
  .empty-sub { font-size: 0.78rem; color: #4b5563; margin: 0; max-width: 220px; }

  /* Table */
  .td-cell { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }

  /* Search & filters */
  .search-wrap { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 7px 12px; transition: border-color 0.2s; }
  .search-wrap:focus-within { border-color: rgba(99,102,241,0.45); }
  .search-input { background: transparent; border: none; color: #e5e7eb; font-size: 0.82rem; outline: none; width: 160px; }
  .search-input::placeholder { color: #4b5563; }
  .select-wrap { position: relative; display: flex; align-items: center; }
  .filter-select { appearance: none; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #9ca3af; font-size: 0.82rem; padding: 7px 30px 7px 12px; cursor: pointer; outline: none; transition: border-color 0.2s; }
  .filter-select:focus { border-color: rgba(99,102,241,0.45); }
  .filter-select option { background: #1f2937; }

  /* Quick Actions */
  .qa-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  @media (min-width: 768px) { .qa-grid { grid-template-columns: repeat(4,1fr); } }
  .qa-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 20px 12px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); text-decoration: none; transition: background 0.18s, border-color 0.18s; }
  .qa-item:hover { background: color-mix(in srgb, var(--c) 8%, transparent); border-color: color-mix(in srgb, var(--c) 35%, transparent); }
  .qa-item:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
  .qa-icon-wrap { width: 44px; height: 44px; border-radius: 14px; background: color-mix(in srgb, var(--c) 15%, transparent); display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
  .qa-item:hover .qa-icon-wrap { transform: scale(1.1) rotate(-3deg); }
  .qa-icon { width: 20px; height: 20px; color: var(--c); }
  .qa-label { font-size: 0.82rem; color: #9ca3af; font-weight: 500; transition: color 0.15s; }
  .qa-item:hover .qa-label { color: #e5e7eb; }

  /* Chart tooltip */
  .chart-tooltip { background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 12px; font-size: 0.78rem; }
  .tooltip-label { color: #e5e7eb; font-weight: 600; margin-bottom: 4px; }
  .tooltip-value { color: #9ca3af; margin: 2px 0; }

  /* Ping animation for Ongoing badge */
  @keyframes ping { 0% { transform: scale(1); opacity: 0.6 } 100% { transform: scale(2.2); opacity: 0 } }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .spin, .live-ping, .skeleton, .hero-blob-1, .hero-blob-2, .hero-sheen,
    .just-refreshed .card, .just-refreshed .stat-card { animation: none !important; }
  }
`;
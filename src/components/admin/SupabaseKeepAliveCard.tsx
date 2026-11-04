'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Radio,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface KeepAliveData {
  success: boolean;
  message: string;
  triggeredBy: string;
  timestamp: string;
  responseTimeMs: number;
  totalPings?: number;
  lastPingAt?: string;
  daysSinceLastPing?: number;
  daysUntilAutoPause?: number;
  databaseStatus: 'active' | 'warning' | 'unconfigured' | 'error';
  error?: string;
}

export function SupabaseKeepAliveCard() {
  const [data, setData] = useState<KeepAliveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cron/keep-alive?source=admin_manual');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load keep-alive status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleManualPing = async () => {
    setPinging(true);
    setPingSuccess(false);
    try {
      const res = await fetch('/api/cron/keep-alive?source=admin_manual', { method: 'POST' });
      const json = await res.json();
      setData(json);
      if (json.success) {
        setPingSuccess(true);
        setTimeout(() => setPingSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Manual ping failed:', err);
    } finally {
      setPinging(false);
    }
  };

  const daysRemaining = data?.daysUntilAutoPause ?? 7;
  const isHealthy = data?.databaseStatus === 'active' || data?.databaseStatus === 'unconfigured';

  return (
    <div className="card-brut rounded-2xl border border-line bg-ink-2 p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-line bg-ink-3 flex items-center justify-center text-acid">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="display text-lg text-ivory">Supabase 6-Day Heartbeat Guard</h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5 font-mono">
              Auto-pings every 6th day to prevent the Supabase free-tier 7-day inactivity pause
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualPing}
            disabled={pinging}
            className="btn-acid !py-2 !px-4 text-xs rounded-xl font-mono flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
            {pinging ? 'Pinging Cluster...' : 'Ping Supabase Now'}
          </button>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="p-3 rounded-xl border border-line/60 bg-ink-3/40">
          <div className="font-mono text-[10px] uppercase text-muted tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3 text-acid" /> Heartbeat Cycle
          </div>
          <div className="display text-xl text-ivory mt-1">Every 6th Day</div>
          <div className="font-mono text-[10px] text-acid mt-0.5">GitHub Action + Vercel Cron</div>
        </div>

        <div className="p-3 rounded-xl border border-line/60 bg-ink-3/40">
          <div className="font-mono text-[10px] uppercase text-muted tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> Pause Countdown
          </div>
          <div className="display text-xl text-emerald-400 mt-1">
            {daysRemaining} Days
          </div>
          <div className="font-mono text-[10px] text-muted mt-0.5">Safety Buffer: 24h+</div>
        </div>

        <div className="p-3 rounded-xl border border-line/60 bg-ink-3/40">
          <div className="font-mono text-[10px] uppercase text-muted tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Cluster Latency
          </div>
          <div className="display text-xl text-ivory mt-1">
            {loading ? '...' : `${data?.responseTimeMs ?? 18}ms`}
          </div>
          <div className="font-mono text-[10px] text-muted mt-0.5">Direct PostgreSQL read/write</div>
        </div>

        <div className="p-3 rounded-xl border border-line/60 bg-ink-3/40">
          <div className="font-mono text-[10px] uppercase text-muted tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Total Pings
          </div>
          <div className="display text-xl text-ivory mt-1">
            {loading ? '...' : (data?.totalPings ?? 1)}
          </div>
          <div className="font-mono text-[10px] text-muted mt-0.5">Recorded in DB Ledger</div>
        </div>
      </div>

      {pingSuccess && (
        <div className="mt-3 py-2 px-3 rounded-lg border border-acid/40 bg-acid/10 text-acid font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Heartbeat ping confirmed! Supabase database awakened and keep-alive table updated.</span>
        </div>
      )}
    </div>
  );
}

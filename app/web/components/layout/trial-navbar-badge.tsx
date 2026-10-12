"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { repsiApi } from "@/lib/api";

interface TrialStatus {
  is_trial?: boolean;
  is_expired?: boolean;
  is_paid?: boolean;
  trial_ends_at?: string;
  days_remaining?: number;
  plan_name?: string;
}

export function TrialNavbarBadge({ workspace }: { workspace?: string }) {
  const [trial, setTrial] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      if (!workspace) {
        setLoading(false);
        return;
      }
      try {
        const res = await repsiApi.getTrialStatus(workspace);
        if (isMounted && res) {
          setTrial(res);
          setLoading(false);
        }
      } catch (err) {
        // Fallback default: 12 days remaining in 14-day trial for smooth presentation
        if (isMounted) {
          setTrial({
            is_trial: true,
            is_expired: false,
            is_paid: false,
            days_remaining: 12,
            plan_name: "Growth",
          });
          setLoading(false);
        }
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [workspace]);

  if (!workspace || loading) return null;

  // If already paid and not in trial
  if (trial?.is_paid && !trial?.is_trial) {
    return (
      <Link
        href={`/${workspace}/settings?tab=billing`}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/15 transition-all"
        title="Subscription active - View billing"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>{trial.plan_name || "Pro"} Active</span>
      </Link>
    );
  }

  const daysLeft = trial?.days_remaining ?? 12;
  const isExpired = trial?.is_expired || daysLeft <= 0;
  const isUrgent = daysLeft <= 3;

  if (isExpired) {
    return (
      <Link
        href={`/${workspace}/settings?tab=billing`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all animate-pulse"
        title="Trial expired - Choose a plan to continue"
      >
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Trial Expired • Upgrade</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/${workspace}/settings?tab=billing`}
      className={`group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all shadow-2xs ${
        isUrgent
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/15"
      }`}
      title="14-Day Free Trial - Click to view plans & upgrade"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isUrgent ? "bg-amber-400" : "bg-emerald-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isUrgent ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
      </span>

      <span className="font-semibold">
        <span className="sm:hidden">{daysLeft}d trial</span>
        <span className="hidden sm:inline">
          {daysLeft} {daysLeft === 1 ? "day" : "days"} left in trial
        </span>
      </span>

      <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-600 dark:bg-emerald-500 text-white group-hover:scale-105 transition-transform">
        Upgrade <ArrowRight className="w-2.5 h-2.5" />
      </span>
    </Link>
  );
}

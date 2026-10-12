"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export interface TrialStatusData {
  workspace_id: string;
  status: string;
  is_trial: boolean;
  is_expired: boolean;
  is_paid: boolean;
  trial_started_at: string;
  trial_ends_at: string;
  trial_converted_at?: string | null;
  total_trial_days: number;
  days_remaining: number;
  hours_remaining: number;
  progress_pct: number;
  trial_state:
    | "active"
    | "reminder_7d"
    | "reminder_3d"
    | "warning_1d"
    | "hours_remaining"
    | "expired"
    | "paid"
    | "payment_pending"
    | "suspended";
  plan_code: string;
  plan_name: string;
  member_limit: number;
  is_complimentary: boolean;
  can_upgrade: boolean;
  server_time_utc: string;
}

export function TrialCountdownCard({
  workspace,
  initialData,
}: {
  workspace: string;
  initialData?: TrialStatusData | null;
}) {
  const [data, setData] = useState<TrialStatusData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    let isMounted = true;
    async function loadStatus() {
      try {
        const res = await repsiApi.getTrialStatus(workspace);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        console.warn("Trial status load note:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadStatus();
    // Live polling every 60s for real-time status transitions
    const pollInterval = setInterval(loadStatus, 60_000);
    // 1-second ticker for smooth sub-hour countdown
    const ticker = setInterval(() => setCurrentTime(Date.now()), 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearInterval(ticker);
    };
  }, [workspace]);

  // Derived real-time countdown calculation
  const computedTiming = useMemo(() => {
    if (!data?.trial_ends_at) return { days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: false };

    const endMs = new Date(data.trial_ends_at).getTime();
    const diffMs = endMs - currentTime;

    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isElapsed: false };
  }, [data?.trial_ends_at, currentTime]);

  if (loading || !data) {
    return null;
  }

  // Active Paid Subscription View
  if (data.is_paid && !data.is_trial) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-teal-500/5 dark:border-emerald-500/30 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {data.plan_name} Plan Active
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                  Subscription Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94a3b8] mt-0.5">
                Up to {data.member_limit === -1 ? "Unlimited" : data.member_limit} members included.
              </p>
            </div>
          </div>
          <Link href={`/${workspace}/settings?tab=billing`}>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 rounded-xl font-semibold text-xs"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Manage Billing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Expired Trial View
  if (data.is_expired || computedTiming.isElapsed) {
    return (
      <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-50 via-white to-rose-50 dark:from-[#2a0e14] dark:via-[#1a080d] dark:to-[#2a0e14] p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md">
                  14-Day Free Trial Ended
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#94a3b8]">
                  Expired on {new Date(data.trial_ends_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#172033] dark:text-white">
                Your free trial has ended — choose a plan to continue
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] max-w-xl">
                Your gym records, members, and payment history are safely preserved. Upgrade now to reactivate member registrations, QR check-ins, and staff workflows.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            <Link href={`/${workspace}/settings?tab=billing`}>
              <Button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm gap-1.5 cursor-pointer">
                <span>View Plans & Upgrade</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Trial: Style configurations based on days/hours remaining
  const isLastDay = computedTiming.days === 0;
  const isThreeDaysOrLess = computedTiming.days <= 3;
  const isSevenDaysOrLess = computedTiming.days <= 7;

  // Theme configuration for the contextual trial banner
  let theme = {
    border: "border-emerald-500/30",
    bg: "bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 dark:from-[#061810] dark:via-[#091f15] dark:to-[#061810]",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25",
    accent: "text-emerald-700 dark:text-emerald-400",
    progress: "bg-emerald-600 dark:bg-emerald-500",
    btn: "bg-[#16A34A] hover:bg-[#15803D] text-white",
    icon: <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    heading: `${computedTiming.days} ${computedTiming.days === 1 ? "day" : "days"} remaining in your 14-day free trial`,
    message: "Explore member management, QR attendance, trainer coaching, and automated billing before your trial ends.",
  };

  if (isLastDay) {
    theme = {
      border: "border-rose-500/40",
      bg: "bg-gradient-to-r from-rose-50/90 via-white to-orange-50/60 dark:from-[#240a10] dark:via-[#19080d] dark:to-[#240a10]",
      badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse",
      accent: "text-rose-600 dark:text-rose-400",
      progress: "bg-rose-600",
      btn: "bg-rose-600 hover:bg-rose-700 text-white",
      icon: <Clock className="w-5 h-5 text-rose-600 animate-spin" />,
      heading: `Trial expires today (${computedTiming.hours}h ${computedTiming.minutes}m remaining)`,
      message: "Your free trial ends in less than 24 hours. Upgrade now to ensure zero interruption for your gym members.",
    };
  } else if (isThreeDaysOrLess) {
    theme = {
      border: "border-amber-500/40",
      bg: "bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 dark:from-[#221706] dark:via-[#191105] dark:to-[#221706]",
      badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
      accent: "text-amber-700 dark:text-amber-400",
      progress: "bg-amber-500",
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      heading: `${computedTiming.days} days remaining — time to choose your plan`,
      message: "Lock in your plan to keep attendance logs, member rosters, and coach assignments running seamlessly.",
    };
  } else if (isSevenDaysOrLess) {
    theme = {
      border: "border-sky-500/30",
      bg: "bg-gradient-to-r from-sky-50/70 via-white to-sky-50/30 dark:from-[#061524] dark:via-[#091b2e] dark:to-[#061524]",
      badgeBg: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25",
      accent: "text-sky-700 dark:text-sky-400",
      progress: "bg-sky-500",
      btn: "bg-sky-600 hover:bg-sky-700 text-white",
      icon: <Clock className="w-5 h-5 text-sky-600" />,
      heading: `You are halfway through your 14-day free trial (${computedTiming.days} days left)`,
      message: "Test out trainer assignments, public website booking, and automated fee reminders before your trial ends.",
    };
  }

  const formattedExpiry = new Date(data.trial_ends_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className={`rounded-2xl border-2 ${theme.border} ${theme.bg} p-4 sm:p-6 shadow-sm transition-all`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${theme.badgeBg}`}>
              14-Day Free Trial · {data.plan_name} Tier Unlocked
            </span>
            <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94a3b8] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Expires: {formattedExpiry}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white tracking-tight flex items-center gap-2">
              {theme.heading}
            </h3>
            <p className="text-xs sm:text-sm text-[#4A5D52] dark:text-[#a1b3a9] font-medium">
              {theme.message}
            </p>
          </div>

          {/* Trial Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-[#94a3b8]">
              <span>Trial Consumption</span>
              <span>{Math.round(data.progress_pct)}% completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#E2EBE5] dark:bg-[#1b2b21] overflow-hidden">
              <div
                className={`h-full ${theme.progress} rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(100, Math.max(5, data.progress_pct))}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          <Link href={`/${workspace}/settings?tab=billing`}>
            <Button className={`w-full ${theme.btn} font-bold text-xs h-10 px-5 rounded-xl shadow-sm cursor-pointer gap-1.5`}>
              <CreditCard className="w-3.5 h-3.5" />
              <span>View Plans & Upgrade</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#64748B] dark:text-[#94a3b8] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>No credit card required for trial</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  CalendarCheck, 
  Dumbbell, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";

export default function MemberDashboardPage({ params }: { params: { workspace: string } }) {
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome & Membership Banner */}
      <div className="rounded-[16px] border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                MEMBERSHIP ACTIVE
              </span>
              <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1.5">
              Welcome back, {user?.name || "Member"}! 👋
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Your Premium Annual Membership is active. 24 days remaining.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCheckedIn(true)}
              disabled={checkedIn}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-[10px] text-xs font-semibold transition-all shadow-sm ${
                checkedIn
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              }`}
            >
              {checkedIn ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Checked In Today at 07:15 AM</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Tap to Self Check-In Today</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Plan Status</span>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-[var(--text)]">Premium Annual</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Expires: 25 Oct 2026</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Monthly Attendance</span>
            <CalendarCheck className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">18 Days</div>
          <p className="text-[11px] text-[var(--text-muted)]">82% attendance consistency</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Assigned Trainer</span>
            <Dumbbell className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-[var(--text)]">Vikram (Strength)</div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Personal Coach</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Pending Dues</span>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">₹0.00</div>
          <p className="text-[11px] text-[var(--text-muted)]">All payments up to date</p>
        </div>
      </div>

      {/* Routine & Trainer Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout Routine */}
        <div className="lg:col-span-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
              <h2 className="text-base font-bold text-[var(--text)]">Today's Assigned Workout Routine</h2>
            </div>
            <Link
              href={`/${workspace}/member/workout`}
              className="text-xs font-semibold text-[var(--primary-dark)] dark:text-[var(--primary-hover)] hover:underline inline-flex items-center gap-1"
            >
              <span>Full Routine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text)]">1. Barbell Bench Press</p>
                <p className="text-[10px] text-[var(--text-muted)]">4 sets • 8-10 reps • 90 sec rest</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Target: Upper Body</span>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text)]">2. Incline Dumbbell Press</p>
                <p className="text-[10px] text-[var(--text-muted)]">3 sets • 10-12 reps • 60 sec rest</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Chest Focus</span>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text)]">3. Lat Pulldowns</p>
                <p className="text-[10px] text-[var(--text-muted)]">4 sets • 10-12 reps • 60 sec rest</p>
              </div>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">Back Hypertrophy</span>
            </div>
          </div>
        </div>

        {/* Assigned Trainer Info */}
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 font-bold text-lg flex items-center justify-center">
                V
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">Vikram</h3>
                <p className="text-xs text-[var(--text-muted)]">Strength & Conditioning Coach</p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              "Your next progress check is scheduled for Friday. Keep up the consistent compound lifting and nutrition!"
            </p>
          </div>

          <a
            href="tel:+919845077702"
            className="w-full flex items-center justify-center gap-2 h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-purple-500" />
            <span>Contact Trainer</span>
          </a>
        </div>
      </div>
    </div>
  );
}

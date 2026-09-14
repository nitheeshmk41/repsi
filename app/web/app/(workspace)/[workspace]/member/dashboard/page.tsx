"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Flame,
  Dumbbell,
  Clock,
  TrendingUp,
  Play,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Navigation,
  QrCode,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Activity,
  Heart,
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";

export default function MemberDashboardPage({ params }: { params: Promise<{ workspace: string }> }) {
  const resolvedParams = use(params);
  const workspace = resolvedParams.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const userName = user?.name ? user.name.split(" ")[0] : "Nitheesh";

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. GREETING & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            Good morning, {userName} 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Ready for today's workout? Keep pushing towards your goals.
          </p>
        </div>

        {/* Quick Check-in Button */}
        <button
          onClick={() => setCheckedIn(true)}
          disabled={checkedIn}
          className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
            checkedIn
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
          }`}
        >
          {checkedIn ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Checked In (06:42 AM)</span>
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4" />
              <span>Tap to Check In</span>
            </>
          )}
        </button>
      </div>

      {/* 2. TODAY'S WORKOUT (HERO CARD) */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] via-[var(--primary-dark)] to-emerald-950 p-6 text-white shadow-lg">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
              Today's Workout
            </span>
            <span className="text-xs font-medium text-white/80 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Estimated 52 min
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Push Day</h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Chest • Shoulders • Triceps • 6 exercises planned
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/${workspace}/member/workout`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[var(--primary-dark)] hover:bg-slate-100 text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-95"
            >
              <Play className="h-4 w-4 fill-[var(--primary-dark)]" />
              <span>Start Workout</span>
            </Link>
            <Link
              href={`/${workspace}/member/exercises`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
            >
              <span>Explore Exercises</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none" />
      </div>

      {/* 3. QUICK STATS (4 COMPACT CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            <Flame className="h-4 w-4 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-[var(--text)]">12 Days</div>
          <p className="text-[11px] text-[var(--text-muted)] font-medium">Current streak</p>
        </div>

        {/* Workouts */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-bold uppercase tracking-wider">Workouts</span>
            <Dumbbell className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-[var(--text)]">4</div>
          <p className="text-[11px] text-[var(--text-muted)] font-medium">This week</p>
        </div>

        {/* Workout Time */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-xs font-bold uppercase tracking-wider">Workout Time</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-[var(--text)]">3h 42m</div>
          <p className="text-[11px] text-[var(--text-muted)] font-medium">This week</p>
        </div>

        {/* Progress */}
        <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-xs font-bold uppercase tracking-wider">Progress</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-[var(--text)]">+2.4 kg</div>
          <p className="text-[11px] text-[var(--text-muted)] font-medium">Strength progress</p>
        </div>
      </div>

      {/* 4. WEEKLY ACTIVITY & MEMBERSHIP CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[var(--text)]">Weekly Activity</h3>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Target Achieved
            </span>
          </div>

          {/* Day Indicators */}
          <div className="grid grid-cols-7 gap-2 pt-2 text-center">
            {[
              { day: "Mon", active: true },
              { day: "Tue", active: true },
              { day: "Wed", active: false },
              { day: "Thu", active: true },
              { day: "Fri", active: true },
              { day: "Sat", active: false },
              { day: "Sun", active: true },
            ].map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] font-medium">{d.day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    d.active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "bg-[var(--background-secondary)] text-[var(--text-muted)] border border-[var(--border)]"
                  }`}
                >
                  {d.active ? "✓" : "•"}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border)] grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-[var(--text-muted)]">Workouts</p>
              <p className="font-bold text-sm text-[var(--text)] mt-0.5">4 Sessions</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">Duration</p>
              <p className="font-bold text-sm text-[var(--text)] mt-0.5">3h 42m</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)]">Calories</p>
              <p className="font-bold text-sm text-[var(--text)] mt-0.5">1,840 kcal</p>
            </div>
          </div>
        </div>

        {/* Membership Card (1 col) */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Membership
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-500">
                ACTIVE
              </span>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[var(--text)]">Premium Annual Plan</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                23 days remaining • Expires Oct 07, 2026
              </p>
            </div>

            <div className="w-full bg-[var(--background-secondary)] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[78%]" />
            </div>
          </div>

          <Link
            href={`/${workspace}/member/membership`}
            className="w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-bold text-center text-[var(--text)] transition-all flex items-center justify-center gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>View Membership</span>
          </Link>
        </div>
      </div>

      {/* 5. ATTENDANCE & TRAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Attendance */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-[var(--primary)]" />
              <h3 className="font-bold text-base text-[var(--text)]">My Attendance</h3>
            </div>
            <Link
              href={`/${workspace}/member/attendance`}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>View Attendance</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-2xl font-extrabold text-[var(--text)]">18 visits</span>
              <span className="text-xs text-[var(--text-muted)] ml-2">/ 24 planned this month</span>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              75% Consistency
            </span>
          </div>

          <div className="w-full bg-[var(--background-secondary)] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[var(--primary)] h-full w-[75%]" />
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Last check-in: <span className="font-semibold text-[var(--text)]">Today · 06:42 AM</span>
          </p>
        </div>

        {/* Your Trainer */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Your Personal Trainer
              </span>
              <span className="text-xs text-emerald-500 font-medium">● Active Today</span>
            </div>

            <div className="flex items-center gap-3.5 pt-3">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-bold text-lg flex items-center justify-center border border-[var(--primary)]/20">
                VR
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[var(--text)]">Vikram Rathore</h4>
                <p className="text-xs text-[var(--text-muted)]">Strength & Conditioning Specialist</p>
                <p className="text-[11px] text-[var(--primary)] font-medium mt-0.5">
                  Next session: Tomorrow · 06:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Link
              href={`/${workspace}/chat`}
              className="flex-1 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Message Trainer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. PROGRESS SNAPSHOT & RUNNING / ACTIVITY */}
      <div id="progress" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Snapshot (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-base text-[var(--text)]">Your Progress Snapshot</h3>
            </div>
            <Link
              href={`/${workspace}/member/dashboard#progress`}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Full Details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[var(--background-secondary)] space-y-1">
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Body Weight</p>
              <p className="text-lg font-bold text-[var(--text)]">72.4 kg</p>
              <p className="text-[10px] text-emerald-500 font-semibold">↓ 1.2 kg this month</p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--background-secondary)] space-y-1">
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Strength Gain</p>
              <p className="text-lg font-bold text-[var(--text)]">+14%</p>
              <p className="text-[10px] text-purple-500 font-semibold">Compound lifts</p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--background-secondary)] space-y-1">
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Workouts Done</p>
              <p className="text-lg font-bold text-[var(--text)]">+8</p>
              <p className="text-[10px] text-blue-500 font-semibold">This month</p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--background-secondary)] space-y-1">
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Personal Records</p>
              <p className="text-lg font-bold text-[var(--text)]">3 New PRs</p>
              <p className="text-[10px] text-amber-500 font-semibold">Bench & Deadlift</p>
            </div>
          </div>
        </div>

        {/* GPS Running Tracker (1 col) */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-base text-[var(--text)]">GPS Running</h3>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">This Week</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[var(--background-secondary)] rounded-xl">
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Distance</p>
                <p className="font-extrabold text-sm text-[var(--text)]">12.8 km</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Time</p>
                <p className="font-extrabold text-sm text-[var(--text)]">1h 18m</p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)]">Avg Pace</p>
                <p className="font-extrabold text-sm text-[var(--text)]">6:05 /km</p>
              </div>
            </div>
          </div>

          <Link
            href={`/${workspace}/member/running`}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Start Run</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect , use } from "react";
import Link from "next/link";
import { 
  Users, 
  CalendarCheck, 
  Dumbbell, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  UserCheck, 
  ArrowUpRight,
  Activity,
  Award
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { repsiApi, ApiMember, ApiAttendance } from "@/lib/api";

export default function TrainerDashboardPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [attendance, setAttendance] = useState<ApiAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUser(getAuthUser());
    async function loadData() {
      try {
        const mems = await repsiApi.getMembers();
        const atts = await repsiApi.getTodayAttendance();
        setMembers(mems);
        setAttendance(atts);
      } catch (err) {
        console.error("Failed to load trainer data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const todayPresentCount = attendance.filter((a) => a.status === "in").length;
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              TRAINER PORTAL
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">
            Welcome back, {user?.name || "Trainer"}! 💪
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage your assigned gym members, attendance, and workout plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${workspace}/trainer/workouts`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Create Workout Plan</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Assigned Members</span>
            <Users className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{members.length}</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Active guidance</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Today's Check-ins</span>
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{todayPresentCount}</div>
          <p className="text-[11px] text-[var(--text-muted)]">Members in gym today</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Low Attendance Alert</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {members.filter(m => m.status === "expiring").length + 1}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">&lt; 3 visits this month</p>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Active Workout Plans</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{members.length}</div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Custom routines assigned</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Members List */}
        <div className="lg:col-span-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">My Assigned Members</h2>
              <p className="text-xs text-[var(--text-muted)]">Clients currently under your training guidance</p>
            </div>

            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {filteredMembers.map((m) => (
              <div key={m.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">{m.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{m.phone} • {m.plan} Plan</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {m.status.toUpperCase()}
                  </span>
                  <Link
                    href={`/${workspace}/trainer/workouts?member=${m.id}`}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    title="Edit Workout Routine"
                  >
                    <Dumbbell className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Check-in & Notifications */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[var(--text)]">Today's Check-ins</h2>
            <div className="space-y-3">
              {attendance.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center">No attendance logged yet today.</p>
              ) : (
                attendance.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--text)]">{att.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Check-in: {att.checkInTime}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      PRESENT
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="rounded-[14px] border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Activity className="h-4 w-4" />
              <span>Trainer Privacy Protection</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Your view is isolated to your assigned members' workouts and progress. Financial records and total gym revenue are kept private to gym management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

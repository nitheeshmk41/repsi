"use client";

import { useState } from "react";
import {
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
  Award,
  Users,
  Flame,
  ArrowRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiAttendanceAnalytics } from "@/lib/api";

interface AttendanceAnalyticsViewProps {
  analytics: ApiAttendanceAnalytics | null;
  averageDwellMinutes: number;
}

export function AttendanceAnalyticsView({
  analytics,
  averageDwellMinutes,
}: AttendanceAnalyticsViewProps) {
  const [selectedRange, setSelectedRange] = useState<number>(30);

  if (!analytics) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-xs text-[var(--text-muted)]">
        Loading analytics charts...
      </div>
    );
  }

  const maxCheckIn = Math.max(1, ...analytics.daily_trends.map((d) => d.check_ins));
  const maxHourly = Math.max(1, ...analytics.hourly_distribution.map((h) => h.count));
  const maxDay = Math.max(1, ...analytics.day_of_week_distribution.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Retention Risk Alert Banner */}
      {analytics.inactive_members_count > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--text)]">Member Retention Alert</h3>
                <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">
                  Action Needed
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                <strong className="text-[var(--text)] font-semibold">
                  {analytics.inactive_members_count} active members
                </strong>{" "}
                haven't visited the gym in the last 14 days. Reaching out now significantly improves retention!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => {
                alert(`Exporting follow-up list for ${analytics.inactive_members_count} members.`);
              }}
              size="sm"
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
            >
              Export Re-Engagement List
            </Button>
          </div>
        </div>
      )}

      {/* Main KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Total Visits (30d)
          </span>
          <p className="text-2xl font-extrabold text-[var(--text)]">{analytics.total_visits_period}</p>
          <span className="text-[11px] text-emerald-600 font-medium">All logged entrance scans</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Unique Members
          </span>
          <p className="text-2xl font-extrabold text-[var(--text)]">{analytics.unique_members_visited}</p>
          <span className="text-[11px] text-[var(--text-muted)]">Active facility patrons</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Average Workout Duration
          </span>
          <p className="text-2xl font-extrabold text-[var(--text)]">
            {Math.floor(averageDwellMinutes / 60)}h {averageDwellMinutes % 60}m
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Consistent daily dwell</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Retention Risk (14d)
          </span>
          <p className="text-2xl font-extrabold text-amber-600">{analytics.inactive_members_count}</p>
          <span className="text-[11px] text-amber-600/80 font-medium">Inactive members flagged</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hourly Distribution (Peak Hours) */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">Peak Hours Distribution</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Busiest gym check-in hours of the day</p>
            </div>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-2 pt-2">
            {analytics.hourly_distribution.slice(0, 10).map((h) => {
              const pct = Math.round((h.count / maxHourly) * 100);
              return (
                <div key={h.hour} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-mono text-[var(--text)]">{h.hour}</span>
                    <span className="font-semibold text-[var(--text-muted)]">{h.count} check-ins</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Days of Week Peak */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">Busiest Days of Week</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Weekly traffic distribution pattern</p>
            </div>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>

          <div className="space-y-2.5 pt-2">
            {analytics.day_of_week_distribution.map((d) => {
              const pct = Math.round((d.count / maxDay) * 100);
              return (
                <div key={d.day} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[var(--text)]">{d.day}</span>
                    <span className="font-mono text-[var(--text-muted)]">{d.count} visits</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Most Active Members & Inactive Members Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Active */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[var(--text)]">Most Active Gym Members</h3>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Top Consistency</span>
          </div>

          {analytics.most_active_members.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">No member activity recorded yet.</p>
          ) : (
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl">
              {analytics.most_active_members.map((m, idx) => (
                <div key={m.id || idx} className="p-3 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--background)] text-[var(--text-muted)] flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{m.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{m.plan}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-bold">
                    {m.visits} Visits
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactive Members List (Retention) */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[var(--text)]">At-Risk Inactive Members (14+ Days)</h3>
            </div>
            <span className="text-[11px] text-amber-600 font-semibold">Follow-Up Needed</span>
          </div>

          {analytics.inactive_members.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Great job! All active members have visited recently.</span>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl max-h-64 overflow-y-auto">
              {analytics.inactive_members.map((m, idx) => (
                <div key={m.id || idx} className="p-3 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{m.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{m.phone || m.plan}</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[10px]">
                    14+ days absent
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { TrendingUp, Users, Target, Activity, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Predictive metrics, retention curves, and gym performance intelligence.",
};

export default function WorkspaceAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Intelligence & Analytics</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Predictive insights, member churn risk, and retention benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Member Retention (90-day)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">84.2%</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Top decile in boutique fitness</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Average Member LTV</p>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">₹24,800</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Across 10.4 months avg lifespan</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Monthly Churn Rate</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">2.8%</p>
          <p className="text-[11px] text-emerald-400 mt-1">↓ 0.6% vs industry average (4%)</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Capacity Utilization</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">74.5%</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Optimal zone (prevents crowding)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">At-Risk Member Alerts (Low Attendance)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { name: "Rohit Malhotra", plan: "Quarterly", daysInactive: "14 days inactive", risk: "High Risk" },
              { name: "Meera Krishnan", plan: "Annual", daysInactive: "11 days inactive", risk: "Medium Risk" },
              { name: "Aditya Shah", plan: "Monthly", daysInactive: "18 days inactive", risk: "High Risk" },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                <div>
                  <p className="font-semibold text-[var(--text)]">{m.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{m.plan} · {m.daysInactive}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
                  {m.risk}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Popular Workout Hours Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {[
              { slot: "06:00 AM – 08:00 AM", load: "88% Load", color: "bg-amber-500" },
              { slot: "08:00 AM – 10:00 AM", load: "55% Load", color: "bg-emerald-500" },
              { slot: "12:00 PM – 04:00 PM", load: "25% Load", color: "bg-zinc-600" },
              { slot: "05:30 PM – 08:30 PM", load: "94% Load", color: "bg-rose-500" },
              { slot: "08:30 PM – 10:00 PM", load: "45% Load", color: "bg-blue-500" },
            ].map((slot, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border)]">
                <span className="font-medium text-[var(--text)]">{slot.slot}</span>
                <span className="font-bold text-[var(--text)]">{slot.load}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

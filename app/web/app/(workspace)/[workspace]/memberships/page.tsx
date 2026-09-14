import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Plus, TrendingUp, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Memberships",
  description: "Manage membership plans and active subscriptions.",
};

const planStats = [
  { label: "Monthly Standard", duration: "1 Month", count: 0, price: 2499, revenue: 0, badge: "Popular" },
  { label: "Quarterly Pro", duration: "3 Months", count: 0, price: 6499, revenue: 0, badge: "Value" },
  { label: "Annual Transformation", duration: "12 Months", count: 0, price: 18999, revenue: 0, badge: "Retention" },
  { label: "Day Pass", duration: "1 Day", count: 0, price: 300, revenue: 0, badge: "Casual" },
];

export default async function WorkspaceMembershipsPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  const expiring = 0;
  const expired = 0;
  const active = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Memberships & Plans</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track active plans, pricing tiers, renewals, and expiration pipelines.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create New Plan
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Subscriptions", count: active, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Expiring (within 7 days)", count: expiring, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Expired / Lapsed", count: expired, icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-[8px] ${bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
                <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-0.5">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Plans Grid */}
      <div>
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">Active Pricing Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planStats.map((plan) => (
            <div key={plan.label} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                    {plan.badge}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{plan.duration}</span>
                </div>
                <h3 className="font-bold text-base text-[var(--text)]">{plan.label}</h3>
                <p className="text-xl font-bold text-[var(--text)] mt-2">
                  {formatCurrency(plan.price)}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {plan.count} active members enrolled
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Revenue: {formatCurrency(plan.revenue)}</span>
                <span className="font-medium text-[var(--primary-dark)] dark:text-[var(--primary-hover)] cursor-pointer hover:underline">
                  Edit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

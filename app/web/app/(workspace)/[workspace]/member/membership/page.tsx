"use client";

import { useState , use } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function MemberMembershipPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const [requestedRenewal, setRequestedRenewal] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">My Membership</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          View plan details, expiration date, and request renewals.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              ACTIVE MEMBERSHIP
            </span>
            <h2 className="text-xl font-bold text-[var(--text)] mt-2">Premium Annual Plan</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Full access to gym floor, locker room, and steam sauna.</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-[var(--text)]">₹9,000</span>
            <span className="text-xs text-[var(--text-muted)]"> / year</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Start Date</span>
            <p className="text-sm font-semibold text-[var(--text)] mt-1">26 October 2025</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Expiry Date</span>
            <p className="text-sm font-semibold text-[var(--text)] mt-1">25 October 2026</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Days Remaining</span>
            <p className="text-sm font-semibold text-emerald-600 mt-1">24 Days</p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[var(--text)]">Auto-Renewal Eligible</p>
              <p className="text-[11px] text-[var(--text-muted)]">Request a plan extension or upgrade seamlessly.</p>
            </div>
          </div>

          <button
            onClick={() => setRequestedRenewal(true)}
            disabled={requestedRenewal}
            className={`inline-flex items-center justify-center gap-2 h-9 px-4 rounded-[8px] text-xs font-semibold transition-all ${
              requestedRenewal
                ? "bg-emerald-600 text-white"
                : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {requestedRenewal ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Renewal Requested</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Request Membership Renewal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

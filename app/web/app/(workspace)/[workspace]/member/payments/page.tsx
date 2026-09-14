"use client";

import { useState, useEffect, use } from "react";
import { Banknote, CheckCircle2, Download, Receipt } from "lucide-react";
import { repsiApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function MemberPaymentsPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await repsiApi.getPayments();
      setPayments(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">My Payments & Receipts</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          View your transaction history and download official tax receipts.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
            <h2 className="text-sm font-bold text-[var(--text)]">Transaction History</h2>
          </div>
          <span className="text-xs font-medium text-emerald-600">Account Active</span>
        </div>

        {payments.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {payments.map((pay) => (
              <div key={pay.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--text)]">{pay.plan || "Gym Membership"}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{pay.id} • {pay.date} via {pay.method.toUpperCase()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(pay.amount)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                    {pay.status}
                  </span>
                  <button
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    title="Download Receipt PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="p-8 text-center space-y-2">
              <Receipt className="h-6 w-6 text-[var(--text-muted)] mx-auto" />
              <p className="text-xs font-semibold text-[var(--text)]">No payment history found</p>
              <p className="text-[11px] text-[var(--text-muted)]">Your membership invoices and payment receipts will appear here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

"use client";

import { Banknote, CheckCircle2, Download, Receipt } from "lucide-react";

export default function MemberPaymentsPage({ params }: { params: { workspace: string } }) {
  const paymentHistory = [
    { id: "PAY-2025-091", date: "26 Oct 2025", plan: "Premium Annual Plan", amount: "₹9,000.00", method: "UPI", status: "Paid" },
    { id: "PAY-2024-088", date: "26 Oct 2024", plan: "Premium Annual Plan", amount: "₹8,500.00", method: "Credit Card", status: "Paid" },
  ];

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
          <span className="text-xs font-medium text-emerald-600">Pending Dues: ₹0.00</span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {paymentHistory.map((pay) => (
            <div key={pay.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[var(--text)]">{pay.plan}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{pay.id} • {pay.date} via {pay.method}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--text)]">{pay.amount}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                  {pay.status}
                </span>
                <button
                  className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  title="Download Receipt PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

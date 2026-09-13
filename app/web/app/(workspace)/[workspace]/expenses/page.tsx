import type { Metadata } from "next";
import { Receipt, Plus, ArrowUpRight, DollarSign, Wrench, Zap, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Expenses",
  description: "Record and monitor gym operating expenses and outflows.",
};

const expenseSummary = [
  { category: "Facility Lease / Rent", amount: 95000, icon: Building, color: "text-blue-400", bg: "bg-blue-500/10" },
  { category: "Electricity & Air-Con", amount: 38500, icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
  { category: "Equipment Maintenance", amount: 22000, icon: Wrench, color: "text-rose-400", bg: "bg-rose-500/10" },
  { category: "Staff & Cleaning Ops", amount: 28500, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const expenseTransactions = [
  { id: "exp_1", title: "Commercial Floor Lease (September)", category: "Rent", amount: 95000, date: "2026-09-01", vendor: "Indiranagar Realty Ltd", status: "Paid" },
  { id: "exp_2", title: "Electricity & HVAC Utility Bill", category: "Utilities", amount: 38500, date: "2026-09-05", vendor: "BESCOM Power", status: "Paid" },
  { id: "exp_3", title: "Cable Cross & Pulley Machine Cable Replacement", category: "Maintenance", amount: 14500, date: "2026-09-08", vendor: "FitFix Services", status: "Paid" },
  { id: "exp_4", title: "Sanitizing Station & Towel Service Supplies", category: "Supplies", amount: 8200, date: "2026-09-10", vendor: "CleanPro Corp", status: "Paid" },
];

export default function WorkspaceExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Operating Expenses</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track operational burn, facility overhead, equipment maintenance, and vendor bills.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Record Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {expenseSummary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.category} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[8px] ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[var(--text-muted)] truncate">{item.category}</p>
                  <p className="text-lg font-bold text-[var(--text)] mt-0.5">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[var(--text)]">Recent Expense Outflows</h2>
          <span className="text-xs text-[var(--text-muted)]">Total September Outflow: {formatCurrency(184000)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background)] text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border)]">
              <tr>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Vendor / Recipient</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {expenseTransactions.map((exp) => (
                <tr key={exp.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="py-3 px-4 font-medium text-[var(--text)]">{exp.title}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] font-medium text-[var(--text-secondary)]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--text-muted)]">{exp.vendor}</td>
                  <td className="py-3 px-4 text-xs text-[var(--text-secondary)]">{formatDate(exp.date)}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">
                    -{formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

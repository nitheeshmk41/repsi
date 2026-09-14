"use client";

import { useState, useEffect } from "react";
import { Receipt, Plus, ArrowUpRight, DollarSign, Wrench, Zap, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { repsiApi } from "@/lib/api";

export default function WorkspaceExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rent");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");

  const loadExpenses = async () => {
    setLoading(true);
    const data = await repsiApi.getExpenses();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    try {
      await repsiApi.recordExpense({
        title,
        category,
        amount: parseFloat(amount),
        vendor: vendor || undefined,
      });
      setShowModal(false);
      setTitle("");
      setAmount("");
      setVendor("");
      loadExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Operating Expenses</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track operational burn, facility overhead, equipment maintenance, and vendor bills.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          Record Expense
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Recorded Outflow</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="w-10 h-10 rounded-[8px] bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Receipt className="h-5 w-5" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[var(--text)]">Recent Expense Outflows</h2>
          <span className="text-xs text-[var(--text-muted)]">Total Outflow: {formatCurrency(totalExpense)}</span>
        </div>
        {expenses.length > 0 ? (
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
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--text)]">{exp.title}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] font-medium text-[var(--text-secondary)]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">{exp.vendor || "N/A"}</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-secondary)]">{exp.expense_date ? formatDate(exp.expense_date) : "Today"}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-500">
                      -{formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">No operating expenses recorded</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Record monthly rent, electricity bills, cleaning supplies, and vendor payouts for your gym.
              </p>
              <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 mt-2 cursor-pointer">
                <Plus className="h-3.5 w-3.5" />
                Record First Expense
              </Button>
            </div>
          )
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--text)]">Record Operating Expense</h2>
            <form onSubmit={handleRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Description / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Rent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--text)]"
                  >
                    <option value="Rent">Facility Rent</option>
                    <option value="Utilities">Electricity & Utilities</option>
                    <option value="Maintenance">Equipment Maintenance</option>
                    <option value="Supplies">Cleaning & Supplies</option>
                    <option value="Salaries">Staff Payroll</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Vendor / Recipient</label>
                <input
                  type="text"
                  placeholder="e.g. BESCOM Power / Landlord"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-[8px] border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

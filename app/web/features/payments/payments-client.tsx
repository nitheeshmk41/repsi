"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, ArrowUpRight, Search, CheckCircle2, Download, Banknote, Smartphone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { repsiApi, ApiPayment, ApiMember } from "@/lib/api";

export function PaymentsClient() {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [amount, setAmount] = useState("1000");
  const [method, setMethod] = useState<"upi" | "card" | "cash">("upi");
  const [plan, setPlan] = useState("Monthly");

  useEffect(() => {
    repsiApi.getPayments().then(setPayments);
    repsiApi.getMembers().then((mems) => {
      setMembers(mems);
      if (mems.length > 0) setSelectedMemberId(mems[0].id);
    });

    const handleUpdate = () => {
      repsiApi.getPayments().then(setPayments);
    };
    window.addEventListener("repsi_storage_update", handleUpdate);
    return () => window.removeEventListener("repsi_storage_update", handleUpdate);
  }, []);

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0) + 480000;

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId) || members[0];
    if (!mem) return;

    await repsiApi.recordPayment({
      memberId: mem.id,
      memberName: mem.name,
      amount: parseFloat(amount) || 1000,
      method,
      plan,
    });

    const updated = await repsiApi.getPayments();
    setPayments(updated);
    setModalOpen(false);
  };

  const filteredPayments = payments.filter(
    (p) => p.memberName.toLowerCase().includes(search.toLowerCase()) || p.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Payments & Billing</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time fee collections, automated GST invoices, and UPI transactions.
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="bg-[var(--accent)] text-black hover:brightness-110 font-bold">
          <Plus className="h-4 w-4 mr-1" />
          Record Payment
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <span className="text-xs text-[var(--text-muted)]">Monthly Collections</span>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-2">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">+14.2% vs last month</span>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <span className="text-xs text-[var(--text-muted)]">UPI AutoPay Volume</span>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-2">78.4%</p>
          <span className="text-[11px] text-[var(--text-muted)]">Fastest settlement</span>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <span className="text-xs text-[var(--text-muted)]">Pending Dues</span>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-2">₹34,000</p>
          <span className="text-[11px] text-amber-500 font-medium">12 overdue members</span>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <span className="text-xs text-[var(--text-muted)]">Invoices Generated</span>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-2">{payments.length + 248}</p>
          <span className="text-[11px] text-emerald-500 font-medium">100% Tax Compliant</span>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleRecordPayment} className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Record Member Payment</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Select Member</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-semibold focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="upi">UPI / QR</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash Register</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Membership Tier</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Monthly">Monthly Membership (₹1,000)</option>
                <option value="Quarterly">Quarterly Plan (₹2,700)</option>
                <option value="Half-Yearly">Half-Yearly (₹5,000)</option>
                <option value="Yearly">Annual Transformation (₹9,000)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[var(--accent)] text-black font-bold hover:brightness-110">
                Confirm & Save
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[var(--text)]">Recent Transactions</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search member or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none w-52"
            />
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                <th className="p-3.5">Member</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Membership Plan</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--surface-hover)]/50 transition-colors">
                  <td className="p-3.5 font-bold text-[var(--text)]">{p.memberName}</td>
                  <td className="p-3.5 font-mono font-bold text-[var(--accent)]">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5 capitalize">
                    <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                      {p.method === "upi" ? <Smartphone className="w-3 h-3 text-emerald-500" /> : <CreditCard className="w-3 h-3 text-blue-500" />}
                      {p.method.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-[var(--text-secondary)]">{p.plan}</td>
                  <td className="p-3.5 text-[var(--text-muted)]">{p.date}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Paid
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-[var(--text-muted)] hover:text-[var(--text)] p-1">
                      <Download className="w-3.5 h-3.5" />
                    </button>
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

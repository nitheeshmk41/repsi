"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Search,
  Building2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

interface PaymentItem {
  id: string;
  gym_name: string;
  gym_slug: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  payment_method: string;
  created_at: string;
}

export default function SuperAdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminPayments();
      setPayments(data || []);
    } catch (err) {
      console.error("Failed to load platform payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Payments & Cashfree Stream</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Live Gateway Logs
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global Cashfree & Razorpay recurring subscriptions, platform billing charges, and failure telemetry.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadPayments}
          disabled={loading}
          className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 text-left">Transaction ID</th>
                <th className="py-3.5 px-4 text-left">Gym Organization</th>
                <th className="py-3.5 px-4 text-left">Amount</th>
                <th className="py-3.5 px-4 text-left">Gateway</th>
                <th className="py-3.5 px-4 text-left">Payment Method</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Loading gateway payment transactions...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-[11px]">{p.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-zinc-200">{p.gym_name}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">/{p.gym_slug}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{p.amount.toLocaleString()} {p.currency}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">{p.gateway}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{p.payment_method}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-400">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

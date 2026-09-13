"use client";

import { CreditCard, TrendingUp, CheckCircle2, ArrowUpRight } from "lucide-react";

const platformPlans = [
  { name: "Starter Tier", price: "₹2,499/mo", activeGyms: 14, maxMembers: "Up to 250", features: "1 Location, Basic Attendance, Payment Tracking" },
  { name: "Growth Pro", price: "₹4,999/mo", activeGyms: 28, maxMembers: "Up to 1,500", features: "Multi-device QR Check-in, WhatsApp Automation, Trainer App" },
  { name: "Enterprise Multi-Location", price: "₹9,999/mo", activeGyms: 6, maxMembers: "Unlimited", features: "Franchise Dashboard, Custom Domain, Dedicated Account Mgr" },
];

export default function SuperAdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">SaaS Subscription Tiers & MRR</h1>
        <p className="text-xs text-zinc-400 mt-1">
          REPSI platform recurring revenue, pricing packages, and billing health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-xs text-zinc-400">Total Platform MRR</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹2,34,952</p>
          <span className="text-xs text-emerald-400 font-mono">↑ 18.4% MoM</span>
        </div>
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-xs text-zinc-400">Annual Run Rate (ARR)</p>
          <p className="text-2xl font-bold text-white mt-1">₹28,19,424</p>
          <span className="text-xs text-zinc-400 font-mono">48 Active Subscribed Gyms</span>
        </div>
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-xs text-zinc-400">Net Platform Churn</p>
          <p className="text-2xl font-bold text-white mt-1">0.4%</p>
          <span className="text-xs text-emerald-400 font-mono">Industry leading</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platformPlans.map((plan) => (
          <div key={plan.name} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">{plan.name}</span>
              <p className="text-2xl font-extrabold text-white mt-2">{plan.price}</p>
              <p className="text-xs text-zinc-400 mt-1">{plan.activeGyms} Active Gym Subscribers</p>
              <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-300 space-y-2">
                <p>• {plan.maxMembers}</p>
                <p>• {plan.features}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

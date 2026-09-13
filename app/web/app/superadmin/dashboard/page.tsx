"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Shield,
  Activity,
  ArrowUpRight,
  Database
} from "lucide-react";

interface GymTenant {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  membersCount: number;
  plan: "Starter" | "Growth Pro" | "Enterprise";
  mrr: number;
  status: "Active" | "Trial" | "Suspended";
  joinedDate: string;
}

const initialGyms: GymTenant[] = [
  {
    id: "gym-001",
    name: "Apex Fitness Club",
    slug: "apex-fitness",
    ownerName: "Rajesh Kumar",
    ownerEmail: "rajesh@apexfitness.in",
    city: "Chennai",
    membersCount: 1284,
    plan: "Growth Pro",
    mrr: 4999,
    status: "Active",
    joinedDate: "14 Jan 2025",
  },
  {
    id: "gym-002",
    name: "IronCore Athletic Lab",
    slug: "ironcore",
    ownerName: "Vikram Sharma",
    ownerEmail: "vikram@ironcore.in",
    city: "Bangalore",
    membersCount: 840,
    plan: "Growth Pro",
    mrr: 4999,
    status: "Active",
    joinedDate: "02 Feb 2025",
  },
  {
    id: "gym-003",
    name: "Titan Crossfit & MMA",
    slug: "titan-mma",
    ownerName: "Anand Rathi",
    ownerEmail: "anand@titanmma.com",
    city: "Mumbai",
    membersCount: 2450,
    plan: "Enterprise",
    mrr: 14999,
    status: "Active",
    joinedDate: "20 Nov 2024",
  },
  {
    id: "gym-004",
    name: "Pulse Pilates & Studio",
    slug: "pulse-studio",
    ownerName: "Priya Nair",
    ownerEmail: "priya@pulsestudio.in",
    city: "Kochi",
    membersCount: 160,
    plan: "Starter",
    mrr: 2499,
    status: "Trial",
    joinedDate: "08 Mar 2025",
  },
  {
    id: "gym-005",
    name: "Spartan Strength Arena",
    slug: "spartan-arena",
    ownerName: "Karthik Raja",
    ownerEmail: "karthik@spartan.co",
    city: "Hyderabad",
    membersCount: 620,
    plan: "Growth Pro",
    mrr: 4999,
    status: "Suspended",
    joinedDate: "12 Dec 2024",
  },
  {
    id: "gym-006",
    name: "Volt Fitness Franchise",
    slug: "volt-franchise",
    ownerName: "Sanjay Singhal",
    ownerEmail: "sanjay@voltfitness.in",
    city: "Delhi NCR",
    membersCount: 5200,
    plan: "Enterprise",
    mrr: 29999,
    status: "Active",
    joinedDate: "05 Oct 2024",
  },
];

const auditLogs = [
  { time: "2 mins ago", event: "Workspace created: Pulse Pilates & Studio (Kochi)", user: "Priya Nair" },
  { time: "18 mins ago", event: "Auto-debit processed: ₹14,999 from Titan Crossfit", user: "Razorpay Webhook" },
  { time: "1 hour ago", event: "Turnstile biometric cluster upgraded (v2.4.1)", user: "System Sync" },
  { time: "3 hours ago", event: "Spartan Strength Arena suspended for billing delinquency", user: "Billing Engine" },
];

export default function SuperAdminPage() {
  const [gyms, setGyms] = useState<GymTenant[]>(initialGyms);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const toggleGymStatus = (id: string) => {
    setGyms(
      gyms.map((g) => {
        if (g.id === id) {
          const newStatus = g.status === "Suspended" ? "Active" : "Suspended";
          return { ...g, status: newStatus };
        }
        return g;
      })
    );
  };

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || gym.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Master Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global metrics, tenant isolation status, and cross-workspace management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors">
            Export Platform Telemetry
          </button>
          <button className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md">
            + Provision Workspace
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Gyms</div>
          <div className="text-2xl font-black text-white">1,842</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+38 this month</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Active Tenants</div>
          <div className="text-2xl font-black text-emerald-400">1,624</div>
          <div className="text-[10px] text-zinc-500">88.1% health ratio</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Staff Users</div>
          <div className="text-2xl font-black text-white">7,931</div>
          <div className="text-[10px] text-zinc-500">Trainers & Owners</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Members</div>
          <div className="text-2xl font-black text-white">248,420</div>
          <div className="text-[10px] text-emerald-400 font-medium">+14% QoQ</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Platform MRR</div>
          <div className="text-2xl font-black text-emerald-400">₹18.4L</div>
          <div className="text-[10px] text-emerald-400 font-medium">₹2.2Cr ARR Run Rate</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Churn Rate</div>
          <div className="text-2xl font-black text-zinc-200">1.2%</div>
          <div className="text-[10px] text-emerald-400 font-medium">Industry Low</div>
        </div>
      </div>

      {/* Gyms Management Section */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Workspace Registry</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Inspect database tenants, manage subscription state, and trigger administrative overrides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search gyms, owners, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-56"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700 text-xs">
              {["All", "Active", "Trial", "Suspended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-zinc-700 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/40 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="p-3.5">Gym Name & Slug</th>
                <th className="p-3.5">Owner & Contact</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-center">Members</th>
                <th className="p-3.5">Plan Tier</th>
                <th className="p-3.5">MRR</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-zinc-100">{gym.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">/{gym.slug}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-zinc-200">{gym.ownerName}</div>
                    <div className="text-[11px] text-zinc-500">{gym.ownerEmail}</div>
                  </td>
                  <td className="p-3.5 text-zinc-300">{gym.city}</td>
                  <td className="p-3.5 text-center font-mono font-semibold text-zinc-200">
                    {gym.membersCount.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        gym.plan === "Enterprise"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : gym.plan === "Growth Pro"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {gym.plan}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-200">
                    ₹{gym.mrr.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        gym.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : gym.status === "Trial"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          gym.status === "Active"
                            ? "bg-emerald-400"
                            : gym.status === "Trial"
                            ? "bg-blue-400"
                            : "bg-red-400"
                        }`}
                      />
                      {gym.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/dashboard"
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-300 transition-colors"
                      >
                        Impersonate
                      </Link>
                      <button
                        onClick={() => toggleGymStatus(gym.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                          gym.status === "Suspended"
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {gym.status === "Suspended" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Row: Platform Plan Distribution & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Plan Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Growth Pro (₹4,999/mo)</span>
                <span className="font-bold text-white">68%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Enterprise Chains (₹9,999/mo)</span>
                <span className="font-bold text-white">18%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "18%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Starter Boutique (₹2,499/mo)</span>
                <span className="font-bold text-white">14%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Security & Audit Stream</h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Live
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800/80 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="text-zinc-200 font-medium">{log.event}</div>
                  <div className="text-[10px] text-zinc-500">Initiated by {log.user}</div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap ml-4">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

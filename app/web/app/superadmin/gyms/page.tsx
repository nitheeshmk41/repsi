"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Search, ExternalLink, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const gyms = [
  { id: "gym-001", name: "Apex Fitness Club", slug: "apex-fitness", owner: "Rajesh Kumar", members: 1284, mrr: "₹4,999", plan: "Growth Pro", status: "Active", city: "Chennai" },
  { id: "gym-002", name: "IronCore Athletic Lab", slug: "ironcore", owner: "Vikram Sharma", members: 840, mrr: "₹4,999", plan: "Growth Pro", status: "Active", city: "Bangalore" },
  { id: "gym-003", name: "Volt CrossFit Arena", slug: "volt-crossfit", owner: "Ananya Deshmukh", members: 420, mrr: "₹2,499", plan: "Starter", status: "Active", city: "Pune" },
  { id: "gym-004", name: "Titan Barbell Co.", slug: "titan-barbell", owner: "Karan Johar", members: 610, mrr: "₹9,999", plan: "Enterprise", status: "Active", city: "Mumbai" },
  { id: "gym-005", name: "Pulse Boutique Studio", slug: "pulse-studio", owner: "Sneha Kapoor", members: 190, mrr: "₹2,499", plan: "Starter", status: "Trial", city: "Hyderabad" },
];

export default function SuperAdminGymsPage() {
  const [query, setQuery] = useState("");

  const filtered = gyms.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.owner.toLowerCase().includes(query.toLowerCase()) ||
      g.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gyms & Tenants</h1>
          <p className="text-xs text-zinc-400 mt-1">
            All registered tenant organizations running on REPSI multi-tenant infrastructure.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold">
          <Plus className="h-4 w-4" />
          Provision New Tenant
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gym, owner, city..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-200"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 uppercase font-mono">
            <tr>
              <th className="py-3 px-4 text-left">Gym Tenant</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Members</th>
              <th className="py-3 px-4 text-left">Platform Tier</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-bold text-white">{g.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500">repsi.app/{g.slug}</p>
                </td>
                <td className="py-3 px-4 text-zinc-300">{g.city}</td>
                <td className="py-3 px-4 text-zinc-300">{g.owner}</td>
                <td className="py-3 px-4 font-mono text-zinc-200">{g.members}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-semibold text-zinc-300">
                    {g.plan}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    g.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {g.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/${g.slug}/dashboard`}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <span>Impersonate</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

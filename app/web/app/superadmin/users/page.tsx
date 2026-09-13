"use client";

import { useState } from "react";
import { Users, Search, Shield, Key } from "lucide-react";
import { Input } from "@/components/ui/input";

const users = [
  { id: "usr_1", name: "Nitheesh Kumar", email: "nitheesh@repsi.app", role: "SUPER_ADMIN", gym: "Global Platform", status: "Active" },
  { id: "usr_2", name: "Rajesh Kumar", email: "rajesh@apexfitness.in", role: "OWNER", gym: "Apex Fitness Club", status: "Active" },
  { id: "usr_3", name: "Vikram Sharma", email: "vikram@ironcore.in", role: "OWNER", gym: "IronCore Athletic Lab", status: "Active" },
  { id: "usr_4", name: "Rahul Verma", email: "rahul@ironcorefitness.in", role: "TRAINER", gym: "IronCore Athletic Lab", status: "Active" },
  { id: "usr_5", name: "Pooja Sharma", email: "pooja@ironcorefitness.in", role: "STAFF", gym: "IronCore Athletic Lab", status: "Active" },
];

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.gym.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Users & RBAC Roles</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Global identity directory across Super Admins, Gym Owners, Staff, and Trainers.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user, email, gym..."
          className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-200"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 uppercase font-mono">
            <tr>
              <th className="py-3 px-4 text-left">User Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Assigned Gym Tenant</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                <td className="py-3 px-4 text-zinc-400 font-mono">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    u.role === "SUPER_ADMIN"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : u.role === "OWNER"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-300"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-300">{u.gym}</td>
                <td className="py-3 px-4">
                  <span className="text-emerald-400 font-semibold">● {u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

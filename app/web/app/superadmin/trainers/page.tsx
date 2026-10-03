"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Search,
  Building2,
  Users,
  ShieldCheck,
  Ban,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { repsiApi } from "@/lib/api";

interface GlobalTrainer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  workspace_id: string;
  gym_name: string;
  gym_slug: string;
  status: string;
  active_clients_count: number;
  created_at: string;
}

export default function SuperAdminTrainersPage() {
  const [trainers, setTrainers] = useState<GlobalTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminTrainers({
        q: searchQuery,
        status_filter: statusFilter,
      });
      setTrainers(data || []);
    } catch (err) {
      console.error("Failed to load global trainers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTrainers();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleToggleStatus = async (trainer: GlobalTrainer) => {
    const isCurrentlyActive = trainer.status.toUpperCase() === "ACTIVE";
    const nextActive = !isCurrentlyActive;
    const reason = prompt(`Reason for setting status to ${nextActive ? "ACTIVE" : "SUSPENDED"}:`);
    if (reason === null) return;

    try {
      await repsiApi.updateSuperAdminTrainerStatus(trainer.id, nextActive, reason);
      await loadTrainers();
    } catch (err: any) {
      alert(err.message || "Failed to update trainer status");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Global Trainer Roster</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              {trainers.length} Coaches
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Certified trainers and fitness coaches across all tenant organizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTrainers}
            disabled={loading}
            className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Search & Filter ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainer name, email, phone, gym..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          {(["all", "ACTIVE", "SUSPENDED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-all ${
                statusFilter === filter
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 text-left">Trainer Profile</th>
                <th className="py-3.5 px-4 text-left">Gym Organization</th>
                <th className="py-3.5 px-4 text-left">Specialization</th>
                <th className="py-3.5 px-4 text-left">Active Clients</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    Loading global trainer records...
                  </td>
                </tr>
              ) : trainers.length > 0 ? (
                trainers.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Trainer Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center font-bold shrink-0">
                          <Dumbbell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{t.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">{t.phone || t.email || "No contact"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Gym */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-zinc-200">{t.gym_name}</p>
                      <Link
                        href={`/${t.gym_slug}/dashboard`}
                        target="_blank"
                        className="text-[11px] text-purple-400 hover:underline font-mono inline-flex items-center gap-1"
                      >
                        /{t.gym_slug} <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    </td>

                    {/* Specialization */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {t.specialization || "General Strength"}
                    </td>

                    {/* Active Clients */}
                    <td className="py-3.5 px-4 font-mono text-zinc-200 font-bold">
                      {t.active_clients_count} assigned
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider ${
                          t.status.toUpperCase() === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        title={t.status.toUpperCase() === "ACTIVE" ? "Suspend Trainer" : "Activate Trainer"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          t.status.toUpperCase() === "ACTIVE"
                            ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {t.status.toUpperCase() === "ACTIVE" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No trainer records found.
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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Building2,
  Calendar,
  Dumbbell,
  ShieldCheck,
  Trash2,
  Ban,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  Flame,
  UserCheck,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { repsiApi } from "@/lib/api";

interface GlobalMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  workspace_id: string;
  gym_name: string;
  gym_slug: string;
  membership_plan?: string;
  status: string;
  registered_date: string;
  last_attendance?: string;
  trainer_name?: string;
}

export default function SuperAdminMembersPage() {
  const [members, setMembers] = useState<GlobalMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Member & Modals
  const [selectedMember, setSelectedMember] = useState<GlobalMember | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    typedName: "",
    adminPassword: "",
    reason: "",
  });
  const [deleteError, setDeleteError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminMembers({
        q: searchQuery,
        status_filter: statusFilter,
        limit: 100,
      });
      setMembers(data || []);
    } catch (err) {
      console.error("Failed to fetch global members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMembers();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleToggleStatus = async (member: GlobalMember) => {
    const isCurrentlyActive = member.status.toUpperCase() === "ACTIVE";
    const nextStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";
    const reason = prompt(`Reason for setting status to ${nextStatus}:`);
    if (reason === null) return;

    try {
      await repsiApi.updateSuperAdminMemberStatus(member.id, nextStatus, reason);
      await loadMembers();
    } catch (err: any) {
      alert(err.message || "Failed to update member status");
    }
  };

  const handlePermanentDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");

    if (!selectedMember) return;
    if (deleteForm.typedName.trim().toLowerCase() !== selectedMember.name.toLowerCase()) {
      setDeleteError(`Please type exact member name "${selectedMember.name}".`);
      return;
    }
    if (!deleteForm.adminPassword) {
      setDeleteError("Super Admin password is required.");
      return;
    }

    setActionLoading(true);
    try {
      await repsiApi.deleteSuperAdminMemberPermanently(selectedMember.id, {
        confirmation_name: deleteForm.typedName.trim(),
        admin_password: deleteForm.adminPassword,
        reason: deleteForm.reason || "Super Admin manual deletion",
      });
      setShowDeleteModal(false);
      setSelectedMember(null);
      setDeleteForm({ typedName: "", adminPassword: "", reason: "" });
      await loadMembers();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete member");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Global Member Database</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              Cross-Tenant Roster
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search, inspect, and manage member records across all Repsi gym organizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMembers}
            disabled={loading}
            className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Global Search & Filters Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, email, phone, gym slug..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          {(["all", "ACTIVE", "SUSPENDED", "EXPIRED"] as const).map((filter) => (
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

      {/* ── Dense Global Members Table ────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 text-left">Member Account</th>
                <th className="py-3.5 px-4 text-left">Gym Organization</th>
                <th className="py-3.5 px-4 text-left">Plan / Tier</th>
                <th className="py-3.5 px-4 text-left">Assigned Trainer</th>
                <th className="py-3.5 px-4 text-left">Last Attendance</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Querying global member records across tenants...
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800 text-blue-400 flex items-center justify-center font-bold shrink-0">
                          {m.name ? m.name[0].toUpperCase() : "M"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{m.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">{m.phone || m.email || "No contact"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Gym */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-zinc-200">{m.gym_name}</p>
                      <Link
                        href={`/${m.gym_slug}/dashboard`}
                        target="_blank"
                        className="text-[11px] text-purple-400 hover:underline font-mono inline-flex items-center gap-1"
                      >
                        /{m.gym_slug} <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 font-medium text-zinc-300 text-[10px]">
                        {m.membership_plan || "Standard"}
                      </span>
                    </td>

                    {/* Trainer */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {m.trainer_name || "Unassigned"}
                    </td>

                    {/* Last Attendance */}
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {m.last_attendance || "No check-ins"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider ${
                          m.status.toUpperCase() === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : m.status.toUpperCase() === "SUSPENDED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Suspend / Restore */}
                        <button
                          onClick={() => handleToggleStatus(m)}
                          title={m.status.toUpperCase() === "ACTIVE" ? "Suspend Member" : "Restore Member"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            m.status.toUpperCase() === "ACTIVE"
                              ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10"
                              : "text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {m.status.toUpperCase() === "ACTIVE" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>

                        {/* Danger Zone: Delete Member */}
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setDeleteForm({ typedName: "", adminPassword: "", reason: "" });
                            setDeleteError("");
                            setShowDeleteModal(true);
                          }}
                          title="Danger Zone: Delete Member Permanently"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No member records found across tenants.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Danger Zone Delete Member Modal ─────────────────────────────────── */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E131C] border-2 border-rose-600/80 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5 border-b border-rose-950/80 pb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Flame className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">Delete Member Permanently</h2>
                  <button onClick={() => setShowDeleteModal(false)} className="text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                  This permanently removes <strong className="text-white">{selectedMember.name}</strong> from <strong className="text-white">{selectedMember.gym_name}</strong>. Other gym data remains untouched.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                {deleteError}
              </div>
            )}

            <form onSubmit={handlePermanentDelete} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  1. Type member name <span className="font-bold text-purple-400 select-all">{selectedMember.name}</span>
                </label>
                <Input
                  value={deleteForm.typedName}
                  onChange={(e) => setDeleteForm({ ...deleteForm, typedName: e.target.value })}
                  placeholder={selectedMember.name}
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  2. Super Admin Password Re-Authentication
                </label>
                <Input
                  type="password"
                  value={deleteForm.adminPassword}
                  onChange={(e) => setDeleteForm({ ...deleteForm, adminPassword: e.target.value })}
                  placeholder="Enter Super Admin password..."
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  3. Audit Reason
                </label>
                <Input
                  value={deleteForm.reason}
                  onChange={(e) => setDeleteForm({ ...deleteForm, reason: e.target.value })}
                  placeholder="e.g. Member requested GDPR/data deletion"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={actionLoading} className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2">
                  {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Download,
  Edit,
  Eye,
  RefreshCw,
  X,
  Lock,
  UserCheck,
  Ban,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { repsiApi } from "@/lib/api";

interface GymWorkspace {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  city?: string;
  gym_type?: string;
  plan: string;
  mrr: number;
  last_active: string;
  is_active: boolean;
  onboarding_completed: boolean;
  owner_name?: string;
  owner_email?: string;
  members_count: number;
  trainers_count: number;
  created_at: string;
}

export default function SuperAdminGymsPage() {
  const [gyms, setGyms] = useState<GymWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "trial">("all");

  // Modals state
  const [selectedGym, setSelectedGym] = useState<GymWorkspace | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDangerDeleteModal, setShowDangerDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    slug: "",
    owner_name: "",
    owner_email: "",
    owner_password: "",
    phone: "",
    city: "",
  });

  // Danger delete form
  const [deleteForm, setDeleteForm] = useState({
    typedSlug: "",
    typedConfirm: "",
    adminPassword: "",
    reason: "",
  });
  const [deleteError, setDeleteError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadGyms = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminWorkspaces(statusFilter);
      setGyms(data || []);
    } catch (err) {
      console.error("Failed to load gym workspaces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGyms();
  }, [statusFilter]);

  const handleCreateGym = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await repsiApi.createSuperAdminWorkspace(createForm);
      setShowCreateModal(false);
      setCreateForm({ name: "", slug: "", owner_name: "", owner_email: "", owner_password: "", phone: "", city: "" });
      await loadGyms();
    } catch (err: any) {
      alert(err.message || "Failed to create gym");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (gym: GymWorkspace) => {
    const nextState = !gym.is_active;
    const reason = prompt(`Reason for ${nextState ? "reactivating" : "suspending"} ${gym.name}:`);
    if (reason === null) return;
    try {
      await repsiApi.updateSuperAdminWorkspaceStatus(gym.id, nextState, reason);
      await loadGyms();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleExport = async (gym: GymWorkspace) => {
    try {
      const data = await repsiApi.exportSuperAdminWorkspace(gym.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `repsi-${gym.slug}-export.json`;
      a.click();
    } catch (err: any) {
      alert(err.message || "Failed to export gym");
    }
  };

  const handlePermanentDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");

    if (!selectedGym) return;
    if (deleteForm.typedSlug.trim().toLowerCase() !== selectedGym.slug.toLowerCase()) {
      setDeleteError(`Please type the exact gym slug "${selectedGym.slug}".`);
      return;
    }
    if (deleteForm.typedConfirm.trim() !== "DELETE GYM") {
      setDeleteError('Please type "DELETE GYM" to confirm.');
      return;
    }
    if (!deleteForm.adminPassword) {
      setDeleteError("Super Admin password is required.");
      return;
    }

    setActionLoading(true);
    try {
      await repsiApi.deleteSuperAdminWorkspacePermanently(selectedGym.id, {
        confirmation_slug: deleteForm.typedSlug.trim(),
        admin_password: deleteForm.adminPassword,
        reason: deleteForm.reason || "Super Admin manual deletion",
      });
      setShowDangerDeleteModal(false);
      setSelectedGym(null);
      setDeleteForm({ typedSlug: "", typedConfirm: "", adminPassword: "", reason: "" });
      await loadGyms();
    } catch (err: any) {
      setDeleteError(err.message || "Permanent deletion failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredGyms = gyms.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.slug.toLowerCase().includes(q) ||
      (g.owner_name && g.owner_name.toLowerCase().includes(q)) ||
      (g.city && g.city.toLowerCase().includes(q)) ||
      (g.email && g.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Gyms & Tenant Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {gyms.length} Tenants
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global multi-tenant administration, database governance, and tenant lifecycle actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadGyms}
            disabled={loading}
            className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            <Plus className="h-4 w-4" />
            Provision New Gym
          </Button>
        </div>
      </div>

      {/* ── Search & Filters Bar ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by gym name, slug, owner, email, city..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          {(["all", "active", "trial", "suspended"] as const).map((filter) => (
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

      {/* ── Dense Gym Table ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 text-left">Gym Organization</th>
                <th className="py-3.5 px-4 text-left">Owner / Contact</th>
                <th className="py-3.5 px-4 text-left">City / Location</th>
                <th className="py-3.5 px-4 text-left">Subscription</th>
                <th className="py-3.5 px-4 text-left">Members</th>
                <th className="py-3.5 px-4 text-left">Trainers</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    Loading gym tenant database...
                  </td>
                </tr>
              ) : filteredGyms.length > 0 ? (
                filteredGyms.map((g) => (
                  <tr key={g.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Gym Org */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800 text-purple-400 flex items-center justify-center font-bold shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{g.name}</p>
                          <p className="font-mono text-[11px] text-zinc-500">/{g.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner / Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-zinc-200">{g.owner_name || "Unassigned"}</p>
                      <p className="text-[11px] text-zinc-400">{g.email || g.owner_email || "No email"}</p>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-zinc-300">{g.city || "India"}</td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 font-semibold text-zinc-300 text-[10px]">
                        {g.plan}
                      </span>
                    </td>

                    {/* Members */}
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-200">
                      {g.members_count}
                    </td>

                    {/* Trainers */}
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {g.trainers_count}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider ${
                          g.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {g.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Impersonate */}
                        <Link
                          href={`/${g.slug}/dashboard`}
                          target="_blank"
                          title="Impersonate / Support Access"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        {/* Export */}
                        <button
                          onClick={() => handleExport(g)}
                          title="Export Gym Tenant JSON"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {/* Suspend / Resume */}
                        <button
                          onClick={() => handleToggleStatus(g)}
                          title={g.is_active ? "Suspend Gym Tenant" : "Reactivate Gym Tenant"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            g.is_active
                              ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10"
                              : "text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {g.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>

                        {/* Danger Zone Delete */}
                        <button
                          onClick={() => {
                            setSelectedGym(g);
                            setDeleteForm({ typedSlug: "", typedConfirm: "", adminPassword: "", reason: "" });
                            setDeleteError("");
                            setShowDangerDeleteModal(true);
                          }}
                          title="Danger Zone: Delete Gym Permanently"
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
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No gym organizations match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Danger Zone Delete Gym Modal ───────────────────────────────────── */}
      {showDangerDeleteModal && selectedGym && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E131C] border-2 border-rose-600/80 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start gap-3.5 border-b border-rose-950/80 pb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Flame className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">Danger Zone: Delete Gym Permanently</h2>
                  <button
                    onClick={() => setShowDangerDeleteModal(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                  This will perform a controlled cascading deletion of <strong className="text-white">{selectedGym.name}</strong>, all member rosters, workouts, attendance, subscriptions, and CRM records.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                {deleteError}
              </div>
            )}

            <form onSubmit={handlePermanentDelete} className="space-y-4 text-xs">
              {/* Step 1: Slug Confirmation */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  1. Type gym slug <span className="font-mono text-purple-400 select-all">{selectedGym.slug}</span>
                </label>
                <Input
                  value={deleteForm.typedSlug}
                  onChange={(e) => setDeleteForm({ ...deleteForm, typedSlug: e.target.value })}
                  placeholder={selectedGym.slug}
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              {/* Step 2: Confirm Phrase */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  2. Type <span className="font-mono text-rose-400 font-bold">DELETE GYM</span>
                </label>
                <Input
                  value={deleteForm.typedConfirm}
                  onChange={(e) => setDeleteForm({ ...deleteForm, typedConfirm: e.target.value })}
                  placeholder="DELETE GYM"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              {/* Step 3: Super Admin Password */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  3. Super Admin Password Re-Authentication
                </label>
                <Input
                  type="password"
                  value={deleteForm.adminPassword}
                  onChange={(e) => setDeleteForm({ ...deleteForm, adminPassword: e.target.value })}
                  placeholder="Enter your Super Admin password..."
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              {/* Step 4: Deletion Reason */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  4. Reason for Audit Log
                </label>
                <Input
                  value={deleteForm.reason}
                  onChange={(e) => setDeleteForm({ ...deleteForm, reason: e.target.value })}
                  placeholder="e.g. Owner requested tenant closure / Non-payment"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDangerDeleteModal(false)}
                  className="bg-zinc-900 border-zinc-800 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoading}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2"
                >
                  {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Execute Permanent Deletion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Provision Gym Modal ────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white">Provision New Gym Tenant</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGym} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Gym Name</label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Titan Strength Arena"
                  className="bg-zinc-800 border-zinc-700 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Workspace Slug (repsi.app/[slug])</label>
                <Input
                  value={createForm.slug}
                  onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  placeholder="e.g. titan-strength"
                  className="bg-zinc-800 border-zinc-700 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Owner Full Name</label>
                  <Input
                    value={createForm.owner_name}
                    onChange={(e) => setCreateForm({ ...createForm, owner_name: e.target.value })}
                    placeholder="e.g. Rohan Varma"
                    className="bg-zinc-800 border-zinc-700 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Owner Email</label>
                  <Input
                    type="email"
                    value={createForm.owner_email}
                    onChange={(e) => setCreateForm({ ...createForm, owner_email: e.target.value })}
                    placeholder="owner@titan.com"
                    className="bg-zinc-800 border-zinc-700 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Phone Number</label>
                  <Input
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="bg-zinc-800 border-zinc-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">City</label>
                  <Input
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="bg-zinc-800 border-zinc-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={actionLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  Provision Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  Plus,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Sliders,
  Gift,
  History,
  X,
  ChevronRight,
  ExternalLink,
  Edit2,
  User,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { repsiApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShinyText } from "@/components/ui/shiny-text";
import { AnimatedNumber } from "@/components/ui/animated-number";

export default function SuperAdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<"gyms" | "plans">("gyms");
  const [loading, setLoading] = useState(true);

  // Gyms state
  const [gyms, setGyms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Plans catalog state
  const [plans, setPlans] = useState<any[]>([]);

  // Modals state
  const [selectedGym, setSelectedGym] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalType, setModalType] = useState<
    "extend_trial" | "change_plan" | "complimentary" | "override" | "status" | "history" | "edit_plan" | null
  >(null);

  // Extend trial form
  const [trialDays, setTrialDays] = useState(14);
  const [actionReason, setActionReason] = useState("");

  // Change plan form
  const [targetPlanCode, setTargetPlanCode] = useState("growth");
  const [targetBillingCycle, setTargetBillingCycle] = useState("monthly");

  // Complimentary form
  const [compDays, setCompDays] = useState(30);
  const [compPermanent, setCompPermanent] = useState(false);

  // Overrides form
  const [customMemberLimit, setCustomMemberLimit] = useState<number | string>("");
  const [customTrainerLimit, setCustomTrainerLimit] = useState<number | string>("");
  const [customStaffLimit, setCustomStaffLimit] = useState<number | string>("");

  // Plan editor form
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  // Status toggle form
  const [statusAction, setStatusAction] = useState<"suspended" | "active">("suspended");

  // Detailed Gym data for History/Detail modal
  const [detailedGymSub, setDetailedGymSub] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gymsData, plansData] = await Promise.all([
        repsiApi.getSuperAdminGymSubscriptions({
          q: searchQuery,
          status: statusFilter,
          plan: planFilter,
        }),
        repsiApi.getSuperAdminSubscriptionPlans(),
      ]);
      setGyms(gymsData || []);
      setPlans(plansData || []);
    } catch (err) {
      console.error("Failed to load subscription data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openExtendTrial = (gym: any) => {
    setSelectedGym(gym);
    setTrialDays(14);
    setActionReason("Owner requested onboarding extension");
    setModalType("extend_trial");
  };

  const handleExtendTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGym) return;
    setActionLoading(true);
    try {
      await repsiApi.extendSuperAdminGymTrial(selectedGym.workspace_id, trialDays, actionReason);
      alert(`Extended trial by ${trialDays} days for ${selectedGym.workspace_name}.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to extend trial");
    } finally {
      setActionLoading(false);
    }
  };

  const openChangePlan = (gym: any) => {
    setSelectedGym(gym);
    setTargetPlanCode(gym.plan_code || "growth");
    setTargetBillingCycle(gym.billing_cycle || "monthly");
    setActionReason("Super Admin plan migration");
    setModalType("change_plan");
  };

  const handleChangePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGym) return;
    setActionLoading(true);
    try {
      await repsiApi.changeSuperAdminGymPlan(selectedGym.workspace_id, {
        plan_code: targetPlanCode,
        billing_cycle: targetBillingCycle,
        reason: actionReason,
      });
      alert(`Updated plan to ${targetPlanCode.toUpperCase()} for ${selectedGym.workspace_name}.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to change plan");
    } finally {
      setActionLoading(false);
    }
  };

  const openComplimentary = (gym: any) => {
    setSelectedGym(gym);
    setCompDays(30);
    setCompPermanent(false);
    setActionReason("Promotional partner grant");
    setModalType("complimentary");
  };

  const handleComplimentarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGym) return;
    setActionLoading(true);
    try {
      await repsiApi.grantSuperAdminComplimentary(selectedGym.workspace_id, {
        days: compPermanent ? undefined : compDays,
        is_permanent: compPermanent,
        reason: actionReason,
      });
      alert(`Complimentary access granted for ${selectedGym.workspace_name}.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to grant complimentary access");
    } finally {
      setActionLoading(false);
    }
  };

  const openOverrides = (gym: any) => {
    setSelectedGym(gym);
    setCustomMemberLimit(gym.member_limit === -1 ? "" : gym.member_limit);
    setCustomTrainerLimit(gym.trainer_limit === -1 ? "" : gym.trainer_limit);
    setCustomStaffLimit("");
    setActionReason("Custom gym capacity upgrade");
    setModalType("override");
  };

  const handleOverridesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGym) return;
    setActionLoading(true);
    try {
      await repsiApi.setSuperAdminGymOverride(selectedGym.workspace_id, {
        custom_member_limit: customMemberLimit === "" ? null : Number(customMemberLimit),
        custom_trainer_limit: customTrainerLimit === "" ? null : Number(customTrainerLimit),
        custom_staff_limit: customStaffLimit === "" ? null : Number(customStaffLimit),
        reason: actionReason,
      });
      alert(`Overrides saved for ${selectedGym.workspace_name}.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save overrides");
    } finally {
      setActionLoading(false);
    }
  };

  const openStatusToggle = (gym: any, target: "suspended" | "active") => {
    setSelectedGym(gym);
    setStatusAction(target);
    setActionReason(target === "suspended" ? "Terms of service audit / Non-payment" : "Account reinstated");
    setModalType("status");
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGym) return;
    setActionLoading(true);
    try {
      await repsiApi.updateSuperAdminGymSubscriptionStatus(selectedGym.workspace_id, {
        status: statusAction,
        reason: actionReason,
      });
      alert(`Subscription marked as ${statusAction.toUpperCase()} for ${selectedGym.workspace_name}.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const openHistory = async (gym: any) => {
    setSelectedGym(gym);
    setModalType("history");
    try {
      const details = await repsiApi.getSuperAdminGymSubscription(gym.workspace_id);
      setDetailedGymSub(details);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditPlan = (plan: any) => {
    setEditingPlan({ ...plan });
    setModalType("edit_plan");
  };

  const handleEditPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setActionLoading(true);
    try {
      await repsiApi.updateSuperAdminSubscriptionPlan(editingPlan.id, {
        name: editingPlan.name,
        monthly_price: Number(editingPlan.monthly_price),
        annual_price: Number(editingPlan.annual_price),
        member_limit: Number(editingPlan.member_limit),
        trainer_limit: Number(editingPlan.trainer_limit),
        staff_limit: Number(editingPlan.staff_limit),
        is_active: editingPlan.is_active,
      });
      alert(`Plan ${editingPlan.name} updated successfully.`);
      setModalType(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update plan");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            SaaS Subscription & Entitlement Control
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Super Admin control center: manage gym plan allocations, 14-day trials, feature gates, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab("gyms")}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeTab === "gyms" ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Gym Tenant Subscriptions ({gyms.length})
          {activeTab === "gyms" && (
            <motion.div
              layoutId="superAdminSubTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("plans")}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeTab === "plans" ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Catalog Plans & Entitlements ({plans.length})
          {activeTab === "plans" && (
            <motion.div
              layoutId="superAdminSubTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* TAB 1: GYMS SUBSCRIPTIONS */}
      {activeTab === "gyms" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by gym name, workspace slug, or owner email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-zinc-950 border-zinc-800 text-xs text-white"
              />
            </form>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="trialing">Trialing (Growth)</option>
                <option value="active">Active (Paid)</option>
                <option value="grace_period">Grace Period</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="growth">Growth</option>
                <option value="premium">Premium</option>
                <option value="pro">Pro</option>
                <option value="pro_plus">Pro Plus+</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-[11px] font-semibold uppercase text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Gym Tenant</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Effective Plan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Active Capacity</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                        Loading gym subscriptions...
                      </td>
                    </tr>
                  ) : gyms.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        No gym subscriptions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    gyms.map((gym) => {
                      const isUnlimited = gym.member_limit === -1;
                      const isSuspended = gym.status === "suspended";
                      const isTrial = gym.status === "trialing";
                      return (
                        <tr key={gym.subscription_id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm">{gym.workspace_name}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">/{gym.workspace_slug}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-zinc-200">{gym.owner_name || "—"}</div>
                            <div className="text-[11px] text-zinc-500">{gym.owner_email || "—"}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-400 uppercase">
                              <Sparkles className="w-3.5 h-3.5" />
                              {gym.plan_name}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {gym.billing_cycle || "monthly"} • ₹{gym.plan_price || 0}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                gym.status === "active"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : gym.status === "trialing"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : gym.status === "suspended"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                              }`}
                            >
                              {gym.status}
                            </span>
                            {gym.is_complimentary && (
                              <span className="block mt-1 text-[9px] text-purple-400 font-bold">
                                ★ COMPLIMENTARY
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-zinc-200">
                              Members: <strong className="text-white">{gym.active_members_count}</strong> /{" "}
                              {isUnlimited ? "Unlimited" : gym.member_limit}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              Trainers: {gym.active_trainers_count} / {gym.trainer_limit === -1 ? "Unlimited" : gym.trainer_limit}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px]">
                            {gym.expires_at ? new Date(gym.expires_at).toLocaleDateString() : "Permanent / None"}
                            {isTrial && gym.expires_at && (
                              <span className="block text-[10px] text-amber-400">
                                {Math.max(0, Math.ceil((new Date(gym.expires_at).getTime() - Date.now()) / (1000 * 3600 * 24)))} days left
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Extend Trial */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openExtendTrial(gym)}
                                className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-amber-300 hover:bg-amber-500/10"
                                title="Extend Trial"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                +Trial
                              </Button>

                              {/* Change Plan */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openChangePlan(gym)}
                                className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white"
                                title="Change Plan"
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Plan
                              </Button>

                              {/* Overrides */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openOverrides(gym)}
                                className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white"
                                title="Set Resource Overrides"
                              >
                                <Sliders className="w-3 h-3" />
                              </Button>

                              {/* Complimentary */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openComplimentary(gym)}
                                className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-purple-400 hover:bg-purple-500/10"
                                title="Grant Complimentary Access"
                              >
                                <Gift className="w-3 h-3" />
                              </Button>

                              {/* Suspend or Reactivate */}
                              {isSuspended ? (
                                <Button
                                  size="sm"
                                  onClick={() => openStatusToggle(gym, "active")}
                                  className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
                                  title="Reactivate subscription"
                                >
                                  <Unlock className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openStatusToggle(gym, "suspended")}
                                  className="h-7 text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                                  title="Suspend subscription"
                                >
                                  <Lock className="w-3 h-3" />
                                </Button>
                              )}

                              {/* History / Audit */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openHistory(gym)}
                                className="h-7 text-[10px] bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
                                title="Audit history"
                              >
                                <History className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANS & ENTITLEMENTS CATALOG */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p) => (
              <SpotlightCard
                key={p.id}
                spotlightColor="rgba(16, 185, 129, 0.12)"
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {p.code}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        p.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {p.is_active ? "ACTIVE CATALOG" : "INACTIVE"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-1">{p.name}</h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-white">
                      {p.monthly_price === 0 ? "Custom" : `₹${p.monthly_price}`}
                    </span>
                    <span className="text-xs text-zinc-400">/ mo</span>
                    <span className="text-xs text-zinc-500 font-mono">
                      (Annual: ₹{p.annual_price || 0})
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                    <div>
                      • Member Limit:{" "}
                      <strong className="text-white">
                        {p.member_limit === -1 ? "Unlimited" : p.member_limit}
                      </strong>
                    </div>
                    <div>
                      • Trainer Limit:{" "}
                      <strong className="text-white">
                        {p.trainer_limit === -1 ? "Unlimited" : p.trainer_limit}
                      </strong>
                    </div>
                    <div>
                      • Staff Limit:{" "}
                      <strong className="text-white">
                        {p.staff_limit === -1 ? "Unlimited" : p.staff_limit}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                    <div className="text-[11px] font-semibold text-zinc-300">Features Unlocked:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(p.features || {}).map((f) => (
                        <span key={f} className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-[9px] text-zinc-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditPlan(p)}
                  className="w-full bg-zinc-950 border-zinc-700 text-zinc-200 hover:text-white text-xs gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Plan Details & Limits
                </Button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ACTION MODALS */}
      {/* ======================================================== */}

      {/* EXTEND TRIAL MODAL */}
      {modalType === "extend_trial" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-amber-400">
                <Clock className="w-5 h-5" />
                Extend 14-Day Free Trial
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Extend access for <strong className="text-white">{selectedGym.workspace_name}</strong> without creating duplicate subscriptions.
            </p>

            <form onSubmit={handleExtendTrialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Additional Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTrialDays(d)}
                      className={`py-2 rounded-lg font-bold border transition ${
                        trialDays === d
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      +{d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Reason for Extension</label>
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Granted by CEO for pilot onboarding"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                  {actionLoading ? "Applying..." : "Confirm Extension"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PLAN MODAL */}
      {modalType === "change_plan" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-emerald-400">
                <Edit2 className="w-5 h-5" />
                Change Gym Plan
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Assign a new catalog plan to <strong className="text-white">{selectedGym.workspace_name}</strong>.
            </p>

            <form onSubmit={handleChangePlanSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Target Plan</label>
                <select
                  value={targetPlanCode}
                  onChange={(e) => setTargetPlanCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="basic">Basic (10 Members · ₹149/mo)</option>
                  <option value="growth">Growth (35 Members · ₹499/mo)</option>
                  <option value="premium">Premium (100 Members · ₹1,299/mo)</option>
                  <option value="pro">Pro (250 Members · ₹2,499/mo)</option>
                  <option value="pro_plus">Pro Plus+ (Unlimited Members · ₹4,999/mo)</option>
                  <option value="enterprise">Enterprise (Custom)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Billing Cycle</label>
                <select
                  value={targetBillingCycle}
                  onChange={(e) => setTargetBillingCycle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Administrative Reason</label>
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Plan upgrade requested via support ticket"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  {actionLoading ? "Applying..." : "Assign Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLIMENTARY ACCESS MODAL */}
      {modalType === "complimentary" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-purple-400">
                <Gift className="w-5 h-5" />
                Grant Complimentary Access
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Grant free complimentary access to <strong className="text-white">{selectedGym.workspace_name}</strong> without tampering billing ledger history.
            </p>

            <form onSubmit={handleComplimentarySubmit} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  id="compPerm"
                  checked={compPermanent}
                  onChange={(e) => setCompPermanent(e.target.checked)}
                  className="rounded border-zinc-700"
                />
                <label htmlFor="compPerm" className="text-xs font-semibold text-zinc-200">
                  Grant Permanent Complimentary Access (until manually revoked)
                </label>
              </div>

              {!compPermanent && (
                <div>
                  <label className="block text-zinc-400 mb-1">Duration (Days)</label>
                  <Input
                    type="number"
                    value={compDays}
                    onChange={(e) => setCompDays(Number(e.target.value))}
                    min={1}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-400 mb-1">Reason</label>
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. VIP Partner sponsorship"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                  {actionLoading ? "Granting..." : "Grant Access"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERRIDES MODAL */}
      {modalType === "override" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-blue-400">
                <Sliders className="w-5 h-5" />
                Configure Tenant Resource Overrides
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Apply per-gym custom limits to <strong className="text-white">{selectedGym.workspace_name}</strong>. Leave empty to use plan defaults.
            </p>

            <form onSubmit={handleOverridesSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Member Limit</label>
                  <Input
                    type="number"
                    value={customMemberLimit}
                    onChange={(e) => setCustomMemberLimit(e.target.value)}
                    placeholder="Plan default"
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Trainer Limit</label>
                  <Input
                    type="number"
                    value={customTrainerLimit}
                    onChange={(e) => setCustomTrainerLimit(e.target.value)}
                    placeholder="Plan default"
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Staff Limit</label>
                  <Input
                    type="number"
                    value={customStaffLimit}
                    onChange={(e) => setCustomStaffLimit(e.target.value)}
                    placeholder="Plan default"
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Reason</label>
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Custom agreement addendum"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  {actionLoading ? "Saving..." : "Save Overrides"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE MODAL */}
      {modalType === "status" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                {statusAction === "suspended" ? "Suspend Subscription" : "Reactivate Subscription"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              {statusAction === "suspended"
                ? `Suspending will block all feature and capacity operations for ${selectedGym.workspace_name}.`
                : `Reactivating will restore plan entitlements for ${selectedGym.workspace_name}.`}
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Reason for Status Change</label>
                <Input
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Required administrative reason"
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className={`${
                    statusAction === "suspended" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                  } text-white text-xs`}
                >
                  {actionLoading ? "Updating..." : `Confirm ${statusAction.toUpperCase()}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY / AUDIT MODAL */}
      {modalType === "history" && selectedGym && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-zinc-200">
                <History className="w-5 h-5 text-emerald-400" />
                Subscription History & Audit Log — {selectedGym.workspace_name}
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {detailedGymSub?.audit_logs?.length === 0 ? (
                <div className="py-8 text-center text-zinc-500">No administrative changes recorded for this workspace.</div>
              ) : (
                detailedGymSub?.audit_logs?.map((log: any) => (
                  <div key={log.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                      <span className="font-bold text-emerald-400 uppercase">{log.action}</span>
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-zinc-200 text-xs">{log.reason || "No reason specified"}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {log.old_value && <span>Old: {log.old_value} → </span>}
                      {log.new_value && <span className="text-white">New: {log.new_value}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {modalType === "edit_plan" && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-emerald-400">
                <Edit2 className="w-5 h-5" />
                Edit Plan: {editingPlan.name}
              </h3>
              <button onClick={() => setModalType(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditPlanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Display Name</label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Monthly Price (₹)</label>
                  <Input
                    type="number"
                    value={editingPlan.monthly_price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthly_price: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Annual Price (₹)</label>
                  <Input
                    type="number"
                    value={editingPlan.annual_price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, annual_price: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Member Limit</label>
                  <Input
                    type="number"
                    value={editingPlan.member_limit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, member_limit: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Trainer Limit</label>
                  <Input
                    type="number"
                    value={editingPlan.trainer_limit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, trainer_limit: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Staff Limit</label>
                  <Input
                    type="number"
                    value={editingPlan.staff_limit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, staff_limit: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="planActive"
                  checked={editingPlan.is_active}
                  onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                  className="rounded border-zinc-700"
                />
                <label htmlFor="planActive" className="text-zinc-300">
                  Active for new purchases
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setModalType(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  {actionLoading ? "Saving..." : "Save Plan Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

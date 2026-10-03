"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { repsiApi } from "@/lib/api";

interface PlanItem {
  id: string;
  name: string;
  description?: string;
  duration_months: number;
  price: number;
  features?: string;
  is_active: boolean;
}

export default function WorkspaceMembershipsPage(props: {
  params: Promise<{ workspace: string }>;
}) {
  const searchParams = useSearchParams();
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  // Form states
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration_months: 1,
    price: 1999,
    features: "Gym Floor Access, Locker Room, Steam",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansData, expiringData, membersData] = await Promise.all([
        repsiApi.getMembershipPlans().catch(() => []),
        repsiApi.getExpiringMemberships(7).catch(() => []),
        repsiApi.getMembers().catch(() => []),
      ]);

      setPlans(plansData || []);

      setExpiringCount(expiringData.length);
      const activeMembers = membersData.filter((m: any) => m.status === "active").length;
      const expiredMembers = membersData.filter((m: any) => m.status === "expired").length;
      setActiveCount(activeMembers);
      setExpiredCount(expiredMembers);
    } catch (err) {
      console.error("Failed to load membership data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await repsiApi.createMembershipPlan({
        name: planForm.name,
        description: planForm.description,
        duration_months: Number(planForm.duration_months),
        price: Number(planForm.price),
        features: planForm.features,
      });
      setIsCreateOpen(false);
      setPlanForm({
        name: "",
        description: "",
        duration_months: 1,
        price: 1999,
        features: "Gym Floor Access, Locker Room, Steam",
      });
      await loadData();
      alert("Membership plan created successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to create membership plan");
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await repsiApi.updateMembershipPlan(editingPlan.id, {
        name: editingPlan.name,
        description: editingPlan.description,
        duration_months: Number(editingPlan.duration_months),
        price: Number(editingPlan.price),
        features: editingPlan.features,
        is_active: editingPlan.is_active,
      });
      setEditingPlan(null);
      await loadData();
      alert("Membership plan updated successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to update membership plan");
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate/delete the "${name}" plan?`)) return;
    try {
      await repsiApi.deleteMembershipPlan(id);
      await loadData();
      alert("Membership plan deleted or deactivated successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete membership plan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Memberships & Plans</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track active plans, pricing tiers, renewals, and expiration pipelines.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Create New Plan
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Memberships",
            count: activeCount,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Expiring (within 7 days)",
            count: expiringCount,
            icon: AlertTriangle,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Expired / Lapsed",
            count: expiredCount,
            icon: XCircle,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
          },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-[8px] ${bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
                <p className="text-2xl font-bold text-[var(--text)] tabular-nums mt-0.5">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Plans Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[var(--text)]">Gym Pricing Tiers</h2>
          <span className="text-xs text-[var(--text-muted)]">{plans.length} configured plans</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)] mx-auto" />
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            mascotPose="membership"
            speechBubble="Let's create your first plan!"
            title="No membership plans yet"
            description="Create the packages your gym offers. Members purchase these packages to unlock gym access and training."
            action={{
              label: "+ Create plan",
              onClick: () => {
                setPlanForm({
                  name: "",
                  description: "",
                  duration_months: 1,
                  price: 999,
                  features: "Gym Access, General Training",
                });
                setIsCreateOpen(true);
              },
            }}
            templateCard={{
              title: "Monthly Membership",
              subtitle: "₹999 / 30 days",
              details: [
                "Full gym floor access",
                "General trainer guidance",
                "30 days validity",
              ],
              actionLabel: "Use as template",
              onUseTemplate: () => {
                setPlanForm({
                  name: "Monthly Membership",
                  description: "Full gym floor access with general trainer guidance",
                  duration_months: 1,
                  price: 999,
                  features: "Gym Access, General Training, Locker Room",
                });
                setIsCreateOpen(true);
              },
            }}
            guideTitle="How to create plans"
            guideSteps={[
              "Click + Create plan or Use template",
              "Enter plan name & fee in rupees",
              "Set duration in months (1 mo, 3 mo, 12 mo)",
              "Save to enable member subscriptions and renewals",
            ]}
            guideLinkText="View plan guide →"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={plan.is_active ? "active" : "expired"}>
                      {plan.is_active ? "Active Tier" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {plan.duration_months} {plan.duration_months === 1 ? "Month" : "Months"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--text)]">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">{plan.description}</p>
                  )}
                  <p className="text-2xl font-bold text-[var(--text)] mt-3">
                    {formatCurrency(plan.price)}
                  </p>
                  {plan.features && (
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Includes: {plan.features}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Plan
                  </button>

                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="flex items-center gap-1 text-text-muted hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--primary)]" />
              Create Membership Plan
            </h3>
            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semi-Annual Strength"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    required
                    value={planForm.duration_months}
                    onChange={(e) => setPlanForm({ ...planForm, duration_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Complete gym floor access and cardio zone"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Features / Amenities Included</label>
                <input
                  type="text"
                  placeholder="e.g. Free Towel, Sauna, Steam, Diet consultation"
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Plan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[var(--primary)]" />
              Edit Membership Plan
            </h3>
            <form onSubmit={handleUpdatePlan} className="space-y-4 text-xs">
              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    required
                    value={editingPlan.duration_months}
                    onChange={(e) => setEditingPlan({ ...editingPlan, duration_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Features / Amenities</label>
                <input
                  type="text"
                  value={editingPlan.features || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="plan-active"
                  checked={editingPlan.is_active}
                  onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="plan-active" className="text-xs text-[var(--text)] cursor-pointer">
                  Plan is active and available for enrollment
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

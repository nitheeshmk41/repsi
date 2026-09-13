"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function OnboardingPlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState([
    { name: "Monthly Standard", duration: "1 month", price: 2499, status: "Active" },
    { name: "Quarterly Pro", duration: "3 months", price: 6499, status: "Active" },
    { name: "Half-Yearly Elite", duration: "6 months", price: 11499, status: "Active" },
    { name: "Yearly Transformation", duration: "12 months", price: 18999, status: "Active" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", duration: "1 month", price: 1999, description: "" });

  const addPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.name.trim()) {
      setPlans([...plans, { ...newPlan, price: Number(newPlan.price), status: "Active" }]);
      setNewPlan({ name: "", duration: "1 month", price: 1999, description: "" });
      setShowAddModal(false);
    }
  };

  const removePlan = (idx: number) => {
    setPlans(plans.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("repsi_onboarding_plans", JSON.stringify(plans));
    router.push("/onboarding/team");
  };

  const handleSkip = () => {
    localStorage.setItem("repsi_onboarding_plans", JSON.stringify(plans));
    router.push("/onboarding/team");
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-lg relative">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-[#16A34A] mb-1">
          <CreditCard className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Step 3 of 5</span>
        </div>
        <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">Membership Plans</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Set up initial membership tiers for your gym. You can also configure advanced access rules later.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-zinc-900">{p.name}</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{p.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-base text-zinc-900 font-mono">
                  {formatCurrency(p.price)}
                </span>
                <button
                  type="button"
                  onClick={() => removePlan(idx)}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                  aria-label="Delete plan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Plan Button Trigger */}
        {!showAddModal ? (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full p-3.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 hover:bg-emerald-50/50 hover:border-emerald-400 text-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all group"
          >
            <Plus className="h-4 w-4 text-[#16A34A] group-hover:scale-110 transition-transform" />
            <span>Add Membership Plan</span>
          </button>
        ) : (
          /* Expandable Form */
          <form onSubmit={addPlan} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/30 space-y-3 animate-in fade-in duration-200">
            <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Create Membership Plan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-zinc-700">Plan Name *</Label>
                <Input
                  placeholder="e.g. Weekend Pass"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  required
                  className="h-9 text-xs bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-zinc-700">Duration *</Label>
                <select
                  className="w-full h-9 px-2 rounded-md border border-zinc-200 bg-white text-xs font-medium"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                >
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="Day Pass">Day Pass</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-zinc-700">Price (₹) *</Label>
                <Input
                  type="number"
                  placeholder="1999"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                  required
                  className="h-9 text-xs bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)} className="h-8 text-xs text-zinc-500">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs bg-[#16A34A] text-white font-bold px-4">
                Add Plan
              </Button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <Link href="/onboarding/business">
            <Button type="button" variant="outline" className="gap-2 h-10 px-4 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors px-2 py-1"
            >
              Skip for now
            </button>
            <Button type="button" onClick={handleSubmit} className="gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-11 px-6 rounded-xl">
              <span>Continue →</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

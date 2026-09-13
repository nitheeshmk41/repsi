"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingBusinessPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    gymType: "Strength & Conditioning",
    locationsCount: "1 Location",
    approxMembers: "250-500 members",
    openingHours: "05:30 AM – 10:30 PM",
    timezone: "Asia/Kolkata (IST)",
    currency: "INR (₹)",
  });

  useEffect(() => {
    const saved = localStorage.getItem("repsi_onboarding_business");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("repsi_onboarding_business", JSON.stringify(form));
    router.push("/onboarding/plans");
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-[#16A34A] mb-1">
          <Briefcase className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Step 2 of 5</span>
        </div>
        <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">Business Setup</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Configure your gym&apos;s operating hours, size, location and business settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gymType" className="font-semibold text-zinc-900">Gym Type</Label>
              <select
                id="gymType"
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-800"
                value={form.gymType}
                onChange={(e) => setForm({ ...form, gymType: e.target.value })}
              >
                <option value="Strength & Conditioning">Strength & Conditioning</option>
                <option value="CrossFit Box">CrossFit Box</option>
                <option value="Boutique Fitness Studio">Boutique Fitness Studio</option>
                <option value="Commercial Health Club">Commercial Health Club</option>
                <option value="Yoga & Pilates Center">Yoga & Pilates Center</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="locations" className="font-semibold text-zinc-900">Number of Locations</Label>
              <select
                id="locations"
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-800"
                value={form.locationsCount}
                onChange={(e) => setForm({ ...form, locationsCount: e.target.value })}
              >
                <option value="1 Location">1 Location</option>
                <option value="2-3 Locations">2 - 3 Locations</option>
                <option value="4+ Locations">4+ Locations (Franchise)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="members" className="font-semibold text-zinc-900">Current Members</Label>
              <select
                id="members"
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-800"
                value={form.approxMembers}
                onChange={(e) => setForm({ ...form, approxMembers: e.target.value })}
              >
                <option value="< 100 members">Less than 100 members</option>
                <option value="100-250 members">100 – 250 members</option>
                <option value="250-500 members">250 – 500 members</option>
                <option value="500+ members">500+ members</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hours" className="font-semibold text-zinc-900">Operating Hours</Label>
              <Input
                id="hours"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                placeholder="05:30 AM – 10:30 PM"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timezone" className="font-semibold text-zinc-900">Timezone</Label>
              <Input
                id="timezone"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency" className="font-semibold text-zinc-900">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <Link href="/onboarding/gym">
              <Button type="button" variant="outline" className="gap-2 h-10 px-4 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </Link>
            <Button type="submit" className="gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-11 px-6 rounded-xl">
              <span>Continue →</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

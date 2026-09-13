"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingGymPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "Apex Fitness",
    phone: "+91 98450 11223",
    email: "contact@apexfitness.in",
    address: "Plot 42, 100 Feet Road, Indiranagar",
    city: "Coimbatore",
    country: "India",
    logoUrl: "",
  });

  const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  useEffect(() => {
    const saved = localStorage.getItem("repsi_onboarding_gym");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("repsi_onboarding_gym", JSON.stringify(form));
    localStorage.setItem("repsi_workspace_slug", slug || "apex-fitness");
    router.push("/onboarding/business");
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-[#16A34A] mb-1">
          <Building2 className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Step 1 of 5</span>
        </div>
        <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">Gym Profile</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Tell us about your gym and business operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="gymName" className="font-semibold text-zinc-900">Gym Name *</Label>
              <Input
                id="gymName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Apex Fitness"
                className="h-10"
              />
              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs">
                <span className="text-zinc-500">Workspace URL: </span>
                <strong className="font-mono text-zinc-900 font-bold">repsi.app/<span className="text-[#16A34A]">{slug || "apex-fitness"}</span></strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="font-semibold text-zinc-900">Official Contact Phone *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                placeholder="+91 98400 00000"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-semibold text-zinc-900">Business Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="owner@apexfitness.in"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address" className="font-semibold text-zinc-900">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address or location landmark"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="font-semibold text-zinc-900">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Coimbatore"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country" className="font-semibold text-zinc-900">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="India"
                className="h-10"
              />
            </div>
          </div>

          {/* Optional Logo Upload */}
          <div className="pt-3 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-semibold text-zinc-900 text-xs">Gym Logo</Label>
              <span className="text-[11px] text-zinc-400 font-medium">Optional</span>
            </div>
            <div className="p-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-800">Upload your logo</p>
                  <p className="text-[11px] text-zinc-400">PNG, SVG or JPG up to 5MB</p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Browse File
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end">
            <Button type="submit" className="gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-11 px-6 rounded-xl">
              <span>Continue →</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { slugToGymName } from "@/lib/workspace";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState("apex-fitness");
  const [gymName, setGymName] = useState("Apex Fitness");
  const [city, setCity] = useState("Coimbatore");
  const [plansCount, setPlansCount] = useState(4);
  const [teamCount, setTeamCount] = useState(2);

  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const slug = localStorage.getItem("repsi_workspace_slug") || "apex-fitness";
    setWorkspace(slug);

    const gymData = localStorage.getItem("repsi_onboarding_gym");
    if (gymData) {
      try {
        const parsed = JSON.parse(gymData);
        if (parsed.name) setGymName(parsed.name);
        if (parsed.city) setCity(parsed.city);
      } catch (e) {}
    }

    const plansData = localStorage.getItem("repsi_onboarding_plans");
    if (plansData) {
      try {
        const parsed = JSON.parse(plansData);
        setPlansCount(parsed.length);
      } catch (e) {}
    }

    const teamData = localStorage.getItem("repsi_onboarding_team");
    if (teamData) {
      try {
        const parsed = JSON.parse(teamData);
        setTeamCount(parsed.length);
      } catch (e) {}
    }
  }, []);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      router.push(`/${workspace}/dashboard`);
    }, 750);
  };

  if (launching) {
    return (
      <Card className="border border-emerald-500/30 bg-white shadow-2xl text-center py-16 px-8 animate-in fade-in zoom-in duration-300">
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Launching your workspace...</h2>
            <p className="text-sm text-zinc-500">Initializing {gymName} on repsi.app/{workspace}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-zinc-200 bg-white shadow-xl text-left overflow-hidden">
      <CardHeader className="pb-4 border-b border-zinc-100 bg-emerald-500/5">
        <div className="flex items-center gap-2 text-[#16A34A] mb-1">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Step 5 of 5 · Launch Ready</span>
        </div>
        <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">You&apos;re ready to launch.</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Your gym workspace is configured and ready to go.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Summary List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <span>✓</span>
              <span>Gym Profile</span>
            </div>
            <p className="font-bold text-sm text-zinc-900">{gymName}</p>
            <p className="text-xs text-zinc-500">{city}, India</p>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <span>✓</span>
              <span>Business Setup</span>
            </div>
            <p className="font-bold text-sm text-zinc-900">Single Location</p>
            <p className="text-xs text-zinc-500">250–500 members · INR (₹)</p>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <span>✓</span>
              <span>Membership Plans</span>
            </div>
            <p className="font-bold text-sm text-zinc-900">{plansCount} plans created</p>
            <p className="text-xs text-zinc-500">Ready for member enrollment</p>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <span>✓</span>
              <span>Team</span>
            </div>
            <p className="font-bold text-sm text-zinc-900">{teamCount} team members invited</p>
            <p className="text-xs text-zinc-500">Trainers & staff configured</p>
          </div>
        </div>

        {/* Dedicated Workspace URL Banner */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[#16A34A]" />
            <div>
              <p className="text-xs text-zinc-500 font-medium">Your Workspace URL</p>
              <p className="text-sm font-mono font-bold text-zinc-900">repsi.app/<span className="text-[#16A34A]">{workspace}</span></p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#16A34A] text-white">
            READY
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex justify-end">
          <Button size="lg" onClick={handleLaunch} className="w-full sm:w-auto px-8 py-6 text-base font-bold gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
            <span>Launch REPSI →</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

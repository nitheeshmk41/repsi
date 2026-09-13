"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Users, Plus, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingTeamPage() {
  const router = useRouter();

  const [team, setTeam] = useState([
    { name: "Rahul Verma", email: "rahul@apexfitness.in", role: "TRAINER" },
    { name: "Pooja Sharma", email: "pooja@apexfitness.in", role: "STAFF" },
  ]);

  const [newMember, setNewMember] = useState({ name: "", email: "", role: "TRAINER" });

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setTeam([...team, newMember]);
      setNewMember({ name: "", email: "", role: "TRAINER" });
    }
  };

  const removeMember = (idx: number) => {
    setTeam(team.filter((_, i) => i !== idx));
  };

  const handleFinish = () => {
    localStorage.setItem("repsi_onboarding_team", JSON.stringify(team));
    router.push("/onboarding/complete");
  };

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-[#16A34A] mb-1">
          <Users className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Step 4 of 5 (Optional)</span>
        </div>
        <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">Invite Team</CardTitle>
        <CardDescription className="text-zinc-500 text-sm">
          Add trainers, reception staff, or managers to help run your facility.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          {team.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-zinc-200 bg-white flex items-center justify-between shadow-2xs"
            >
              <div>
                <p className="font-bold text-sm text-zinc-900">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  {m.role}
                </span>
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Teammate */}
        <div className="p-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 space-y-3">
          <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Invite Teammate</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="Name (e.g. Maya Rao)"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="h-9 text-xs bg-white"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="h-9 text-xs bg-white"
            />
            <div className="flex gap-2">
              <select
                className="w-full h-9 px-2 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-800"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              >
                <option value="TRAINER">Trainer</option>
                <option value="STAFF">Front-Desk Staff</option>
                <option value="MANAGER">Gym Manager</option>
                <option value="ADMIN">Gym Admin</option>
              </select>
              <Button type="button" size="sm" onClick={addMember} className="h-9 bg-[#16A34A] text-white">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <Link href="/onboarding/plans">
            <Button type="button" variant="outline" className="gap-2 h-10 px-4 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors px-2 py-1"
            >
              Skip for now
            </button>
            <Button onClick={handleFinish} className="gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-11 px-6 rounded-xl">
              <span>Continue to Launch →</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

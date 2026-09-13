"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Building2, 
  Users, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  Save 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { slugToGymName } from "@/lib/workspace";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";
  const defaultName = slugToGymName(workspace);

  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [gymProfile, setGymProfile] = useState({
    name: defaultName,
    phone: "+91 98450 11223",
    email: `contact@${workspace}.in`,
    address: "100 Feet Road, Indiranagar",
    city: "Bangalore",
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST)",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const navItems = [
    { id: "general", label: "General & Branding", icon: Building2 },
    { id: "team", label: "Staff & Coaches", icon: Users },
    { id: "roles", label: "Role Permissions", icon: Shield },
    { id: "membership", label: "Plan Rules", icon: Sliders },
    { id: "billing", label: "Tax & Invoicing", icon: CreditCard },
    { id: "notifications", label: "SMS & WhatsApp", icon: Bell },
    { id: "security", label: "Security & 2FA", icon: Lock },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Gym Workspace Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure operations, staff access, automated reminders, and tax parameters for /{workspace}.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? "bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Panel */}
        <div className="flex-1">
          {activeTab === "general" && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold">General Information</CardTitle>
                <CardDescription>
                  Your gym's public name, workspace slug, and registered physical address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="gymName">Gym Brand Name</Label>
                      <Input
                        id="gymName"
                        value={gymProfile.name}
                        onChange={(e) => setGymProfile({ ...gymProfile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="slug">Workspace URL Slug</Label>
                      <Input id="slug" value={workspace} disabled className="opacity-75 font-mono text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Official Phone</Label>
                      <Input
                        id="phone"
                        value={gymProfile.phone}
                        onChange={(e) => setGymProfile({ ...gymProfile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="email">Official Email</Label>
                      <Input
                        id="email"
                        value={gymProfile.email}
                        onChange={(e) => setGymProfile({ ...gymProfile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={gymProfile.address}
                        onChange={(e) => setGymProfile({ ...gymProfile, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    {saved ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Settings saved successfully!
                      </span>
                    ) : <span />}
                    <Button type="submit" size="sm" className="gap-2">
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "team" && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Team & Staff Access</CardTitle>
                <CardDescription>
                  Invite managers, reception staff, and trainers to your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Nitheesh Kumar", email: "nitheesh@repsi.app", role: "OWNER" },
                  { name: "Rahul Verma", email: "rahul@ironcorefitness.in", role: "TRAINER" },
                  { name: "Pooja Sharma", email: "pooja@ironcorefitness.in", role: "STAFF" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs">
                    <div>
                      <p className="font-semibold text-sm text-[var(--text)]">{user.name}</p>
                      <p className="text-[var(--text-muted)]">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                      {user.role}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab !== "general" && activeTab !== "team" && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold capitalize">{activeTab} Settings</CardTitle>
                <CardDescription>
                  Configure and customize parameters for {activeTab}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
                  All active parameters and automation triggers are synced with the REPSI platform backend.
                </div>
                <Button size="sm">Update {activeTab} rules</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

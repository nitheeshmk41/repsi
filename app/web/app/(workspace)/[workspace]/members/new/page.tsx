"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { repsiApi } from "@/lib/api";

export default function NewMemberPage() {
  const router = useRouter();
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    plan: "Monthly",
    startDate: new Date().toISOString().split("T")[0],
    emergencyContact: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await repsiApi.createMember({
        name: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${workspace}/members`);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/${workspace}/members`}
          className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--text-muted)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Add New Member</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Register a new client into /{workspace} gym workspace
          </p>
        </div>
      </div>

      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Member Information</CardTitle>
          <CardDescription>
            Enter member personal information and primary membership tier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-rose-300">{error}</p>
                {error.toLowerCase().includes("token") || error.toLowerCase().includes("auth") || error.toLowerCase().includes("expired") ? (
                  <p className="text-xs text-rose-300/80 mt-1">
                    Your session has expired or authentication token is invalid. Please sign in again.
                  </p>
                ) : null}
              </div>
              {error.toLowerCase().includes("token") || error.toLowerCase().includes("auth") || error.toLowerCase().includes("expired") ? (
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium whitespace-nowrap transition"
                >
                  Sign in again
                </Link>
              ) : null}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Arun Kumar"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="arun@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98450 00000"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plan">Membership Plan</Label>
                <select
                  id="plan"
                  className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-sm"
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                >
                  <option value="Monthly">Monthly Standard</option>
                  <option value="Quarterly">Quarterly Pro</option>
                  <option value="Annual">Annual Transformation</option>
                  <option value="Day Pass">Day Pass</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="emergency">Emergency Contact (Optional)</Label>
                <Input
                  id="emergency"
                  placeholder="Name and Phone number"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border)]">
              <Link href={`/${workspace}/members`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || success} className="gap-2">
                {success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Member Registered!
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    {loading ? "Registering..." : "Save Member"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

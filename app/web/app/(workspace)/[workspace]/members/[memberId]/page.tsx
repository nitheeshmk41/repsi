"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  CalendarCheck,
  CreditCard,
  Edit,
  RefreshCcw,
  Ban,
  Trash2,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import type { MemberStatus } from "@/types";
import { repsiApi } from "@/lib/api";

const statusVariant: Record<
  MemberStatus,
  "active" | "expiring" | "expired" | "frozen" | "cancelled"
> = {
  active: "active",
  expiring: "expiring",
  expired: "expired",
  frozen: "frozen",
  cancelled: "cancelled",
};

const statusLabel: Record<MemberStatus, string> = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
  frozen: "Suspended",
  cancelled: "Cancelled",
};

export default function WorkspaceMemberProfilePage(props: {
  params: Promise<{ workspace: string; memberId: string }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const workspace = params.workspace || "apex-fitness";
  const memberId = params.memberId;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    emergency_contact: "",
    notes: "",
  });

  // Renew Modal State
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [renewForm, setRenewForm] = useState({
    plan_name: "Annual Elite",
    duration_months: 12,
    price_paid: 12000,
  });

  const loadMember = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repsiApi.getMember(memberId);
      setMember(data);
      setEditForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        emergency_contact: data.emergency_contact || "",
        notes: data.notes || "",
      });
    } catch (err: any) {
      console.error("Failed to load member", err);
      setError(err.message || "Failed to load member");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, [memberId]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await repsiApi.updateMember(memberId, editForm);
      setIsEditOpen(false);
      await loadMember();
      alert("Member profile updated successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to update member");
    }
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await repsiApi.renewMember(memberId, {
        plan_name: renewForm.plan_name,
        duration_months: Number(renewForm.duration_months),
        price_paid: Number(renewForm.price_paid),
      });
      setIsRenewOpen(false);
      await loadMember();
      alert(res.message || "Membership renewed successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to renew membership");
    }
  };

  const handleToggleSuspend = async () => {
    if (!member) return;
    const isSuspended = member.status === "frozen";
    const confirmMsg = isSuspended
      ? `Activate member "${member.first_name}"? This will restore their gym access and login.`
      : `Suspend member "${member.first_name}"? Suspended members cannot scan in, check in, or access gym modules.`;

    if (!confirm(confirmMsg)) return;

    try {
      const newStatus = isSuspended ? "active" : "frozen";
      await repsiApi.updateMember(memberId, { status: newStatus });
      await loadMember();
      alert(isSuspended ? "Member activated." : "Member suspended.");
    } catch (err: any) {
      alert(err.message || "Failed to update member status");
    }
  };

  const handleDelete = async () => {
    if (!member) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete "${member.first_name} ${member.last_name}"? This will delete all membership history and gym access.`
      )
    ) {
      return;
    }

    try {
      await repsiApi.deleteMember(memberId);
      alert("Member removed successfully.");
      router.push(`/${workspace}/members`);
    } catch (err: any) {
      alert(err.message || "Failed to delete member");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "membership", label: "Membership" },
    { id: "attendance", label: "Attendance" },
    { id: "payments", label: "Payments" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[var(--text)]">Member Not Found</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
          The requested member could not be loaded or was removed from this workspace.
        </p>
        <Link href={`/${workspace}/members`}>
          <Button variant="secondary" size="sm">
            Back to Members List
          </Button>
        </Link>
      </div>
    );
  }

  const memberName = `${member.first_name} ${member.last_name || ""}`.trim();
  const activeMembership = member.memberships?.find((m: any) => m.status === "active") || member.memberships?.[0];
  const planName = member.plan_name || activeMembership?.plan?.name || "Standard";
  const expiryDate = activeMembership?.end_date || "2026-12-31";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
        <Link href={`/${workspace}/members`} className="hover:text-[var(--text-secondary)] transition-colors">
          Members
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--text)]">{memberName}</span>
      </nav>

      {/* Profile Header */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="text-lg">
                {getInitials(memberName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">
                  {memberName}
                </h1>
                <Badge variant={statusVariant[member.status as MemberStatus] || "active"}>
                  {statusLabel[member.status as MemberStatus] || member.status}
                </Badge>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  ID: {member.id}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{planName} Member</p>

              <div className="flex flex-wrap gap-4 mt-3">
                {member.email && (
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Mail className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {member.email}
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Phone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {member.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsRenewOpen(true)}>
              <RefreshCcw className="h-3.5 w-3.5" />
              Renew
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleSuspend}
              className={member.status === "frozen" ? "text-emerald-500 hover:border-emerald-500/30" : "text-[var(--error)] hover:border-[var(--error)]/30"}
            >
              <Ban className="h-3.5 w-3.5" />
              {member.status === "frozen" ? "Activate" : "Suspend"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDelete}
              className="text-rose-500 hover:border-rose-500/30"
              title="Delete Member"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] overflow-x-auto">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <Link
              key={t.id}
              href={`/${workspace}/members/${memberId}?tab=${t.id}`}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-[var(--primary)] text-[var(--text)] font-semibold"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Contents */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Member Since", value: member.joined_date ? formatDate(member.joined_date) : "Recent", icon: Calendar },
              { label: "Membership Expires", value: formatDate(expiryDate), icon: CalendarCheck },
              { label: "Gender", value: member.gender || "Not specified", icon: CreditCard },
              { label: "Account Access", value: member.repsi_access || "Connected", icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-muted)]">{label}</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Member Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Full Name</span>
                  <span className="font-semibold text-[var(--text)]">{memberName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Phone</span>
                  <span>{member.phone || "—"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Email</span>
                  <span>{member.email || "—"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Emergency Contact</span>
                  <span>{member.emergency_contact || "—"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--text-muted)]">Notes</span>
                  <span>{member.notes || "No notes"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Membership Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base text-[var(--text)]">{planName}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Expires: {formatDate(expiryDate)}
                    </p>
                  </div>
                  <Badge variant={member.status === "active" ? "active" : "frozen"}>
                    {member.status.toUpperCase()}
                  </Badge>
                </div>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsRenewOpen(true)}>
                  <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                  Renew / Extend Membership
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "membership" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Current Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[var(--text)]">{planName} All-Access</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Valid until {formatDate(expiryDate)}
                </p>
              </div>
              <Badge variant={statusVariant[member.status as MemberStatus] || "active"}>
                {statusLabel[member.status as MemberStatus] || member.status}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsRenewOpen(true)}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Renew Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "attendance" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Attendance Log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">
              Real-time attendance logs recorded via entrance scanner.
            </p>
          </CardContent>
        </Card>
      )}

      {tab === "payments" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Billing & Transaction Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-[var(--text)]">{planName} Plan Fee</p>
                <p className="text-xs text-[var(--text-muted)]">Membership payment recorded</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">PAID</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL: EDIT MEMBER */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-[var(--primary)]" />
              Edit Member Profile
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editForm.emergency_contact}
                  onChange={(e) => setEditForm({ ...editForm, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENEW MEMBERSHIP */}
      {isRenewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-emerald-500" />
              Renew Membership
            </h3>
            <form onSubmit={handleRenewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[var(--text-secondary)] block mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={renewForm.plan_name}
                  onChange={(e) => setRenewForm({ ...renewForm, plan_name: e.target.value })}
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
                    value={renewForm.duration_months}
                    onChange={(e) => setRenewForm({ ...renewForm, duration_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--text-secondary)] block mb-1">Price Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={renewForm.price_paid}
                    onChange={(e) => setRenewForm({ ...renewForm, price_paid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsRenewOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Renewal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

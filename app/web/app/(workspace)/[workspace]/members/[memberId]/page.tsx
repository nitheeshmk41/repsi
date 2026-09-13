import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  Activity,
  Dumbbell,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { members } from "@/lib/mock-data";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import type { MemberStatus } from "@/types";

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
  frozen: "Frozen",
  cancelled: "Cancelled",
};

const attendanceHistory = [
  { date: "2026-09-13", checkIn: "06:42 AM", checkOut: "08:15 AM" },
  { date: "2026-09-11", checkIn: "07:05 AM", checkOut: "08:50 AM" },
  { date: "2026-09-09", checkIn: "06:55 AM", checkOut: "08:30 AM" },
  { date: "2026-09-07", checkIn: "07:12 AM", checkOut: "09:00 AM" },
  { date: "2026-09-05", checkIn: "06:48 AM", checkOut: "08:20 AM" },
];

const paymentHistory = [
  { id: "pay-001", date: "2026-09-01", amount: 2500, method: "UPI", status: "paid", description: "Monthly renewal" },
  { id: "pay-002", date: "2026-08-01", amount: 2500, method: "UPI", status: "paid", description: "Monthly renewal" },
  { id: "pay-003", date: "2026-07-01", amount: 2500, method: "Cash", status: "paid", description: "Monthly renewal" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workspace: string; memberId: string }>;
}): Promise<Metadata> {
  const { memberId } = await params;
  const member = members.find((m) => m.id === memberId) || members[0];
  return {
    title: member ? `${member.name} — Profile` : "Member Profile",
  };
}

export default async function WorkspaceMemberProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ workspace: string; memberId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { workspace, memberId } = await params;
  const { tab = "overview" } = await searchParams;

  const member = members.find((m) => m.id === memberId) || {
    id: memberId,
    name: "Arun Kumar",
    email: "arun.kumar@gmail.com",
    phone: "+91 98450 12345",
    status: "active" as MemberStatus,
    plan: "Quarterly" as const,
    joined: "2026-01-15",
    expiry: "2026-10-15",
    lastPayment: 6500,
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "membership", label: "Membership" },
    { id: "attendance", label: "Attendance" },
    { id: "payments", label: "Payments" },
    { id: "workouts", label: "Workouts" },
    { id: "measurements", label: "Measurements" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
        <Link href={`/${workspace}/members`} className="hover:text-[var(--text-secondary)] transition-colors">
          Members
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--text)]">{member.name}</span>
      </nav>

      {/* Profile Header */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarFallback className="text-lg">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">
                  {member.name}
                </h1>
                <Badge variant={statusVariant[member.status]}>
                  {statusLabel[member.status]}
                </Badge>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  ID: {member.id}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{member.plan} Member</p>

              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Mail className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  {member.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Phone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  {member.phone}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="secondary" size="sm">
              <RefreshCcw className="h-3.5 w-3.5" />
              Renew
            </Button>
            <Button variant="secondary" size="sm" className="text-[var(--error)] hover:border-[var(--error)]/30">
              <Ban className="h-3.5 w-3.5" />
              Suspend
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
              { label: "Member Since", value: formatDate(member.joined), icon: Calendar },
              { label: "Membership Expires", value: formatDate(member.expiry), icon: CalendarCheck },
              { label: "Last Payment", value: formatCurrency(member.lastPayment), icon: CreditCard },
              { label: "Total Check-ins", value: "47", icon: CalendarCheck },
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
                <CardTitle className="text-base font-semibold">Recent Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {attendanceHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-[var(--text)]">{formatDate(item.date)}</span>
                    <span className="text-emerald-500 font-medium">{item.checkIn} — {item.checkOut}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Payment Invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {paymentHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] last:border-0">
                    <div>
                      <span className="font-semibold text-[var(--text)]">{formatCurrency(item.amount)}</span>
                      <span className="text-[var(--text-muted)] ml-2">via {item.method}</span>
                    </div>
                    <span className="text-emerald-500 font-bold uppercase">{item.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "membership" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Current Membership Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[var(--text)]">{member.plan} All-Access</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Valid from {formatDate(member.joined)} to {formatDate(member.expiry)}
                </p>
              </div>
              <Badge variant="active">Active Plan</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Remaining Days</p>
                <p className="text-lg font-bold text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">32 Days</p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Auto-Renewal</p>
                <p className="text-lg font-bold text-[var(--text)]">Enabled</p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Locker Assigned</p>
                <p className="text-lg font-bold text-[var(--text)]">#B-14</p>
              </div>
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
            <div className="space-y-2">
              {attendanceHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    In: <strong className="text-[var(--text)]">{item.checkIn}</strong> | Out: <strong className="text-[var(--text)]">{item.checkOut}</strong>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "payments" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Billing & Transaction Ledger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm">
                <div>
                  <p className="font-medium text-[var(--text)]">{item.description}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.id} · {formatDate(item.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--text)]">{formatCurrency(item.amount)}</p>
                  <span className="text-[10px] font-bold uppercase text-emerald-400">PAID</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "workouts" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Assigned Workout Routines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text)]">Hypertrophy Upper Body Split</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-bold">Trainer Assigned</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Bench Press (4x8), Barbell Row (4x10), Overhead Press (3x10), Incline Dumbbell Curl (3x12)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "measurements" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Body Composition & Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <p className="text-xs text-[var(--text-muted)]">Weight</p>
                <p className="text-xl font-bold text-[var(--text)] mt-1">74.2 kg</p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <p className="text-xs text-[var(--text-muted)]">Body Fat %</p>
                <p className="text-xl font-bold text-[var(--text)] mt-1">15.4%</p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <p className="text-xs text-[var(--text-muted)]">Chest</p>
                <p className="text-xl font-bold text-[var(--text)] mt-1">40.5 in</p>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <p className="text-xs text-[var(--text-muted)]">Waist</p>
                <p className="text-xl font-bold text-[var(--text)] mt-1">31.2 in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "activity" && (
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Audit & Interaction Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: "Checked in at Main Entrance", time: "Today at 06:42 AM" },
              { action: "Membership auto-renewal processed via UPI", time: "Sep 1, 2026" },
              { action: "Assigned Workout Plan 'Hypertrophy Upper Body Split'", time: "Aug 15, 2026" },
              { action: "Body weight and measurements updated", time: "Aug 1, 2026" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-2 border-b border-[var(--border)] last:border-0">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                <span className="text-[var(--text)] flex-1">{ev.action}</span>
                <span className="text-[var(--text-muted)]">{ev.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

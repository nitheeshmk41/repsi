/**
 * REPSI Deterministic Mock Data
 *
 * All values are static — no Math.random().
 * Represents a realistic medium-sized gym (Apex Fitness, Chennai).
 */

import type { Member, MemberStatus, MembershipPlanName } from "@/types";

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export const dashboardMetrics = {
  activeMembers: {
    value: 1284,
    change: 12.4,
    changeType: "increase" as const,
    label: "Active Members",
    sublabel: "vs last month",
  },
  monthlyRevenue: {
    value: 482500,
    change: 8.2,
    changeType: "increase" as const,
    label: "Monthly Revenue",
    sublabel: "vs last month",
  },
  todayAttendance: {
    value: 186,
    change: 14.1,
    changeType: "increase" as const,
    label: "Today's Attendance",
    sublabel: "vs yesterday",
  },
  expiringSoon: {
    value: 24,
    change: -4.3,
    changeType: "decrease" as const,
    label: "Expiring Soon",
    sublabel: "within 7 days",
  },
};

// ─── Revenue Chart (12 months) ────────────────────────────────────────────────

export const revenueData = [
  { month: "Oct", revenue: 384000, expenses: 162000 },
  { month: "Nov", revenue: 412000, expenses: 170000 },
  { month: "Dec", revenue: 396000, expenses: 175000 },
  { month: "Jan", revenue: 428000, expenses: 168000 },
  { month: "Feb", revenue: 445000, expenses: 172000 },
  { month: "Mar", revenue: 461000, expenses: 180000 },
  { month: "Apr", revenue: 438000, expenses: 165000 },
  { month: "May", revenue: 452000, expenses: 178000 },
  { month: "Jun", revenue: 467000, expenses: 182000 },
  { month: "Jul", revenue: 459000, expenses: 176000 },
  { month: "Aug", revenue: 471000, expenses: 179000 },
  { month: "Sep", revenue: 482500, expenses: 184000 },
];

// ─── Attendance Chart (7 days) ────────────────────────────────────────────────

export const attendanceData = [
  { day: "Mon", checkins: 192, capacity: 250 },
  { day: "Tue", checkins: 178, capacity: 250 },
  { day: "Wed", checkins: 215, capacity: 250 },
  { day: "Thu", checkins: 203, capacity: 250 },
  { day: "Fri", checkins: 221, capacity: 250 },
  { day: "Sat", checkins: 248, capacity: 250 },
  { day: "Sun", checkins: 186, capacity: 250 },
];

// ─── Membership Distribution ──────────────────────────────────────────────────

export const membershipDistribution = [
  { name: "Monthly", value: 612, color: "#84CC16" },
  { name: "Quarterly", value: 348, color: "#22C55E" },
  { name: "Annual", value: 256, color: "#16A34A" },
  { name: "Day Pass", value: 68, color: "#BBF7D0" },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

export type ActivityType =
  | "member_joined"
  | "membership_renewed"
  | "payment_received"
  | "trainer_assigned"
  | "membership_expired"
  | "class_created"
  | "check_in"
  | "membership_frozen";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user: string;
  avatar?: string;
  timestamp: string;
  amount?: number;
}

export const recentActivity: Activity[] = [
  {
    id: "act-001",
    type: "member_joined",
    title: "New member registered",
    description: "Kavya Ramesh joined with Monthly membership",
    user: "Kavya Ramesh",
    timestamp: "2026-09-13T08:42:00+05:30",
  },
  {
    id: "act-002",
    type: "payment_received",
    title: "Payment received",
    description: "Membership renewal payment from Arjun Nair",
    user: "Arjun Nair",
    timestamp: "2026-09-13T08:15:00+05:30",
    amount: 2500,
  },
  {
    id: "act-003",
    type: "membership_renewed",
    title: "Membership renewed",
    description: "Priya Venkat renewed Annual plan",
    user: "Priya Venkat",
    timestamp: "2026-09-13T07:58:00+05:30",
    amount: 18000,
  },
  {
    id: "act-004",
    type: "check_in",
    title: "Morning rush check-ins",
    description: "62 members checked in between 6–8 AM",
    user: "System",
    timestamp: "2026-09-13T07:30:00+05:30",
  },
  {
    id: "act-005",
    type: "trainer_assigned",
    title: "Trainer assigned",
    description: "Ravi Kumar assigned to Deepak Singh",
    user: "Deepak Singh",
    timestamp: "2026-09-13T07:12:00+05:30",
  },
  {
    id: "act-006",
    type: "class_created",
    title: "New class scheduled",
    description: "Zumba session added — Tue & Thu 7:00 PM",
    user: "Staff",
    timestamp: "2026-09-13T06:45:00+05:30",
  },
  {
    id: "act-007",
    type: "membership_expired",
    title: "Membership expired",
    description: "Sunita Sharma's quarterly plan expired",
    user: "Sunita Sharma",
    timestamp: "2026-09-12T23:59:00+05:30",
  },
  {
    id: "act-008",
    type: "payment_received",
    title: "Payment received",
    description: "Day pass payment from walk-in member",
    user: "Walk-in",
    timestamp: "2026-09-12T18:30:00+05:30",
    amount: 200,
  },
];

// ─── Members ──────────────────────────────────────────────────────────────────

export const members: Member[] = [
  {
    id: "mem-001",
    name: "Arjun Nair",
    email: "arjun.nair@email.com",
    phone: "+91 98400 12345",
    plan: "Monthly",
    status: "active",
    joined: "2025-06-15",
    expiry: "2026-10-15",
    lastPayment: 2500,
  },
  {
    id: "mem-002",
    name: "Priya Venkat",
    email: "priya.v@email.com",
    phone: "+91 98412 34567",
    plan: "Annual",
    status: "active",
    joined: "2025-09-01",
    expiry: "2026-09-01",
    lastPayment: 18000,
  },
  {
    id: "mem-003",
    name: "Kavya Ramesh",
    email: "kavya.r@email.com",
    phone: "+91 97890 23456",
    plan: "Monthly",
    status: "active",
    joined: "2026-09-13",
    expiry: "2026-10-13",
    lastPayment: 2500,
  },
  {
    id: "mem-004",
    name: "Deepak Singh",
    email: "deepak.s@email.com",
    phone: "+91 99400 56789",
    plan: "Quarterly",
    status: "expiring",
    joined: "2025-12-15",
    expiry: "2026-09-18",
    lastPayment: 6500,
  },
  {
    id: "mem-005",
    name: "Sunita Sharma",
    email: "sunita.sh@email.com",
    phone: "+91 96400 34567",
    plan: "Quarterly",
    status: "expired",
    joined: "2025-03-01",
    expiry: "2026-09-12",
    lastPayment: 6500,
  },
  {
    id: "mem-006",
    name: "Ravi Kumar",
    email: "ravi.k@email.com",
    phone: "+91 98765 43210",
    plan: "Annual",
    status: "frozen",
    joined: "2025-01-10",
    expiry: "2026-12-10",
    lastPayment: 18000,
  },
  {
    id: "mem-007",
    name: "Ananya Krishnan",
    email: "ananya.k@email.com",
    phone: "+91 98900 11223",
    plan: "Monthly",
    status: "active",
    joined: "2026-07-20",
    expiry: "2026-10-20",
    lastPayment: 2500,
  },
  {
    id: "mem-008",
    name: "Sathish Rajan",
    email: "sathish.r@email.com",
    phone: "+91 97700 44556",
    plan: "Annual",
    status: "active",
    joined: "2025-11-01",
    expiry: "2026-11-01",
    lastPayment: 18000,
  },
];

// ─── Gym Info ─────────────────────────────────────────────────────────────────

export const gymInfo = {
  name: "Apex Fitness",
  location: "Anna Nagar, Chennai",
  phone: "+91 44 2626 8800",
  email: "hello@apexfitness.in",
  established: "2019",
  capacity: 250,
};

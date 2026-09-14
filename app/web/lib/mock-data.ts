/**
 * REPSI Data Definitions
 *
 * Mock fallbacks have been completely removed for multi-tenant data isolation.
 */

import type { Member } from "@/types";

export const dashboardMetrics = {
  activeMembers: { value: 0, change: 0, changeType: "increase" as const, label: "Active Members", sublabel: "vs last month" },
  monthlyRevenue: { value: 0, change: 0, changeType: "increase" as const, label: "Monthly Revenue", sublabel: "vs last month" },
  todayAttendance: { value: 0, change: 0, changeType: "increase" as const, label: "Today's Attendance", sublabel: "vs yesterday" },
  expiringSoon: { value: 0, change: 0, changeType: "decrease" as const, label: "Expiring Soon", sublabel: "within 7 days" },
};

export const revenueData: any[] = [];
export const attendanceData: any[] = [];
export const membershipDistribution: any[] = [];
export const recentActivity: any[] = [];
export const members: Member[] = [];
export const gymInfo = { name: "Gym Workspace", location: "", phone: "", email: "", established: "", capacity: 0 };

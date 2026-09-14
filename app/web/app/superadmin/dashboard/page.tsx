"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Activity, TrendingUp } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    workspaces: 0,
    users: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const token = getAuthToken();
      if (!token) return;

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";
      
      try {
        const [wsRes, usersRes] = await Promise.all([
          fetch(`${apiBase}/superadmin/workspaces`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiBase}/superadmin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (wsRes.ok && usersRes.ok) {
          const ws = await wsRes.json();
          const users = await usersRes.json();
          setStats({
            workspaces: ws.length,
            users: users.length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch super admin stats", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Platform Overview</h1>
        <p className="text-[var(--text-muted)] mt-1">High-level metrics across all REPSI workspaces.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Total Gyms</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{stats.workspaces}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Platform wide</div>
        </div>
        
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Total Users</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{stats.users}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">All roles combined</div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Platform Health</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">99.9%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1 font-medium">Uptime this month</div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Active Subscriptions</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">Active</div>
          <div className="text-xs text-[var(--text-muted)] mt-1 font-medium">B2B SaaS status</div>
        </div>
      </div>
    </div>
  );
}

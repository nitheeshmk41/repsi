"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, Search, MoreVertical } from "lucide-react";
import { getAuthCookie } from "@/lib/auth";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  city: string | null;
  is_active: boolean;
};

export default function SuperAdminWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspaces() {
      const token = getAuthCookie();
      if (!token) return;

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";
      try {
        const res = await fetch(`${apiBase}/superadmin/workspaces`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWorkspaces(data);
        }
      } catch (error) {
        console.error("Failed to fetch workspaces", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspaces();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Gym Workspaces</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage all registered gyms on the platform.</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Add Gym
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search gyms by name or city..."
              className="w-full pl-9 pr-4 h-9 rounded-md border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-muted)] font-medium">
              <tr>
                <th className="px-4 py-3 border-b border-[var(--border)]">Name</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Slug</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">City</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Status</th>
                <th className="px-4 py-3 border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    Loading workspaces...
                  </td>
                </tr>
              ) : workspaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    No workspaces found.
                  </td>
                </tr>
              ) : (
                workspaces.map((ws) => (
                  <tr key={ws.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold">
                          {ws.name.charAt(0)}
                        </div>
                        <div className="font-medium text-[var(--text)]">{ws.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{ws.slug}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{ws.city || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        ws.is_active 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {ws.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 rounded hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

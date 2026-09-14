"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search, Mail, ShieldAlert, MoreVertical } from "lucide-react";
import { getAuthCookie } from "@/lib/auth";

type User = {
  id: string;
  full_name: string;
  email: string;
  is_superadmin: boolean;
  is_active: boolean;
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const token = getAuthCookie();
      if (!token) return;

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";
      try {
        const res = await fetch(`${apiBase}/superadmin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSendEmail = (email: string) => {
    // In a real app, this would open a modal or trigger an API
    alert(`Mock: Sending email to ${email}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Platform Users</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage global users and platform administrators.</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
          <ShieldAlert className="h-4 w-4" />
          Add Admin
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 h-9 rounded-md border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-muted)] font-medium">
              <tr>
                <th className="px-4 py-3 border-b border-[var(--border)]">Name</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Email</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Platform Role</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Status</th>
                <th className="px-4 py-3 border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                          {user.full_name.charAt(0)}
                        </div>
                        <div className="font-medium text-[var(--text)]">{user.full_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.is_superadmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
                          <ShieldAlert className="h-3 w-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs font-medium">User</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.is_active 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleSendEmail(user.email)}
                          className="p-1.5 rounded hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
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

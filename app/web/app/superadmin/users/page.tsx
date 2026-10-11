"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search, Mail, ShieldAlert, Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { repsiApi } from "@/lib/api";

type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
  workspace_name?: string;
  is_superadmin: boolean;
  is_active: boolean;
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminUsers(roleFilter);
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await repsiApi.deleteSuperAdminUser(userToDelete.id);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.workspace_name && u.workspace_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Platform Users</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Manage global platform accounts, delete orphaned users, and audit platform credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] outline-none"
          >
            <option value="all">All Roles</option>
            <option value="owner">Gym Owners</option>
            <option value="super_admin">Super Admins</option>
            <option value="trainer">Trainers</option>
            <option value="user">Users / Members</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search users by name, email, or gym..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 rounded-md border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
          <div className="text-xs text-[var(--text-muted)] font-medium">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--background)] text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-[var(--border)]">User</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Email</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Gym Workspace</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Platform Role</th>
                <th className="px-4 py-3 border-b border-[var(--border)]">Status</th>
                <th className="px-4 py-3 border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[var(--text)]">{user.full_name}</div>
                          {user.phone && <div className="text-[11px] text-[var(--text-muted)]">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)] font-mono">{user.email}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                      {user.workspace_name ? (
                        <span className="font-medium text-[var(--text)]">{user.workspace_name}</span>
                      ) : (
                        <span className="text-zinc-400 italic">No gym / Orphaned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_superadmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
                          <ShieldAlert className="h-3 w-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs font-medium uppercase font-mono">
                          {user.role || "USER"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        user.is_active 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!user.is_superadmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError("");
                              setUserToDelete(user);
                            }}
                            className="p-1.5 rounded hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete user from database"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-[var(--text)]">Delete User Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              <p>
                Are you sure you want to permanently delete user{" "}
                <strong className="text-[var(--text)] font-mono">{userToDelete.email}</strong>?
              </p>
              <p className="text-rose-500 font-medium">
                This will completely remove the user record and clear their email from the database, allowing fresh registration.
              </p>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="flex-1 h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete From DB
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

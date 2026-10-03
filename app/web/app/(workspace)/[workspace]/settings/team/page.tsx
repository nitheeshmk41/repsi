"use client";

import { useState, use } from "react";
import {
  Users,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
  UserCheck,
  Building2,
  KeyRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Owner" | "Gym Manager" | "Front Desk" | "Trainer";
  status: "Active" | "Pending";
  joinedDate: string;
}

export default function TeamSettingsPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Gym Owner",
      email: "owner@repsi.app",
      phone: "+91 98765 43210",
      role: "Owner",
      status: "Active",
      joinedDate: "Workspace Creator",
    },
    {
      id: "2",
      name: "Vikram Rathore",
      email: "vikram@repsi.app",
      phone: "+91 98765 12345",
      role: "Trainer",
      status: "Active",
      joinedDate: "Oct 2026",
    },
    {
      id: "3",
      name: "Ananya Roy",
      email: "ananya@repsi.app",
      phone: "+91 98765 99887",
      role: "Front Desk",
      status: "Active",
      joinedDate: "Sep 2026",
    },
  ]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Front Desk" as TeamMember["role"],
  });

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const created: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "+91 98765 00000",
      role: newMember.role,
      status: "Pending",
      joinedDate: "Just invited",
    };

    setTeam([...team, created]);
    setInviteModalOpen(false);
    setNewMember({ name: "", email: "", phone: "", role: "Front Desk" });
  };

  const handleRemove = (id: string) => {
    if (!confirm("Are you sure you want to remove this team member from the workspace?")) return;
    setTeam(team.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ROLE & PERMISSIONS
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">Team & Staff Roles</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage your gym managers, front-desk staff, trainers, and role-based permissions.
          </p>
        </div>

        <Button
          onClick={() => setInviteModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
        >
          <Plus className="w-4 h-4" /> Invite Team Member
        </Button>
      </div>

      {/* Role Matrix Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Owner</span>
          <p className="text-sm font-bold text-[var(--text)]">Full Access</p>
          <p className="text-[11px] text-[var(--text-muted)]">Billing, Website, SuperAdmin & Team Settings</p>
        </div>
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Gym Manager</span>
          <p className="text-sm font-bold text-[var(--text)]">Operations Access</p>
          <p className="text-[11px] text-[var(--text-muted)]">Members, CRM, Attendance & Reports</p>
        </div>
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Front Desk</span>
          <p className="text-sm font-bold text-[var(--text)]">Check-in Access</p>
          <p className="text-[11px] text-[var(--text-muted)]">QR Scan, Member Lookups & Registrations</p>
        </div>
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Trainer</span>
          <p className="text-sm font-bold text-[var(--text)]">Coach Portal</p>
          <p className="text-[11px] text-[var(--text-muted)]">Assigned Clients, Workouts & Chat</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[var(--text)]">Active Workspace Team ({team.length})</h3>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {team.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--background)]/50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[var(--text)]">{member.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.role === "Owner"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          : member.role === "Trainer"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {member.email} • {member.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)] hidden sm:inline">{member.joinedDate}</span>
                {member.role !== "Owner" && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInviteModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[var(--text)]">Invite Team Member</h3>

            <form onSubmit={handleAddTeamMember} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@repsi.app"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text)] block mb-1">Assign Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] focus:outline-none"
                >
                  <option value="Front Desk">Front Desk</option>
                  <option value="Gym Manager">Gym Manager</option>
                  <option value="Trainer">Trainer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

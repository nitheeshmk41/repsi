"use client";

import { useState, useEffect , use } from "react";
import { Search, UserCheck, Calendar, Phone, Mail, Dumbbell, Activity } from "lucide-react";
import { repsiApi, ApiMember } from "@/lib/api";

export default function TrainerMembersPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<ApiMember | null>(null);

  useEffect(() => {
    async function loadMembers() {
      const data = await repsiApi.getMembers();
      setMembers(data);
      if (data.length > 0) setSelectedMember(data[0]);
    }
    loadMembers();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">My Assigned Members</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          View member fitness info, contact details, and attendance tracking. Sensitive billing details are protected.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-1 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className={`w-full text-left py-3 px-2 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]" : "hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{m.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{m.plan} Plan</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                    {m.status.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Column */}
        {selectedMember && (
          <div className="lg:col-span-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xl flex items-center justify-center">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)]">{selectedMember.name}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Joined {selectedMember.joinedDate}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
                {selectedMember.status}
              </span>
            </div>

            {/* Contact & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                  <Phone className="h-4 w-4 text-[var(--text-muted)]" />
                  <span>Phone Number</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono">{selectedMember.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                  <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  <span>Email Address</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{selectedMember.email}</p>
              </div>
            </div>

            {/* Fitness Vitals Tracking */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Fitness Vitals & Measurements</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">Body Weight</span>
                  <p className="text-lg font-bold text-[var(--text)]">74.5 kg</p>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">Height</span>
                  <p className="text-lg font-bold text-[var(--text)]">178 cm</p>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">Target BMI</span>
                  <p className="text-lg font-bold text-emerald-600">23.5</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

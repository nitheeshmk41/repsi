"use client";

import { useState, useEffect } from "react";
import { UserCheck, Users, Clock, TrendingUp, Search, Plus, CheckCircle2, LogOut, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { repsiApi, ApiAttendance, ApiMember } from "@/lib/api";

export function AttendanceClient() {
  const [checkIns, setCheckIns] = useState<ApiAttendance[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [searchMember, setSearchMember] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");

  useEffect(() => {
    repsiApi.getTodayAttendance().then(setCheckIns);
    repsiApi.getMembers().then(setMembers);

    const handleUpdate = () => {
      repsiApi.getTodayAttendance().then(setCheckIns);
    };
    window.addEventListener("repsi_storage_update", handleUpdate);
    return () => window.removeEventListener("repsi_storage_update", handleUpdate);
  }, []);

  const currentlyInsideCount = checkIns.filter((c) => c.status === "in").length;
  const todayTotalCount = checkIns.length > 0 ? 186 + checkIns.length - 3 : 186;

  const handleCheckIn = async (member: ApiMember) => {
    await repsiApi.checkInMember(member.id, member.name);
    const updated = await repsiApi.getTodayAttendance();
    setCheckIns(updated);
    setModalOpen(false);
    setSearchMember("");
  };

  const handleCheckOut = async (attendanceId: string) => {
    await repsiApi.checkOutMember(attendanceId);
    const updated = await repsiApi.getTodayAttendance();
    setCheckIns(updated);
  };

  const filteredCheckIns = checkIns.filter((c) => {
    if (filter === "in") return c.status === "in";
    if (filter === "out") return c.status === "out";
    return true;
  });

  const matchingMembers = members.filter((m) =>
    searchMember ? m.name.toLowerCase().includes(searchMember.toLowerCase()) || m.phone.includes(searchMember) : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Turnstile Attendance</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time biometric & QR check-ins synced to PostgreSQL database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setModalOpen(true)} className="bg-[var(--accent)] text-black hover:brightness-110 font-bold">
            <Plus className="h-4 w-4 mr-1" />
            Check In Member
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Today&apos;s Check-ins</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <UserCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{todayTotalCount}</p>
          <p className="text-[11px] text-emerald-500 font-medium mt-1">+14.1% vs yesterday</p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Currently on Floor</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{currentlyInsideCount}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Live active headcount</p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Peak Gym Hour</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">06:00 – 08:30 AM</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Morning rush</p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Capacity Utilization</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">74.5%</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Optimal floor load</p>
        </div>
      </div>

      {/* Check In Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg">
                <QrCode className="w-5 h-5 text-[var(--accent)]" />
                <span>Check In Member</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search member name or phone (e.g. Arun)..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl">
              {matchingMembers.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">No members found</div>
              ) : (
                matchingMembers.map((m) => (
                  <div key={m.id} className="p-3 flex items-center justify-between hover:bg-[var(--surface-hover)]">
                    <div>
                      <div className="font-semibold text-sm text-[var(--text)]">{m.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {m.phone} · <span className="text-[var(--accent)] font-medium">{m.plan}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCheckIn(m)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] text-xs font-semibold"
                    >
                      [ Check In ]
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Check-ins Table */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">Today&apos;s Live Turnstile Stream</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Verified entries and departures recorded at the facility door.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] text-xs">
            {(["all", "in", "out"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === mode
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {mode === "in" ? "Currently Inside" : mode === "out" ? "Checked Out" : "All Entries"}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
          {filteredCheckIns.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)]/40 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    In at {item.checkInTime}
                    {item.checkOutTime ? ` · Out at ${item.checkOutTime}` : " · On gym floor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === "in" ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Inside
                    </span>
                    <button
                      onClick={() => handleCheckOut(item.id)}
                      className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Check Out</span>
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                    Checked Out
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { Users, CalendarCheck, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function TrainerClassesPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mark Attendance State
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [attStatus, setAttStatus] = useState("attended");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [cList, mList] = await Promise.all([
          repsiApi.getClasses(),
          repsiApi.getMembers(),
        ]);
        setClasses(cList);
        setMembers(mList);
        if (cList.length > 0) {
          setSelectedClass(cList[0]);
          fetchParticipants(cList[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchParticipants = async (classId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/classes/${classId}/participants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("repsi_auth_token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setParticipants(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectClass = (cls: any) => {
    setSelectedClass(cls);
    fetchParticipants(cls.id);
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedMemberId) return;
    setMarking(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/classes/${selectedClass.id}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("repsi_auth_token")}`,
        },
        body: JSON.stringify({
          member_id: selectedMemberId,
          status: attStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to mark attendance");
      }

      setSelectedMemberId("");
      fetchParticipants(selectedClass.id);
      alert("Attendance marked successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
              STUDIO CLASSES & ATTENDANCE
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">Assigned Classes</h1>
          <p className="text-xs text-[var(--text-muted)]">
            View participants enrolled in your group classes and record session attendance.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : classes.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-2">
          <Users className="h-10 w-10 mx-auto text-[var(--text-muted)]" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Studio Classes Assigned</h3>
          <p>No active group fitness classes are assigned to your schedule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[var(--text)]">Your Group Classes</h2>
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => handleSelectClass(cls)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedClass?.id === cls.id
                    ? "border-[var(--primary)] bg-[var(--surface)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text)]">{cls.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600">
                    {cls.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">{cls.schedule} • {cls.room}</p>
                <p className="text-[11px] font-medium text-emerald-600 mt-2">Max Capacity: {cls.capacity}</p>
              </div>
            ))}
          </div>

          {/* Participants & Mark Attendance */}
          <div className="lg:col-span-2 space-y-6">
            {selectedClass && (
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text)]">{selectedClass.name} — Participants</h2>
                  <p className="text-xs text-[var(--text-muted)]">{selectedClass.schedule} • {selectedClass.room}</p>
                </div>

                {/* Mark Attendance Form */}
                <form onSubmit={handleMarkAttendance} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Mark Participant Attendance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">Select Member</label>
                      <select
                        value={selectedMemberId}
                        onChange={(e) => setSelectedMemberId(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                        required
                      >
                        <option value="">-- Choose Member --</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.phone})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--text)]">Status</label>
                      <select
                        value={attStatus}
                        onChange={(e) => setAttStatus(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                      >
                        <option value="attended">Attended (Present)</option>
                        <option value="late">Late</option>
                        <option value="no_show">No Show (Absent)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={marking || !selectedMemberId} className="bg-purple-600 text-white hover:bg-purple-700 text-xs">
                      {marking ? "Recording..." : "Record Attendance"}
                    </Button>
                  </div>
                </form>

                {/* Enrolled Log */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Class Attendance Roster</h3>
                  {participants.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)]">No attendance records logged for this session yet.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {participants.map((p) => (
                        <div key={p.attendance_id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-[var(--text)]">{p.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{p.phone} • {new Date(p.check_in_time).toLocaleTimeString()}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

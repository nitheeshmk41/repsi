"use client";

import { useState, useEffect, use } from "react";
import { Calendar, Clock, Plus, Users, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function TrainerSchedulePage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [schedule, setSchedule] = useState<{ sessions: any[]; classes: any[] }>({ sessions: [], classes: [] });
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"Day" | "Week">("Day");

  // Schedule Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("1-on-1 Personal Training");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);
  const [scheduling, setScheduling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, cData] = await Promise.all([
        repsiApi.getCurrentTrainerSchedule(),
        repsiApi.getCurrentTrainerClients(),
      ]);
      setSchedule(sData);
      setClients(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !scheduledAt) return;
    setScheduling(true);
    try {
      await repsiApi.createTrainerSession({
        title,
        client_id: selectedClientId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: Number(duration),
      });
      setModalOpen(false);
      setSelectedClientId("");
      setScheduledAt("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to schedule session");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              TRAINER CALENDAR & SCHEDULE
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">Schedule</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage your personal training client sessions and group studio classes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setViewMode("Day")}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewMode === "Day" ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)]"
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode("Week")}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                viewMode === "Week" ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)]"
              }`}
            >
              Week View
            </button>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 bg-[var(--primary)] text-white text-xs">
            <Plus className="h-3.5 w-3.5" />
            + Schedule Session
          </Button>
        </div>
      </div>

      {/* Schedule Items */}
      {loading ? (
        <div className="py-12 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : schedule.sessions.length === 0 && schedule.classes.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-2">
          <Calendar className="h-10 w-10 mx-auto text-[var(--text-muted)]" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Sessions Scheduled</h3>
          <p>Click '+ Schedule Session' to add personal training client sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--text)]">Personal Training Sessions</h2>
          <div className="space-y-3">
            {schedule.sessions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] mt-0.5">{new Date(s.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)]">{s.client_name || s.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{s.title} • {s.duration_minutes} mins • {new Date(s.scheduled_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-bold text-[var(--text)] pt-4">Assigned Studio Classes</h2>
          <div className="space-y-3">
            {schedule.classes.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text)]">{c.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{c.schedule} • {c.capacity} Participants Max • {c.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Schedule Personal Session</h3>
            <form onSubmit={handleScheduleSession} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Session Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Select Client</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                >
                  <option value="">-- Choose Assigned Client --</option>
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={scheduling || !selectedClientId}>
                  {scheduling ? "Scheduling..." : "Schedule Session"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

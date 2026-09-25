"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  Dumbbell,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Calendar,
  Loader2,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth";
import { repsiApi } from "@/lib/api";

export default function TrainerDashboardPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<{ sessions: any[]; classes: any[] }>({ sessions: [], classes: [] });
  const [loading, setLoading] = useState(true);

  // Quick Action Modal states
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [sessionTitle, setSessionTitle] = useState("1-on-1 Personal Training");
  const [sessionTime, setSessionTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteClientId, setNoteClientId] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      setUser(getAuthUser());
      const [profData, clientsData, scheduleData] = await Promise.all([
        repsiApi.getCurrentTrainerProfile().catch(() => null),
        repsiApi.getCurrentTrainerClients().catch(() => []),
        repsiApi.getCurrentTrainerSchedule().catch(() => ({ sessions: [], classes: [] })),
      ]);
      setProfile(profData);
      setClients(clientsData);
      setSchedule(scheduleData);
    } catch (err) {
      console.error("Error loading trainer dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !sessionTime) return;
    setScheduling(true);
    try {
      await repsiApi.createTrainerSession({
        title: sessionTitle,
        client_id: selectedClientId,
        scheduled_at: new Date(sessionTime).toISOString(),
        duration_minutes: 60,
      });
      setSessionModalOpen(false);
      setSelectedClientId("");
      setSessionTime("");
      loadDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to schedule session");
    } finally {
      setScheduling(false);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteClientId || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      await repsiApi.createClientNote(noteClientId, noteContent);
      setNoteModalOpen(false);
      setNoteClientId("");
      setNoteContent("");
      alert("Client note saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              TRAINER OPERATIONS
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">
            Good morning, {profile?.name || user?.name || "Alex"} 👋
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Here is your training schedule, client activity, and operations for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${workspace}/trainer/workouts`}>
            <Button size="sm" className="gap-1.5 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-xs">
              <Dumbbell className="h-3.5 w-3.5" />
              + Assign Workout
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSessionModalOpen(true)}
            className="gap-1.5 text-xs border-[var(--border)]"
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
            + Schedule Session
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setNoteModalOpen(true)}
            className="gap-1.5 text-xs border-[var(--border)]"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            + Add Client Note
          </Button>
        </div>
      </div>

      {/* Today's Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Assigned Clients</p>
            <h3 className="text-2xl font-bold text-[var(--text)] mt-1">{clients.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Today's Sessions</p>
            <h3 className="text-2xl font-bold text-[var(--text)] mt-1">{schedule.sessions.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Active Group Classes</p>
            <h3 className="text-2xl font-bold text-[var(--text)] mt-1">{schedule.classes.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Operational Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--text)]">Today's Schedule</h2>
                <p className="text-xs text-[var(--text-muted)]">Your personal sessions & group classes</p>
              </div>
              <Link href={`/${workspace}/trainer/schedule`} className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
                View Full Calendar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-[var(--text-muted)]">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : schedule.sessions.length === 0 && schedule.classes.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-2 border border-dashed border-[var(--border)] rounded-lg">
                <Clock className="h-8 w-8 mx-auto text-[var(--text-muted)]" />
                <p className="font-semibold text-[var(--text)]">No Sessions Today</p>
                <p>Your schedule is clear today. Schedule a session or assign a workout plan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.sessions.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex flex-col items-center justify-center text-xs font-bold shrink-0">
                        <span>{new Date(s.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text)]">{s.client_name || s.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{s.title} • {s.duration_minutes} mins</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {s.status}
                    </span>
                  </div>
                ))}

                {schedule.classes.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex flex-col items-center justify-center text-xs font-bold shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text)]">{c.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{c.schedule} • {c.capacity} Max Participants</p>
                      </div>
                    </div>
                    <Link href={`/${workspace}/trainer/classes`}>
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        Mark Attendance
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Client Activity Stream */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
            <h2 className="text-base font-bold text-[var(--text)]">Recent Client Activity</h2>
            <div className="space-y-3">
              {clients.slice(0, 4).map((c) => (
                <div key={c.client_id} className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-[var(--text)]">{c.name}</span>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {c.last_workout ? `Completed routine: ${c.last_workout.title}` : "Active member guidance"}
                      </p>
                    </div>
                  </div>
                  <Link href={`/${workspace}/trainer/clients/${c.client_id}`} className="text-xs font-semibold text-[var(--primary)] hover:underline">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel: Quick Actions & Privacy Banner */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)]">Assigned Clients Shortcut</h3>
            <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto">
              {clients.map((c) => (
                <div key={c.client_id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{c.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{c.phone}</p>
                  </div>
                  <Link
                    href={`/${workspace}/trainer/clients/${c.client_id}`}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Activity className="h-4 w-4" />
              <span>Trainer Operations Scoped</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Your view focuses strictly on your assigned clients, routines, and training sessions. Financial revenue and administrative settings remain protected.
            </p>
          </div>
        </div>
      </div>

      {/* Modal 1: Schedule Session Modal */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Schedule Personal Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Session Title</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
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
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setSessionModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={scheduling || !selectedClientId} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  {scheduling ? "Scheduling..." : "Schedule Session"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Client Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Add Private Client Note</h3>
            <form onSubmit={handleSaveNote} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Select Client</label>
                <select
                  value={noteClientId}
                  onChange={(e) => setNoteClientId(e.target.value)}
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
                <label className="text-xs font-semibold text-[var(--text)]">Private Note Content</label>
                <textarea
                  placeholder="e.g. Client reported shoulder discomfort during overhead press..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setNoteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savingNote || !noteClientId || !noteContent.trim()}>
                  {savingNote ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

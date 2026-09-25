"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  User,
  Dumbbell,
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { repsiApi } from "@/lib/api";

export default function TrainerClientDetailPage(props: {
  params: Promise<{ workspace: string; id: string }>;
}) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const clientId = params.id;

  const [client, setClient] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "workouts" | "progress" | "attendance" | "notes" | "sessions"
  >("overview");

  // New Note state
  const [newNoteContent, setNewNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // New Workout state
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutDiff, setWorkoutDiff] = useState("Intermediate");
  const [workoutMuscle, setWorkoutMuscle] = useState("Full Body");
  const [workoutExercises, setWorkoutExercises] = useState(
    JSON.stringify([
      { name: "Bench Press", sets: 4, reps: 10, weight: 60, rest: 90 },
      { name: "Shoulder Press", sets: 3, reps: 12, weight: 20, rest: 60 },
      { name: "Cable Fly", sets: 3, reps: 15, weight: 15, rest: 45 },
    ], null, 2)
  );
  const [creatingWorkout, setCreatingWorkout] = useState(false);

  // New Session state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("1-on-1 Personal Training");
  const [sessionTime, setSessionTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const loadClientDetails = async () => {
    setLoading(true);
    try {
      const [allClients, wList, sList, nList] = await Promise.all([
        repsiApi.getCurrentTrainerClients(),
        repsiApi.getClientWorkouts(clientId),
        repsiApi.getTrainerSessions(clientId),
        repsiApi.getClientNotes(clientId),
      ]);
      const found = allClients.find((c: any) => c.client_id === clientId);
      setClient(found || {
        client_id: clientId,
        name: "Client",
        phone: "+91 98450 00000",
        email: "client@example.com",
        membership_status: "active",
      });
      setWorkouts(wList);
      setSessions(sList);
      setNotes(nList);
    } catch (err) {
      console.error("Failed to load client details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setSavingNote(true);
    try {
      const created = await repsiApi.createClientNote(clientId, newNoteContent);
      setNotes([created, ...notes]);
      setNewNoteContent("");
    } catch (err: any) {
      alert(err.message || "Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle.trim()) return;
    setCreatingWorkout(true);
    try {
      const created = await repsiApi.createClientWorkout(clientId, {
        title: workoutTitle,
        difficulty: workoutDiff,
        target_muscle_groups: workoutMuscle,
        exercises_json: workoutExercises,
        status: "ACTIVE",
      });
      setWorkouts([created, ...workouts]);
      setWorkoutModalOpen(false);
      setWorkoutTitle("");
    } catch (err: any) {
      alert(err.message || "Failed to assign workout");
    } finally {
      setCreatingWorkout(false);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTime) return;
    setScheduling(true);
    try {
      const created = await repsiApi.createTrainerSession({
        title: sessionTitle,
        client_id: clientId,
        scheduled_at: new Date(sessionTime).toISOString(),
        duration_minutes: 60,
      });
      setSessions([created, ...sessions]);
      setSessionModalOpen(false);
      setSessionTime("");
    } catch (err: any) {
      alert(err.message || "Failed to schedule session");
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        <p className="text-xs">Loading client profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link href={`/${workspace}/trainer/clients`} className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
        <ChevronLeft className="h-4 w-4" /> Back to My Clients
      </Link>

      {/* Client Header Card */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-[var(--primary)]">
            <AvatarFallback className="font-bold text-lg bg-emerald-500/10 text-emerald-600">
              {client?.name ? client.name.charAt(0) : "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">{client?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {(client?.membership_status || "ACTIVE").toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {client?.email} • {client?.phone}
            </p>
            <p className="text-xs font-medium text-[var(--primary)] mt-0.5">
              Goal Track: Weight Loss & Muscle Definition
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${workspace}/chat`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs border-[var(--border)]">
              <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
              Message
            </Button>
          </Link>
          <Button size="sm" onClick={() => setWorkoutModalOpen(true)} className="gap-1.5 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-xs">
            <Dumbbell className="h-3.5 w-3.5" />
            + Assign Workout
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSessionModalOpen(true)} className="gap-1.5 text-xs border-[var(--border)]">
            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
            + Schedule Session
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-2">
        {(["overview", "workouts", "progress", "attendance", "notes", "sessions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab
                ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--text-muted)] font-medium">Weight</p>
                <h4 className="text-xl font-bold text-[var(--text)] mt-1">72 kg</h4>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">↓ 2kg this month</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--text-muted)] font-medium">Height</p>
                <h4 className="text-xl font-bold text-[var(--text)] mt-1">175 cm</h4>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--text-muted)] font-medium">BMI</p>
                <h4 className="text-xl font-bold text-[var(--text)] mt-1">23.5</h4>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">Normal Range</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--text-muted)] font-medium">Workout Streak</p>
                <h4 className="text-xl font-bold text-[var(--text)] mt-1">12 Days 🔥</h4>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <h3 className="font-bold text-base text-[var(--text)]">Assigned Workout Routines</h3>
              {workouts.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No workouts assigned yet. Click '+ Assign Workout'.</p>
              ) : (
                <div className="space-y-3">
                  {workouts.map((w) => (
                    <div key={w.id} className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--text)]">{w.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{w.difficulty} • {w.target_muscle_groups || "Full Body"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h3 className="font-bold text-sm text-[var(--text)]">Upcoming Sessions</h3>
              {sessions.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No sessions scheduled.</p>
              ) : (
                sessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs">
                    <p className="font-semibold text-[var(--text)]">{s.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{new Date(s.scheduled_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: WORKOUTS */}
      {activeTab === "workouts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text)]">Client Workout Routines</h2>
            <Button size="sm" onClick={() => setWorkoutModalOpen(true)} className="gap-1.5 bg-[var(--primary)] text-white text-xs">
              <Plus className="h-3.5 w-3.5" />
              Create Workout
            </Button>
          </div>

          {workouts.length === 0 ? (
            <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)]">
              No workouts assigned to this client yet.
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((w) => (
                <div key={w.id} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)]">{w.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{w.difficulty} • {w.target_muscle_groups}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {w.status}
                    </span>
                  </div>

                  {w.exercises_json && (
                    <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)] font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
                      <pre>{w.exercises_json}</pre>
                    </div>
                  )}

                  {w.trainer_feedback && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
                      <strong>Trainer Feedback:</strong> {w.trainer_feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: PROGRESS */}
      {activeTab === "progress" && (
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
          <h2 className="text-lg font-bold text-[var(--text)]">Client Strength & Body Metrics Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
              <h3 className="font-semibold text-sm text-[var(--text)]">Weight Progression Chart</h3>
              <div className="h-32 flex items-center justify-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded">
                72kg ───╲ 71kg ───╲ 70kg (Target: 68kg)
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
              <h3 className="font-semibold text-sm text-[var(--text)]">Bench Press Personal Record</h3>
              <div className="h-32 flex items-center justify-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded">
                60kg (Jan) ───↗ 75kg (Feb) ───↗ 85kg (Current PR)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <h2 className="text-lg font-bold text-[var(--text)]">Gym Attendance Log</h2>
          <div className="divide-y divide-[var(--border)]">
            <div className="py-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text)]">Today, 09:15 AM</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">PRESENT (QR)</span>
            </div>
            <div className="py-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text)]">Yesterday, 08:30 AM</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">PRESENT (Biometric)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: NOTES */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <h3 className="font-bold text-sm text-[var(--text)]">Add Private Trainer Note</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                placeholder="Write private observation (e.g. Client reported wrist discomfort during overhead press)..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                rows={3}
                required
              />
              <Button type="submit" size="sm" disabled={savingNote || !newNoteContent.trim()}>
                {savingNote ? "Saving..." : "Save Note"}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
                <p className="text-xs text-[var(--text-muted)] font-medium">
                  {new Date(n.created_at).toLocaleString()}
                </p>
                <p className="text-xs text-[var(--text)]">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: SESSIONS */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text)]">Personal Training Sessions</h2>
            <Button size="sm" onClick={() => setSessionModalOpen(true)} className="gap-1.5 bg-[var(--primary)] text-white text-xs">
              <Plus className="h-3.5 w-3.5" />
              Schedule Session
            </Button>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)]">{s.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">{new Date(s.scheduled_at).toLocaleString()}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Workout Modal */}
      {workoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Assign Workout Plan</h3>
            <form onSubmit={handleCreateWorkout} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Workout Title</label>
                <input
                  type="text"
                  placeholder="e.g. Push Day Hypertrophy"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Difficulty</label>
                  <select
                    value={workoutDiff}
                    onChange={(e) => setWorkoutDiff(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Target Muscle Group</label>
                  <input
                    type="text"
                    value={workoutMuscle}
                    onChange={(e) => setWorkoutMuscle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Exercise Routine JSON (Sets, Reps, Weights)</label>
                <textarea
                  value={workoutExercises}
                  onChange={(e) => setWorkoutExercises(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] font-mono"
                  rows={6}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setWorkoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creatingWorkout || !workoutTitle.trim()}>
                  {creatingWorkout ? "Assigning..." : "Assign Workout"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Schedule Session for {client?.name}</h3>
            <form onSubmit={handleScheduleSession} className="space-y-3">
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
                <Button type="submit" disabled={scheduling}>
                  {scheduling ? "Scheduling..." : "Confirm Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

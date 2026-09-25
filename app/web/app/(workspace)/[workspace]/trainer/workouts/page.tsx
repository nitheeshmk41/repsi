"use client";

import { useState, useEffect, use } from "react";
import { Dumbbell, Plus, Search, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function TrainerWorkoutsPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [targetMuscle, setTargetMuscle] = useState("Full Body");
  const [exercisesJson, setExercisesJson] = useState(
    JSON.stringify([
      { name: "Bench Press", sets: 4, reps: 10, weight: 60, rest: 90 },
      { name: "Incline DB Press", sets: 3, reps: 12, weight: 24, rest: 60 },
      { name: "Cable Chest Fly", sets: 3, reps: 15, weight: 15, rest: 45 }
    ], null, 2)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const cList = await repsiApi.getCurrentTrainerClients();
        setClients(cList);
        if (cList.length > 0) {
          setSelectedClientId(cList[0].client_id);
          const wList = await repsiApi.getClientWorkouts(cList[0].client_id);
          setWorkouts(wList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSelectClient = async (cId: string) => {
    setSelectedClientId(cId);
    setLoading(true);
    try {
      const wList = await repsiApi.getClientWorkouts(cId);
      setWorkouts(wList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !title.trim()) return;
    setSaving(true);
    try {
      const created = await repsiApi.createClientWorkout(selectedClientId, {
        title,
        difficulty,
        target_muscle_groups: targetMuscle,
        exercises_json: exercisesJson,
        status: "ACTIVE"
      });
      setWorkouts([created, ...workouts]);
      setModalOpen(false);
      setTitle("");
    } catch (err: any) {
      alert(err.message || "Failed to create workout");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              WORKOUT ROUTINES & TRACKING
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">Workouts Builder</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Create, schedule, and assign custom workout plans to your clients.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)} disabled={!selectedClientId} className="gap-1.5 bg-[var(--primary)] text-white text-xs">
          <Plus className="h-3.5 w-3.5" />
          Create Workout Plan
        </Button>
      </div>

      {/* Select Client Dropdown */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <label className="text-xs font-semibold text-[var(--text)]">Select Target Client</label>
          <p className="text-[11px] text-[var(--text-muted)]">Choose which assigned client's routines you want to view or manage.</p>
        </div>
        <select
          value={selectedClientId}
          onChange={(e) => handleSelectClient(e.target.value)}
          className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none min-w-[240px]"
        >
          {clients.map((c) => (
            <option key={c.client_id} value={c.client_id}>
              {c.name} ({c.phone})
            </option>
          ))}
        </select>
      </div>

      {/* Workouts List */}
      {loading ? (
        <div className="py-12 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : workouts.length === 0 ? (
        <div className="p-8 border border-dashed border-[var(--border)] rounded-xl text-center text-xs text-[var(--text-muted)] space-y-2">
          <Dumbbell className="h-10 w-10 mx-auto text-[var(--text-muted)]" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Workouts Assigned Yet</h3>
          <p>Create a custom routine with exercise sets, reps, and weights for this client.</p>
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Create Workout
          </Button>
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
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Create & Assign Workout Plan</h3>
            <form onSubmit={handleCreateWorkout} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Workout Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chest & Triceps Hypertrophy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
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
                    value={targetMuscle}
                    onChange={(e) => setTargetMuscle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Exercises Config JSON</label>
                <textarea
                  value={exercisesJson}
                  onChange={(e) => setExercisesJson(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] font-mono"
                  rows={6}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || !title.trim()}>
                  {saving ? "Saving..." : "Assign Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

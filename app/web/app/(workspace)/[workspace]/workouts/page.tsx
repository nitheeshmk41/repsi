"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Plus, Sparkles, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function WorkspaceWorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [targetMuscles, setTargetMuscles] = useState("Full Body");
  const [description, setDescription] = useState("");

  const loadWorkouts = async () => {
    setLoading(true);
    const data = await repsiApi.getWorkouts();
    setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      await repsiApi.createWorkout({
        title,
        difficulty,
        target_muscle_groups: targetMuscles,
        description,
      });
      setShowModal(false);
      setTitle("");
      setDescription("");
      loadWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Workout Plans & Templates</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Build exercise routines, program set-and-rep protocols, and assign to members.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          Create Workout Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workouts.map((w) => (
          <div key={w.id} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                  {w.difficulty}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{w.target_muscle_groups || "Full Body"}</span>
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mt-2">{w.title}</h3>
              {w.description && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {w.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Workspace Template
              </span>
              <Button variant="outline" size="sm" className="text-xs h-7">
                View Protocol
              </Button>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && !loading && (
        <div className="rounded-[16px] border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--surface)]/50">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)]">No workout plans created yet</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Design customized training plans, hypertrophy splits, and cardio protocols for your gym members.
          </p>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 mt-2 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            Create First Workout Plan
          </Button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--text)]">Create Workout Plan</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12-Week Push Pull Legs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--text)]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Target Muscles</label>
                  <input
                    type="text"
                    value={targetMuscles}
                    onChange={(e) => setTargetMuscles(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-[8px] border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold cursor-pointer"
                >
                  Save Workout Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

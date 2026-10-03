"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Dumbbell, Plus, Sparkles, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { repsiApi } from "@/lib/api";

export default function WorkspaceWorkoutsPage() {
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [targetMuscles, setTargetMuscles] = useState("Full Body");
  const [description, setDescription] = useState("");

  const [selectedProtocol, setSelectedProtocol] = useState<any | null>(null);

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
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 cursor-pointer"
                onClick={() => setSelectedProtocol(w)}
              >
                View Protocol
              </Button>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && !loading && (
        <EmptyState
          mascotPose="fitness"
          speechBubble="Train Hard. Live Strong!"
          title="No workout protocols yet"
          description="Create your first workout protocol. Design training routines, rep ranges, and splits for your members."
          action={{
            label: "+ Create protocol",
            onClick: () => setShowModal(true),
          }}
          guideTitle="How to create workout routines"
          guideSteps={[
            "Click + Create protocol",
            "Set routine title (e.g. 4-Day Hypertrophy Split)",
            "Choose difficulty and target muscle groups",
            "Assign to individual members or classes",
          ]}
          guideLinkText="View routine guide →"
        />
      )}

      {/* View Protocol Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--primary)] tracking-wider">
                  Exercise Protocol & Routine
                </span>
                <h2 className="text-lg font-bold text-[var(--text)]">{selectedProtocol.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProtocol(null)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
              <div>
                <span className="text-[var(--text-muted)] block">Difficulty Tier:</span>
                <span className="font-semibold text-[var(--text)]">{selectedProtocol.difficulty}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Target Muscle Group:</span>
                <span className="font-semibold text-[var(--text)]">{selectedProtocol.target_muscle_groups || "Full Body"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                Programming Structure & Volume
              </h4>
              <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1">
                  <div className="flex justify-between font-semibold text-[var(--text)]">
                    <span>Compound Movement (Primary)</span>
                    <span>4 Sets × 6–8 Reps</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Rest: 120s · RPE 8.5 · Focus on explosive concentric, 3s eccentric</p>
                </div>

                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1">
                  <div className="flex justify-between font-semibold text-[var(--text)]">
                    <span>Accessory Hypertrophy</span>
                    <span>3 Sets × 10–12 Reps</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Rest: 90s · RPE 8 · Squeeze at peak contraction</p>
                </div>

                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1">
                  <div className="flex justify-between font-semibold text-[var(--text)]">
                    <span>Isolation & Burnout</span>
                    <span>3 Sets × 12–15 Reps</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Rest: 60s · RPE 9 · Complete metabolic pump finisher</p>
                </div>
              </div>
            </div>

            {selectedProtocol.description && (
              <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider">Coaching Notes:</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{selectedProtocol.description}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <Button size="sm" onClick={() => setSelectedProtocol(null)} className="cursor-pointer">
                Close Protocol
              </Button>
            </div>
          </div>
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

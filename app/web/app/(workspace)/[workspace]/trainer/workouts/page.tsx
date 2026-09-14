"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Plus, Trash2, Save, CheckCircle2, User, Sparkles } from "lucide-react";
import { repsiApi, ApiMember } from "@/lib/api";

interface ExerciseItem {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export default function TrainerWorkoutsPage({ params }: { params: { workspace: string } }) {
  const workspace = params.workspace || "apex-fitness";
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [planTitle, setPlanTitle] = useState("Hypertrophy & Strength Program");
  const [notes, setNotes] = useState("Focus on form, controlled eccentric motion, and 2-minute rest between heavy compound lifts.");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [exercises, setExercises] = useState<ExerciseItem[]>([
    { name: "Barbell Bench Press", sets: 4, reps: "8-10 reps", rest: "90 sec" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12 reps", rest: "60 sec" },
    { name: "Lat Pulldowns", sets: 4, reps: "10-12 reps", rest: "60 sec" },
    { name: "Barbell Squats", sets: 4, reps: "6-8 reps", rest: "120 sec" },
  ]);

  useEffect(() => {
    async function loadMembers() {
      const data = await repsiApi.getMembers();
      setMembers(data);
      if (data.length > 0) setSelectedMemberId(data[0].id);
    }
    loadMembers();
  }, []);

  const addExercise = () => {
    setExercises([...exercises, { name: "New Exercise", sets: 3, reps: "10-12 reps", rest: "60 sec" }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseItem, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Workout Plan Builder</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Design and assign customized training routines to your members.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>Save & Assign Routine</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Workout plan assigned successfully to member!</span>
        </div>
      )}

      {/* Routine Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Target Member</h2>
            <div>
              <label className="block text-xs font-medium text-[var(--text)] mb-1">Select Member</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.plan})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text)] mb-1">Routine Title</label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text)] mb-1">Trainer Instructions / Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
                <h2 className="text-sm font-bold text-[var(--text)]">Exercise Breakdown ({exercises.length})</h2>
              </div>

              <button
                onClick={addExercise}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-[10px] border border-[var(--border)] bg-[var(--background)] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-muted)]">#{idx + 1}</span>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(idx, "name", e.target.value)}
                      placeholder="Exercise Name"
                      className="flex-1 h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-semibold text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    />
                    <button
                      onClick={() => removeExercise(idx)}
                      className="text-rose-500 hover:text-rose-600 p-1 transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1">Sets</label>
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(idx, "sets", parseInt(e.target.value) || 1)}
                        className="w-full h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1">Target Reps</label>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(idx, "reps", e.target.value)}
                        className="w-full h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1">Rest Interval</label>
                      <input
                        type="text"
                        value={ex.rest}
                        onChange={(e) => handleExerciseChange(idx, "rest", e.target.value)}
                        className="w-full h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

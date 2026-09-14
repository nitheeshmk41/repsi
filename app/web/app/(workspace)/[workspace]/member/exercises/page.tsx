"use client";

import { useState , use } from "react";
import { Dumbbell, Search, Filter, Play, Info, Sparkles } from "lucide-react";

interface ExerciseDef {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string;
  recommended: string;
}

const exerciseDatabase: ExerciseDef[] = [
  {
    id: "ex-001",
    name: "Barbell Bench Press",
    muscle: "Chest",
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    instructions: "Lie flat on the bench with your eyes under the bar. Unrack with arms extended, lower to mid-chest with elbows at 45 degrees, and drive upwards explosively.",
    recommended: "3-4 Sets • 8-12 Reps",
  },
  {
    id: "ex-002",
    name: "Barbell Back Squat",
    muscle: "Legs",
    equipment: "Barbell & Squat Rack",
    difficulty: "Advanced",
    instructions: "Rest bar across upper trapezius. Stand with feet shoulder-width apart, break at hips and knees simultaneously to lower until thighs are parallel to ground.",
    recommended: "4 Sets • 6-10 Reps",
  },
  {
    id: "ex-003",
    name: "Lat Pulldown (Wide Grip)",
    muscle: "Back",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    instructions: "Grasp bar wider than shoulder-width. Lean back slightly, pull bar down toward upper chest while driving elbows down and back.",
    recommended: "3 Sets • 10-12 Reps",
  },
  {
    id: "ex-004",
    name: "Overhead Dumbbell Press",
    muscle: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    instructions: "Sit erect on bench with back support. Hold dumbbells at shoulder height, press overhead until arms are extended, lower under control.",
    recommended: "3-4 Sets • 8-10 Reps",
  },
  {
    id: "ex-005",
    name: "Incline Dumbbell Curl",
    muscle: "Arms",
    equipment: "Dumbbells & Bench",
    difficulty: "Beginner",
    instructions: "Sit on 45-degree incline bench. Allow arms to hang fully extended, curl weight upward while maintaining elbows fixed at sides.",
    recommended: "3 Sets • 12-15 Reps",
  },
  {
    id: "ex-006",
    name: "Hanging Leg Raise",
    muscle: "Core",
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
    instructions: "Hang from bar with overhand grip. Engage abs to raise knees or straight legs up toward chest level without swinging momentum.",
    recommended: "3 Sets • 15-20 Reps",
  },
];

export default function ExerciseLibraryPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDef | null>(null);

  const muscles = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  const filtered = exerciseDatabase.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || ex.muscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || ex.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Exercise Library</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Browse comprehensive exercise movement guides, execution tips, and target muscles.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search exercise by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {muscles.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-colors ${
                selectedMuscle === m
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-xs hover:border-[var(--primary)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {ex.muscle}
                </span>
                <span className="text-[10px] font-semibold text-[var(--text-muted)]">{ex.difficulty}</span>
              </div>

              <h3 className="text-base font-bold text-[var(--text)]">{ex.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">Equipment: {ex.equipment}</p>
              <p className="text-xs text-[var(--text-muted)] line-clamp-3 italic">"{ex.instructions}"</p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600">{ex.recommended}</span>
              <button
                onClick={() => setSelectedExercise(ex)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary-dark)] dark:text-[var(--primary-hover)] hover:underline"
              >
                <span>View Steps</span>
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-base font-bold text-[var(--text)]">{selectedExercise.name}</h2>
              <button onClick={() => setSelectedExercise(null)} className="text-xs font-bold text-[var(--text-muted)]">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-muted)]">
              <p><strong className="text-[var(--text)]">Target Muscle:</strong> {selectedExercise.muscle}</p>
              <p><strong className="text-[var(--text)]">Required Equipment:</strong> {selectedExercise.equipment}</p>
              <p><strong className="text-[var(--text)]">Execution Guide:</strong> {selectedExercise.instructions}</p>
              <p><strong className="text-[var(--text)]">Recommended Protocol:</strong> {selectedExercise.recommended}</p>
            </div>

            <button
              onClick={() => setSelectedExercise(null)}
              className="w-full py-2 rounded-[8px] bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

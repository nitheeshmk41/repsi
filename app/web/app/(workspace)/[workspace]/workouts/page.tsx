import type { Metadata } from "next";
import { Dumbbell, Plus, Sparkles, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Workouts",
  description: "Workout plan templates, exercise library, and training programs.",
};

const workoutTemplates = [
  {
    id: "wp_1",
    title: "Push-Pull-Legs Hypertrophy",
    split: "6-Day Split",
    difficulty: "Advanced",
    exercisesCount: 24,
    activeMembers: 142,
  },
  {
    id: "wp_2",
    title: "Starting Strength 5x5",
    split: "3-Day Full Body",
    difficulty: "Beginner",
    exercisesCount: 8,
    activeMembers: 98,
  },
  {
    id: "wp_3",
    title: "Metabolic Conditioning & Fat Loss",
    split: "4-Day Circuit",
    difficulty: "Intermediate",
    exercisesCount: 16,
    activeMembers: 84,
  },
  {
    id: "wp_4",
    title: "Joint Mobility & Functional Posture",
    split: "Daily 20-min",
    difficulty: "All Levels",
    exercisesCount: 12,
    activeMembers: 65,
  },
];

export default function WorkspaceWorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Workout Plans & Templates</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Build exercise routines, program set-and-rep protocols, and assign to members.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Create Workout Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workoutTemplates.map((w) => (
          <div key={w.id} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                  {w.difficulty}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{w.split}</span>
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mt-2">{w.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {w.exercisesCount} total exercises programmed across cycles
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                {w.activeMembers} Members Enrolled
              </span>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                View Protocol
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

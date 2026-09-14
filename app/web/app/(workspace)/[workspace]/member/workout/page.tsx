"use client";

import { useState, useEffect } from "react";
import { 
  Dumbbell, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Plus, 
  Award, 
  ChevronRight, 
  Sparkles,
  Timer as TimerIcon
} from "lucide-react";

interface SetItem {
  setNum: number;
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
}

interface ExerciseTracker {
  id: string;
  name: string;
  muscle: string;
  sets: SetItem[];
}

export default function MemberWorkoutSessionPage({ params }: { params: { workspace: string } }) {
  const workspace = params.workspace || "apex-fitness";

  // Workout Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest Timer Modal State
  const [restActive, setRestActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);

  // Exercises State
  const [exercises, setExercises] = useState<ExerciseTracker[]>([
    {
      id: "ex-1",
      name: "Barbell Bench Press",
      muscle: "Chest / Triceps",
      sets: [
        { setNum: 1, weight: 60, reps: 12, completed: true },
        { setNum: 2, weight: 70, reps: 10, completed: true },
        { setNum: 3, weight: 80, reps: 8, completed: false, isPR: true },
      ],
    },
    {
      id: "ex-2",
      name: "Incline Dumbbell Press",
      muscle: "Upper Chest",
      sets: [
        { setNum: 1, weight: 24, reps: 12, completed: false },
        { setNum: 2, weight: 26, reps: 10, completed: false },
        { setNum: 3, weight: 28, reps: 8, completed: false },
      ],
    },
    {
      id: "ex-3",
      name: "Lat Pulldowns",
      muscle: "Back & Lats",
      sets: [
        { setNum: 1, weight: 55, reps: 12, completed: false },
        { setNum: 2, weight: 65, reps: 10, completed: false },
      ],
    },
  ]);

  // Session Duration Timer
  useEffect(() => {
    let timer: any;
    if (sessionActive && !sessionPaused) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionActive, sessionPaused]);

  // Rest Timer Countdown
  useEffect(() => {
    let restTimer: any;
    if (restActive && restSeconds > 0) {
      restTimer = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      setRestActive(false);
    }
    return () => clearInterval(restTimer);
  }, [restActive, restSeconds]);

  const toggleSetComplete = (exIdx: number, setIdx: number) => {
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    targetSet.completed = !targetSet.completed;
    setExercises(updated);

    // Trigger Rest Timer when completing a set
    if (targetSet.completed) {
      setRestSeconds(90);
      setRestActive(true);
    }
  };

  const addSet = (exIdx: number) => {
    const updated = [...exercises];
    const lastSet = updated[exIdx].sets[updated[exIdx].sets.length - 1];
    updated[exIdx].sets.push({
      setNum: updated[exIdx].sets.length + 1,
      weight: lastSet ? lastSet.weight : 40,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    });
    setExercises(updated);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Active Session Top Bar */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                sessionActive ? "bg-emerald-500 text-white animate-pulse" : "bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]"
              }`}>
                {sessionActive ? "WORKOUT IN PROGRESS" : "READY TO WORKOUT"}
              </span>
              <span className="text-xs text-[var(--text-muted)]">• Chest & Triceps Day</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">
              Hypertrophy Push Routine
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!sessionActive ? (
              <button
                onClick={() => setSessionActive(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Workout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSessionPaused(!sessionPaused)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
                >
                  {sessionPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span>{sessionPaused ? "Resume" : "Pause"}</span>
                </button>
                <button
                  onClick={() => {
                    setSessionActive(false);
                    setElapsedSeconds(0);
                  }}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Finish Workout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Timer Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]">
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Duration</span>
            <p className="text-lg font-mono font-extrabold text-[var(--text)]">{formatTime(elapsedSeconds)}</p>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Volume Lifted</span>
            <p className="text-lg font-bold text-emerald-600">2,480 kg</p>
          </div>
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase">Est. Calories</span>
            <p className="text-lg font-bold text-[var(--text)]">340 kcal</p>
          </div>
        </div>
      </div>

      {/* Rest Timer Banner */}
      {restActive && (
        <div className="p-4 rounded-[14px] border border-blue-500/30 bg-blue-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TimerIcon className="h-6 w-6 text-blue-500 animate-spin" />
            <div>
              <p className="text-xs font-bold text-[var(--text)]">Rest Interval Active</p>
              <p className="text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {formatTime(restSeconds)} remaining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRestSeconds((prev) => prev + 30)}
              className="px-3 py-1.5 rounded-[6px] border border-blue-500/30 bg-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-300"
            >
              +30 sec
            </button>
            <button
              onClick={() => setRestActive(false)}
              className="px-3 py-1.5 rounded-[6px] bg-blue-600 text-white text-xs font-semibold"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Exercises Logger List */}
      <div className="space-y-5">
        {exercises.map((ex, exIdx) => (
          <div key={ex.id} className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Exercise #{exIdx + 1} • {ex.muscle}
                </span>
                <h3 className="text-base font-bold text-[var(--text)]">{ex.name}</h3>
              </div>

              <button
                onClick={() => addSet(exIdx)}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Set</span>
              </button>
            </div>

            {/* Set Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-[var(--text-muted)] px-2">
                <span className="col-span-2">Set</span>
                <span className="col-span-4">Weight (kg)</span>
                <span className="col-span-4">Target Reps</span>
                <span className="col-span-2 text-right">Done</span>
              </div>

              {ex.sets.map((s, setIdx) => (
                <div
                  key={setIdx}
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-[8px] transition-colors ${
                    s.completed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-[var(--background)] border border-[var(--border)]"
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-1">
                    <span className="text-xs font-bold text-[var(--text)]">#{s.setNum}</span>
                    {s.isPR && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-600 border border-amber-500/30">
                        PR
                      </span>
                    )}
                  </div>

                  <div className="col-span-4">
                    <input
                      type="number"
                      value={s.weight}
                      onChange={(e) => {
                        const updated = [...exercises];
                        updated[exIdx].sets[setIdx].weight = parseFloat(e.target.value) || 0;
                        setExercises(updated);
                      }}
                      className="w-full h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-bold text-[var(--text)]"
                    />
                  </div>

                  <div className="col-span-4">
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => {
                        const updated = [...exercises];
                        updated[exIdx].sets[setIdx].reps = parseInt(e.target.value) || 0;
                        setExercises(updated);
                      }}
                      className="w-full h-8 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-bold text-[var(--text)]"
                    />
                  </div>

                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => toggleSetComplete(exIdx, setIdx)}
                      className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition-all cursor-pointer ${
                        s.completed ? "bg-emerald-600 text-white" : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

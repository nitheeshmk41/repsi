"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Flame, Navigation, Award, Zap, CheckCircle2, TrendingUp } from "lucide-react";

export default function RunningTrackerPage({ params }: { params: { workspace: string } }) {
  const [runningActive, setRunningActive] = useState(false);
  const [runningPaused, setRunningPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0.00); // km

  // Live Timer & Distance Simulation
  useEffect(() => {
    let timer: any;
    if (runningActive && !runningPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setDistance((prev) => parseFloat((prev + 0.003).toFixed(2)));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [runningActive, runningPaused]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Pace calculation (min/km)
  const paceMinutes = distance > 0 ? (seconds / 60) / distance : 0;
  const paceFormatted = distance > 0 ? `${Math.floor(paceMinutes)}:${Math.floor((paceMinutes % 1) * 60).toString().padStart(2, "0")}` : "0:00";
  const caloriesBurned = Math.round(distance * 65);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Outdoor GPS Running Tracker</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Track running distance, real-time pace, duration, and calories.
        </p>
      </div>

      {/* Live Running Monitor Card */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                runningActive ? "bg-emerald-500 text-white animate-pulse" : "bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]"
              }`}>
                {runningActive ? "LIVE RUN IN PROGRESS" : "GPS READY"}
              </span>
              <h2 className="text-xl font-bold text-[var(--text)] mt-1">Outdoor Cardio Session</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!runningActive ? (
              <button
                onClick={() => setRunningActive(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Outdoor Run</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setRunningPaused(!runningPaused)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] cursor-pointer"
                >
                  {runningPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span>{runningPaused ? "Resume" : "Pause"}</span>
                </button>
                <button
                  onClick={() => {
                    setRunningActive(false);
                    setSeconds(0);
                    setDistance(0);
                  }}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Square className="h-4 w-4" />
                  <span>End Run</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Running Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Distance</span>
            <div className="text-3xl font-extrabold text-emerald-600">{distance.toFixed(2)}</div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">Kilometers</span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Duration</span>
            <div className="text-3xl font-mono font-extrabold text-[var(--text)]">{formatTime(seconds)}</div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">Minutes:Seconds</span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Avg Pace</span>
            <div className="text-3xl font-mono font-extrabold text-blue-600">{paceFormatted}</div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">/ km</span>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Calories</span>
            <div className="text-3xl font-extrabold text-amber-500">{caloriesBurned}</div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">kcal burned</span>
          </div>
        </div>
      </div>

      {/* Fitness Goals & Streaks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak & Achievements */}
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-[var(--text)]">Fitness Achievements & Streaks</h2>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">🔥 12-Day Workout Streak</span>
              <p className="text-xs text-[var(--text-muted)]">Active consistency streak unlocked!</p>
            </div>
            <span className="text-2xl font-black text-amber-500">12 Days</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text)]">🏆 First 5K Outdoor Run</span>
              <span className="text-emerald-600 font-bold">UNLOCKED</span>
            </div>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text)]">🏋️ 100 Workouts Completed</span>
              <span className="text-emerald-600 font-bold">UNLOCKED</span>
            </div>
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-bold text-[var(--text)]">Target Goal: 70.0 kg</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Current: 74.2 kg</span>
              <span className="text-emerald-600">68% Progress</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--background)] border border-[var(--border)] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1 text-xs">
            <p className="font-bold text-[var(--text)]">Next Milestone:</p>
            <p className="text-[var(--text-muted)]">Reach 72.5 kg by end of current month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

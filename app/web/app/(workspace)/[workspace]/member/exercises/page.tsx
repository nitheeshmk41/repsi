"use client";

import { useState, use, useEffect } from "react";
import {
  Dumbbell,
  Search,
  Filter,
  Play,
  Info,
  Sparkles,
  Heart,
  Plus,
  Check,
  Flame,
  UserCheck,
  Bookmark,
  ChevronDown,
  Layers,
  Clock,
  RotateCcw,
  Zap,
  CheckCircle2,
  X,
  FileText
} from "lucide-react";

export interface ExerciseDef {
  id: string;
  name: string;
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Cardio" | "Full Body";
  subMuscle: string;
  secondaryMuscles: string[];
  equipment: "No Equipment" | "Dumbbells" | "Barbell" | "Cable" | "Machine" | "Kettlebell" | "Resistance Band" | "Smith Machine" | "Bench";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Strength" | "Hypertrophy" | "Endurance" | "Mobility";
  steps: string[];
  defaultSets: number;
  defaultReps: number;
  defaultRestSec: number;
  animBg: string;
  trainerNote?: string;
}

const EXERCISE_DATABASE: ExerciseDef[] = [
  {
    id: "ex-001",
    name: "Barbell Bench Press",
    category: "Chest",
    subMuscle: "Mid Chest",
    secondaryMuscles: ["Triceps", "Anterior Deltoids"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    type: "Strength",
    steps: [
      "Set up flat on the bench with eyes directly under the bar.",
      "Grip the barbell slightly wider than shoulder-width.",
      "Unrack the weight and brace your core, pinching your shoulder blades together.",
      "Lower the bar under control toward your lower sternum.",
      "Press explosively back up to top lockout."
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRestSec: 90,
    animBg: "from-emerald-950/80 to-zinc-900",
    trainerNote: "Focus on driving your feet firm into the ground and keeping your back neutral."
  },
  {
    id: "ex-002",
    name: "Incline Dumbbell Press",
    category: "Chest",
    subMuscle: "Upper Chest",
    secondaryMuscles: ["Triceps", "Front Shoulders"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    type: "Hypertrophy",
    steps: [
      "Set an adjustable bench to a 30 to 45 degree incline.",
      "Kick dumbbells up to shoulder level as you sit back.",
      "Press both dumbbells straight overhead, squeezing your upper chest at peak height.",
      "Lower under control until upper arms are parallel with the floor."
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 75,
    animBg: "from-teal-950/80 to-zinc-900",
    trainerNote: "Keep your elbows tucked at a 45-degree angle to protect your rotator cuffs."
  },
  {
    id: "ex-003",
    name: "Barbell Back Squat",
    category: "Legs",
    subMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Advanced",
    type: "Strength",
    steps: [
      "Position the barbell across your upper trapezius muscles.",
      "Stand with feet shoulder-width apart, toes pointing slightly outward.",
      "Break at your hips and knees simultaneously to sit down into the squat.",
      "Lower until thighs are parallel or below parallel to the ground.",
      "Drive through your mid-foot to stand back up."
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRestSec: 120,
    animBg: "from-blue-950/80 to-zinc-900",
    trainerNote: "Add 5kg to your top set this week if depth feels comfortable."
  },
  {
    id: "ex-004",
    name: "Lat Pulldown (Wide Grip)",
    category: "Back",
    subMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    equipment: "Cable",
    difficulty: "Beginner",
    type: "Hypertrophy",
    steps: [
      "Grasp the wide bar with an overhand grip wider than shoulder width.",
      "Sit upright with thigh pads securely pressing down on your knees.",
      "Lean back slightly (about 10-15 degrees) and pull the bar down toward upper chest.",
      "Squeeze your lat muscles at the bottom position before controlled return."
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60,
    animBg: "from-indigo-950/80 to-zinc-900"
  },
  {
    id: "ex-005",
    name: "Overhead Dumbbell Shoulder Press",
    category: "Shoulders",
    subMuscle: "Anterior Deltoids",
    secondaryMuscles: ["Triceps", "Upper Chest"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    type: "Strength",
    steps: [
      "Sit erect on a bench with 90-degree back support.",
      "Hold dumbbells at shoulder height with palms facing forward.",
      "Press dumbbells directly overhead until arms extend smoothly.",
      "Lower under control back to shoulder level."
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSec: 75,
    animBg: "from-purple-950/80 to-zinc-900",
    trainerNote: "Avoid arching your lower back away from the bench pad."
  },
  {
    id: "ex-006",
    name: "Incline Dumbbell Biceps Curl",
    category: "Arms",
    subMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    type: "Hypertrophy",
    steps: [
      "Sit back on an incline bench angled at 45 degrees.",
      "Let dumbbells hang straight down at your sides with palms forward.",
      "Curl weights upward while keeping upper arms strictly fixed.",
      "Pause at top contraction then lower with a 3-second negative tempo."
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSec: 60,
    animBg: "from-amber-950/80 to-zinc-900"
  },
  {
    id: "ex-007",
    name: "Hanging Leg Raise",
    category: "Core",
    subMuscle: "Lower Abs",
    secondaryMuscles: ["Hip Flexors", "Grip Strength"],
    equipment: "No Equipment",
    difficulty: "Advanced",
    type: "Endurance",
    steps: [
      "Hang from a pull-up bar with an overhand grip.",
      "Keep legs straight or slightly bent at knees.",
      "Raise legs upward toward waist level using abs without swinging momentum.",
      "Lower back down slowly."
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSec: 45,
    animBg: "from-rose-950/80 to-zinc-900"
  },
  {
    id: "ex-008",
    name: "Dumbbell Bent-Over Row",
    category: "Back",
    subMuscle: "Upper Back & Rhomboids",
    secondaryMuscles: ["Biceps", "Lats"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    type: "Hypertrophy",
    steps: [
      "Hinge forward at hips with flat back, knees slightly bent.",
      "Hold dumbbells hanging straight down below shoulders.",
      "Row dumbbells toward your hips, driving elbows up toward the ceiling.",
      "Squeeze shoulder blades together at top."
    ],
    defaultSets: 4,
    defaultReps: 10,
    defaultRestSec: 75,
    animBg: "from-slate-900 to-emerald-950",
    trainerNote: "Drive with elbows, not your biceps, to maximize lat engagement."
  }
];

export default function ExerciseLibraryPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("All Equipment");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Levels");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recommended" | "recent">("all");

  const [favorites, setFavorites] = useState<string[]>(["ex-001", "ex-003"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(["ex-001", "ex-002", "ex-004"]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDef | null>(null);

  // Custom Workout Builder State
  const [workoutBasket, setWorkoutBasket] = useState<ExerciseDef[]>([]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [workoutName, setWorkoutName] = useState("My Chest & Arms Routine");
  const [workoutCreated, setWorkoutCreated] = useState(false);

  const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio", "Full Body"];
  const equipmentOptions = [
    "All Equipment",
    "No Equipment",
    "Dumbbells",
    "Barbell",
    "Cable",
    "Machine",
    "Kettlebell",
    "Resistance Band",
    "Smith Machine"
  ];
  const difficultyOptions = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleOpenExercise = (ex: ExerciseDef) => {
    setSelectedExercise(ex);
    if (!recentlyViewed.includes(ex.id)) {
      setRecentlyViewed([ex.id, ...recentlyViewed]);
    }
  };

  const handleAddToWorkout = (ex: ExerciseDef, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!workoutBasket.some((item) => item.id === ex.id)) {
      setWorkoutBasket([...workoutBasket, ex]);
    }
  };

  const handleRemoveFromWorkout = (id: string) => {
    setWorkoutBasket(workoutBasket.filter((item) => item.id !== id));
  };

  const handleCreateWorkout = () => {
    setWorkoutCreated(true);
    setTimeout(() => {
      setWorkoutCreated(false);
      setShowBuilderModal(false);
      setWorkoutBasket([]);
    }, 1800);
  };

  // Smart Filtering Logic (handles multi-word search like "chest dumbbell" or "beginner leg")
  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const searchLower = searchTerm.toLowerCase().trim();

    // Tab level filter
    if (activeTab === "favorites" && !favorites.includes(ex.id)) return false;
    if (activeTab === "recommended" && !ex.trainerNote) return false;
    if (activeTab === "recent" && !recentlyViewed.includes(ex.id)) return false;

    // Dropdown filters
    if (selectedCategory !== "All" && ex.category !== selectedCategory) return false;
    if (selectedEquipment !== "All Equipment" && ex.equipment !== selectedEquipment) return false;
    if (selectedDifficulty !== "All Levels" && ex.difficulty !== selectedDifficulty) return false;

    // Search filter
    if (searchLower) {
      const searchWords = searchLower.split(" ");
      const combinedText = `${ex.name} ${ex.category} ${ex.subMuscle} ${ex.equipment} ${ex.difficulty} ${ex.type}`.toLowerCase();
      const matchesAllWords = searchWords.every((word) => combinedText.includes(word));
      if (!matchesAllWords) return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* ── 1. HEADER & SUMMARY ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary-soft)] border border-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center font-bold">
              <Dumbbell className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
              Exercise Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Simple movement reference, execution guides, and workout builder for your training goals.
          </p>
        </div>

        {/* Builder Basket Floating Button */}
        {workoutBasket.length > 0 && (
          <button
            onClick={() => setShowBuilderModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-md transition-transform active:scale-95 animate-bounce"
          >
            <Plus className="h-4 w-4" />
            <span>Workout Builder ({workoutBasket.length} selected)</span>
          </button>
        )}
      </div>

      {/* ── 2. SMART SEARCH & CATEGORY CHIPS ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search exercises... (e.g. 'chest dumbbell', 'beginner leg', 'back machine')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                  : "bg-[var(--background)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-elevated)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Equipment Filter */}
            <div className="relative">
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--text)] px-3 py-1.5 pr-7 rounded-xl font-medium focus:outline-none focus:border-[var(--primary)]"
              >
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none bg-[var(--background)] border border-[var(--border)] text-[var(--text)] px-3 py-1.5 pr-7 rounded-xl font-medium focus:outline-none focus:border-[var(--primary)]"
              >
                {difficultyOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Quick Sub-tabs */}
          <div className="flex items-center gap-1 bg-[var(--background)] border border-[var(--border)] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeTab === "all" ? "bg-[var(--surface)] text-[var(--text)] shadow-xs" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              All ({EXERCISE_DATABASE.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === "favorites" ? "bg-[var(--surface)] text-[var(--text)] shadow-xs" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>Favorites ({favorites.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === "recommended" ? "bg-[var(--surface)] text-[var(--text)] shadow-xs" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <UserCheck className="h-3 w-3 text-[var(--primary)]" />
              <span>Trainer Demos</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. EXERCISE CARDS GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => {
          const isFav = favorites.includes(ex.id);
          const inBasket = workoutBasket.some((b) => b.id === ex.id);

          return (
            <div
              key={ex.id}
              onClick={() => handleOpenExercise(ex)}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs hover:border-[var(--primary)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Animation Demonstration Banner */}
                <div className={`h-36 bg-gradient-to-br ${ex.animBg} p-4 flex flex-col justify-between relative border-b border-[var(--border)] overflow-hidden`}>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {ex.category} • {ex.subMuscle}
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(ex.id, e)}
                      className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform"
                      title={isFav ? "Remove Favorite" : "Add Favorite"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFav ? "text-rose-500 fill-rose-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Center Animation Indicator */}
                  <div className="self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-bold z-10 group-hover:scale-105 transition-transform">
                    <Play className="h-3 w-3 fill-emerald-400 animate-pulse" />
                    <span>Looping Demo</span>
                  </div>

                  {/* Trainer Callout Badge */}
                  {ex.trainerNote && (
                    <div className="z-10 flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                      <UserCheck className="h-3 w-3" />
                      <span>Recommended by Coach Arun</span>
                    </div>
                  )}

                  {/* Subtle Grid Accent */}
                  <div className="absolute inset-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-base text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                    {ex.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text)]">
                      {ex.equipment}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text)]">
                      {ex.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[var(--border)]/50">
                <span className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[var(--primary)]" />
                  {ex.defaultSets}×{ex.defaultReps}
                </span>

                <button
                  onClick={(e) => handleAddToWorkout(ex, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    inBasket
                      ? "bg-emerald-600 text-white"
                      : "bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {inBasket ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>{inBasket ? "Added" : "Add to Workout"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 space-y-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
          <Dumbbell className="h-8 w-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="font-bold text-sm text-[var(--text)]">No exercises matched your search</h3>
          <p className="text-xs text-[var(--text-muted)]">Try adjusting your keywords or clearing category filters.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedEquipment("All Equipment");
              setSelectedDifficulty("All Levels");
              setActiveTab("all");
            }}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── 4. EXERCISE DETAIL MODAL ───────────────────────────────────────────────── */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto text-[var(--text)]">
            {/* Modal Animation Header */}
            <div className={`h-48 bg-gradient-to-br ${selectedExercise.animBg} p-5 flex flex-col justify-between relative border-b border-[var(--border)]`}>
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {selectedExercise.category} • {selectedExercise.subMuscle}
                </span>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="z-10">
                <h2 className="text-2xl font-black text-white">{selectedExercise.name}</h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {selectedExercise.equipment} • {selectedExercise.difficulty} • {selectedExercise.type}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 text-xs">
              {/* Target Muscles */}
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">
                  Target Muscles
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] font-bold">
                    Primary: {selectedExercise.subMuscle} ({selectedExercise.category})
                  </span>
                  {selectedExercise.secondaryMuscles.map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-muted)] font-medium">
                      Secondary: {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescribed Target Sets & Rest */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium block">Prescribed Sets</span>
                  <span className="text-base font-extrabold text-[var(--text)]">{selectedExercise.defaultSets} Sets</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium block">Target Reps</span>
                  <span className="text-base font-extrabold text-[var(--text)]">{selectedExercise.defaultReps} Reps</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium block">Rest Interval</span>
                  <span className="text-base font-extrabold text-[var(--text)]">{selectedExercise.defaultRestSec} sec</span>
                </div>
              </div>

              {/* Trainer Callout Note: "Why am I doing this?" */}
              {selectedExercise.trainerNote && (
                <div className="p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/30 text-[var(--primary)] space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-xs">
                    <UserCheck className="h-4 w-4 text-[var(--primary)]" />
                    <span>Why am I doing this? (Coach Arun's Note)</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] italic">
                    "{selectedExercise.trainerNote}"
                  </p>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[var(--text)]">How to Perform</h4>
                <ol className="space-y-2 pl-4 list-decimal text-[var(--text-secondary)] leading-relaxed">
                  {selectedExercise.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleFavorite(selectedExercise.id)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    favorites.includes(selectedExercise.id)
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(selectedExercise.id) ? "fill-rose-500" : ""}`} />
                  <span>{favorites.includes(selectedExercise.id) ? "Favorited" : "Add to Favorites"}</span>
                </button>

                <button
                  onClick={() => {
                    handleAddToWorkout(selectedExercise);
                    setSelectedExercise(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Workout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. BUILD WORKOUT DRAWER MODAL ─────────────────────────────────────────── */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 space-y-5 text-[var(--text)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                <h2 className="text-base font-bold text-[var(--text)]">Create Custom Workout</h2>
              </div>
              <button onClick={() => setShowBuilderModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {workoutCreated ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-lg text-[var(--text)]">Workout Created!</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  "{workoutName}" has been added to <strong>My Workouts</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-xs text-[var(--text-secondary)] font-semibold">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] font-semibold focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <label className="block text-xs text-[var(--text-secondary)] font-semibold">
                    Selected Exercises ({workoutBasket.length})
                  </label>

                  {workoutBasket.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold block text-[var(--text)]">{ex.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{ex.defaultSets} × {ex.defaultReps} reps</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromWorkout(ex.id)}
                        className="text-xs text-rose-500 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowBuilderModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkout}
                    disabled={workoutBasket.length === 0}
                    className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-md disabled:opacity-50"
                  >
                    Save & Create Workout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

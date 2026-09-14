"use client";

import { useState, use, useEffect } from "react";
import { repsiApi } from "@/lib/api";
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  Trash2,
  Edit2,
  Sparkles
} from "lucide-react";

export interface GymMachine {
  id: string;
  name: string;
  category: "Strength" | "Cardio" | "Cables" | "Free Weights" | "Recovery";
  brand: string;
  model: string;
  muscleGroup: string;
  status: "Available" | "In Use" | "Maintenance" | "Out of Service";
  instructions: string;
  lastServiced: string;
}

export default function MachinesManagementPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [machines, setMachines] = useState<GymMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<GymMachine | null>(null);

  // New Machine Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<GymMachine["category"]>("Strength");
  const [newBrand, setNewBrand] = useState("Jerai Fitness");
  const [newModel, setNewModel] = useState("Pro Series");
  const [newMuscle, setNewMuscle] = useState("Chest, Shoulders");
  const [newInstructions, setNewInstructions] = useState("Keep form strict, control eccentric phase.");

  const fetchMachines = async () => {
    setLoading(true);
    const data = await repsiApi.getMachines();
    const mapped: GymMachine[] = data.map((m: any) => ({
      id: m.id,
      name: m.name,
      category: m.category || "Strength",
      brand: m.brand || "Generic",
      model: m.model || "Standard",
      muscleGroup: m.muscle_group || "Full Body",
      status: m.status || "Available",
      instructions: m.instructions || "",
      lastServiced: m.last_serviced || "N/A",
    }));
    setMachines(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await repsiApi.createMachine({
        name: newName,
        category: newCategory,
        brand: newBrand,
        model: newModel,
        muscle_group: newMuscle,
        status: "Available",
        instructions: newInstructions,
      });
      setShowAddModal(false);
      setNewName("");
      fetchMachines();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id: string) => {
    const target = machines.find(m => m.id === id);
    if (!target) return;
    const statuses: GymMachine["status"][] = ["Available", "In Use", "Maintenance", "Out of Service"];
    const nextIdx = (statuses.indexOf(target.status) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    try {
      await repsiApi.updateMachine(id, { status: nextStatus });
      setMachines(machines.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      await repsiApi.deleteMachine(id);
      setMachines(machines.filter((m) => m.id !== id));
      if (selectedMachine?.id === id) setSelectedMachine(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Equipment & Machine Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Track machine status, maintenance logs, and muscle group instructions across {workspace}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Machine</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Equipment</span>
          <div className="text-2xl font-bold text-[var(--text)]">{machines.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">100% Asset Tracked</span>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Available Now</span>
          <div className="text-2xl font-bold text-emerald-600">
            {machines.filter((m) => m.status === "Available").length}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Ready for workout</span>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Currently In Use</span>
          <div className="text-2xl font-bold text-blue-600">
            {machines.filter((m) => m.status === "In Use").length}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Active gym floor</span>
        </div>

        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Maintenance / Out</span>
          <div className="text-2xl font-bold text-amber-600">
            {machines.filter((m) => m.status === "Maintenance" || m.status === "Out of Service").length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Attention needed</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search equipment, muscle group, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {["All", "Available", "In Use", "Maintenance", "Out of Service"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mac) => (
          <div
            key={mac.id}
            className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3 shadow-xs hover:border-[var(--primary)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {mac.category} • {mac.brand}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text)]">{mac.name}</h3>
                </div>

                <button
                  onClick={() => toggleStatus(mac.id)}
                  title="Click to cycle status"
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                    mac.status === "Available"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : mac.status === "In Use"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : mac.status === "Maintenance"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {mac.status}
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-1">
                <p className="text-[11px] font-semibold text-[var(--text)]">Target Muscles:</p>
                <p className="text-[11px] text-[var(--text-muted)]">{mac.muscleGroup}</p>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 italic">
                "{mac.instructions}"
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
              <span>Serviced: {mac.lastServiced}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMachine(mac)}
                  className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text)]"
                  title="View Details"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteMachine(mac.id)}
                  className="p-1 rounded hover:bg-rose-500/10 text-rose-500"
                  title="Delete Equipment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="rounded-[16px] border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--surface)]/50">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)]">No equipment logged yet</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Get started by adding gym machines, dumbbells, and cardio equipment to track maintenance logs and instructions for your workspace.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm cursor-pointer mt-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Machine</span>
          </button>
        </div>
      )}

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--text)]">Add Gym Equipment</h2>
            <form onSubmit={handleAddMachine} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline Cable Fly Machine"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--text)]"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Cables">Cables</option>
                    <option value="Free Weights">Free Weights</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Target Muscle Group</label>
                <input
                  type="text"
                  value={newMuscle}
                  onChange={(e) => setNewMuscle(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Instructions / Notes</label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-[8px] border border-[var(--border)] text-xs font-medium text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-base font-bold text-[var(--text)]">{selectedMachine.name}</h2>
              <button onClick={() => setSelectedMachine(null)} className="text-xs font-bold text-[var(--text-muted)]">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-muted)]">
              <p><strong className="text-[var(--text)]">Brand & Model:</strong> {selectedMachine.brand} ({selectedMachine.model})</p>
              <p><strong className="text-[var(--text)]">Category:</strong> {selectedMachine.category}</p>
              <p><strong className="text-[var(--text)]">Muscles Worked:</strong> {selectedMachine.muscleGroup}</p>
              <p><strong className="text-[var(--text)]">Usage Instructions:</strong> {selectedMachine.instructions}</p>
              <p><strong className="text-[var(--text)]">Status:</strong> {selectedMachine.status}</p>
            </div>

            <button
              onClick={() => setSelectedMachine(null)}
              className="w-full py-2 rounded-[8px] bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

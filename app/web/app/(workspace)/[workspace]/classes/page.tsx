"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, Users, Flame, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function WorkspaceClassesPage() {
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("Mon/Wed/Fri 07:00 AM");
  const [category, setCategory] = useState("CrossFit");
  const [room, setRoom] = useState("Studio A");
  const [capacity, setCapacity] = useState("20");

  const loadClasses = async () => {
    setLoading(true);
    const data = await repsiApi.getClasses();
    setClassesList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await repsiApi.createClass({
        name,
        schedule,
        category,
        room,
        capacity: parseInt(capacity) || 20,
      });
      setShowModal(false);
      setName("");
      loadClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Group Classes & Schedule</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Weekly timetable, class capacity, waitlists, and coach allocations.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          Schedule Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classesList.map((c) => (
          <div key={c.id} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                  {c.room || "Main Studio"}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500" />
                  {c.category || "General"}
                </span>
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mt-2">{c.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {c.schedule}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-xs text-[var(--text-muted)]">
                Capacity: <span className="font-bold text-[var(--text)]">{c.capacity} Slots</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Manage Roster
              </Button>
            </div>
          </div>
        ))}
      </div>

      {classesList.length === 0 && !loading && (
        <div className="rounded-[16px] border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--surface)]/50">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)]">No classes scheduled yet</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Schedule group workout sessions, yoga flows, spin cycling, or HIIT training for your gym.
          </p>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 mt-2 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            Schedule First Class
          </Button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-[var(--text)]">Schedule Group Class</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning HIIT & Burn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Schedule / Timings</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon / Wed / Fri - 07:00 AM"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Studio / Room</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full h-9 rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)]"
                  />
                </div>
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
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

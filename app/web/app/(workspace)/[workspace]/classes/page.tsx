import type { Metadata } from "next";
import { Calendar, Plus, Clock, Users, Flame, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Classes",
  description: "Schedule and manage group fitness classes, slots, and bookings.",
};

const classesList = [
  {
    id: "cls_1",
    name: "Morning MetCon HIIT",
    time: "06:30 AM – 07:30 AM",
    trainer: "Ananya Deshmukh",
    enrolled: 18,
    capacity: 20,
    room: "Studio A",
    intensity: "High",
  },
  {
    id: "cls_2",
    name: "Vinyasa Flow Yoga",
    time: "08:00 AM – 09:00 AM",
    trainer: "Sneha Reddy",
    enrolled: 14,
    capacity: 15,
    room: "Zen Studio",
    intensity: "Moderate",
  },
  {
    id: "cls_3",
    name: "Powerlifting Fundamentals",
    time: "05:00 PM – 06:15 PM",
    trainer: "Vikram Sethi",
    enrolled: 10,
    capacity: 12,
    room: "Iron Dungeon",
    intensity: "High",
  },
  {
    id: "cls_4",
    name: "Evening Kettlebell Blitz",
    time: "07:00 PM – 08:00 PM",
    trainer: "Karan Johar",
    enrolled: 16,
    capacity: 18,
    room: "Studio B",
    intensity: "High",
  },
];

export default function WorkspaceClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Group Classes & Schedule</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Weekly timetable, class capacity, waitlists, and coach allocations.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Schedule Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classesList.map((c) => (
          <div key={c.id} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                  {c.room}
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500" />
                  {c.intensity} Intensity
                </span>
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mt-2">{c.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {c.time}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Coach: <strong>{c.trainer}</strong>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-[var(--text)]">{c.enrolled}</span>
                <span className="text-[var(--text-muted)]">/{c.capacity} Booked</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Manage Roster
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

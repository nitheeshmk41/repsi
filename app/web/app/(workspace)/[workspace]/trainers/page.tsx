import type { Metadata } from "next";
import { Dumbbell, Plus, Star, Users, Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Manage gym personal trainers, certifications, and assigned clients.",
};

const trainers = [
  {
    id: "trn_1",
    name: "Vikram Sethi",
    specialty: "Strength & Powerlifting",
    certification: "CSCS, ACE Certified",
    clients: 18,
    rating: 4.9,
    phone: "+91 98410 44211",
    email: "vikram@apexfitness.in",
    status: "Active",
  },
  {
    id: "trn_2",
    name: "Ananya Deshmukh",
    specialty: "Functional Mobility & HIIT",
    certification: "CrossFit L2, NASM",
    clients: 24,
    rating: 4.95,
    phone: "+91 98410 77332",
    email: "ananya@apexfitness.in",
    status: "Active",
  },
  {
    id: "trn_3",
    name: "Karan Johar",
    specialty: "Bodybuilding & Hypertrophy",
    certification: "ISSA Master Trainer",
    clients: 15,
    rating: 4.8,
    phone: "+91 98410 99443",
    email: "karan@apexfitness.in",
    status: "Active",
  },
  {
    id: "trn_4",
    name: "Sneha Reddy",
    specialty: "Yoga & Postural Rehab",
    certification: "RYT-500, Physio BPT",
    clients: 22,
    rating: 5.0,
    phone: "+91 98410 11554",
    email: "sneha@apexfitness.in",
    status: "Active",
  },
];

export default function WorkspaceTrainersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Trainers & Coaches</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your certified coaches, schedules, specialty tracks, and client assignments.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Trainer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="font-bold">{t.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base text-[var(--text)]">{t.name}</h3>
                    <p className="text-xs text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-medium">{t.specialty}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{t.certification}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{t.rating}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span>{t.clients} Personal Clients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">● {t.status}</span>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                View Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

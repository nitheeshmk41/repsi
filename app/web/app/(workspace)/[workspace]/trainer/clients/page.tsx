"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Dumbbell,
  Calendar,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { repsiApi } from "@/lib/api";

export default function TrainerClientsPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Active" | "Needs Attention" | "Workout Due" | "Inactive">("All");

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getCurrentTrainerClients();
      setClients(data);
    } catch (err) {
      console.error("Failed to load trainer clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "Active") return c.relationship_status === "ACTIVE";
    if (filterTab === "Inactive") return c.relationship_status === "INACTIVE" || c.relationship_status === "ENDED";
    if (filterTab === "Workout Due") return !c.last_workout;
    if (filterTab === "Needs Attention") return c.membership_status === "expiring" || !c.last_workout;

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              MY ASSIGNED CLIENTS
            </span>
            <span className="text-xs text-[var(--text-muted)]">• {workspace}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mt-1">My Clients</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage your personal training clients, workouts, streaks, and progress.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Active", "Needs Attention", "Workout Due", "Inactive"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === tab
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search client by name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
      </div>

      {/* Client List / Cards */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
          <p className="text-xs">Loading assigned clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center space-y-2">
          <Users className="h-10 w-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Clients Found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            {searchTerm || filterTab !== "All"
              ? "No clients match the selected filter criteria."
              : "You don't have any clients assigned yet. Ask your gym owner to assign clients to your training roster."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((c) => (
            <Link
              key={c.client_id}
              href={`/${workspace}/trainer/clients/${c.client_id}`}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-[var(--border)]">
                      <AvatarFallback className="font-bold bg-emerald-500/10 text-emerald-600">
                        {c.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">{c.phone}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.membership_status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {c.membership_status.toUpperCase()}
                  </span>
                </div>

                {/* Training overview status */}
                <div className="mt-4 space-y-2 text-xs bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span>Last Workout</span>
                    <span className="font-semibold text-[var(--text)]">
                      {c.last_workout ? c.last_workout.title : "None assigned"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span>Next Session</span>
                    <span className="font-semibold text-emerald-600">
                      {c.next_session ? new Date(c.next_session.scheduled_at).toLocaleDateString() : "Not scheduled"}
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-[var(--text-muted)]">
                      <span>Goal Progress</span>
                      <span>{c.last_workout ? `${c.last_workout.completion_percentage}%` : "0%"}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${c.last_workout ? c.last_workout.completion_percentage : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform">
                <span>View Client Profile</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

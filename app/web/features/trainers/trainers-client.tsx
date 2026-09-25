"use client";

import { useState, useEffect } from "react";
import { Plus, Star, Users, Phone, Mail, Edit3, UserPlus, ShieldAlert, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InviteDialog } from "@/components/invite-dialog";
import { repsiApi, ApiMember } from "@/lib/api";

export function TrainersClient() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Assign Client Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [assignNotes, setAssignNotes] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  // Edit Trainer Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTrainerData, setEditTrainerData] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, mData] = await Promise.all([
        repsiApi.getTrainers(),
        repsiApi.getMembers()
      ]);
      setTrainers(tData);
      setMembers(mData);
    } catch (err) {
      console.error("Failed to load trainers data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer || !selectedClientId) return;
    setAssigning(true);
    try {
      await repsiApi.assignClientToTrainer(selectedTrainer.id, selectedClientId, assignNotes);
      setAssignModalOpen(false);
      setSelectedClientId("");
      setAssignNotes("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to assign client");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTrainerData) return;
    setUpdating(true);
    try {
      await repsiApi.updateTrainer(editTrainerData.id, editTrainerData);
      setEditModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update trainer");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTrainer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove trainer "${name}"? Historical client assignments will be preserved.`)) return;
    try {
      await repsiApi.deleteTrainer(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to remove trainer");
    }
  };

  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.specialization && t.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.phone && t.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Trainers & Coaches</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your certified coaches, client assignments, schedules, and active statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setInviteDialogOpen(true)}
            className="gap-1.5 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
          >
            <Mail className="h-3.5 w-3.5" />
            Invite Trainer
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search trainer by name, specialty, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
          <p className="text-xs">Loading gym trainers...</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center space-y-3">
          <Users className="h-10 w-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="font-semibold text-sm text-[var(--text)]">No Trainers Found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            {searchTerm ? "No trainers match your search parameters." : "No trainers have been added yet. Click 'Invite Trainer' to send an invitation."}
          </p>
          {!searchTerm && (
            <Button size="sm" onClick={() => setInviteDialogOpen(true)} className="gap-2">
              <Mail className="h-3.5 w-3.5" />
              Invite First Trainer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-[var(--border)]">
                      <AvatarFallback className="font-bold bg-emerald-500/10 text-emerald-600">
                        {t.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)]">{t.name}</h3>
                      <p className="text-xs text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-medium">
                        {t.specialization || "General Fitness"}
                      </p>
                      {t.email && <p className="text-[11px] text-[var(--text-muted)]">{t.email}</p>}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                    t.status === "SUSPENDED" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] bg-[var(--background)] p-2.5 rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span className="font-semibold text-[var(--text)]">{t.assigned_clients_count || 0} Clients</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span>{t.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTrainer(t);
                    setAssignModalOpen(true);
                  }}
                  className="text-xs h-8 gap-1"
                >
                  <UserPlus className="h-3.5 w-3.5 text-emerald-500" />
                  Assign Client
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditTrainerData({ ...t });
                      setEditModalOpen(true);
                    }}
                    className="h-8 w-8 p-0"
                    title="Edit Trainer Details"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrainer(t.id, t.name)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    title="Remove Trainer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Trainer Dialog */}
      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        defaultRole="trainer"
        onSuccess={loadData}
      />

      {/* Assign Client Modal */}
      {assignModalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Assign Client to {selectedTrainer.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Select a member from your gym to assign under {selectedTrainer.name}'s training guidance.
            </p>
            <form onSubmit={handleAssignClient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Select Client / Member</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
                  required
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.phone}) - {m.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Assignment Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Personal Training Plan - 3 sessions/week"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assigning || !selectedClientId} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainer Modal */}
      {editModalOpen && editTrainerData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--text)]">Edit Trainer: {editTrainerData.name}</h3>
            <form onSubmit={handleUpdateTrainer} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Full Name</label>
                <input
                  type="text"
                  value={editTrainerData.name || ""}
                  onChange={(e) => setEditTrainerData({ ...editTrainerData, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Specialization</label>
                <input
                  type="text"
                  value={editTrainerData.specialization || ""}
                  onChange={(e) => setEditTrainerData({ ...editTrainerData, specialization: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Trainer Status</label>
                <select
                  value={editTrainerData.status || "ACTIVE"}
                  onChange={(e) => setEditTrainerData({ ...editTrainerData, status: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Bio / Notes</label>
                <textarea
                  value={editTrainerData.bio || ""}
                  onChange={(e) => setEditTrainerData({ ...editTrainerData, bio: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

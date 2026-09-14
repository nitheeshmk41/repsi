"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MembersToolbar } from "./members-toolbar";
import { MembersTable } from "./members-table";
import { AddMemberDialog } from "./add-member-dialog";
import { InviteDialog } from "@/components/invite-dialog";
import { CsvImportModal } from "./csv-import-modal";
import { RenewalAlertsCard } from "./renewal-alerts-card";
import type { Member, MemberStatus, MembershipPlanName } from "@/types";
import { repsiApi } from "@/lib/api";

interface MembersClientProps {
  initialMembers: Member[];
}

export function MembersClient({ initialMembers }: MembersClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [planFilter, setPlanFilter] = useState<MembershipPlanName | "all">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  // Sync with persistent API / DB on mount
  const fetchMembers = useCallback(() => {
    repsiApi.getMembers().then((apiMems) => {
      const mapped: Member[] = (apiMems || []).map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        status: m.status as MemberStatus,
        plan: (m.plan as MembershipPlanName) || "Monthly",
        joined: m.joinedDate || new Date().toISOString().split("T")[0],
        expiry: "2026-12-31",
        lastPayment: 1000,
      }));
      setMembers(mapped);
    });
  }, []);

  useEffect(() => {
    fetchMembers();
    window.addEventListener("repsi_storage_update", fetchMembers);
    return () => window.removeEventListener("repsi_storage_update", fetchMembers);
  }, [fetchMembers]);

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem("repsi_auth_token");
      const res = await fetch(repsiApi.getExportMembersCsvUrl(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to export members");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `repsi_members_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.warn("Export CSV error", err);
    }
  };

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        search === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.includes(search);
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesPlan = planFilter === "all" || m.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [members, search, statusFilter, planFilter]);

  return (
    <div className="space-y-5">
      {/* 1. Automated Renewal Alerts Engine */}
      <RenewalAlertsCard />

      {/* 2. Toolbar with Search, Filters, CSV Import/Export */}
      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        onAddMember={() => setAddDialogOpen(true)}
        onInviteMember={() => setInviteDialogOpen(true)}
        onImportCsv={() => setCsvModalOpen(true)}
        onExportCsv={handleExportCsv}
        totalCount={members.length}
        filteredCount={filtered.length}
      />

      <MembersTable
        members={filtered}
        onAddMember={() => setAddDialogOpen(true)}
      />

      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        defaultRole="member"
      />

      <AddMemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={async (data) => {
          // Persist to FastAPI and DB via repsiApi
          const created = await repsiApi.createMember({
            name: data.name,
            email: data.email,
            phone: data.phone,
            plan: data.plan,
          });

          const newMember: Member = {
            id: created.id,
            name: created.name,
            email: created.email,
            phone: created.phone,
            plan: data.plan,
            status: "active",
            joined: data.startDate,
            expiry: new Date(
              new Date(data.startDate).setMonth(
                new Date(data.startDate).getMonth() +
                  (data.plan === "Annual" ? 12 : data.plan === "Quarterly" ? 3 : 1)
              )
            )
              .toISOString()
              .split("T")[0],
            lastPayment:
              data.plan === "Annual"
                ? 18000
                : data.plan === "Quarterly"
                ? 6500
                : data.plan === "Day Pass"
                ? 200
                : 2500,
          };
          setMembers((prev) => [newMember, ...prev.filter((m) => m.id !== newMember.id)]);
        }}
      />

      <CsvImportModal
        open={csvModalOpen}
        onOpenChange={setCsvModalOpen}
        onSuccess={fetchMembers}
      />
    </div>
  );
}

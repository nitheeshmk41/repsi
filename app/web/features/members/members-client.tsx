"use client";

import { useState, useMemo, useEffect } from "react";
import { MembersToolbar } from "./members-toolbar";
import { MembersTable } from "./members-table";
import { AddMemberDialog } from "./add-member-dialog";
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

  // Sync with persistent API / DB on mount
  useEffect(() => {
    repsiApi.getMembers().then((apiMems) => {
      if (apiMems && apiMems.length > 0) {
        const mapped: Member[] = apiMems.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          status: m.status as MemberStatus,
          plan: (m.plan as MembershipPlanName) || "Monthly",
          joined: m.joinedDate,
          expiry: "2026-12-31",
          lastPayment: 1000,
        }));
        setMembers(mapped);
      }
    });

    const handleUpdate = () => {
      repsiApi.getMembers().then((apiMems) => {
        if (apiMems && apiMems.length > 0) {
          const mapped: Member[] = apiMems.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            status: m.status as MemberStatus,
            plan: (m.plan as MembershipPlanName) || "Monthly",
            joined: m.joinedDate,
            expiry: "2026-12-31",
            lastPayment: 1000,
          }));
          setMembers(mapped);
        }
      });
    };

    window.addEventListener("repsi_storage_update", handleUpdate);
    return () => window.removeEventListener("repsi_storage_update", handleUpdate);
  }, []);

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
    <div className="space-y-4">
      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        onAddMember={() => setAddDialogOpen(true)}
        totalCount={members.length}
        filteredCount={filtered.length}
      />

      <MembersTable
        members={filtered}
        onAddMember={() => setAddDialogOpen(true)}
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Plus, Download, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MemberStatus, MembershipPlanName } from "@/types";

interface MembersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: MemberStatus | "all";
  onStatusFilterChange: (value: MemberStatus | "all") => void;
  planFilter: MembershipPlanName | "all";
  onPlanFilterChange: (value: MembershipPlanName | "all") => void;
  onAddMember: () => void;
  onInviteMember?: () => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions: Array<{ value: MemberStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
  { value: "frozen", label: "Frozen" },
  { value: "cancelled", label: "Cancelled" },
];

const planOptions: Array<{ value: MembershipPlanName | "all"; label: string }> = [
  { value: "all", label: "All plans" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Annual", label: "Annual" },
  { value: "Day Pass", label: "Day Pass" },
];

export function MembersToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  planFilter,
  onPlanFilterChange,
  onAddMember,
  onInviteMember,
  totalCount,
  filteredCount,
}: MembersToolbarProps) {
  const hasFilters = statusFilter !== "all" || planFilter !== "all" || search !== "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Search + Filters */}
      <div className="flex flex-1 items-center gap-2 max-w-xl">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            startIcon={<Search className="h-3.5 w-3.5" />}
            className="h-9"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className={statusFilter !== "all" ? "border-[var(--primary)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" : ""}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {statusFilter === "all"
                ? "Status"
                : statusOptions.find((o) => o.value === statusFilter)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={statusFilter === opt.value}
                onCheckedChange={() => onStatusFilterChange(opt.value)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Plan Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className={planFilter !== "all" ? "border-[var(--primary)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" : ""}
            >
              {planFilter === "all" ? "Plan" : planFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Filter by plan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {planOptions.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={planFilter === opt.value}
                onCheckedChange={() => onPlanFilterChange(opt.value)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
              onPlanFilterChange("all");
            }}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right: Count + Actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
          {hasFilters
            ? `${filteredCount} of ${totalCount}`
            : `${totalCount} members`}
        </span>
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        {onInviteMember && (
          <Button size="sm" onClick={onInviteMember} className="gap-1.5 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
            <Mail className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onAddMember}>
          <Plus className="h-3.5 w-3.5" />
          Add Direct
        </Button>
      </div>
    </div>
  );
}

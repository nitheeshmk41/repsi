"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  RefreshCcw,
  Ban,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { getWorkspaceFromPath } from "@/lib/workspace";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  cn,
  formatDate,
  formatCurrency,
  getInitials,
} from "@/lib/utils";
import type { Member, MemberStatus, SortDirection } from "@/types";
import { Users } from "lucide-react";

// ─── Status Badge Mapping ─────────────────────────────────────────────────────

const statusBadgeVariant: Record<
  MemberStatus,
  "active" | "expiring" | "expired" | "frozen" | "cancelled"
> = {
  active: "active",
  expiring: "expiring",
  expired: "expired",
  frozen: "frozen",
  cancelled: "cancelled",
};

const statusLabel: Record<MemberStatus, string> = {
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
  frozen: "Frozen",
  cancelled: "Cancelled",
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({
  column,
  activeColumn,
  direction,
}: {
  column: string;
  activeColumn: string;
  direction: SortDirection;
}) {
  if (column !== activeColumn)
    return <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)] opacity-40" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-[var(--primary)]" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-[var(--primary)]" />
  );
}

// ─── Column Header ────────────────────────────────────────────────────────────

function ColHeader({
  label,
  column,
  activeColumn,
  direction,
  onSort,
  className,
}: {
  label: string;
  column: string;
  activeColumn: string;
  direction: SortDirection;
  onSort: (col: string) => void;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 text-left", className)}>
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors group"
      >
        {label}
        <SortIcon column={column} activeColumn={activeColumn} direction={direction} />
      </button>
    </th>
  );
}

// ─── Row Actions ──────────────────────────────────────────────────────────────

function RowActions({ member }: { member: Member }) {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 group-hover/row:opacity-100 transition-opacity"
          aria-label={`Actions for ${member.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Member actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${workspace}/members/${member.id}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit member
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Renew membership
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Ban className="mr-2 h-4 w-4" />
          Suspend
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[var(--error)]">
          <Trash2 className="mr-2 h-4 w-4" />
          Archive member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Members Table ────────────────────────────────────────────────────────────

interface MembersTableProps {
  members: Member[];
  onAddMember: () => void;
}

export function MembersTable({ members, onAddMember }: MembersTableProps) {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  function handleSort(column: string) {
    if (column === sortColumn) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const sorted = [...members].sort((a, b) => {
    let valA: string | number = "";
    let valB: string | number = "";

    switch (sortColumn) {
      case "name":
        valA = a.name;
        valB = b.name;
        break;
      case "plan":
        valA = a.plan;
        valB = b.plan;
        break;
      case "status":
        valA = a.status;
        valB = b.status;
        break;
      case "joined":
        valA = a.joined;
        valB = b.joined;
        break;
      case "expiry":
        valA = a.expiry;
        valB = b.expiry;
        break;
      case "payment":
        valA = a.lastPayment;
        valB = b.lastPayment;
        break;
    }

    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
    return sortDirection === "asc" ? cmp : -cmp;
  });

  if (members.length === 0) {
    return (
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No members found"
          description="Try adjusting your search or filters, or add your first member."
          action={{ label: "Add Member", onClick: onAddMember }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[768px]">
          {/* Head */}
          <thead className="border-b border-[var(--border)] bg-[var(--background)]">
            <tr>
              <ColHeader
                label="Member"
                column="name"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                className="w-64"
              />
              <ColHeader
                label="Plan"
                column="plan"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <ColHeader
                label="Status"
                column="status"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Phone
                </span>
              </th>
              <ColHeader
                label="Joined"
                column="joined"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <ColHeader
                label="Expires"
                column="expiry"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <ColHeader
                label="Last Payment"
                column="payment"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th className="px-4 py-3 w-12" />
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[var(--border)]">
            {sorted.map((member) => (
              <tr
                key={member.id}
                className="group/row hover:bg-[var(--background)] transition-colors"
              >
                {/* Member */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                      <AvatarFallback className="text-[10px]">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link
                        href={`/${workspace}/members/${member.id}`}
                        className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary-dark)] dark:hover:text-[var(--primary-hover)] transition-colors truncate block"
                      >
                        {member.name}
                      </Link>
                      <span className="text-xs text-[var(--text-muted)] truncate block">
                        {member.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)]">{member.plan}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant[member.status]}>
                    {statusLabel[member.status]}
                  </Badge>
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                    {member.phone}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {formatDate(member.joined)}
                  </span>
                </td>

                {/* Expires */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "text-sm",
                      member.status === "expiring"
                        ? "text-[var(--warning-foreground)] font-medium"
                        : member.status === "expired"
                        ? "text-[var(--error)] font-medium"
                        : "text-[var(--text-secondary)]"
                    )}
                  >
                    {formatDate(member.expiry)}
                  </span>
                </td>

                {/* Last Payment */}
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                    {formatCurrency(member.lastPayment)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <RowActions member={member} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
        <p className="text-xs text-[var(--text-muted)]">
          Showing {sorted.length} member{sorted.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

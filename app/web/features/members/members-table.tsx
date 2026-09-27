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

function RowActions({
  member,
  onDelete,
}: {
  member: Member;
  onDelete?: (id: string, name: string) => void;
}) {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
          aria-label={`Actions for ${member.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Member actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${workspace}/members/${member.id}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${workspace}/members/${member.id}`} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit member
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${workspace}/members/${member.id}?tab=membership`} className="cursor-pointer">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Renew membership
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/40 focus:text-rose-700 cursor-pointer"
          onClick={() => onDelete?.(member.id, member.name)}
        >
          <Trash2 className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-400" />
          Delete member & user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Members Table ────────────────────────────────────────────────────────────

interface MembersTableProps {
  members: Member[];
  onAddMember: () => void;
  onDeleteMember?: (id: string, name: string) => void;
}

export function MembersTable({ members, onAddMember, onDeleteMember }: MembersTableProps) {
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
                  Repsi Access
                </span>
              </th>
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

                {/* Repsi Access */}
                <td className="px-4 py-3">
                  {member.repsiAccess === "Connected" || member.userId ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Not connected
                    </span>
                  )}
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
                  <RowActions member={member} onDelete={onDeleteMember} />
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

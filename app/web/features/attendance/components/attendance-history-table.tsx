"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiAttendance } from "@/lib/api";

interface AttendanceHistoryTableProps {
  records: ApiAttendance[];
  gymName: string;
}

export function AttendanceHistoryTable({ records, gymName }: AttendanceHistoryTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in" | "out">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "MANUAL" | "AUTO" | "STAFF">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "qr" | "biometric" | "manual">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Filtering
  const filtered = records.filter((r) => {
    const matchesQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.memberId && r.memberId.toLowerCase().includes(query.toLowerCase())) ||
      (r.terminalId && r.terminalId.toLowerCase().includes(query.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in" && r.status === "in") ||
      (statusFilter === "out" && r.status === "out");

    const matchesType =
      typeFilter === "all" || r.checkoutType === typeFilter;

    const matchesMethod =
      methodFilter === "all" || r.method === methodFilter;

    return matchesQuery && matchesStatus && matchesType && matchesMethod;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No attendance records to export");
      return;
    }

    const headers = ["Member Name", "Type", "Check-In", "Check-Out", "Duration", "Method", "Checkout Type", "Status"];
    const rows = filtered.map((r) => [
      `"${r.name}"`,
      r.personType,
      r.checkInTime,
      r.checkOutTime || "Active",
      r.durationFormatted || "0m",
      r.method.toUpperCase(),
      r.checkoutType || "MANUAL",
      r.status === "in" ? "CHECKED_IN" : "CHECKED_OUT",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
      {/* Header and Export Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
            Comprehensive Attendance Log
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Audit trail of check-ins, check-outs, automatic expirations, and visit durations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-9"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search member name or pass ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="in">Currently Inside</option>
            <option value="out">Checked Out</option>
          </select>
        </div>

        {/* Checkout Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
          >
            <option value="all">All Checkout Types</option>
            <option value="MANUAL">Manual Checkout</option>
            <option value="AUTO">Automatic Checkout</option>
            <option value="STAFF">Staff Checkout</option>
          </select>
        </div>

        {/* Method Filter */}
        <div className="sm:col-span-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
            className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
          >
            <option value="all">All Methods</option>
            <option value="qr">QR Code</option>
            <option value="biometric">Biometric</option>
            <option value="manual">Manual Entry</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center space-y-2 border border-dashed border-[var(--border)] rounded-xl">
          <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
          <p className="text-xs font-semibold text-[var(--text)]">No attendance logs match your criteria</p>
          <p className="text-[11px] text-[var(--text-muted)]">Clear filters or search query to see past sessions.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Checkout Type</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  {/* Member Name */}
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[var(--text)]">{item.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {item.personType === "trainer" ? "Trainer" : "Member"}
                    </p>
                  </td>

                  {/* Check In */}
                  <td className="py-3 px-4 font-mono text-[var(--text)]">
                    {item.checkInTime}
                  </td>

                  {/* Check Out */}
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                    {item.checkOutTime || <span className="text-emerald-600 font-semibold">In Progress</span>}
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-4 font-semibold text-[var(--text)]">
                    {item.durationFormatted || "0m"}
                  </td>

                  {/* Checkout Type Badge */}
                  <td className="py-3 px-4">
                    {item.checkoutType === "AUTO" ? (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                        Auto Checkout
                      </Badge>
                    ) : item.checkoutType === "STAFF" ? (
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                        Staff Checked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-[var(--text-muted)]">
                        Manual
                      </Badge>
                    )}
                  </td>

                  {/* Method */}
                  <td className="py-3 px-4 uppercase text-[10px] font-mono text-[var(--text-muted)]">
                    {item.method}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-right">
                    {item.status === "in" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Inside
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

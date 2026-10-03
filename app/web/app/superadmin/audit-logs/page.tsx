"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  ShieldCheck,
  RefreshCw,
  Flame,
  UserCheck,
  AlertTriangle,
  Building2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { repsiApi } from "@/lib/api";

interface AuditLogItem {
  id: string;
  workspace_id?: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
}

export default function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminAuditLogs({
        limit: 150,
        action: actionFilter,
      });
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q)) ||
      (l.workspace_id && l.workspace_id.toLowerCase().includes(q)) ||
      (l.user_id && l.user_id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Audit Trail & Security Ledger</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tamper-evident recording of Super Admin destructive events, tenant deletions, and access mutations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadLogs}
          disabled={loading}
          className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* ── Search & Filter ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action event, details, gym ID..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs overflow-x-auto">
          {[
            { label: "All Events", value: "all" },
            { label: "Deletions", value: "PERMANENT_DELETE_WORKSPACE" },
            { label: "Member Deletions", value: "PERMANENT_DELETE_MEMBER" },
            { label: "Suspensions", value: "SUSPEND_WORKSPACE" },
            { label: "Tenant Creation", value: "CREATE_WORKSPACE" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setActionFilter(item.value)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-[10px] tracking-wider whitespace-nowrap transition-all ${
                actionFilter === item.value
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C1017] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 text-left">Action Event</th>
                <th className="py-3.5 px-4 text-left">Event Details</th>
                <th className="py-3.5 px-4 text-left">Tenant Scope</th>
                <th className="py-3.5 px-4 text-left">Actor ID</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    Querying immutable audit records...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isDestructive =
                    log.action.includes("DELETE") || log.action.includes("SUSPEND");
                  const isCreate =
                    log.action.includes("CREATE") || log.action.includes("ENABLE") || log.action.includes("REACTIVATE");

                  return (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      {/* Action Event */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 ${
                            isDestructive
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : isCreate
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Event Details */}
                      <td className="py-3.5 px-4 text-zinc-200 font-medium max-w-md leading-relaxed">
                        {log.details || "No details provided"}
                      </td>

                      {/* Tenant Scope */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                        {log.workspace_id || "platform"}
                      </td>

                      {/* Actor ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                        {log.user_id ? log.user_id.slice(0, 12) + "..." : "System"}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No audit log events match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

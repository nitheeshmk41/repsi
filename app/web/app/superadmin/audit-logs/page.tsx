"use client";

import { Shield, Clock, Search } from "lucide-react";

const auditLogs = [
  { id: "log-101", admin: "nitheesh@repsi.app", action: "Tenant Plan Upgrade", target: "Apex Fitness Club (Growth Pro -> Enterprise)", ip: "49.37.152.18", time: "14 mins ago", status: "Success" },
  { id: "log-102", admin: "system_cron", action: "Automated Backup Completed", target: "PostgreSQL Database Cluster (repsi_prod)", ip: "10.0.4.12", time: "1 hour ago", status: "Success" },
  { id: "log-103", admin: "nitheesh@repsi.app", action: "Impersonate Gym Session", target: "ironcore (Owner Rajesh Kumar)", ip: "49.37.152.18", time: "3 hours ago", status: "Success" },
  { id: "log-104", admin: "support_ops", action: "Reset MFA Token", target: "user: vikram@ironcore.in", ip: "103.22.41.9", time: "5 hours ago", status: "Success" },
];

export default function SuperAdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Platform Audit Logs</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Immutable event ledger tracking administrative operations, tenant creation, and God-mode access.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 uppercase font-mono">
            <tr>
              <th className="py-3 px-4 text-left">Actor / Initiator</th>
              <th className="py-3 px-4 text-left">Action Event</th>
              <th className="py-3 px-4 text-left">Target Resource</th>
              <th className="py-3 px-4 text-left">Origin IP</th>
              <th className="py-3 px-4 text-left">Timestamp</th>
              <th className="py-3 px-4 text-left">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-zinc-300">{log.admin}</td>
                <td className="py-3 px-4 font-bold text-white">{log.action}</td>
                <td className="py-3 px-4 text-zinc-400">{log.target}</td>
                <td className="py-3 px-4 font-mono text-zinc-500">{log.ip}</td>
                <td className="py-3 px-4 text-zinc-400">{log.time}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/10 text-emerald-400">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

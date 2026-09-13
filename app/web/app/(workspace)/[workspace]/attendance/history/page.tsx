"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { repsiApi } from "@/lib/api";

export default function AttendanceHistoryPage() {
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    repsiApi.getAttendance().then((res) => setRecords(res));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${workspace}/attendance`}
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Attendance History
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Comprehensive log of all gym visits and scan times
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Historical Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase">
                <tr>
                  <th className="py-2.5 text-left">Member Name</th>
                  <th className="py-2.5 text-left">Date</th>
                  <th className="py-2.5 text-left">Check In</th>
                  <th className="py-2.5 text-left">Check Out</th>
                  <th className="py-2.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="py-3 font-medium text-[var(--text)]">{r.memberName || r.member_name}</td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {new Date(r.checkInTime || r.check_in_time).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-mono text-xs text-[var(--text-secondary)]">
                      {new Date(r.checkInTime || r.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 font-mono text-xs text-[var(--text-secondary)]">
                      {r.checkOutTime || r.check_out_time ? new Date(r.checkOutTime || r.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

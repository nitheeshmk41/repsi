"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// Custom tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-[var(--shadow-md)] text-xs">
      <div className="font-medium text-[var(--text)] mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-secondary)] capitalize">
            {entry.dataKey}:
          </span>
          <span className="font-medium text-[var(--text)] tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--text)]">Revenue Overview</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Last 12 months · Revenue vs Expenses
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
            <span className="text-[var(--text-secondary)]">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
            <span className="text-[var(--text-secondary)]">Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#84CC16" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#84CC16" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#475569" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#475569" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#84CC16"
            strokeWidth={2}
            fill="url(#revGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#84CC16", strokeWidth: 2, stroke: "var(--surface)" }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#475569"
            strokeWidth={1.5}
            fill="url(#expGradient)"
            dot={false}
            activeDot={{ r: 3, fill: "#475569", strokeWidth: 2, stroke: "var(--surface)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

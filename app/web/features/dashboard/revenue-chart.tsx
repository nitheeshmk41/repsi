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
import { formatCurrency } from "@/lib/utils";

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
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.04)] text-xs">
      <div className="font-semibold text-[#172033] mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#64748B] capitalize">
            {entry.dataKey}:
          </span>
          <span className="font-bold text-[#172033] tabular-nums">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: { data?: Array<{ label: string; value: number }> }) {
  const chartData = data || [
    { label: "Oct", value: 0 },
    { label: "Nov", value: 0 },
    { label: "Dec", value: 0 },
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
  ];

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#172033] dark:text-white">Revenue Overview</h2>
          <p className="text-sm text-[#64748B] dark:text-zinc-400 mt-0.5">
            Last 6 months · Authenticated Gym Revenue
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-[#64748B] dark:text-zinc-400 font-medium">Revenue</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748B", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#16A34A"
            strokeWidth={2}
            fill="url(#revGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#16A34A", strokeWidth: 2, stroke: "#FFFFFF" }}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

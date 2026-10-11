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
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#22332a] bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-xs">
      <div className="font-bold text-[#172033] dark:text-[#f4f8f6] mb-1.5">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#64748B] dark:text-[#889b90] capitalize">
            {entry.dataKey}:
          </span>
          <span className="font-bold text-[#172033] dark:text-[#25d979] tabular-nums">
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
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#22332a] bg-white dark:bg-[#101b16] dark:bg-gradient-to-b dark:from-[#12221a] dark:to-[#0e1713] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-[#172033] dark:text-[#f4f8f6] tracking-tight">Revenue Overview</h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#889b90] mt-0.5">
            Last 6 months · Authenticated Gym Revenue
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] dark:bg-[#25d979] shadow-[0_0_8px_rgba(37,217,121,0.4)]" />
            <span className="text-[#64748B] dark:text-[#889b90] font-semibold">Revenue</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#25d979" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#25d979" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--divider, #1e2d26)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-muted, #718079)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted, #718079)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--divider, #1e2d26)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#25d979"
            strokeWidth={2}
            fill="url(#revGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#25d979", strokeWidth: 2, stroke: "#08110D" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#22332a] bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-xs">
      <div className="font-bold text-[#172033] dark:text-[#f4f8f6] mb-1">{label}</div>
      <div className="text-[#64748B] dark:text-[#889b90]">
        Check-ins:{" "}
        <span className="font-bold text-[#172033] dark:text-[#25d979] tabular-nums">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

export function AttendanceChart({ data }: { data?: Array<{ label: string; value: number }> }) {
  const chartData = data || [
    { label: "Mon", value: 0 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 0 },
    { label: "Thu", value: 0 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 0 },
    { label: "Sun", value: 0 },
  ];

  const totalThisWeek = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#22332a] bg-white dark:bg-[#101b16] dark:bg-gradient-to-b dark:from-[#12221a] dark:to-[#0e1713] p-4 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-[#172033] dark:text-[#f4f8f6] tracking-tight">Attendance</h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#889b90] mt-0.5">
            Daily check-ins this week
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[#172033] dark:text-[#f4f8f6] tabular-nums">
            {totalThisWeek}
          </div>
          <div className="text-xs text-[#64748B] dark:text-[#889b90] font-medium">Total this week</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
          barSize={28}
        >
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
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-soft, rgba(37,217,121,0.06))", radius: 4 }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => {
              const isLatest = index === chartData.length - 1;
              const hasActivity = entry.value > 0;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    hasActivity || isLatest
                      ? "#25d979"
                      : "var(--surface-soft, #1b2c24)"
                  }
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

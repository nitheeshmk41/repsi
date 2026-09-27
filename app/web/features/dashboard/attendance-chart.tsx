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
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.04)] text-xs">
      <div className="font-semibold text-[#172033] mb-1">{label}</div>
      <div className="text-[#64748B]">
        Check-ins:{" "}
        <span className="font-bold text-[#172033]">
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
    <div className="rounded-[12px] border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#172033] dark:text-white">Attendance</h2>
          <p className="text-sm text-[#64748B] dark:text-zinc-400 mt-0.5">
            Daily check-ins this week
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[#172033] dark:text-white tabular-nums">
            {totalThisWeek}
          </div>
          <div className="text-xs text-[#64748B] dark:text-zinc-400 font-medium">Total this week</div>
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
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F7F5", radius: 4 }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === chartData.length - 1 ? "#16A34A" : "#E5E7EB"}
              />
            ))}

          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

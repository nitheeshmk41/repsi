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
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-[var(--shadow-md)] text-xs">
      <div className="font-medium text-[var(--text)] mb-1">{label}</div>
      <div className="text-[var(--text-secondary)]">
        Check-ins:{" "}
        <span className="font-semibold text-[var(--text)]">
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
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--text)]">Attendance</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Daily check-ins this week
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[var(--text)] tabular-nums">
            {totalThisWeek}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Total this week</div>
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
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)", radius: 4 }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === chartData.length - 1 ? "#84CC16" : "var(--border-strong)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

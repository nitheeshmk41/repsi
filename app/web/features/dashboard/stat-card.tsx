import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  sublabel?: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  isCurrency?: boolean;
  iconName?: "users" | "trending-up" | "calendar-check" | "alert-triangle";
}

// We render icons inline by name to keep this a server component
function StatIcon({ name }: { name?: StatCardProps["iconName"] }) {
  const cls = "h-4 w-4 text-[var(--text-muted)]";
  // SVG paths for each icon (from Lucide)
  switch (name) {
    case "users":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "trending-up":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "calendar-check":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case "alert-triangle":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export function StatCard({
  label,
  sublabel,
  value,
  change,
  changeType,
  isCurrency = false,
  iconName,
}: StatCardProps) {
  const isPositive = changeType === "increase";
  const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value);
  const absChange = Math.abs(change);

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        {iconName && (
          <div className="h-8 w-8 rounded-[8px] bg-[var(--background)] flex items-center justify-center border border-[var(--border)]">
            <StatIcon name={iconName} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-2xl font-bold text-[var(--text)] tracking-tight tabular-nums">
          {formattedValue}
        </span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium",
            isPositive ? "text-[var(--success)]" : "text-[var(--error)]"
          )}
        >
          {isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M7 17 17 7" /><path d="M7 7h10v10" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="m7 7 10 10" /><path d="M17 7v10H7" />
            </svg>
          )}
          {absChange}%
        </span>
        {sublabel && (
          <span className="text-xs text-[var(--text-muted)]">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

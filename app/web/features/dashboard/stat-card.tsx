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
  const cls = "h-4 w-4 stroke-[2.5]";
  // SVG paths for each icon (from Lucide)
  switch (name) {
    case "users":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "trending-up":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "calendar-check":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case "alert-triangle":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    default:
      return null;
  }
}

function getIconBadgeClass(name?: StatCardProps["iconName"]) {
  switch (name) {
    case "users":
      return "bg-[#ECFDF3] text-[#15803D] border-[#DCFCE7] dark:bg-emerald-500/10 dark:text-[#25d979] dark:border-emerald-500/20 dark:shadow-[0_0_14px_rgba(37,217,121,0.12)]";
    case "trending-up":
      return "bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE] dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 dark:shadow-[0_0_14px_rgba(96,165,250,0.12)]";
    case "calendar-check":
      return "bg-[#F3E8FF] text-[#7C3AED] border-[#E9D5FF] dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 dark:shadow-[0_0_14px_rgba(192,132,252,0.12)]";
    case "alert-triangle":
      return "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 dark:shadow-[0_0_14px_rgba(251,191,36,0.12)]";
    default:
      return "bg-slate-100 text-[#64748B] border-[#E5E7EB] dark:bg-white/[0.06] dark:text-[#aab8b1] dark:border-white/10";
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
  const isPositive = changeType === "increase" && change > 0;
  const isNegative = changeType === "decrease" && change > 0;
  const isNeutral = change === 0;
  const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value);
  const absChange = Math.abs(change);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#22332a] bg-white dark:bg-[#101b16] dark:bg-gradient-to-b dark:from-[#12221a] dark:to-[#0e1713] p-4 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:shadow-md dark:hover:border-[#25d979]/40 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#889b90]">{label}</span>
        {iconName && (
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105", getIconBadgeClass(iconName))}>
            <StatIcon name={iconName} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-3xl font-extrabold text-[#172033] dark:text-[#f4f8f6] tracking-tight tabular-nums">
          {formattedValue}
        </span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] dark:border-[#1e2f26] mt-3">
        {isNeutral ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/80 dark:bg-white/[0.05] dark:text-[#889b90] dark:border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-[#718079]" />
            0%
          </span>
        ) : isPositive ? (
          <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#B7E4C7] dark:bg-emerald-500/15 dark:text-[#25d979] dark:border-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M7 17 17 7" /><path d="M7 7h10v10" />
            </svg>
            +{absChange}%
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="m7 7 10 10" /><path d="M17 7v10H7" />
            </svg>
            -{absChange}%
          </span>
        )}
        {sublabel && (
          <span className="text-xs font-medium text-[#64748B] dark:text-[#889b90] truncate">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

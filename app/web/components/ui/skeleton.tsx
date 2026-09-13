import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[6px] bg-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for a single stat card
 */
function StatCardSkeleton() {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-[8px]" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

/**
 * Skeleton for the dashboard header
 */
function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-9 w-32 rounded-[8px]" />
    </div>
  );
}

/**
 * Skeleton for a chart card
 */
function ChartSkeleton() {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-8 w-24 rounded-[8px]" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-[8px]" />
    </div>
  );
}

/**
 * Skeleton for a table row
 */
function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)]">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-40" : "flex-1")}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for a full table
 */
function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3", i === 0 ? "w-32" : "flex-1")}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </div>
  );
}

export {
  Skeleton,
  StatCardSkeleton,
  DashboardHeaderSkeleton,
  ChartSkeleton,
  TableSkeleton,
  TableRowSkeleton,
};

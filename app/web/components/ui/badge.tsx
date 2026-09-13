import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border)]",
        active:
          "bg-[var(--success-soft)] text-[var(--success-foreground)] border border-[var(--success)]/20",
        expiring:
          "bg-[var(--warning-soft)] text-[var(--warning-foreground)] border border-[var(--warning)]/20",
        expired:
          "bg-[var(--error-soft)] text-[var(--error-foreground)] border border-[var(--error)]/20",
        frozen:
          "bg-[var(--info-soft)] text-[var(--info-foreground)] border border-[var(--info)]/20",
        cancelled:
          "bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border)]",
        lime:
          "bg-[var(--primary-soft)] text-[var(--primary-dark)] border border-[var(--primary)]/20 dark:text-[var(--primary-hover)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

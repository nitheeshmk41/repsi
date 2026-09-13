import type { ReactNode } from "react";

// Generates a stub "Coming Soon" page for a given route
function ComingSoonPage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-base font-semibold text-[var(--text)] mb-2">{title} — Coming in Phase 8</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-sm">
          This section is under active development. The design system and architecture
          are in place — features will be implemented progressively.
        </p>
      </div>
    </div>
  );
}

export default ComingSoonPage;
export type { ComingSoonPage };

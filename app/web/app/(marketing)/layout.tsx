import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "REPSI — Run your studio. Grow your business.",
  description:
    "Manage members, memberships, attendance, trainers, payments, and analytics — all in one place.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="light bg-white text-zinc-900 min-h-screen font-sans antialiased">
      {children}
    </div>
  );
}


import type { Metadata } from "next";
import { DashboardClient } from "@/features/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function WorkspaceDashboardPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  return <DashboardClient workspace={workspace} />;
}

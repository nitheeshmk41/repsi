import type { Metadata } from "next";
import { MembersClient } from "@/features/members/members-client";
import { slugToGymName } from "@/lib/workspace";

export const metadata: Metadata = {
  title: "Members",
  description: "Manage your gym members — view, add, edit, and track membership status.",
};

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  const gymName = slugToGymName(workspace);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Members</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage and track all {gymName} members, memberships, and their activity.
        </p>
      </div>

      {/* Members Table + Controls */}
      <MembersClient initialMembers={[]} />
    </div>
  );
}

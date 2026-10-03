import { redirect } from "next/navigation";

export default async function NewMembershipPage(props: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await props.params;
  redirect(`/${workspace}/memberships?new=true`);
}

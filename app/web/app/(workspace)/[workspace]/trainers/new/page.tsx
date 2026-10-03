import { redirect } from "next/navigation";

export default async function NewTrainerPage(props: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await props.params;
  redirect(`/${workspace}/trainers?new=true`);
}

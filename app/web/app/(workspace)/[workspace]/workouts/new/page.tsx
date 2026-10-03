import { redirect } from "next/navigation";

export default async function NewWorkoutPage(props: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await props.params;
  redirect(`/${workspace}/workouts?new=true`);
}

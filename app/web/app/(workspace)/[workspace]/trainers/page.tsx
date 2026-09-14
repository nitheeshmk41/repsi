import type { Metadata } from "next";
import { TrainersClient } from "@/features/trainers/trainers-client";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Manage gym personal trainers, certifications, and assigned clients.",
};

export default function WorkspaceTrainersPage() {
  return <TrainersClient />;
}

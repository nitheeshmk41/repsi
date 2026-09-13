import type { Metadata } from "next";
import { PaymentsClient } from "@/features/payments/payments-client";

export const metadata: Metadata = {
  title: "Payments",
  description: "Track payments, invoices, and financial transactions.",
};

export default function WorkspacePaymentsPage() {
  return <PaymentsClient />;
}

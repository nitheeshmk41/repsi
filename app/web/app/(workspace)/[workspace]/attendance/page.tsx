import type { Metadata } from "next";
import { AttendanceClient } from "@/features/attendance/attendance-client";

export const metadata: Metadata = {
  title: "Attendance",
  description: "Track daily gym attendance, check-ins, and attendance history.",
};

export default function WorkspaceAttendancePage() {
  return <AttendanceClient />;
}

// ─── Shared Domain Types ──────────────────────────────────────────────────────
// These types mirror the backend Pydantic schemas and are used across
// all frontend features. When the FastAPI backend is integrated, the
// API client will return these exact shapes.

export type MemberStatus = "active" | "expiring" | "expired" | "frozen" | "cancelled";
export type MembershipPlanName = "Monthly" | "Quarterly" | "Annual" | "Day Pass";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: MembershipPlanName;
  status: MemberStatus;
  joined: string; // ISO date string
  expiry: string; // ISO date string
  lastPayment: number; // INR amount
  avatar?: string;
  trainerId?: string;
  notes?: string;
}

export type TrainerStatus = "active" | "inactive";

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  status: TrainerStatus;
  memberCount: number;
  joined: string;
  avatar?: string;
}

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer";

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  description: string;
  invoiceNumber?: string;
}

export type AttendanceStatus = "checked_in" | "checked_out";

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkIn: string; // ISO datetime
  checkOut?: string; // ISO datetime
  status: AttendanceStatus;
}

export interface ClassSession {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  schedule: string; // e.g. "Mon, Wed, Fri 7:00 PM"
  capacity: number;
  enrolled: number;
  status: "active" | "cancelled" | "completed";
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ─── Filter / Sort Types ──────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc";

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface MemberFilters {
  status?: MemberStatus;
  plan?: MembershipPlanName;
  search?: string;
  page?: number;
  perPage?: number;
  sort?: TableSort;
}

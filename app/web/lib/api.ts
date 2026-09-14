/**
 * REPSI API Client & Persistence Bridge
 *
 * Connects the Next.js frontend to the FastAPI + PostgreSQL backend.
 * Provides resilient local fallbacks so the app operates smoothly both
 * in standalone preview mode and with live FastAPI backend running.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "expiring" | "expired" | "frozen" | "cancelled";
  plan: string;
  joinedDate: string;
  avatarUrl?: string;
  gender?: string;
  emergencyContact?: string;
}

export interface ApiAttendance {
  id: string;
  name: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "in" | "out";
  method: "qr" | "biometric" | "manual";
}

export interface ApiPayment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  method: "upi" | "card" | "cash";
  plan: string;
  date: string;
  status: "success" | "pending";
}

// Initial Seed Data matching the user flow spec
const SEED_MEMBERS: ApiMember[] = [
  {
    id: "mem_arun_001",
    name: "Arun Kumar",
    email: "arun@example.com",
    phone: "+91 98450 11001",
    status: "active",
    plan: "Monthly",
    joinedDate: "13 Aug 2026",
    gender: "Male",
  },
  {
    id: "mem_rahul_002",
    name: "Rahul Verma",
    email: "rahul@example.com",
    phone: "+91 98450 22002",
    status: "active",
    plan: "Yearly",
    joinedDate: "01 Jan 2026",
    gender: "Male",
  },
  {
    id: "mem_karthik_003",
    name: "Karthik Raja",
    email: "karthik@example.com",
    phone: "+91 98450 33003",
    status: "expiring",
    plan: "Monthly",
    joinedDate: "15 Aug 2026",
    gender: "Male",
  },
  {
    id: "mem_priya_004",
    name: "Priya Venkat",
    email: "priya@example.com",
    phone: "+91 98450 44004",
    status: "active",
    plan: "Quarterly",
    joinedDate: "10 Jul 2026",
    gender: "Female",
  },
  {
    id: "mem_ananya_005",
    name: "Ananya Krishnan",
    email: "ananya@example.com",
    phone: "+91 98450 55005",
    status: "active",
    plan: "Half-Yearly",
    joinedDate: "20 Jun 2026",
    gender: "Female",
  },
];

const SEED_ATTENDANCE: ApiAttendance[] = [
  { id: "att-001", name: "Arun Kumar", memberId: "mem_arun_001", checkInTime: "06:42 AM", status: "in", method: "qr" },
  { id: "att-002", name: "Priya Venkat", memberId: "mem_priya_004", checkInTime: "07:05 AM", status: "in", method: "qr" },
  { id: "att-003", name: "Ananya Krishnan", memberId: "mem_ananya_005", checkInTime: "07:24 AM", checkOutTime: "08:15 AM", status: "out", method: "biometric" },
];

const SEED_PAYMENTS: ApiPayment[] = [
  { id: "pay-001", memberId: "mem_arun_001", memberName: "Arun Kumar", amount: 1000, method: "upi", plan: "Monthly", date: "13 Sep 2026", status: "success" },
  { id: "pay-002", memberId: "mem_rahul_002", memberName: "Rahul Verma", amount: 9000, method: "card", plan: "Yearly", date: "01 Jan 2026", status: "success" },
  { id: "pay-003", memberId: "mem_priya_004", memberName: "Priya Venkat", amount: 2700, method: "upi", plan: "Quarterly", date: "10 Jul 2026", status: "success" },
];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(`repsi_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`repsi_${key}`, JSON.stringify(val));
    window.dispatchEvent(new Event("repsi_storage_update"));
  } catch (err) {
    console.error("Failed to persist to storage", err);
  }
}

export const repsiApi = {
  // Members
  async getMembers(): Promise<ApiMember[]> {
    try {
      const res = await fetch(`${API_BASE}/members/`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const apiMapped: ApiMember[] = data.items.map((m: any) => ({
            id: m.id,
            name: `${m.first_name} ${m.last_name}`.trim(),
            email: m.email,
            phone: m.phone,
            status: m.status,
            plan: "Monthly",
            joinedDate: m.joined_date || "13 Sep 2026",
            avatarUrl: m.avatar_url,
          }));
          return apiMapped;
        }
      }
    } catch {
      // Backend not running, use local persistent store
    }
    return getStored<ApiMember[]>("members", SEED_MEMBERS);
  },

  async createMember(member: {
    name: string;
    phone: string;
    email: string;
    gender?: string;
    plan?: string;
    emergencyContact?: string;
  }): Promise<ApiMember> {
    const parts = member.name.trim().split(" ");
    const firstName = parts[0] || "Member";
    const lastName = parts.slice(1).join(" ") || "";

    const newMem: ApiMember = {
      id: `mem-${Date.now()}`,
      name: member.name,
      email: member.email,
      phone: member.phone,
      status: "active",
      plan: member.plan || "Monthly",
      joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      gender: member.gender,
      emergencyContact: member.emergencyContact,
    };

    // Attempt to persist to FastAPI backend
    try {
      await fetch(`${API_BASE}/members/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: member.email,
          phone: member.phone,
          gender: member.gender,
          emergency_contact: member.emergencyContact,
        }),
      });
    } catch {
      // Standalone mode
    }

    // Persist to local store
    const current = getStored<ApiMember[]>("members", SEED_MEMBERS);
    const updated = [newMem, ...current];
    setStored("members", updated);
    return newMem;
  },

  // Attendance
  async getTodayAttendance(): Promise<ApiAttendance[]> {
    return getStored<ApiAttendance[]>("attendance", SEED_ATTENDANCE);
  },

  async getAttendance(): Promise<ApiAttendance[]> {
    return getStored<ApiAttendance[]>("attendance", SEED_ATTENDANCE);
  },

  async checkInMember(memberId: string, memberName: string): Promise<ApiAttendance> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const newRecord: ApiAttendance = {
      id: `att-${Date.now()}`,
      memberId,
      name: memberName,
      checkInTime: timeStr,
      status: "in",
      method: "qr",
    };

    try {
      await fetch(`${API_BASE}/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, method: "qr" }),
      });
    } catch {
      // Standalone mode
    }

    const current = getStored<ApiAttendance[]>("attendance", SEED_ATTENDANCE);
    const updated = [newRecord, ...current.filter((a) => a.memberId !== memberId)];
    setStored("attendance", updated);
    return newRecord;
  },

  async checkOutMember(attendanceId: string): Promise<void> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    try {
      await fetch(`${API_BASE}/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance_id: attendanceId }),
      });
    } catch {
      // Standalone mode
    }

    const current = getStored<ApiAttendance[]>("attendance", SEED_ATTENDANCE);
    const updated = current.map((a) =>
      a.id === attendanceId ? { ...a, status: "out" as const, checkOutTime: timeStr } : a
    );
    setStored("attendance", updated);
  },

  // Payments
  async getPayments(): Promise<ApiPayment[]> {
    return getStored<ApiPayment[]>("payments", SEED_PAYMENTS);
  },

  async recordPayment(payment: {
    memberId: string;
    memberName: string;
    amount: number;
    method: "upi" | "card" | "cash";
    plan: string;
  }): Promise<ApiPayment> {
    const newPay: ApiPayment = {
      id: `pay-${Date.now()}`,
      memberId: payment.memberId,
      memberName: payment.memberName,
      amount: payment.amount,
      method: payment.method,
      plan: payment.plan,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "success",
    };

    try {
      await fetch(`${API_BASE}/payments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: payment.memberId,
          amount: payment.amount,
          method: payment.method,
        }),
      });
    } catch {
      // Standalone mode
    }

    const current = getStored<ApiPayment[]>("payments", SEED_PAYMENTS);
    setStored("payments", [newPay, ...current]);
    return newPay;
  },

  // Invitations
  async sendInvitation(invitation: {
    name: string;
    email: string;
    phone?: string;
    role: "member" | "trainer";
    specialization?: string;
  }): Promise<{ status: string; message: string; invitation?: any }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("repsi_auth_token") : null;
    const slug = typeof window !== "undefined" ? localStorage.getItem("repsi_workspace_slug") || "apex-fitness" : "apex-fitness";

    try {
      const res = await fetch(`${API_BASE}/invitations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Slug": slug,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(invitation),
      });

      if (res.ok) {
        const data = await res.json();
        return { status: "success", message: `Invitation sent to ${invitation.email}`, invitation: data };
      } else {
        const err = await res.json();
        throw new Error(err.detail || "Failed to send invitation");
      }
    } catch (e: any) {
      if (e.message) throw e;
      // Dev mode fallback
      return { status: "success", message: `[Dev Mode] Invitation queued for ${invitation.email}` };
    }
  },

  async verifyInvitation(tokenStr: string): Promise<{
    id: string;
    email: string;
    name: string;
    role: "member" | "trainer";
    gym_name: string;
    gym_slug: string;
    invited_by_name?: string;
    status: string;
  }> {
    const res = await fetch(`${API_BASE}/invitations/verify?token=${encodeURIComponent(tokenStr)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Invalid or expired invitation link.");
    }
    return await res.json();
  },

  async acceptInvitation(req: { token: string; password: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/invitations/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to accept invitation.");
    }
    return await res.json();
  },
};


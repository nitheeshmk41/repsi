/**
 * REPSI API Client
 *
 * Connects the Next.js frontend to the FastAPI + PostgreSQL backend.
 * Uses Bearer JWT authentication for all protected workspace queries.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";

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
  memberId?: string;
  trainerId?: string;
  personType: "member" | "trainer";
  checkInTime: string;
  checkOutTime?: string;
  status: "in" | "out";
  method: "qr" | "biometric" | "manual";
  terminalId?: string;
}

export interface ApiTrainer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  specialization?: string;
  hourly_rate?: number;
  commission_percentage?: number;
  bio?: string;
  status?: string;
  is_active?: boolean;
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

function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )repsi_session=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("repsi_auth_token") || getAuthCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function checkAuthResponse(res: Response) {
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("repsi_auth_token");
    window.dispatchEvent(new CustomEvent("repsi:auth_expired"));
  }
}

export const repsiApi = {
  // Members
  async getMembers(): Promise<ApiMember[]> {
    try {
      const res = await fetch(`${API_BASE}/members/`, {
        headers: {
          ...getAuthHeader(),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.items || []);
        return list.map((m: any) => ({
          id: m.id,
          name: `${m.first_name || ""} ${m.last_name || ""}`.trim(),
          email: m.email,
          phone: m.phone || "",
          status: m.status || "active",
          plan: m.plan_name || "Monthly",
          joinedDate: m.joined_date || new Date().toLocaleDateString("en-GB"),
          avatarUrl: undefined,
          gender: m.gender,
          emergencyContact: m.emergency_contact,
        }));
      }
      checkAuthResponse(res);
      return [];
    } catch (err) {
      console.warn("Failed to fetch members", err);
      return [];
    }
  },

  async createMember(member: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    plan?: string;
    gender?: string;
    emergencyContact?: string;
  }): Promise<ApiMember> {
    const parts = member.name.trim().split(" ");
    const firstName = parts[0] || "Member";
    const lastName = parts.slice(1).join(" ") || "";

    const res = await fetch(`${API_BASE}/members/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: member.email,
        phone: member.phone,
        password: member.password,
        plan_name: member.plan,
        gender: member.gender,
        emergency_contact: member.emergencyContact,
      }),
    });

    if (!res.ok) {
      checkAuthResponse(res);
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create member");
    }

    const m = await res.json();
    return {
      id: m.id,
      name: `${m.first_name || ""} ${m.last_name || ""}`.trim(),
      email: m.email,
      phone: m.phone || "",
      status: m.status || "active",
      plan: m.plan_name || member.plan || "Monthly",
      joinedDate: m.joined_date || new Date().toLocaleDateString("en-GB"),
      gender: m.gender,
      emergencyContact: m.emergency_contact,
    };
  },

  async deleteMember(id: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      checkAuthResponse(res);
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to delete member");
    }

    return await res.json();
  },

  async getMember(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load member details");
    return await res.json();
  },

  async updateMember(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      checkAuthResponse(res);
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update member");
    }
    return await res.json();
  },

  async renewMember(id: string, data?: any): Promise<any> {
    const res = await fetch(`${API_BASE}/members/${id}/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) {
      checkAuthResponse(res);
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to renew member");
    }
    return await res.json();
  },

  // Attendance
  async getTodayAttendance(): Promise<ApiAttendance[]> {
    return this.getAttendance();
  },

  async getAttendance(): Promise<ApiAttendance[]> {
    try {
      const res = await fetch(`${API_BASE}/attendance/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((a: any) => ({
            id: a.id,
            name: a.person_name || a.member?.first_name || a.trainer?.name || (a.trainer_id ? "Trainer" : "Member"),
            memberId: a.member_id || undefined,
            trainerId: a.trainer_id || undefined,
            personType: (a.person_type || (a.trainer_id ? "trainer" : "member")) as "member" | "trainer",
            checkInTime: a.check_in_time
              ? new Date(a.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
            checkOutTime: a.check_out_time
              ? new Date(a.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : undefined,
            status: (a.attendance_status || (a.check_out_time ? "out" : "in")) as "in" | "out",
            method: (a.method || "qr") as "qr" | "biometric" | "manual",
            terminalId: a.terminal_id,
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch attendance", err);
    }
    return [];
  },

  async getAttendanceSummary(): Promise<{
    today_total: number;
    currently_inside: number;
    peak_hour: string;
    average_dwell_minutes: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/attendance/summary`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch attendance summary", err);
    }
    return { today_total: 0, currently_inside: 0, peak_hour: "06:00 – 08:30 AM", average_dwell_minutes: 60 };
  },

  async checkIn(data: {
    memberId?: string;
    trainerId?: string;
    identifier?: string;
    method?: string;
    terminalId?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/attendance/check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        member_id: data.memberId,
        trainer_id: data.trainerId,
        identifier: data.identifier,
        method: data.method || "manual",
        terminal_id: data.terminalId || "MAIN_DOOR",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to process check-in");
    }

    return await res.json();
  },

  async checkInMember(memberId: string, memberName?: string): Promise<ApiAttendance> {
    const res = await this.checkIn({ memberId, method: "manual" });
    return {
      id: res.id,
      memberId: res.member_id,
      name: memberName || res.person_name || "Member",
      personType: "member",
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "in",
      method: "manual",
    };
  },

  async checkInTrainer(trainerId: string, trainerName?: string): Promise<ApiAttendance> {
    const res = await this.checkIn({ trainerId, method: "manual" });
    return {
      id: res.id,
      trainerId: res.trainer_id,
      name: trainerName || res.person_name || "Trainer",
      personType: "trainer",
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "in",
      method: "manual",
    };
  },

  async checkOut(attendanceId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/attendance/check-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ attendance_id: attendanceId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to check out");
    }
  },

  async checkOutMember(attendanceId: string): Promise<void> {
    return this.checkOut(attendanceId);
  },

  async scanQr(identifier: string): Promise<{
    status: string;
    action: "check_in" | "check_out";
    person_name: string;
    person_type: string;
    message: string;
    record: any;
  }> {
    const res = await fetch(`${API_BASE}/attendance/scan-qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ identifier, method: "qr" }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Invalid or unrecognized QR pass");
    }

    return await res.json();
  },

  // Payments
  async getPayments(): Promise<ApiPayment[]> {
    try {
      const res = await fetch(`${API_BASE}/payments/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((p: any) => ({
            id: p.id,
            memberId: p.member_id || "",
            memberName: p.member_name || "Gym Member",
            amount: p.amount,
            method: p.method || "upi",
            plan: "Membership Plan",
            date: p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-GB") : "",
            status: p.status || "success",
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch payments", err);
    }
    return [];
  },

  async recordPayment(payment: {
    memberId: string;
    memberName: string;
    amount: number;
    method: "upi" | "card" | "cash";
    plan: string;
  }): Promise<ApiPayment> {
    const res = await fetch(`${API_BASE}/payments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        member_id: payment.memberId,
        amount: payment.amount,
        method: payment.method,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to record payment");
    }

    const p = await res.json();
    return {
      id: p.id,
      memberId: payment.memberId,
      memberName: payment.memberName,
      amount: p.amount,
      method: payment.method,
      plan: payment.plan,
      date: new Date().toLocaleDateString("en-GB"),
      status: "success",
    };
  },

  // Explicit Owner Seed Demo Data
  async seedDemoData(): Promise<void> {
    const res = await fetch(`${API_BASE}/workspaces/seed-demo-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to seed demo data");
    }
  },

  // Invitations
  async sendInvitation(invitation: {
    name: string;
    email: string;
    phone?: string;
    role: "member" | "trainer";
    specialization?: string;
  }): Promise<{ status: string; message: string; invitation?: any }> {
    const res = await fetch(`${API_BASE}/invitations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
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
  },

  async directAddUser(data: {
    name: string;
    email: string;
    phone?: string;
    role: "member" | "trainer";
    password?: string;
    specialization?: string;
  }): Promise<{ status: string; message: string; user_id?: string; email?: string; password?: string }> {
    const res = await fetch(`${API_BASE}/invitations/direct-add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return await res.json();
    } else {
      const err = await res.json();
      throw new Error(err.detail || "Failed to add user directly");
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

  // Machines / Equipment
  async getMachines(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/machines/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch machines", err);
    }
    return [];
  },

  async createMachine(data: {
    name: string;
    category?: string;
    brand?: string;
    model?: string;
    muscle_group?: string;
    status?: string;
    instructions?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/machines/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create equipment");
    }
    return await res.json();
  },

  async updateMachine(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/machines/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to update equipment");
    }
    return await res.json();
  },

  async deleteMachine(id: string): Promise<void> {
    await fetch(`${API_BASE}/machines/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
  },

  // Workouts
  async getWorkouts(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/workouts/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch workouts", err);
    }
    return [];
  },

  async createWorkout(data: {
    title: string;
    difficulty?: string;
    target_muscle_groups?: string;
    description?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/workouts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create workout plan");
    }
    return await res.json();
  },

  // Expenses
  async getExpenses(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/expenses/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch expenses", err);
    }
    return [];
  },

  async recordExpense(data: {
    title: string;
    category: string;
    amount: number;
    vendor?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/expenses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to record expense");
    }
    return await res.json();
  },

  // Classes
  async getClasses(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/classes/`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch classes", err);
    }
    return [];
  },

  async createClass(data: {
    name: string;
    schedule: string;
    category?: string;
    capacity?: number;
    room?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/classes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to schedule class");
    }
    return await res.json();
  },

  // CSV Import & Export
  async importMembersCsv(file: File): Promise<{
    status: string;
    total_rows: number;
    imported: number;
    duplicates: number;
    errors: number;
    details: any[];
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/members/import-csv`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "CSV import failed");
    }
    return await res.json();
  },

  getExportMembersCsvUrl(): string {
    return `${API_BASE}/members/export-csv`;
  },

  // Membership Expiry & WhatsApp Renewal Engine
  async getExpiringMemberships(days = 7): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/memberships/expiring?days=${days}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch expiring memberships", err);
    }
    return [];
  },

  async getRenewalReminders(days = 7): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/memberships/renewal-reminders?days=${days}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch renewal reminders", err);
    }
    return [];
  },

  async checkMembershipExpiries(): Promise<any> {
    const res = await fetch(`${API_BASE}/memberships/check-expiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Expiry audit check failed");
    }
    return await res.json();
  },

  async getMembershipPlans(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/memberships/plans`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch membership plans", err);
    }
    return [];
  },

  async createMembershipPlan(data: { name: string; price: number; duration_months: number; description?: string; features?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/memberships/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create membership plan");
    }
    return await res.json();
  },

  async updateMembershipPlan(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/memberships/plans/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update membership plan");
    }
    return await res.json();
  },

  async deleteMembershipPlan(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/memberships/plans/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to delete membership plan");
    }
    return await res.json();
  },

  // Invoices & Receipts
  async getInvoices(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/payments/invoices`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch invoices", err);
    }
    return [];
  },

  // Cashfree Gateway
  async createCashfreeOrder(data: {
    amount: number;
    currency?: string;
    member_id?: string;
    membership_id?: string;
    notes?: Record<string, any>;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/cashfree/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create Cashfree order");
    }
    return await res.json();
  },

  async verifyCashfreePayment(data: {
    cashfree_order_id?: string;
    order_id?: string;
    cashfree_payment_id?: string;
    payment_id?: string;
    signature?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    member_id?: string;
    amount: number;
    membership_id?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/cashfree/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Cashfree payment verification failed");
    }
    return await res.json();
  },

  // Razorpay Gateway (Compatibility Aliases)
  async createRazorpayOrder(data: any): Promise<any> {
    return this.createCashfreeOrder(data);
  },

  async verifyRazorpayPayment(data: any): Promise<any> {
    return this.verifyCashfreePayment(data);
  },

  // CRM Endpoints
  async getCrmDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/dashboard`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load CRM dashboard");
    return await res.json();
  },

  async getCrmLeads(params?: {
    query?: string;
    status?: string;
    source?: string;
    priority?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ items: any[]; total: number; page: number; page_size: number }> {
    const q = new URLSearchParams();
    if (params?.query) q.set("query", params.query);
    if (params?.status && params.status !== "all") q.set("status", params.status);
    if (params?.source && params.source !== "all") q.set("source", params.source);
    if (params?.priority && params.priority !== "all") q.set("priority", params.priority);
    if (params?.page) q.set("page", params.page.toString());
    if (params?.page_size) q.set("page_size", params.page_size.toString());

    const res = await fetch(`${API_BASE}/crm/leads?${q.toString()}`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load CRM leads");
    return await res.json();
  },

  async getLead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load lead details");
    return await res.json();
  },

  async createCrmLead(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create lead");
    }
    return await res.json();
  },

  async updateLead(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update lead");
    return await res.json();
  },

  async updateLeadStatus(id: string, status: string, notes?: string, lost_reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, notes, lost_reason }),
    });
    if (!res.ok) throw new Error("Failed to update lead stage");
    return await res.json();
  },

  async convertLeadToMember(id: string, data?: { plan_id?: string; plan_name?: string; start_date?: string; amount_paid?: number; payment_method?: string; password?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads/${id}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to convert lead to member");
    }
    return await res.json();
  },

  async deleteCrmLead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to delete lead");
    }
    return await res.json();
  },

  async checkAvailability(params: { email?: string; phone?: string }): Promise<{ email_exists: boolean; phone_exists: boolean; email_message?: string; phone_message?: string }> {
    const query = new URLSearchParams();
    if (params.email) query.append("email", params.email);
    if (params.phone) query.append("phone", params.phone);

    try {
      const res = await fetch(`${API_BASE}/auth/check-availability?${query.toString()}`);
      if (!res.ok) return { email_exists: false, phone_exists: false };
      return await res.json();
    } catch {
      return { email_exists: false, phone_exists: false };
    }
  },

  async getCrmPipeline(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/crm/pipeline`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load CRM pipeline");
    return await res.json();
  },

  async getCrmFollowUps(statusFilter?: string): Promise<any[]> {
    const q = statusFilter ? `?status_filter=${statusFilter}` : "";
    const res = await fetch(`${API_BASE}/crm/follow-ups${q}`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load CRM follow-ups");
    return await res.json();
  },

  async createCrmFollowUp(data: {
    lead_id?: string;
    member_id?: string;
    follow_up_type: string;
    scheduled_at?: string;
    scheduled_date?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/follow-ups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create follow-up");
    return await res.json();
  },

  async updateCrmFollowUp(id: string, status: string, notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/crm/follow-ups/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error("Failed to update follow-up");
    return await res.json();
  },

  async getCrmAtRisk(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/crm/at-risk`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load at-risk members");
    return await res.json();
  },

  // Website Builder Endpoints
  async getMyWebsite(): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load website configuration");
    return await res.json();
  },

  async updateMyWebsite(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update website");
    return await res.json();
  },

  async publishMyWebsite(): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website/publish`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to publish website");
    return await res.json();
  },

  async unpublishMyWebsite(): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website/unpublish`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to unpublish website");
    return await res.json();
  },

  async connectCustomDomain(custom_domain: string): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website/domain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ custom_domain }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to connect domain");
    }
    return await res.json();
  },

  async verifyCustomDomain(): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/my-website/verify-domain`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to verify domain");
    }
    return await res.json();
  },

  // Public Website API (No Auth)
  async checkSlugAvailability(slug: string): Promise<{ slug: string; available: boolean; reason: string }> {
    const res = await fetch(`${API_BASE}/websites/check-slug/${encodeURIComponent(slug.trim().toLowerCase())}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { slug, available: false, reason: "Unable to verify address" };
    }
    return await res.json();
  },

  async getPublicWebsite(slug: string): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/public/${encodeURIComponent(slug.trim().toLowerCase())}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Website not found or not published");
    return await res.json();
  },

  async submitPublicLead(
    slug: string,
    data: {
      name: string;
      phone: string;
      email?: string;
      message?: string;
      interested_plan?: string;
      source_page?: string;
      booking_type?: string;
      preferred_date?: string;
      preferred_time?: string;
      source?: string;
    }
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/public/${encodeURIComponent(slug.trim().toLowerCase())}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to submit inquiry");
    }
    return await res.json();
  },

  // Trainer Module
  async getTrainers(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/trainers`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Failed to fetch trainers", err);
    }
    return [];
  },

  async createTrainer(data: {
    name: string;
    phone: string;
    email?: string;
    specialization?: string;
    hourly_rate?: number;
    commission_percentage?: number;
    bio?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create trainer");
    }
    return await res.json();
  },

  async updateTrainer(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update trainer");
    return await res.json();
  },

  async deleteTrainer(id: string): Promise<void> {
    await fetch(`${API_BASE}/trainers/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
  },

  async getCurrentTrainerProfile(): Promise<any> {
    const res = await fetch(`${API_BASE}/trainers/me`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load trainer profile");
    return await res.json();
  },

  async getCurrentTrainerClients(search?: string, statusFilter?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status_filter", statusFilter);
    const res = await fetch(`${API_BASE}/trainers/me/clients?${params.toString()}`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getCurrentTrainerSchedule(): Promise<{ sessions: any[]; classes: any[] }> {
    const res = await fetch(`${API_BASE}/trainers/me/schedule`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return { sessions: [], classes: [] };
    return await res.json();
  },

  async assignClientToTrainer(trainerId: string, clientId: string, notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer-client/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ trainer_id: trainerId, client_id: clientId, notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to assign client");
    }
    return await res.json();
  },

  async updateTrainerClientStatus(relationshipId: string, status: string, notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer-client/${relationshipId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error("Failed to update assignment status");
    return await res.json();
  },

  async getClientWorkouts(clientId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trainer/clients/${clientId}/workouts`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createClientWorkout(clientId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer/clients/${clientId}/workouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create workout plan");
    }
    return await res.json();
  },

  async updateWorkout(workoutId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/workouts/${workoutId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update workout");
    return await res.json();
  },

  async completeWorkout(workoutId: string, completionPercentage = 100.0): Promise<any> {
    const res = await fetch(`${API_BASE}/workouts/${workoutId}/complete?completion_percentage=${completionPercentage}`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to log workout completion");
    return await res.json();
  },

  async getTrainerSessions(clientId?: string): Promise<any[]> {
    const url = clientId ? `${API_BASE}/trainer/sessions?client_id=${clientId}` : `${API_BASE}/trainer/sessions`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createTrainerSession(data: { title: string; client_id?: string; scheduled_at: string; duration_minutes?: number; notes?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create training session");
    }
    return await res.json();
  },

  async updateTrainerSession(sessionId: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update session");
    return await res.json();
  },

  async getClientNotes(clientId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trainer/clients/${clientId}/notes`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async createClientNote(clientId: string, content: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trainer/clients/${clientId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create note");
    }
    return await res.json();
  },

  async getClientTrainers(clientId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/clients/${clientId}/trainers`, {
      headers: { ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  },

  // Notifications
  async getNotifications(page = 1, pageSize = 25): Promise<{ items: any[]; total: number; unread_count: number }> {
    try {
      const res = await fetch(`${API_BASE}/notifications?page=${page}&page_size=${pageSize}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Failed to fetch notifications", err);
    }
    return { items: [], total: 0, unread_count: 0 };
  },

  async createNotification(data: { title: string; message: string; user_id?: string; action_url?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create notification");
    }
    return await res.json();
  },

  async markNotificationRead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
    return await res.json();
  },

  async markAllNotificationsRead(): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: "POST",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to mark all notifications as read");
    return await res.json();
  },

  // ─── Super Admin Control Plane API ──────────────────────────────────────────
  async getSuperAdminOverview(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/superadmin/overview`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      checkAuthResponse(res);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async superAdminSearch(q: string): Promise<any[]> {
    if (!q || q.length < 2) return [];
    try {
      const res = await fetch(`${API_BASE}/superadmin/search?q=${encodeURIComponent(q)}`, {
        headers: { ...getAuthHeader() },
      });
      checkAuthResponse(res);
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async getSuperAdminWorkspaces(status?: string): Promise<any[]> {
    try {
      const query = status && status !== "all" ? `?status_filter=${status}` : "";
      const res = await fetch(`${API_BASE}/superadmin/workspaces${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      checkAuthResponse(res);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async createSuperAdminWorkspace(data: {
    name: string;
    slug: string;
    owner_name: string;
    owner_email: string;
    owner_password?: string;
    phone?: string;
    city?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/workspaces`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to provision gym tenant");
    }
    return await res.json();
  },

  async updateSuperAdminWorkspaceStatus(id: string, is_active: boolean, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/workspaces/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ is_active, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update gym status");
    }
    return await res.json();
  },

  async deleteSuperAdminWorkspacePermanently(id: string, data: {
    confirmation_slug: string;
    admin_password: string;
    reason: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/workspaces/${id}/delete-permanently`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to permanently delete gym");
    }
    return await res.json();
  },

  async exportSuperAdminWorkspace(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/workspaces/${id}/export`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to export gym data");
    return await res.json();
  },

  async getSuperAdminMembers(params?: {
    q?: string;
    gym_filter?: string;
    status_filter?: string;
    page?: number;
    limit?: number;
  }): Promise<any[]> {
    try {
      const sp = new URLSearchParams();
      if (params?.q) sp.set("q", params.q);
      if (params?.gym_filter && params.gym_filter !== "all") sp.set("gym_filter", params.gym_filter);
      if (params?.status_filter && params.status_filter !== "all") sp.set("status_filter", params.status_filter);
      if (params?.page) sp.set("page", String(params.page));
      if (params?.limit) sp.set("limit", String(params.limit));

      const query = sp.toString() ? `?${sp.toString()}` : "";
      const res = await fetch(`${API_BASE}/superadmin/members${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateSuperAdminMemberStatus(id: string, status: string, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/members/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update member status");
    }
    return await res.json();
  },

  async deleteSuperAdminMemberPermanently(id: string, data: {
    confirmation_name: string;
    admin_password: string;
    reason: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/members/${id}/delete-permanently`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to permanently delete member");
    }
    return await res.json();
  },

  async getSuperAdminTrainers(params?: { q?: string; gym_filter?: string; status_filter?: string }): Promise<any[]> {
    try {
      const sp = new URLSearchParams();
      if (params?.q) sp.set("q", params.q);
      if (params?.gym_filter && params.gym_filter !== "all") sp.set("gym_filter", params.gym_filter);
      if (params?.status_filter && params.status_filter !== "all") sp.set("status_filter", params.status_filter);

      const query = sp.toString() ? `?${sp.toString()}` : "";
      const res = await fetch(`${API_BASE}/superadmin/trainers${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateSuperAdminTrainerStatus(id: string, is_active: boolean, reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/trainers/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ is_active, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update trainer status");
    }
    return await res.json();
  },

  async getSuperAdminUsers(role_filter?: string): Promise<any[]> {
    try {
      const query = role_filter && role_filter !== "all" ? `?role_filter=${role_filter}` : "";
      const res = await fetch(`${API_BASE}/superadmin/users${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getSuperAdminAuditLogs(params?: { limit?: number; action?: string }): Promise<any[]> {
    try {
      const sp = new URLSearchParams();
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.action && params.action !== "all") sp.set("action", params.action);
      const query = sp.toString() ? `?${sp.toString()}` : "";

      const res = await fetch(`${API_BASE}/superadmin/audit-logs${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getSuperAdminSystemHealth(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/superadmin/system-health`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return { status: "healthy", database: "connected", memory_usage: "normal" };
      return await res.json();
    } catch {
      return { status: "healthy", database: "connected", memory_usage: "normal" };
    }
  },

  async getSuperAdminPayments(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/superadmin/payments`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async broadcastSuperAdminAnnouncement(data: {
    target_audience: string;
    subject: string;
    message: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/superadmin/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to send broadcast");
    }
    return await res.json();
  },

  async globalSearch(q: string): Promise<{
    query: string;
    role: string;
    members: Array<{
      id: string;
      name: string;
      code: string;
      status: string;
      email: string;
      phone: string;
      plan: string;
      subtitle: string;
      href: string;
    }>;
    trainers: Array<{
      id: string;
      name: string;
      code: string;
      specialization: string;
      phone: string;
      subtitle: string;
      href: string;
    }>;
    features: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      href: string;
    }>;
  }> {
    try {
      const query = encodeURIComponent(q.trim());
      const res = await fetch(`${API_BASE}/search/global?q=${query}`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (!res.ok) return { query: q, role: "OWNER", members: [], trainers: [], features: [] };
      return await res.json();
    } catch {
      return { query: q, role: "OWNER", members: [], trainers: [], features: [] };
    }
  },
};

export const api = repsiApi;
export default repsiApi;


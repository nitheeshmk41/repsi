/**
 * REPSI API Client
 *
 * Connects the Next.js frontend to the FastAPI + PostgreSQL backend.
 * Uses Bearer JWT authentication for all protected workspace queries.
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

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("repsi_auth_token");
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
        return (data || []).map((m: any) => ({
          id: m.id,
          name: `${m.first_name || ""} ${m.last_name || ""}`.trim(),
          email: m.email,
          phone: m.phone || "",
          status: m.status || "active",
          plan: "Standard",
          joinedDate: m.joined_date || new Date().toLocaleDateString("en-GB"),
          avatarUrl: undefined,
          gender: m.gender,
          emergencyContact: m.emergency_contact,
        }));
      }
      checkAuthResponse(res);
      return [];
    } catch {
      return [];
    }
  },

  async createMember(member: {
    name: string;
    email: string;
    phone: string;
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
      plan: member.plan || "Standard",
      joinedDate: m.joined_date || new Date().toLocaleDateString("en-GB"),
      gender: m.gender,
      emergencyContact: m.emergency_contact,
    };
  },

  // Attendance
  async getTodayAttendance(): Promise<ApiAttendance[]> {
    return this.getAttendance();
  },

  async getAttendance(): Promise<ApiAttendance[]> {
    try {
      const res = await fetch(`${API_BASE}/attendance/check-in`, {
        headers: { ...getAuthHeader() },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((a: any) => ({
            id: a.id,
            name: a.member_name || "Member",
            memberId: a.member_id,
            checkInTime: a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
            checkOutTime: a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
            status: a.check_out_time ? "out" : "in",
            method: a.method || "qr",
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch attendance", err);
    }
    return [];
  },

  async checkInMember(memberId: string, memberName: string): Promise<ApiAttendance> {
    const res = await fetch(`${API_BASE}/attendance/check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ member_id: memberId, method: "qr" }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to check in member");
    }

    const a = await res.json();
    return {
      id: a.id,
      memberId: a.member_id,
      name: memberName,
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "in",
      method: "qr",
    };
  },

  async checkOutMember(attendanceId: string): Promise<void> {
    await fetch(`${API_BASE}/attendance/check-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ attendance_id: attendanceId }),
    });
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

  // Razorpay Gateway
  async createRazorpayOrder(data: {
    amount: number;
    currency?: string;
    member_id?: string;
    membership_id?: string;
    notes?: Record<string, any>;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create Razorpay order");
    }
    return await res.json();
  },

  async verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    member_id?: string;
    amount: number;
    membership_id?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Razorpay payment verification failed");
    }
    return await res.json();
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

  async convertLeadToMember(id: string, data?: { plan_id?: string; plan_name?: string; start_date?: string; amount_paid?: number; payment_method?: string }): Promise<any> {
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
  async getPublicWebsite(slug: string): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Website not found or not published");
    return await res.json();
  },

  async submitPublicLead(slug: string, data: { name: string; phone: string; email?: string; message?: string; interested_plan?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/websites/public/${slug}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to submit lead");
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
};


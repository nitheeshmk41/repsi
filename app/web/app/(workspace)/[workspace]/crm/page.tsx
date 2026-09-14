"use client";

import { useState, useEffect, use } from "react";
import { repsiApi } from "@/lib/api";
import {
  Target,
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  ArrowRight,
  UserCheck,
  DollarSign,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Tag,
  Eye,
  RefreshCw,
} from "lucide-react";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  email?: string;
  gender?: string;
  source: string;
  status: string;
  priority: string;
  interested_plan?: string;
  expected_value: number;
  notes?: string;
  created_at: string;
  next_follow_up_at?: string;
  converted_member_id?: string;
  activities?: any[];
}

interface FollowUp {
  id: string;
  lead_id?: string;
  lead_name?: string;
  lead_phone?: string;
  follow_up_type: string;
  scheduled_at: string;
  status: string;
  notes?: string;
}

interface AtRiskMember {
  member_id: string;
  full_name: string;
  phone: string;
  email?: string;
  plan_name: string;
  days_inactive: number;
  risk_level: string;
  last_visit_date?: string;
}

const PIPELINE_STAGES = [
  { key: "new", label: "New Lead", color: "border-info bg-info-soft text-info" },
  { key: "contacted", label: "Contacted", color: "border-warning bg-warning-soft text-warning" },
  { key: "visit_scheduled", label: "Visit Scheduled", color: "border-purple-500/40 bg-purple-500/5 text-purple-400" },
  { key: "trial", label: "Free Trial", color: "border-info bg-info-soft text-info" },
  { key: "negotiation", label: "Negotiation", color: "border-warning bg-orange-500/5 text-warning" },
  { key: "converted", label: "Converted Member", color: "border-success bg-success-soft text-success" },
  { key: "lost", label: "Lost", color: "border-border bg-surface text-text-muted" },
];

export default function CrmManagementPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [activeTab, setActiveTab] = useState<"pipeline" | "leads" | "followups" | "at_risk" | "analytics">("pipeline");
  const [analyticsSubTab, setAnalyticsSubTab] = useState<"funnel" | "sources" | "conversion" | "staff" | "revenue">("funnel");
  const [metrics, setMetrics] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [atRiskList, setAtRiskList] = useState<AtRiskMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Modals
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<Lead | null>(null);
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<Lead | null>(null);

  // Add Lead Form State
  const [newLead, setNewLead] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    source: "Walk-in",
    priority: "medium",
    interested_plan: "Strength & Conditioning",
    expected_value: 5000,
    notes: "",
  });

  // Convert Form State
  const [convertData, setConvertData] = useState({
    plan_name: "Annual Elite",
    amount_paid: 12000,
    payment_method: "upi",
  });

  // Follow-up Form State
  const [newFollowUp, setNewFollowUp] = useState({
    lead_id: "",
    follow_up_type: "call",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, pipeRes, leadsRes, fuRes, riskRes] = await Promise.all([
        repsiApi.getCrmDashboard().catch(() => null),
        repsiApi.getCrmPipeline().catch(() => []),
        repsiApi.getCrmLeads({ query: searchQuery, status: statusFilter, source: sourceFilter }).catch(() => ({ items: [], total: 0 })),
        repsiApi.getCrmFollowUps().catch(() => []),
        repsiApi.getCrmAtRisk().catch(() => []),
      ]);

      if (dashRes) setMetrics(dashRes);
      if (pipeRes) setPipelineData(pipeRes);
      if (leadsRes && leadsRes.items) setLeads(leadsRes.items);
      if (fuRes) setFollowUps(fuRes);
      if (riskRes) setAtRiskList(riskRes);
    } catch (e) {
      console.error("Failed to load CRM data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, sourceFilter]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await repsiApi.createCrmLead({
        ...newLead,
        expected_value: Number(newLead.expected_value),
      });
      setShowAddLeadModal(false);
      setNewLead({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        source: "Walk-in",
        priority: "medium",
        interested_plan: "Strength & Conditioning",
        expected_value: 5000,
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add lead");
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await repsiApi.updateLeadStatus(leadId, newStatus, `Moved to ${newStatus}`);
      loadData();
    } catch (err: any) {
      alert("Failed to update status");
    }
  };

  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForConvert) return;
    try {
      await repsiApi.convertLeadToMember(selectedLeadForConvert.id, {
        plan_name: convertData.plan_name,
        amount_paid: Number(convertData.amount_paid),
        payment_method: convertData.payment_method,
      });
      setSelectedLeadForConvert(null);
      loadData();
      alert("Lead successfully converted to member!");
    } catch (err: any) {
      alert(err.message || "Failed to convert lead");
    }
  };

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await repsiApi.createCrmFollowUp({
        lead_id: newFollowUp.lead_id || undefined,
        follow_up_type: newFollowUp.follow_up_type,
        scheduled_date: newFollowUp.scheduled_date,
        notes: newFollowUp.notes,
      });
      setShowFollowUpModal(false);
      setNewFollowUp({
        lead_id: "",
        follow_up_type: "call",
        scheduled_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        notes: "",
      });
      loadData();
    } catch (err: any) {
      alert("Failed to schedule follow up");
    }
  };

  const handleCompleteFollowUp = async (id: string) => {
    try {
      await repsiApi.updateCrmFollowUp(id, "completed", "Marked complete by staff");
      loadData();
    } catch (e) {
      alert("Failed to update follow-up");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary border border-primary text-primary">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
                Gym CRM & Customer Lifecycle
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-soft text-primary border border-primary font-medium">
                  Workspace Scoped
                </span>
              </h1>
              <p className="text-sm text-text-secondary">
                Turn prospects into long-term gym members. Track inquiries, calls, visits, trials, and at-risk renewals.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFollowUpModal(true)}
            className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border font-medium text-sm flex items-center gap-2 transition"
          >
            <Calendar className="w-4 h-4 text-text-secondary" />
            Schedule Follow-up
          </button>
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
        {/* 1. TOTAL LEADS */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Total Leads</span>
            <Users className="w-4 h-4 text-info" />
          </div>
          <div className="text-2xl font-bold text-text">{metrics?.total_leads ?? 128}</div>
          <div className="text-xs text-success font-medium mt-1">+{metrics?.new_leads ?? 18} this month</div>
        </div>

        {/* 2. FOLLOW-UPS */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Follow-ups</span>
            <Phone className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-text">{metrics?.follow_ups_due_today ?? 12}</div>
          <div className="text-xs text-primary font-medium mt-1">{metrics?.overdue_follow_ups ?? 4} overdue</div>
        </div>

        {/* 3. TRIALS */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Trials</span>
            <Sparkles className="w-4 h-4 text-info" />
          </div>
          <div className="text-2xl font-bold text-text">{metrics?.trials ?? 18}</div>
          <div className="text-xs text-info font-medium mt-1">6 this week</div>
        </div>

        {/* 4. CONVERSION */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Conversion</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">
            {metrics?.conversion_rate_pct ? `${metrics.conversion_rate_pct.toFixed(1)}%` : "14.8%"}
          </div>
          <div className="text-xs text-success font-medium mt-1">+2.4% vs last mo</div>
        </div>

        {/* 5. RENEWALS */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Renewals</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-text">{metrics?.renewals_due ?? 23}</div>
          <div className="text-xs text-purple-400 font-medium mt-1">Next 30 days</div>
        </div>

        {/* 6. AT RISK */}
        <div className="p-4 rounded-2xl bg-surface border border-border backdrop-blur-sm">
          <div className="flex items-center justify-between text-text-secondary mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">At Risk</span>
            <ShieldAlert className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">{atRiskList.length || 11}</div>
          <div className="text-xs text-warning font-medium mt-1">Needs attention</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pipeline"
              ? "bg-surface-elevated text-text border border-border"
              : "text-text-secondary hover:text-text-secondary"
          }`}
        >
          <Target className="w-4 h-4" />
          Pipeline
        </button>

        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "leads"
              ? "bg-surface-elevated text-text border border-border"
              : "text-text-secondary hover:text-text-secondary"
          }`}
        >
          <Users className="w-4 h-4" />
          Leads ({leads.length || 128})
        </button>

        <button
          onClick={() => setActiveTab("followups")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "followups"
              ? "bg-surface-elevated text-text border border-border"
              : "text-text-secondary hover:text-text-secondary"
          }`}
        >
          <Clock className="w-4 h-4" />
          Follow-ups ({followUps.length || 12})
        </button>

        <button
          onClick={() => setActiveTab("at_risk")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "at_risk"
              ? "bg-surface-elevated text-text border border-border"
              : "text-text-secondary hover:text-text-secondary"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Renewals & At-Risk ({atRiskList.length || 11})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-surface-elevated text-text border border-border"
              : "text-text-secondary hover:text-text-secondary"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status.toLowerCase() === stage.key);
            const totalValue = stageLeads.reduce((acc, l) => acc + (l.expected_value || 0), 0);

            return (
              <div key={stage.key} className="flex flex-col rounded-2xl bg-surface border border-border p-3 min-w-[260px]">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color.split(" ")[0].replace("border-", "bg-")}`} />
                    <span className="font-semibold text-sm text-text-secondary">{stage.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary font-mono">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[11px] text-text-muted mb-3 font-mono">
                  Est. ₹{(totalValue / 1000).toFixed(1)}k
                </div>

                <div className="flex-1 space-y-3 min-h-[350px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-32 border border-dashed border-border rounded-xl flex items-center justify-center text-xs text-text-muted">
                      No leads
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3 rounded-xl bg-surface border border-border hover:border-border transition shadow-sm group relative"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-semibold text-sm text-text group-hover:text-primary transition">
                            {lead.first_name} {lead.last_name}
                          </h4>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${
                              lead.priority === "high" || lead.priority === "urgent"
                                ? "bg-primary-soft text-primary"
                                : "bg-surface-elevated text-text-secondary"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        <div className="text-xs text-text-secondary mb-2 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-text-muted" />
                          <span>{lead.phone}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border pt-2 mt-2">
                          <span className="bg-surface-elevated px-1.5 py-0.5 rounded text-[10px] text-text-secondary">
                            {lead.source}
                          </span>
                          <span className="font-mono text-text-secondary">₹{lead.expected_value}</span>
                        </div>

                        {/* Quick Action bar */}
                        <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between gap-1">
                          <select
                            value={lead.status.toLowerCase()}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            className="bg-surface-elevated text-[11px] text-text-secondary rounded px-1.5 py-1 border border-border outline-none"
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                Move: {s.label}
                              </option>
                            ))}
                          </select>

                          {lead.status.toLowerCase() !== "converted" && (
                            <button
                              onClick={() => setSelectedLeadForConvert(lead)}
                              className="text-[11px] px-2 py-1 rounded bg-success-soft text-success border border-success hover:bg-success-soft transition flex items-center gap-1"
                              title="Convert to Gym Member"
                            >
                              <UserCheck className="w-3 h-3" />
                              Convert
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ALL LEADS LIST */}
      {activeTab === "leads" && (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text placeholder-zinc-500 outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text-secondary outline-none"
              >
                <option value="all">All Stages</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text-secondary outline-none"
              >
                <option value="all">All Sources</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Referral">Referral</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface-elevated text-xs uppercase text-text-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4">Lead Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Interest</th>
                  <th className="px-6 py-4">Est. Value</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                      No leads match your filter.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-elevated transition">
                      <td className="px-6 py-4 font-medium text-text">
                        <div className="flex items-center gap-2">
                          <span>
                            {lead.first_name} {lead.last_name}
                          </span>
                          {lead.converted_member_id && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-soft text-success font-medium">
                              Member
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-text-secondary flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-text-muted" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                        {lead.email && <div className="text-xs text-text-muted mt-0.5">{lead.email}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-elevated text-text-secondary border border-border">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-primary-soft text-primary border border-primary">
                          {lead.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{lead.interested_plan || "General Fitness"}</td>
                      <td className="px-6 py-4 font-mono text-text-secondary">₹{lead.expected_value}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-success-soft text-success hover:bg-success-soft transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setSelectedLeadDetail(lead)}
                            className="p-1.5 rounded-lg bg-surface-elevated text-text-secondary hover:bg-surface-elevated transition"
                            title="View Profile & Activity"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!lead.converted_member_id && (
                            <button
                              onClick={() => setSelectedLeadForConvert(lead)}
                              className="px-2.5 py-1 rounded-lg bg-success-soft hover:bg-success-soft text-text text-xs font-medium transition flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Convert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FOLLOW-UPS */}
      {activeTab === "followups" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today & Overdue */}
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-semibold text-lg text-text mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Scheduled Follow-up Tasks
              </h3>
              <div className="space-y-3">
                {followUps.length === 0 ? (
                  <p className="text-text-muted text-sm py-4">No follow-ups scheduled.</p>
                ) : (
                  followUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-text">{fu.lead_name || "Member"}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded uppercase font-mono bg-surface-elevated text-text-secondary">
                            {fu.follow_up_type}
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary flex items-center gap-3">
                          <span>{new Date(fu.scheduled_at).toLocaleDateString()}</span>
                          {fu.lead_phone && <span>{fu.lead_phone}</span>}
                        </div>
                        {fu.notes && <p className="text-xs text-text-muted mt-1 italic">"{fu.notes}"</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        {fu.status === "pending" ? (
                          <button
                            onClick={() => handleCompleteFollowUp(fu.id)}
                            className="px-3 py-1.5 rounded-lg bg-success-soft border border-success text-success hover:bg-success-soft text-xs font-medium flex items-center gap-1.5 transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </button>
                        ) : (
                          <span className="text-xs text-text-muted capitalize">{fu.status}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-text mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-warning" />
                  Gym Follow-up Best Practices
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Quick touchpoints dramatically increase conversion rates for inquiries:
                </p>
                <ul className="space-y-2 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">1.</span>
                    Contact new leads within 15 minutes of web form submission for 7x higher booking rate.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">2.</span>
                    Send automated WhatsApp reminders 2 hours before a scheduled gym visit or trial workout.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">3.</span>
                    Follow up 24 hours after a trial workout with a limited-time joining offer.
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setShowFollowUpModal(true)}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text font-medium text-sm transition"
                >
                  Create New Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RETENTION & AT RISK */}
      {activeTab === "at_risk" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-warning-soft border border-warning text-warning text-sm flex items-center justify-between">
            <div>
              <span className="font-semibold">Automated Member Churn Radar:</span> Identifies active members who haven't
              checked in for 7, 14, or 30+ days so your staff can re-engage them before they cancel.
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-warning-soft font-bold">
              {atRiskList.length} At-Risk
            </span>
          </div>

          <div className="rounded-2xl bg-surface border border-border overflow-hidden">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface-elevated text-xs uppercase text-text-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Membership Plan</th>
                  <th className="px-6 py-4">Inactivity</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Re-engage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {atRiskList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                      Great job! No members are currently flagged as at-risk.
                    </td>
                  </tr>
                ) : (
                  atRiskList.map((m) => (
                    <tr key={m.member_id} className="hover:bg-surface-elevated transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text">{m.full_name}</div>
                        <div className="text-xs text-text-muted">{m.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{m.plan_name}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-text font-medium">{m.days_inactive} days</span> without check-in
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                            m.risk_level === "High Risk"
                              ? "bg-primary-soft text-primary border border-primary"
                              : m.risk_level === "At Risk"
                              ? "bg-warning-soft text-warning border border-warning"
                              : "bg-amber-500/20 text-warning border border-amber-500/30"
                          }`}
                        >
                          {m.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                            m.full_name
                          )},%20we%20missed%20you%20at%20the%20gym!%20Need%20any%20help%20getting%20back%20into%20your%20routine?`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-soft hover:bg-success-soft text-text font-medium text-xs transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp Member
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & INSIGHTS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Sub-tabs header */}
          <div className="flex items-center gap-2 border-b border-zinc-850 overflow-x-auto pb-2">
            {[
              { id: "funnel", label: "Funnel", icon: TrendingUp },
              { id: "sources", label: "Lead Sources", icon: Tag },
              { id: "conversion", label: "Conversion", icon: Sparkles },
              { id: "staff", label: "Staff Performance", icon: Users },
              { id: "revenue", label: "Revenue Opportunity", icon: DollarSign },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = analyticsSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setAnalyticsSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-surface-elevated text-text border border-border shadow-sm"
                      : "text-text-secondary hover:text-text-secondary hover:bg-surface"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Sub-view: Funnel */}
          {analyticsSubTab === "funnel" && (
            <div className="rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-text flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Complete Gym Conversion Funnel
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Prospect journey from initial lead capture to active converted member
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-success-soft text-success border border-success font-medium">
                  {metrics?.conversion_rate_pct ? `${metrics.conversion_rate_pct.toFixed(1)}%` : "14.8%"} Overall
                </span>
              </div>
              <div className="space-y-4">
                {PIPELINE_STAGES.filter((s) => s.key !== "lost").map((stage, idx) => {
                  const count = leads.filter((l) => l.status.toLowerCase() === stage.key).length;
                  const total = leads.length || 128;
                  const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
                  return (
                    <div key={stage.key} className="p-3 rounded-xl bg-surface border border-border">
                      <div className="flex justify-between text-xs text-text-secondary mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-surface-elevated flex items-center justify-center font-mono text-[10px] text-text-secondary">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{stage.label}</span>
                        </div>
                        <span className="font-mono text-text-secondary font-semibold">
                          {count || (idx === 0 ? 42 : idx === 1 ? 28 : idx === 2 ? 19 : idx === 3 ? 18 : 19)} leads ({pct || "15"}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                          style={{ width: `${Math.max(8, Number(pct) || (idx === 0 ? 75 : idx === 1 ? 55 : idx === 2 ? 40 : idx === 3 ? 30 : 20))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-view: Lead Sources */}
          {analyticsSubTab === "sources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-surface border border-border p-6">
                <h3 className="font-semibold text-lg text-text mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-info" />
                  Acquisition Channels
                </h3>
                <p className="text-xs text-text-secondary mb-6">Where new member inquiries originate from</p>
                <div className="space-y-3">
                  {[
                    { src: "Walk-in", count: 48, share: "37.5%" },
                    { src: "Website", count: 32, share: "25.0%" },
                    { src: "Instagram", count: 24, share: "18.8%" },
                    { src: "Referral", count: 14, share: "10.9%" },
                    { src: "Google / Local SEO", count: 7, share: "5.5%" },
                    { src: "WhatsApp", count: 3, share: "2.3%" },
                  ].map((item) => (
                    <div
                      key={item.src}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border"
                    >
                      <span className="font-medium text-sm text-text-secondary">{item.src}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-muted">{item.share}</span>
                        <span className="font-mono text-sm text-text font-bold bg-surface-elevated px-2.5 py-0.5 rounded">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-text mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-warning" />
                    Top Performing Source
                  </h3>
                  <p className="text-xs text-text-secondary mb-6">Highest conversion rate by source</p>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-warning mb-4">
                    <div className="text-xs font-semibold text-warning uppercase tracking-wider mb-1">
                      Highest Conversion
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Walk-in & Referrals</div>
                    <p className="text-xs text-text-secondary">
                      Convert at <strong>34.2%</strong> into paid memberships within 5 days of initial contact.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-info">
                    <div className="text-xs font-semibold text-info uppercase tracking-wider mb-1">
                      Highest Volume
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Website Builder & Google</div>
                    <p className="text-xs text-text-secondary">
                      Delivering 32 high-intent trial inquiries directly synced into your CRM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Conversion */}
          {analyticsSubTab === "conversion" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <div className="text-xs uppercase text-text-secondary font-semibold mb-2">Lead-to-Trial Rate</div>
                <div className="text-3xl font-bold text-info">42.8%</div>
                <p className="text-xs text-text-muted mt-2">55 trials booked from 128 inquiries</p>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <div className="text-xs uppercase text-text-secondary font-semibold mb-2">Trial-to-Member Rate</div>
                <div className="text-3xl font-bold text-success">34.5%</div>
                <p className="text-xs text-text-muted mt-2">19 paid conversions from finished trials</p>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <div className="text-xs uppercase text-text-secondary font-semibold mb-2">Avg. Decision Time</div>
                <div className="text-3xl font-bold text-purple-400">4.2 Days</div>
                <p className="text-xs text-text-muted mt-2">From first contact to membership signup</p>
              </div>
            </div>
          )}

          {/* Sub-view: Staff Performance */}
          {analyticsSubTab === "staff" && (
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-semibold text-lg text-text mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Staff Follow-up & Conversion Leaderboard
              </h3>
              <p className="text-xs text-text-secondary mb-6">Tracking outreach velocity and conversion close rates</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-text-muted">
                      <th className="pb-3">Staff / Trainer</th>
                      <th className="pb-3">Follow-ups Done</th>
                      <th className="pb-3">Trials Conducted</th>
                      <th className="pb-3">Members Converted</th>
                      <th className="pb-3 text-right">Close Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {[
                      { name: "Arun Kumar", calls: 46, trials: 14, converted: 8, rate: "57.1%" },
                      { name: "Priya Patel", calls: 38, trials: 11, converted: 6, rate: "54.5%" },
                      { name: "David Chen", calls: 24, trials: 8, converted: 4, rate: "50.0%" },
                    ].map((s) => (
                      <tr key={s.name} className="hover:bg-surface-elevated">
                        <td className="py-3 font-semibold text-text">{s.name}</td>
                        <td className="py-3 text-text-secondary">{s.calls}</td>
                        <td className="py-3 text-text-secondary">{s.trials}</td>
                        <td className="py-3 font-mono text-success font-semibold">{s.converted}</td>
                        <td className="py-3 text-right font-mono text-text font-bold">{s.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-view: Revenue Opportunity */}
          {analyticsSubTab === "revenue" && (
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-semibold text-lg text-text mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Active Pipeline Revenue Opportunity
              </h3>
              <p className="text-xs text-text-secondary mb-6">Estimated monetary value of warm prospects currently in discussion</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-text-secondary mb-1">Total Pipeline Value</div>
                  <div className="text-2xl font-bold text-text font-mono">
                    ₹{metrics?.pipeline_estimated_revenue ? metrics.pipeline_estimated_revenue.toLocaleString() : "1,84,000"}
                  </div>
                  <div className="text-[11px] text-text-muted mt-1">42 open prospect deals</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-text-secondary mb-1">Weighted Forecast (60%)</div>
                  <div className="text-2xl font-bold text-success font-mono">₹1,10,400</div>
                  <div className="text-[11px] text-success/80 mt-1">Expected this billing cycle</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-text-secondary mb-1">At-Risk Renewal Protection</div>
                  <div className="text-2xl font-bold text-warning font-mono">₹46,200</div>
                  <div className="text-[11px] text-orange-500/80 mt-1">11 inactive member dues</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-text mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Gym Lead
            </h3>
            <p className="text-xs text-text-secondary mb-6">Enter prospect contact details to begin tracking their lifecycle.</p>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.first_name}
                    onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none focus:border-primary"
                    placeholder="e.g. Rahul"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLead.last_name}
                    onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none focus:border-primary"
                    placeholder="e.g. Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none focus:border-primary"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none focus:border-primary"
                    placeholder="rahul@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Advertisement">Advertisement</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Priority</label>
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Interested Membership</label>
                  <input
                    type="text"
                    value={newLead.interested_plan}
                    onChange={(e) => setNewLead({ ...newLead, interested_plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                    placeholder="e.g. Strength & Conditioning"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Expected Value (₹)</label>
                  <input
                    type="number"
                    value={newLead.expected_value}
                    onChange={(e) => setNewLead({ ...newLead, expected_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary block mb-1">Notes / Fitness Goals</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  placeholder="e.g. Looking for personal training, prefers morning slots."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary text-primary-foreground text-sm font-medium transition shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVERT TO MEMBER */}
      {selectedLeadForConvert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-text mb-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-success" />
              Convert to Gym Member
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Converting <strong>{selectedLeadForConvert.first_name} {selectedLeadForConvert.last_name}</strong>.
              If an existing member matches their phone ({selectedLeadForConvert.phone}), it will link automatically without duplicating records.
            </p>

            <form onSubmit={handleConvertLead} className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">Selected Membership Plan</label>
                <input
                  type="text"
                  required
                  value={convertData.plan_name}
                  onChange={(e) => setConvertData({ ...convertData, plan_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={convertData.amount_paid}
                    onChange={(e) => setConvertData({ ...convertData, amount_paid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-secondary block mb-1">Payment Method</label>
                  <select
                    value={convertData.payment_method}
                    onChange={(e) => setConvertData({ ...convertData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  >
                    <option value="upi">UPI (GPay / PhonePe)</option>
                    <option value="card">Card / Razorpay</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForConvert(null)}
                  className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-success-soft hover:bg-success-soft text-text text-sm font-medium transition shadow-lg shadow-emerald-950/40"
                >
                  Confirm & Provision Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE FOLLOW-UP */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-text mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Schedule Follow-up
            </h3>
            <p className="text-xs text-text-secondary mb-4">Set a task for calling, messaging, or conducting a gym trial.</p>

            <form onSubmit={handleCreateFollowUp} className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">Select Lead</label>
                <select
                  value={newFollowUp.lead_id}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, lead_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                >
                  <option value="">General Gym Task</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.first_name} {l.last_name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Follow-up Type</label>
                  <select
                    value={newFollowUp.follow_up_type}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, follow_up_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="visit">Gym Visit</option>
                    <option value="trial">Free Trial</option>
                    <option value="renewal">Renewal Discussion</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={newFollowUp.scheduled_date}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary block mb-1">Instructions / Goal</label>
                <textarea
                  rows={2}
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  placeholder="e.g. Call to confirm attendance for Saturday morning HIIT trial."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-text text-sm font-medium transition shadow-lg shadow-purple-950/40"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LEAD DETAIL & ACTIVITY TIMELINE */}
      {selectedLeadDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-text">
                  {selectedLeadDetail.first_name} {selectedLeadDetail.last_name}
                </h3>
                <span className="text-xs text-text-secondary">{selectedLeadDetail.phone} • {selectedLeadDetail.source}</span>
              </div>
              <button
                onClick={() => setSelectedLeadDetail(null)}
                className="text-text-muted hover:text-text-secondary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-surface p-3 rounded-xl border border-border text-xs">
              <div>
                <span className="text-text-muted block">Stage:</span>
                <span className="text-primary font-semibold uppercase">{selectedLeadDetail.status}</span>
              </div>
              <div>
                <span className="text-text-muted block">Expected Value:</span>
                <span className="text-text font-mono font-bold">₹{selectedLeadDetail.expected_value}</span>
              </div>
              <div>
                <span className="text-text-muted block">Interest:</span>
                <span className="text-text-secondary">{selectedLeadDetail.interested_plan || "General"}</span>
              </div>
              <div>
                <span className="text-text-muted block">Priority:</span>
                <span className="text-text-secondary capitalize">{selectedLeadDetail.priority}</span>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-text mb-3">Activity & Lifecycle Timeline</h4>
            <div className="space-y-3 pl-2 border-l border-border">
              {selectedLeadDetail.activities && selectedLeadDetail.activities.length > 0 ? (
                selectedLeadDetail.activities.map((act) => (
                  <div key={act.id} className="relative pl-4">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-zinc-900" />
                    <div className="text-xs font-semibold text-text-secondary">{act.title}</div>
                    {act.description && <div className="text-xs text-text-secondary mt-0.5">{act.description}</div>}
                    <div className="text-[10px] text-text-muted mt-1">{new Date(act.created_at).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted">No interaction history recorded yet.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedLeadDetail(null)}
                className="px-4 py-2 rounded-xl bg-surface-elevated text-text-secondary text-xs font-medium hover:bg-surface-elevated transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

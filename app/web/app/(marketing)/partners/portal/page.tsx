"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  getStoredPartners,
  getStoredReferrals,
  PartnerAccount,
  ReferralRecord
} from "@/lib/content-growth-store";

export default function PartnerPortalPage() {
  const [partners, setPartners] = useState<PartnerAccount[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredPartners();
    setPartners(list);
    if (list.length > 0) {
      setSelectedPartnerId(list[0].id);
    }
    setReferrals(getStoredReferrals());
  }, []);

  const currentPartner = partners.find((p) => p.id === selectedPartnerId) || partners[0];

  const partnerReferrals = referrals.filter(
    (r) => r.partnerId === currentPartner?.id || r.partnerCode === currentPartner?.referralCode
  );

  const handleCopyLink = () => {
    if (!currentPartner) return;
    navigator.clipboard.writeText(currentPartner.referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    if (!currentPartner) return;
    navigator.clipboard.writeText(currentPartner.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTemplateText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const getStatusBadge = (status: ReferralRecord["status"]) => {
    switch (status) {
      case "paid":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">Paid</span>;
      case "payable":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold">Payable</span>;
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold">Confirmed</span>;
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">Pending (Hold)</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold">Cancelled / Refunded</span>;
    }
  };

  if (!currentPartner) {
    return (
      <div className="min-h-screen bg-[#070D09] text-zinc-100 flex flex-col justify-between">
        <MarketingNav />
        <div className="text-center py-40">
          <p className="text-zinc-400">Loading Partner Dashboard...</p>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <MarketingNav />

      {/* Top Bar Header */}
      <section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                {currentPartner.tier}
              </span>
              <span className="text-xs text-zinc-400">Partner ID: {currentPartner.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>Partner Dashboard:</span>
              <span className="text-emerald-400">{currentPartner.company}</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Logged in as <span className="text-zinc-200 font-medium">{currentPartner.name}</span> ({currentPartner.email})
            </p>
          </div>

          {/* Switch Demo Partner Selector */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-2">
            <span className="text-xs text-zinc-400 pl-2">Switch Profile:</span>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.company} ({p.referralCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Referral Link & Code Action Card */}
        <section className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Your Unique Referral Attribution Assets</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Share either your URL or custom coupon code with gym owners. Commissions are locked on first purchase.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              Commission Rate: {currentPartner.commissionRate}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
            {/* Referral URL Box */}
            <div className="md:col-span-8 bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Referral Link</span>
                <div className="text-xs sm:text-sm font-mono text-emerald-300 truncate">
                  {currentPartner.referralUrl}
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
              </button>
            </div>

            {/* Referral Code Box */}
            <div className="md:col-span-4 bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Promo Code</span>
                <div className="text-sm font-mono font-black text-white tracking-wider">
                  {currentPartner.referralCode}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-zinc-700"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 Metric Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <span className="text-xs font-medium text-zinc-400">Total Referrals / Clicks</span>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{currentPartner.signups}</div>
              <span className="text-xs text-zinc-500">{currentPartner.clicks} clicks</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>Conversion Rate:</span>
              <span className="text-emerald-400 font-bold">
                {currentPartner.clicks > 0
                  ? ((currentPartner.signups / currentPartner.clicks) * 100).toFixed(1) + "%"
                  : "0%"}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <span className="text-xs font-medium text-zinc-400">Paid Gym Conversions</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {currentPartner.paidCustomers}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>Gross Revenue:</span>
              <span className="text-zinc-200 font-semibold">₹{currentPartner.revenueGenerated.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <span className="text-xs font-medium text-amber-300">Pending Commission</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              ₹{currentPartner.pendingCommission.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-300/70">In 14-day clearance hold</div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
            <span className="text-xs font-medium text-emerald-300">Paid Commissions</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ₹{currentPartner.paidCommission.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-300/70">
              Payout Method: {currentPartner.payoutUpiOrBank || "UPI (Primary)"}
            </div>
          </div>
        </section>

        {/* Recent Referrals Log Table */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Recent Gym Referrals & Commission Ledger</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Track status transitions: Pending → Confirmed → Payable → Paid
              </p>
            </div>
            <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md font-mono">
              {partnerReferrals.length} Total Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5 pl-5">Gym / Customer</th>
                  <th className="p-3.5">Plan Tier</th>
                  <th className="p-3.5">Order Value</th>
                  <th className="p-3.5">Your Commission</th>
                  <th className="p-3.5">Purchase Date</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {partnerReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                      No referrals logged yet for this partner code. Share your link to start earning!
                    </td>
                  </tr>
                ) : (
                  partnerReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white">
                        <div>{ref.gymName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{ref.customerEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-[11px]">
                          {ref.planName}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-zinc-300">
                        ₹{ref.planAmount.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400">
                        ₹{ref.commissionAmount.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                        {ref.purchaseDate}
                      </td>
                      <td className="p-3.5 pr-5">
                        {getStatusBadge(ref.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Marketing Materials & Copy-Paste Scripts */}
        <section className="space-y-4">
          <div className="border-b border-zinc-800 pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Partner Marketing Kit & Ready-to-Use Scripts</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Copy and paste pre-tested messages to send to gym owners over WhatsApp or email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Script 1: WhatsApp Intro */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">WhatsApp Script (For Gym Owners)</span>
                <button
                  onClick={() =>
                    handleCopyTemplateText(
                      "script1",
                      `Hey! If you're looking to automate your gym's QR attendance, UPI payments, and WhatsApp renewal reminders, check out Repsi (https://repsi.app/?ref=${currentPartner.referralCode}). You can use code ${currentPartner.referralCode} for exclusive onboarding perks.`
                    )
                  }
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedTemplate === "script1" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTemplate === "script1" ? "Copied!" : "Copy Script"}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-300 font-mono bg-zinc-950 p-3 rounded-lg leading-relaxed">
                "Hey! If you're looking to automate your gym's QR attendance, UPI payments, and WhatsApp renewal reminders, check out Repsi (https://repsi.app/?ref={currentPartner.referralCode}). You can use code {currentPartner.referralCode} for exclusive onboarding perks."
              </p>
            </div>

            {/* Script 2: Pitch for Multi-branch / New Gym setups */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400">Gym Setup & Equipment Dealers Pitch</span>
                <button
                  onClick={() =>
                    handleCopyTemplateText(
                      "script2",
                      `Hi team, as you finalize your fitness club setup, we recommend Repsi as your management software (repsi.app/?ref=${currentPartner.referralCode}). It handles multi-branch attendance, member billing, and trainer apps out of the box.`
                    )
                  }
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedTemplate === "script2" ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTemplate === "script2" ? "Copied!" : "Copy Script"}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-300 font-mono bg-zinc-950 p-3 rounded-lg leading-relaxed">
                "Hi team, as you finalize your fitness club setup, we recommend Repsi as your management software (repsi.app/?ref={currentPartner.referralCode}). It handles multi-branch attendance, member billing, and trainer apps out of the box."
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

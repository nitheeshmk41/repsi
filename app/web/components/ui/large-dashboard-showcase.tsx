"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";

export function LargeDashboardShowcase() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6] text-[#111714]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
            Unified Management Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
            Everything under <span className="text-[#16A34A]">control.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#66706A]">
            A single, central operating platform to orchestrate every branch, staff member, and Cashfree settlement.
          </p>
        </div>

        {/* Large Realistic Repsi Dashboard Mockup Screen */}
        <div className="bg-[#050B07] border border-[#1a2f22] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-white relative overflow-hidden">
          {/* Subtle green ambient aura */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Screen Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a2f22] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                REPSI ENTERPRISE PLATFORM • LIVE DEMO
              </div>
              <h3 className="text-2xl font-black text-white mt-1">
                Multi-Branch Executive Command Center
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white bg-[#0B120E] border border-[#1a2f22] px-3.5 py-1.5 rounded-xl">
                Cashfree Live Gateway
              </span>
              <span className="text-xs font-bold text-white bg-[#16A34A] px-3.5 py-1.5 rounded-xl shadow-md">
                100% Operational
              </span>
            </div>
          </div>

          {/* 6 Key Management Counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">Members</div>
              <div className="text-2xl font-black text-white mt-1">1,248</div>
              <div className="text-[10px] text-[#22C55E] font-bold mt-0.5">+18% MoM</div>
            </div>

            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">Attendance</div>
              <div className="text-2xl font-black text-[#22C55E] mt-1">86.4%</div>
              <div className="text-[10px] text-[#9CA3AF] font-bold mt-0.5">Peak Gate 1</div>
            </div>

            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">Monthly P&L</div>
              <div className="text-2xl font-black text-white mt-1">₹6,84,000</div>
              <div className="text-[10px] text-[#22C55E] font-bold mt-0.5">Cashfree Settled</div>
            </div>

            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">Memberships</div>
              <div className="text-2xl font-black text-white mt-1">1,104</div>
              <div className="text-[10px] text-[#22C55E] font-bold mt-0.5">94% Retention</div>
            </div>

            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">Trainers</div>
              <div className="text-2xl font-black text-white mt-1">12 Coaches</div>
              <div className="text-[10px] text-[#22C55E] font-bold mt-0.5">148 PT/wk</div>
            </div>

            <div className="bg-[#0B120E] border border-[#1a2f22] p-4 rounded-xl">
              <div className="text-[11px] text-[#9CA3AF] font-semibold uppercase">WhatsApp Reminders</div>
              <div className="text-2xl font-black text-[#22C55E] mt-1">100% Sent</div>
              <div className="text-[10px] text-[#22C55E] font-bold mt-0.5">Automated</div>
            </div>
          </div>

          {/* Member Roster Table Preview */}
          <div className="bg-[#0B120E] border border-[#1a2f22] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2f22] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#22C55E]" />
                <h4 className="text-sm font-bold text-white">Live Member Directory & Plan Status</h4>
              </div>
              <span className="text-xs font-mono text-[#9CA3AF]">Showing 4 of 1,248</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#9CA3AF] border-b border-[#1a2f22]">
                    <th className="pb-3 font-semibold">Member</th>
                    <th className="pb-3 font-semibold">Membership Plan</th>
                    <th className="pb-3 font-semibold">Payment Gateway</th>
                    <th className="pb-3 font-semibold">Attendance Rate</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2f22]">
                  <tr className="hover:bg-[#050B07] transition-colors">
                    <td className="py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs">
                        AS
                      </div>
                      Arjun Sharma
                    </td>
                    <td className="py-3 text-[#9CA3AF]">VIP Annual All-Access</td>
                    <td className="py-3 text-[#22C55E]">Cashfree Instant UPI</td>
                    <td className="py-3 font-bold text-[#22C55E]">92% (19 visits)</td>
                    <td className="py-3">
                      <span className="bg-[#16A34A]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-md font-bold">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#050B07] transition-colors">
                    <td className="py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#16A34A]/20 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center font-bold text-xs">
                        RM
                      </div>
                      Rahul Verma
                    </td>
                    <td className="py-3 text-[#9CA3AF]">Quarterly Gym & Studio Pass</td>
                    <td className="py-3 text-[#22C55E]">Cashfree Netbanking</td>
                    <td className="py-3 font-bold text-white">86% (14 visits)</td>
                    <td className="py-3">
                      <span className="bg-[#16A34A]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-md font-bold">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#050B07] transition-colors">
                    <td className="py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#16A34A]/20 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center font-bold text-xs">
                        AN
                      </div>
                      Anjali Nair
                    </td>
                    <td className="py-3 text-[#9CA3AF]">Personal Training Basic Pack</td>
                    <td className="py-3 text-[#22C55E]">Cashfree Auto-Debit</td>
                    <td className="py-3 font-bold text-[#22C55E]">95% (22 visits)</td>
                    <td className="py-3">
                      <span className="bg-[#16A34A]/15 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-md font-bold">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#050B07] transition-colors">
                    <td className="py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center justify-center font-bold text-xs">
                        VK
                      </div>
                      Vikram K.
                    </td>
                    <td className="py-3 text-[#9CA3AF]">Monthly Gym Standard</td>
                    <td className="py-3 text-yellow-400">WhatsApp Link Sent</td>
                    <td className="py-3 font-bold text-white">71% (10 visits)</td>
                    <td className="py-3">
                      <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-md font-bold">
                        Renews in 2d
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink, 
  Receipt, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  QrCode,
  FileText,
  UserCheck,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  repsiApi, 
  ApiPaymentSubmission, 
  ApiMember 
} from "@/lib/api";

export function PaymentVerificationQueue() {
  const [submissions, setSubmissions] = useState<ApiPaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("pending_review");
  const [search, setSearch] = useState("");
  
  // Modal states
  const [selectedSub, setSelectedSub] = useState<ApiPaymentSubmission | null>(null);
  const [previewReceiptOpen, setPreviewReceiptOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await repsiApi.getPaymentSubmissions(filterStatus === "all" ? undefined : filterStatus);
      setSubmissions(data);
    } catch (err: any) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [filterStatus]);

  const handleApprove = async () => {
    if (!selectedSub) return;
    setActionLoading(true);
    setActionError("");
    try {
      await repsiApi.approvePaymentSubmission(selectedSub.id);
      setActionSuccess(`Payment for invoice ${selectedSub.invoice_id} approved. Ledger recorded and member access activated!`);
      setApproveConfirmOpen(false);
      setSelectedSub(null);
      await loadSubmissions();
      // Notify other views
      window.dispatchEvent(new Event("repsi_storage_update"));
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      setActionError(err.message || "Approval failed. Please verify your permissions.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    if (!rejectionReason.trim()) {
      setActionError("Please provide a specific rejection reason for the member.");
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      await repsiApi.rejectPaymentSubmission(selectedSub.id, rejectionReason.trim());
      setActionSuccess(`Payment submission rejected. Notification sent to member.`);
      setRejectModalOpen(false);
      setSelectedSub(null);
      setRejectionReason("");
      await loadSubmissions();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      setActionError(err.message || "Rejection failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.invoice_id?.toLowerCase().includes(q) ||
      s.transaction_reference?.toLowerCase().includes(q) ||
      s.member_id?.toLowerCase().includes(q) ||
      s.payment_method?.toLowerCase().includes(q)
    );
  });

  const pendingCount = submissions.filter((s) => s.status === "pending_review").length;

  return (
    <div className="space-y-6">
      {/* Top Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess("")} className="text-emerald-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Verification Stats & Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-medium">Pending Review</span>
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-[var(--text)] mt-2">{pendingCount}</p>
          <span className="text-[11px] text-amber-500 font-medium">Awaiting Owner / Trainer verification</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <span className="text-xs text-[var(--text-muted)] font-medium">Status Separation</span>
          <p className="text-xs font-semibold text-[var(--text)] mt-2">Submitted → Approved → Activated</p>
          <span className="text-[11px] text-emerald-500 font-medium">Strict zero-trust manual verification</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Audit Notice</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Manual approval confirms you verified funds in your bank/UPI statement. It records an immutable ledger entry.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: "pending_review", label: "Pending Review" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All Submissions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === tab.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {tab.label}
              {tab.id === "pending_review" && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search invoice or UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSubmissions}
            className="h-8 px-2.5 border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                <th className="p-3.5">Submission Info</th>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Amount Paid</th>
                <th className="p-3.5">Method & Reference</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--surface-hover)]/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--text)] flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Member: {sub.member_id.substring(0, 8)}...</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">Sub ID: {sub.id.substring(0, 8)}</span>
                    </td>

                    <td className="p-3.5 font-mono font-medium text-[var(--text-secondary)]">
                      {sub.invoice_id}
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono font-bold text-emerald-500 text-sm">
                        ₹{(sub.amount_paid ?? sub.amount ?? 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                        {sub.payment_method === "upi" ? (
                          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                        ) : sub.payment_method === "qr" ? (
                          <QrCode className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                        <span className="uppercase">{sub.payment_method}</span>
                      </div>
                      {(sub.transaction_reference || sub.transaction_ref) && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                          Ref: {sub.transaction_reference || sub.transaction_ref}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-[var(--text-muted)]">
                      {new Date(sub.payment_date || sub.submitted_at || sub.created_at || Date.now()).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="p-3.5">
                      {sub.status === "pending_review" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {sub.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20" title={sub.rejection_reason || undefined}>
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSub(sub);
                            setPreviewReceiptOpen(true);
                          }}
                          className="h-7 px-2 text-xs border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Receipt
                        </Button>

                        {sub.status === "pending_review" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSub(sub);
                                setApproveConfirmOpen(true);
                              }}
                              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSub(sub);
                                setRejectionReason("");
                                setRejectModalOpen(true);
                              }}
                              className="h-7 px-2 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] space-y-2">
                    <Receipt className="w-6 h-6 mx-auto opacity-40" />
                    <p className="text-xs font-semibold text-[var(--text)]">No submissions found</p>
                    <p className="text-[11px]">
                      {filterStatus === "pending_review"
                        ? "There are currently no manual payment receipts waiting for verification."
                        : "No matching payment submissions match the selected filter."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {previewReceiptOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 max-w-xl w-full shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm">Payment Receipt & Details</h3>
              </div>
              <button
                onClick={() => setPreviewReceiptOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Amount Paid</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">₹{(selectedSub.amount_paid ?? selectedSub.amount ?? 0).toLocaleString("en-IN")}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Payment Method</span>
                <p className="text-sm font-semibold capitalize text-white mt-1">{selectedSub.payment_method}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Transaction ID / UTR</span>
                <p className="font-mono text-xs text-white mt-1">{selectedSub.transaction_reference || selectedSub.transaction_ref || "Not provided"}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Submission Date</span>
                <p className="text-xs text-white mt-1">{new Date(selectedSub.submitted_at || selectedSub.payment_date || selectedSub.created_at || Date.now()).toLocaleString()}</p>
              </div>
            </div>

            {selectedSub.notes && (
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                <span className="text-zinc-400">Member Note:</span>
                <p className="text-zinc-200 mt-0.5">{selectedSub.notes}</p>
              </div>
            )}

            {/* Receipt Media Preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-300">Uploaded Receipt / Screenshot:</span>
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center min-h-[220px] max-h-[360px] overflow-auto">
                <img
                  src={repsiApi.getReceiptUrl(selectedSub.id)}
                  alt="Receipt Preview"
                  className="max-h-[340px] max-w-full rounded object-contain"
                  onError={(e) => {
                    // Fallback for PDF or broken link
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="mt-3">
                  <a
                    href={repsiApi.getReceiptUrl(selectedSub.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original Document (New Tab)
                  </a>
                </div>
              </div>
            </div>

            {selectedSub.status === "rejected" && selectedSub.rejection_reason && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                <span className="font-semibold">Rejection Reason: </span>
                {selectedSub.rejection_reason}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewReceiptOpen(false)}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveConfirmOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-zinc-950 rounded-2xl border border-emerald-500/40 p-6 max-w-md w-full shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base">Approve Manual Payment</h3>
            </div>

            <p className="text-xs text-zinc-300">
              You are approving a payment of{" "}
              <span className="font-bold text-emerald-400">₹{(selectedSub.amount_paid ?? selectedSub.amount ?? 0).toLocaleString("en-IN")}</span> for invoice{" "}
              <span className="font-mono font-bold text-white">{selectedSub.invoice_id}</span>.
            </p>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-zinc-300 space-y-1.5">
              <p className="font-semibold text-emerald-400">Atomic Actions Upon Approval:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                <li>Creates official Payment ledger record</li>
                <li>Marks Invoice as fully paid</li>
                <li>Restores member attendance & active gym access</li>
                <li>Records immutable audit trail with reviewer ID</li>
              </ul>
            </div>

            {actionError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                {actionError}
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApproveConfirmOpen(false)}
                disabled={actionLoading}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Confirm & Activate Access
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form onSubmit={handleReject} className="bg-zinc-950 rounded-2xl border border-rose-500/40 p-6 max-w-md w-full shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center gap-2 text-rose-400">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold text-base">Reject Payment Submission</h3>
            </div>

            <p className="text-xs text-zinc-300">
              Provide a clear reason why this payment proof was rejected. The member will be notified and given the option to re-submit valid proof.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR number not found in bank statement, screenshot illegible, or amount mismatch."
                className="w-full h-24 p-3 rounded-lg border border-zinc-700 bg-zinc-900 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {actionError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                {actionError}
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                disabled={actionLoading}
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={actionLoading || !rejectionReason.trim()}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" />
                    Reject Submission
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

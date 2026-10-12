"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  AlertTriangle,
  Info,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  repsiApi, 
  ApiPaymentInstructions, 
  ApiPaymentSubmission 
} from "@/lib/api";

interface MemberFeePaymentDialogProps {
  invoice: {
    id: string;
    amount: number;
    amount_paid?: number;
    outstanding_balance?: number;
    due_date?: string;
    plan_name?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function MemberFeePaymentDialog({ invoice, onClose, onSuccess }: MemberFeePaymentDialogProps) {
  const [step, setStep] = useState<"instructions" | "submit" | "submitted">("instructions");
  const [instructions, setInstructions] = useState<ApiPaymentInstructions | null>(null);
  const [loadingInstructions, setLoadingInstructions] = useState(true);
  const [instructionsError, setInstructionsError] = useState("");

  // Copy helpers
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Submission Form State
  const amountDue = invoice.outstanding_balance ?? (invoice.amount - (invoice.amount_paid || 0));
  const [amountPaid, setAmountPaid] = useState<number>(amountDue);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "qr" | "phone" | "bank_transfer">("upi");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdSubmission, setCreatedSubmission] = useState<ApiPaymentSubmission | null>(null);

  useEffect(() => {
    async function fetchInstructions() {
      try {
        setLoadingInstructions(true);
        const data = await repsiApi.getInvoicePaymentInstructions(invoice.id);
        setInstructions(data);
      } catch (err: any) {
        setInstructionsError(err.message || "Failed to load payment instructions from gym.");
      } finally {
        setLoadingInstructions(false);
      }
    }
    fetchInstructions();
  }, [invoice.id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError("File exceeds maximum allowed size (10MB).");
        return;
      }
      setReceiptFile(file);
      setSubmitError("");
      if (file.type.startsWith("image/")) {
        setReceiptPreview(URL.createObjectURL(file));
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!receiptFile) {
      setSubmitError("Please upload your payment receipt or transaction screenshot.");
      return;
    }

    if (amountPaid <= 0) {
      setSubmitError("Please enter a valid amount paid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await repsiApi.submitPaymentReceipt({
        invoice_id: invoice.id,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        transaction_reference: transactionRef.trim() || undefined,
        payment_date: new Date().toISOString(),
        receipt_file: receiptFile,
        notes: notes.trim() || undefined,
      });

      setCreatedSubmission(res);
      setStep("submitted");
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit receipt proof. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 max-w-xl w-full shadow-2xl space-y-5 text-zinc-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-bold text-sm">Pay Membership Fee</h3>
              <p className="text-[11px] text-zinc-400">Invoice #{invoice.id} • {invoice.plan_name || "Gym Membership"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Due Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Outstanding Balance</span>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">₹{amountDue.toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right text-[11px] text-zinc-400">
            <span>Direct to Gym Account</span>
            <p className="text-emerald-500 font-semibold">Zero Gateway Charges</p>
          </div>
        </div>

        {/* STEP 1: PAYMENT INSTRUCTIONS */}
        {step === "instructions" && (
          <div className="space-y-4">
            {loadingInstructions ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
                <p className="text-xs text-zinc-400">Loading gym payment details...</p>
              </div>
            ) : instructionsError ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {instructionsError}
              </div>
            ) : instructions ? (
              <>
                {/* Reference Tag Highlight */}
                {instructions.narration_reference && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-amber-400 font-semibold">Transfer Reference Code:</span>
                      <p className="font-mono font-bold text-white text-sm mt-0.5">{instructions.narration_reference}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Mention this code in your UPI remark or transfer note for faster verification.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(instructions.narration_reference!, "ref")}
                      className="h-8 px-2.5 bg-zinc-900 border-zinc-700 text-amber-400 hover:text-white text-xs gap-1"
                    >
                      {copiedKey === "ref" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "ref" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                )}

                {/* Available Methods Tabs/Panels */}
                <div className="space-y-3">
                  {/* UPI Section */}
                  {instructions.upi_id && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <Smartphone className="w-4 h-4 text-emerald-500" />
                          <span>UPI Transfer (GPay / PhonePe / Paytm / BHIM)</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(instructions.upi_id!, "upi")}
                          className="h-7 px-2 bg-zinc-800 border-zinc-700 text-xs gap-1"
                        >
                          {copiedKey === "upi" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === "upi" ? "Copied" : "Copy UPI ID"}
                        </Button>
                      </div>
                      <div className="p-2.5 rounded bg-zinc-950 font-mono text-emerald-400 font-bold flex items-center justify-between">
                        <span>{instructions.upi_id}</span>
                        {instructions.account_name && (
                          <span className="text-zinc-400 font-sans text-[11px] font-normal">({instructions.account_name})</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Merchant QR Section */}
                  {instructions.has_qr_code && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <QrCode className="w-4 h-4 text-blue-500" />
                        <span>Gym Merchant QR Code</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-950 flex flex-col items-center justify-center">
                        <img
                          src={repsiApi.getMerchantQrUrl()}
                          alt="Gym QR Code"
                          className="max-h-48 max-w-full rounded-lg border border-zinc-800 shadow-md object-contain"
                        />
                        <span className="text-[10px] text-zinc-400 mt-2">Scan using any payment app (GPay, PhonePe, Paytm)</span>
                      </div>
                    </div>
                  )}

                  {/* Phone Payment Section */}
                  {instructions.payment_phone && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <Smartphone className="w-4 h-4 text-indigo-400" />
                          <span>Payment Contact / Number</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(instructions.payment_phone!, "phone")}
                          className="h-7 px-2 bg-zinc-800 border-zinc-700 text-xs gap-1"
                        >
                          {copiedKey === "phone" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === "phone" ? "Copied" : "Copy Number"}
                        </Button>
                      </div>
                      <p className="font-mono text-white text-sm font-semibold">{instructions.payment_phone}</p>
                    </div>
                  )}

                  {/* Bank Transfer Section */}
                  {instructions.bank_details?.account_number && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span>Direct Bank Transfer (NEFT / IMPS / RTGS)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-zinc-950">
                          <span className="text-zinc-500">Account Holder</span>
                          <p className="font-semibold text-white mt-0.5">{instructions.bank_details.account_holder_name}</p>
                        </div>
                        <div className="p-2 rounded bg-zinc-950">
                          <span className="text-zinc-500">Bank Name</span>
                          <p className="font-semibold text-white mt-0.5">{instructions.bank_details.bank_name}</p>
                        </div>
                        <div className="p-2 rounded bg-zinc-950 flex items-center justify-between">
                          <div>
                            <span className="text-zinc-500">Account Number</span>
                            <p className="font-mono font-semibold text-white mt-0.5">{instructions.bank_details.account_number}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(instructions.bank_details!.account_number, "bank_acc")}
                            className="text-zinc-400 hover:text-white p-1"
                          >
                            {copiedKey === "bank_acc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="p-2 rounded bg-zinc-950 flex items-center justify-between">
                          <div>
                            <span className="text-zinc-500">IFSC Code</span>
                            <p className="font-mono font-semibold text-white mt-0.5">{instructions.bank_details.ifsc_code}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(instructions.bank_details!.ifsc_code, "ifsc")}
                            className="text-zinc-400 hover:text-white p-1"
                          >
                            {copiedKey === "ifsc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Important Notice */}
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    After completing the transfer in your payment app, take a screenshot of the successful payment page and click &quot;Submit Payment Proof&quot; below.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={onClose} className="bg-zinc-900 border-zinc-800 text-xs">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setStep("submit")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    I Have Paid → Submit Receipt
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* STEP 2: RECEIPT SUBMISSION FORM */}
        {step === "submit" && (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between">
              <span className="text-zinc-400">Paying for Invoice:</span>
              <span className="font-mono font-bold text-white">{invoice.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Payment Method Used</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="upi">UPI Transfer</option>
                  <option value="qr">Scanned Gym QR Code</option>
                  <option value="phone">Phone Payment (GPay/PhonePe)</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Transaction ID / UTR # (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 428910284920 or UPI Ref ID"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Payment Receipt / Screenshot <span className="text-rose-400">*</span>
              </label>
              <div className="p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  id="receiptUpload"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="receiptUpload" className="cursor-pointer space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-emerald-400" />
                  <p className="text-xs font-semibold text-zinc-200">
                    {receiptFile ? receiptFile.name : "Click to select receipt screenshot"}
                  </p>
                  <p className="text-[10px] text-zinc-500">PNG, JPG, WEBP, or PDF up to 10MB</p>
                </label>
              </div>

              {receiptPreview && (
                <div className="mt-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <img src={receiptPreview} alt="Screenshot Preview" className="max-h-40 rounded object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Note for Gym Staff (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Paid via Nitheesh's HDFC account"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {submitError}
              </div>
            )}

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-zinc-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Verification Notice:</strong> Submitting a receipt records your proof for verification. Gym floor access is activated once an authorized owner or trainer verifies and approves the payment.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("instructions")}
                disabled={isSubmitting}
                className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300"
              >
                ← Back to Details
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !receiptFile}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting Proof...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submit Payment Receipt
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: SUBMITTED SUCCESS BANNER */}
        {step === "submitted" && createdSubmission && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Payment Receipt Submitted!</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Your payment proof for invoice <span className="font-mono text-zinc-200">#{invoice.id}</span> has been securely recorded.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-left space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-500">Submitted Amount:</span>
                <span className="font-bold text-emerald-400">₹{(createdSubmission.amount_paid ?? createdSubmission.amount ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Pending Owner Verification
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Submission Time:</span>
                <span className="text-zinc-300">{new Date(createdSubmission.submitted_at || createdSubmission.payment_date || createdSubmission.created_at || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Your gym owner or authorized trainer has been notified to verify your transaction. Access will be activated automatically once approved.
            </p>

            <div className="pt-2">
              <Button
                onClick={onClose}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-6"
              >
                Close & View Status
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Smartphone,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  Copy,
  Check,
  Save,
  Loader2,
  ShieldCheck,
  Info,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { repsiApi, ApiPaymentSettings } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

export function PaymentSettingsTab() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ApiPaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingQr, setUploadingQr] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiInstructions, setUpiInstructions] = useState("");

  const [qrEnabled, setQrEnabled] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrFilename, setQrFilename] = useState<string | null>(null);

  const [phoneEnabled, setPhoneEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneName, setPhoneName] = useState("");

  const [bankEnabled, setBankEnabled] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankInstructions, setBankInstructions] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await repsiApi.getPaymentSettings();
      setSettings(data);
      setUpiEnabled(data.upi_enabled);
      setUpiId(data.upi_id || "");
      setUpiName(data.upi_name || "");
      setUpiInstructions(data.upi_instructions || "");

      setQrEnabled(data.qr_enabled);
      setQrImageUrl(data.qr_image_url || null);
      setQrFilename(data.qr_filename || null);

      setPhoneEnabled(data.phone_enabled);
      setPhoneNumber(data.phone_number || "");
      setPhoneName(data.phone_name || "");

      setBankEnabled(data.bank_enabled);
      setBankAccountName(data.bank_account_name || "");
      setBankName(data.bank_name || "");
      setBankAccountNumber(data.bank_account_number || "");
      setBankIfsc(data.bank_ifsc || "");
      setBankBranch(data.bank_branch || "");
      setBankInstructions(data.bank_instructions || "");
      setGeneralNotes(data.general_notes || "");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load payment settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSaveSuccess(false);

    // Validation: At least one payment method must remain enabled
    if (!upiEnabled && !qrEnabled && !phoneEnabled && !bankEnabled) {
      setErrorMsg(t("settings.oneRequired", "At least one payment method (UPI, QR, Phone, or Bank Transfer) must remain enabled."));
      return;
    }

    if (upiEnabled && (!upiId.trim() || !upiId.includes("@"))) {
      setErrorMsg("Please provide a valid UPI ID (e.g. yourbusiness@bank).");
      return;
    }

    if (bankEnabled && (!bankAccountNumber.trim() || !bankIfsc.trim())) {
      setErrorMsg("Please provide both Bank Account Number and IFSC Code for direct bank transfers.");
      return;
    }

    try {
      setSaving(true);
      const updated = await repsiApi.updatePaymentSettings({
        upi_enabled: upiEnabled,
        upi_id: upiId.trim(),
        upi_name: upiName.trim(),
        upi_instructions: upiInstructions.trim(),
        qr_enabled: qrEnabled,
        phone_enabled: phoneEnabled,
        phone_number: phoneNumber.trim(),
        phone_name: phoneName.trim(),
        bank_enabled: bankEnabled,
        bank_account_name: bankAccountName.trim(),
        bank_name: bankName.trim(),
        bank_account_number: bankAccountNumber.trim(),
        bank_ifsc: bankIfsc.trim().toUpperCase(),
        bank_branch: bankBranch.trim(),
        bank_instructions: bankInstructions.trim(),
        general_notes: generalNotes.trim(),
      });
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save payment settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrorMsg("Only PNG, JPEG, or WEBP merchant QR images are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("QR image file size exceeds 5MB limit.");
      return;
    }

    try {
      setUploadingQr(true);
      setErrorMsg("");
      const updated = await repsiApi.uploadMerchantQr(file);
      setSettings(updated);
      setQrEnabled(true);
      setQrImageUrl(updated.qr_image_url || null);
      setQrFilename(updated.qr_filename || file.name);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload QR image.");
    } finally {
      setUploadingQr(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveQr = async () => {
    try {
      setUploadingQr(true);
      const updated = await repsiApi.removeMerchantQr();
      setSettings(updated);
      setQrEnabled(false);
      setQrImageUrl(null);
      setQrFilename(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove QR image.");
    } finally {
      setUploadingQr(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[var(--text-muted)] space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#16A34A]" />
        <span className="text-sm">Loading payments and collection settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Card */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#16A34A]" />
              <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">
                {t("settings.payTitle", "Payments & Collections Configuration")}
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t(
                "settings.paySubtitle",
                "Configure your fitness center's manual payment channels so members can transfer fees directly without gateway commission."
              )}
            </p>
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-9 text-xs px-4 rounded-xl gap-1.5 cursor-pointer shadow-sm"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving..." : t("common.save", "Save Changes")}</span>
          </Button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{t("settings.savedSuccess", "Payment settings saved successfully!")}</span>
          </div>
        )}
      </div>

      {/* 1. UPI CONFIGURATION */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-hover)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A]">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-[var(--text)]">
                  {t("settings.upiSection", "UPI ID / VPA Configuration")}
                </CardTitle>
                <CardDescription className="text-xs text-[var(--text-muted)]">
                  Enable instant peer-to-peer or merchant UPI transfers (Google Pay, PhonePe, Paytm, BHIM).
                </CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={upiEnabled}
                onChange={(e) => setUpiEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span className={`text-xs font-semibold ${upiEnabled ? "text-[#16A34A]" : "text-[var(--text-muted)]"}`}>
                {upiEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">
                {t("settings.upiId", "UPI ID / VPA")} <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. gymname@okhdfcbank"
                  disabled={!upiEnabled}
                  className="text-xs font-mono pr-9"
                />
                {upiId && (
                  <button
                    type="button"
                    onClick={() => handleCopy("upi", upiId)}
                    className="absolute right-2 top-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                    title="Copy UPI ID"
                  >
                    {copiedKey === "upi" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">
                {t("settings.upiName", "Account Holder or Business Name")}
              </Label>
              <Input
                value={upiName}
                onChange={(e) => setUpiName(e.target.value)}
                placeholder="e.g. Apex Fitness Pvt Ltd"
                disabled={!upiEnabled}
                className="text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[var(--text)]">
              {t("settings.upiInstructions", "Optional UPI Instructions for Members")}
            </Label>
            <Input
              value={upiInstructions}
              onChange={(e) => setUpiInstructions(e.target.value)}
              placeholder="e.g. Add your Invoice Number in the payment remarks/notes field"
              disabled={!upiEnabled}
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. MERCHANT QR CODE */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-hover)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <QrCode className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-[var(--text)]">
                  {t("settings.qrSection", "Merchant QR Code Image")}
                </CardTitle>
                <CardDescription className="text-xs text-[var(--text-muted)]">
                  {t("settings.qrDesc", "Upload your official Google Pay, PhonePe, Paytm, or Bank QR image.")}
                </CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={qrEnabled}
                onChange={(e) => setQrEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className={`text-xs font-semibold ${qrEnabled ? "text-purple-600" : "text-[var(--text-muted)]"}`}>
                {qrEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* QR Preview Box */}
            <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-hover)]/30 flex flex-col items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
              {qrImageUrl ? (
                <img
                  src="/api/v1/payments/settings/qr-code"
                  alt="Merchant QR"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-2 text-[var(--text-muted)] space-y-1">
                  <QrCode className="h-8 w-8 mx-auto opacity-40" />
                  <span className="text-[10px] block">No QR Uploaded</span>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">
                  {qrFilename ? `Current File: ${qrFilename}` : "Upload Merchant QR"}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Supported formats: PNG, JPEG, WEBP. Maximum file size: 5MB. Files are verified server-side and stored in private storage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleQrUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingQr}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs font-semibold gap-1.5 rounded-xl cursor-pointer"
                >
                  {uploadingQr ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  <span>{qrImageUrl ? "Replace QR Image" : t("settings.uploadQrBtn", "Upload QR Image")}</span>
                </Button>

                {qrImageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={uploadingQr}
                    onClick={handleRemoveQr}
                    className="h-8 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t("settings.removeQrBtn", "Remove QR")}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. BUSINESS PAYMENT PHONE NUMBER */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-hover)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-[var(--text)]">
                  {t("settings.phoneSection", "Business Payment Phone Number")}
                </CardTitle>
                <CardDescription className="text-xs text-[var(--text-muted)]">
                  {t("settings.phoneDesc", "Phone number members can use for UPI contact or payment inquiries.")}
                </CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={phoneEnabled}
                onChange={(e) => setPhoneEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className={`text-xs font-semibold ${phoneEnabled ? "text-amber-600" : "text-[var(--text-muted)]"}`}>
                {phoneEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">
                Payment Contact Mobile Number
              </Label>
              <div className="relative">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  disabled={!phoneEnabled}
                  className="text-xs pr-9"
                />
                {phoneNumber && (
                  <button
                    type="button"
                    onClick={() => handleCopy("phone", phoneNumber)}
                    className="absolute right-2 top-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {copiedKey === "phone" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">Contact Display Name</Label>
              <Input
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                placeholder="e.g. Apex Reception & Accounts"
                disabled={!phoneEnabled}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. DIRECT BANK TRANSFER */}
      <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[var(--border)] bg-[var(--surface-hover)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-[var(--text)]">
                  {t("settings.bankSection", "Bank Account Details (NEFT / IMPS / RTGS)")}
                </CardTitle>
                <CardDescription className="text-xs text-[var(--text-muted)]">
                  {t("settings.bankDesc", "Expose official gym bank details to members for direct electronic transfers.")}
                </CardDescription>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bankEnabled}
                onChange={(e) => setBankEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-xs font-semibold ${bankEnabled ? "text-blue-600" : "text-[var(--text-muted)]"}`}>
                {bankEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">Account Holder Name</Label>
              <Input
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="e.g. Apex Fitness Pvt Ltd"
                disabled={!bankEnabled}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">Bank Name</Label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank Ltd"
                disabled={!bankEnabled}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">Account Number</Label>
              <div className="relative">
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="e.g. 50200012345678"
                  disabled={!bankEnabled}
                  className="text-xs font-mono pr-9"
                />
                {bankAccountNumber && (
                  <button
                    type="button"
                    onClick={() => handleCopy("bankAcc", bankAccountNumber)}
                    className="absolute right-2 top-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {copiedKey === "bankAcc" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text)]">IFSC Code</Label>
              <div className="relative">
                <Input
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  disabled={!bankEnabled}
                  className="text-xs font-mono uppercase pr-9"
                />
                {bankIfsc && (
                  <button
                    type="button"
                    onClick={() => handleCopy("ifsc", bankIfsc)}
                    className="absolute right-2 top-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {copiedKey === "ifsc" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-[var(--text)]">Branch & Instructions</Label>
              <Input
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                placeholder="e.g. Koramangala 5th Block Branch"
                disabled={!bankEnabled}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 text-[var(--text-muted)] text-xs flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[#16A34A] flex-shrink-0" />
        <p>
          <strong className="text-[var(--text)] font-semibold">Security & Tenant Privacy:</strong> REPSI never collects banking passwords, UPI PINs, OTPs, or authentication secrets. Your payment details are strictly tenant-isolated and only displayed to authorized active members of your facility.
        </p>
      </div>
    </form>
  );
}

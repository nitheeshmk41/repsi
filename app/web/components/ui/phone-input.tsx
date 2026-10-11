"use client";

import { useState, useEffect } from "react";

export interface CountryCodeItem {
  code: string;
  country: string;
  flag: string;
  label: string;
  currency: string;
  currencySymbol: string;
}

export const COUNTRY_CODES: CountryCodeItem[] = [
  { code: "+91", country: "IN", flag: "🇮🇳", label: "India (+91)", currency: "INR (₹)", currencySymbol: "₹" },
  { code: "+1", country: "US", flag: "🇺🇸", label: "USA (+1)", currency: "USD ($)", currencySymbol: "$" },
  { code: "+44", country: "GB", flag: "🇬🇧", label: "UK (+44)", currency: "GBP (£)", currencySymbol: "£" },
  { code: "+971", country: "AE", flag: "🇦🇪", label: "UAE (+971)", currency: "AED (د.إ)", currencySymbol: "AED" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada (+1)", currency: "USD ($)", currencySymbol: "$" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia (+61)", currency: "AUD ($)", currencySymbol: "$" },
  { code: "+65", country: "SG", flag: "🇸🇬", label: "Singapore (+65)", currency: "SGD ($)", currencySymbol: "$" },
  { code: "+966", country: "SA", flag: "🇸🇦", label: "Saudi Arabia (+966)", currency: "SAR (﷼)", currencySymbol: "SAR" },
  { code: "+49", country: "DE", flag: "🇩🇪", label: "Germany (+49)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+33", country: "FR", flag: "🇫🇷", label: "France (+33)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+39", country: "IT", flag: "🇮🇹", label: "Italy (+39)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+34", country: "ES", flag: "🇪🇸", label: "Spain (+34)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+31", country: "NL", flag: "🇳🇱", label: "Netherlands (+31)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+353", country: "IE", flag: "🇮🇪", label: "Ireland (+353)", currency: "EUR (€)", currencySymbol: "€" },
  { code: "+41", country: "CH", flag: "🇨🇭", label: "Switzerland (+41)", currency: "EUR (€)", currencySymbol: "CHF" },
  { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand (+64)", currency: "USD ($)", currencySymbol: "$" },
  { code: "+81", country: "JP", flag: "🇯🇵", label: "Japan (+81)", currency: "USD ($)", currencySymbol: "¥" },
  { code: "+82", country: "KR", flag: "🇰🇷", label: "South Korea (+82)", currency: "USD ($)", currencySymbol: "₩" },
  { code: "+60", country: "MY", flag: "🇲🇾", label: "Malaysia (+60)", currency: "USD ($)", currencySymbol: "RM" },
  { code: "+62", country: "ID", flag: "🇮🇩", label: "Indonesia (+62)", currency: "USD ($)", currencySymbol: "Rp" },
  { code: "+63", country: "PH", flag: "🇵🇭", label: "Philippines (+63)", currency: "USD ($)", currencySymbol: "₱" },
  { code: "+66", country: "TH", flag: "🇹🇭", label: "Thailand (+66)", currency: "USD ($)", currencySymbol: "฿" },
  { code: "+84", country: "VN", flag: "🇻🇳", label: "Vietnam (+84)", currency: "USD ($)", currencySymbol: "₫" },
  { code: "+55", country: "BR", flag: "🇧🇷", label: "Brazil (+55)", currency: "USD ($)", currencySymbol: "R$" },
  { code: "+52", country: "MX", flag: "🇲🇽", label: "Mexico (+52)", currency: "USD ($)", currencySymbol: "$" },
  { code: "+27", country: "ZA", flag: "🇿🇦", label: "South Africa (+27)", currency: "USD ($)", currencySymbol: "R" },
  { code: "+234", country: "NG", flag: "🇳🇬", label: "Nigeria (+234)", currency: "USD ($)", currencySymbol: "₦" },
  { code: "+254", country: "KE", flag: "🇰🇪", label: "Kenya (+254)", currency: "USD ($)", currencySymbol: "KSh" },
  { code: "+20", country: "EG", flag: "🇪🇬", label: "Egypt (+20)", currency: "USD ($)", currencySymbol: "E£" },
  { code: "+965", country: "KW", flag: "🇰🇼", label: "Kuwait (+965)", currency: "USD ($)", currencySymbol: "KD" },
  { code: "+974", country: "QA", flag: "🇶🇦", label: "Qatar (+974)", currency: "USD ($)", currencySymbol: "QR" },
  { code: "+968", country: "OM", flag: "🇴🇲", label: "Oman (+968)", currency: "USD ($)", currencySymbol: "OMR" },
  { code: "+973", country: "BH", flag: "🇧🇭", label: "Bahrain (+973)", currency: "USD ($)", currencySymbol: "BD" },
  { code: "+92", country: "PK", flag: "🇵🇰", label: "Pakistan (+92)", currency: "USD ($)", currencySymbol: "Rs" },
  { code: "+880", country: "BD", flag: "🇧🇩", label: "Bangladesh (+880)", currency: "USD ($)", currencySymbol: "৳" },
  { code: "+94", country: "LK", flag: "🇱🇰", label: "Sri Lanka (+94)", currency: "USD ($)", currencySymbol: "Rs" },
  { code: "+977", country: "NP", flag: "🇳🇵", label: "Nepal (+977)", currency: "USD ($)", currencySymbol: "Rs" },
  { code: "+46", country: "SE", flag: "🇸🇪", label: "Sweden (+46)", currency: "EUR (€)", currencySymbol: "kr" },
  { code: "+47", country: "NO", flag: "🇳🇴", label: "Norway (+47)", currency: "EUR (€)", currencySymbol: "kr" },
  { code: "+45", country: "DK", flag: "🇩🇰", label: "Denmark (+45)", currency: "EUR (€)", currencySymbol: "kr" },
  { code: "+48", country: "PL", flag: "🇵🇱", label: "Poland (+48)", currency: "EUR (€)", currencySymbol: "zł" },
  { code: "+90", country: "TR", flag: "🇹🇷", label: "Turkey (+90)", currency: "USD ($)", currencySymbol: "₺" },
];

export interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  onCountryChange?: (country: CountryCodeItem) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: boolean;
  forceLight?: boolean;
}

export function PhoneInput({
  id = "phone",
  value,
  onChange,
  onCountryChange,
  onBlur,
  placeholder = "98765 43210",
  className = "",
  required = false,
  error = false,
  forceLight = true,
}: PhoneInputProps) {
  // Extract initial country code if present, default +91
  const initialCountry =
    COUNTRY_CODES.find((c) => value && value.startsWith(c.code)) || COUNTRY_CODES[0];
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountry.code);

  const rawNumber = value.startsWith(selectedCountryCode)
    ? value.slice(selectedCountryCode.length).trim()
    : value;

  const handleCountrySelect = (newCode: string) => {
    setSelectedCountryCode(newCode);
    const matched = COUNTRY_CODES.find((c) => c.code === newCode);
    if (matched && onCountryChange) {
      onCountryChange(matched);
    }
    const cleanDigits = rawNumber.replace(/[^0-9]/g, "");
    onChange(cleanDigits ? `${newCode} ${cleanDigits}` : "");
  };

  const handleNumberChange = (num: string) => {
    const cleanDigits = num.replace(/[^0-9\s-]/g, "");
    onChange(cleanDigits ? `${selectedCountryCode} ${cleanDigits}` : "");
  };

  // Base theme classes
  const themeClasses = forceLight
    ? "bg-white text-[#111827] border-[#E2E8E5]"
    : "bg-white dark:bg-zinc-900 text-[#111714] dark:text-white border-[#D5DDD7] dark:border-zinc-800";

  return (
    <div
      className={`flex items-center rounded-lg border focus-within:ring-2 focus-within:ring-[#16A34A] focus-within:border-[#16A34A] transition-all overflow-hidden ${
        error
          ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
          : themeClasses
      } ${className}`}
    >
      {/* Country Select */}
      <div
        className={`relative border-r flex items-center shrink-0 ${
          forceLight
            ? "border-[#E2E8E5] bg-[#F8FAFC]"
            : "border-[#E2E8E4] dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50"
        }`}
      >
        <select
          value={selectedCountryCode}
          onChange={(e) => handleCountrySelect(e.target.value)}
          className={`h-11 pl-3 pr-7 text-xs font-semibold bg-transparent border-none outline-none cursor-pointer appearance-none ${
            forceLight ? "text-[#111827]" : "text-slate-800 dark:text-zinc-200"
          }`}
          aria-label="Select country code"
        >
          {COUNTRY_CODES.map((c, i) => (
            <option
              key={`${c.country}-${c.code}-${i}`}
              value={c.code}
              className="bg-white text-slate-800 text-xs py-1"
            >
              {c.flag} {c.country} ({c.code})
            </option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-[#64748B]">
          ▼
        </span>
      </div>

      {/* Phone Number Input */}
      <input
        id={id}
        type="tel"
        required={required}
        placeholder={placeholder}
        value={rawNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        onBlur={onBlur}
        className={`flex-1 h-11 px-3.5 text-sm placeholder:text-[#94A3B8] bg-transparent outline-none ${
          forceLight ? "text-[#111827]" : "text-[#111714] dark:text-white"
        }`}
      />
    </div>
  );
}

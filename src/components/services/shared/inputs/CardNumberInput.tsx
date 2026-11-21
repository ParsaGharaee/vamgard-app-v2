"use client";
import React from "react";
import { CreditCard } from "lucide-react";

// الگوریتم استاندارد اعتبارسنجی کارت‌های ۱۶ رقمی عضو شتاب (Luhn)
export const isValidCardNumber = (card: string) => {
  if (!/^\d{16}$/.test(card)) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let digit = parseInt(card[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const formatCardDisplay = (digits: string) =>
  digits.replace(/(\d{4})(?=\d)/g, "$1 - ");

export const CardNumberInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidCardNumber(value);
  const errorMsg =
    showErrors && !valid
      ? value.length < 16
        ? "شماره کارت باید ۱۶ رقم باشد."
        : "شماره کارت وارد شده نامعتبر است."
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    onChange(digits);
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        شماره کارت
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          placeholder="6362 - 1410 - 8173 - 4437"
          value={formatCardDisplay(value)}
          onChange={handleChange}
          className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 font-sans text-left tracking-wider
            ${
              errorMsg
                ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
                : valid
                  ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-emerald-600"
                  : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
            }
          `}
        />
        <CreditCard
          size={22}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            errorMsg
              ? "text-red-400"
              : valid
                ? "text-emerald-500"
                : "text-silver/60 group-focus-within:text-brand"
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          errorMsg ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[10px] text-red-500 font-bold pr-1">{errorMsg}</p>
      </div>
    </div>
  );
};
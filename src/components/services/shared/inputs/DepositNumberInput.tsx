"use client";
import React from "react";
import { Landmark } from "lucide-react";

// پذیرش اعداد و جداکننده‌های مجاز شماره حساب (/ و . و -) با حداقل ۵ کاراکتر
export const isValidDepositNumber = (deposit: string) =>
  /^[0-9./-]{5,30}$/.test(deposit) && /\d{4,}/.test(deposit.replace(/\D/g, ""));

export const DepositNumberInput = ({
  value,
  onChange,
  showErrors,
  placeholder = "مثال: 1071333715508",
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
  placeholder?: string;
}) => {
  const valid = isValidDepositNumber(value);
  const errorMsg =
    showErrors && !valid
      ? "شماره حساب معتبر وارد کنید (اعداد و جداکننده‌های / یا .)."
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9./-]/g, "").slice(0, 30);
    onChange(cleaned);
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        شماره حساب
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="text"
          dir="ltr"
          placeholder={placeholder}
          value={value}
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
        <Landmark
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
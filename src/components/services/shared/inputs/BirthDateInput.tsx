"use client";
import React from "react";
import { Calendar } from "lucide-react";

export const isValidBirthDate = (date: string) =>
  /^(13|14)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(date);

const formatBirthDate = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`; return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6)}`;
};

export const BirthDateInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidBirthDate(value);
  const errorMsg =
    showErrors && !valid
      ? "تاریخ تولد را به فرمت صحیح وارد کنید (مثال: 1371/06/18)."
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatBirthDate(e.target.value));
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        تاریخ تولد
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          placeholder="1371/06/18"
          value={value}
          onChange={handleChange}
          maxLength={10}
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
        <Calendar
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
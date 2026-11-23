"use client";
import React from "react";
import { IdCard } from "lucide-react";

// سریال ۱۰ کاراکتری پشت کارت ملی هوشمند (حروف انگلیسی و اعداد) یا کد رهگیری رسید کاغذی
export const isValidNationalCardSerial = (serial: string) =>
  /^[A-Za-z0-9]{10}$/.test(serial.trim());

export const NationalCardSerialInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidNationalCardSerial(value);
  const errorMsg =
    showErrors && !valid
      ? "سریال پشت کارت ملی (یا کد رهگیری رسید) باید ۱۰ کاراکتر انگلیسی/عددی باشد."
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 10);
    onChange(cleaned);
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        سریال پشت کارت ملی هوشمند
      </label>
      <div className="relative group">
        <input
          type="text"
          dir="ltr"
          placeholder="مثال: 1R29366454"
          value={value}
          onChange={handleChange}
          maxLength={10}
          className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 font-mono text-left tracking-widest uppercase
            ${
              errorMsg
                ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
                : valid
                  ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-emerald-600"
                  : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
            }
          `}
        />
        <IdCard
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
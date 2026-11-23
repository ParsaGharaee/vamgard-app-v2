"use client";
import { Globe } from "lucide-react";

// تمیز کردن پروتکل و اسلش انتهایی برای ارسال استاندارد به فینوتک
export const normalizeWebsite = (raw: string) =>
  raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");

export const isValidWebsite = (url: string) => {
  const cleaned = normalizeWebsite(url);
  return /^(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(cleaned);
};

export const WebsiteInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidWebsite(value);
  const errorMsg =
    showErrors && !valid
      ? "آدرس وب‌سایت معتبر وارد کنید (مثال: www.finnotech.ir)."
      : "";

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        آدرس وب‌سایت
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="url"
          dir="ltr"
          placeholder="www.finnotech.ir"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
          className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 font-sans text-left
            ${
              errorMsg
                ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
                : valid
                  ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-emerald-600"
                  : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
            }
          `}
        />
        <Globe
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
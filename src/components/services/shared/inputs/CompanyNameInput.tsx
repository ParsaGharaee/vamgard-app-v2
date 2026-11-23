"use client";
import { Building2 } from "lucide-react";

export const isValidCompanyName = (name: string) => name.trim().length >= 2;

export const CompanyNameInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidCompanyName(value);
  const errorMsg =
    showErrors && !valid ? "نام شرکت باید حداقل ۲ کاراکتر باشد." : "";

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        نام شرکت یا کسب‌وکار
      </label>
      <div className="relative group">
        <input
          type="text"
          dir="rtl"
          placeholder="مثال: فین و تک پارس"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 text-right
            ${
              errorMsg
                ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
                : valid
                  ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-emerald-600"
                  : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
            }
          `}
        />
        <Building2
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
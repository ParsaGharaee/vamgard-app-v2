"use client";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  error?: string;
  showErrors?: boolean;
};

export const VamInput = ({
  label,
  hint,
  icon: Icon,
  error,
  showErrors,
  className,
  ...props
}: Props) => (
  <div className="mb-5 relative">
    <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{label}</label>
    {hint && <p className="text-[10px] text-silver/70 mb-2 pr-1 leading-5">{hint}</p>}
    <div className="relative group">
      <input
        className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 font-sans text-left tracking-wide text-ink placeholder:text-silver/40
          ${
            showErrors && error
              ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
              : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10"
          }
          ${className || ""}`}
        dir="ltr"
        {...props}
      />
      {Icon && (
        <Icon
          size={22}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300
            ${
              showErrors && error
                ? "text-red-400"
                : "text-silver/60 group-focus-within:text-brand"
            }`}
        />
      )}
    </div>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        showErrors && error ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"
      }`}
    >
      <p className="text-[10px] text-red-500 font-bold pr-1">{error}</p>
    </div>
  </div>
);

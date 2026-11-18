"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type VamSelectOption = { value: string; label: string };

type Props = {
  label: string;
  hint?: string;
  value: string;
  options: VamSelectOption[];
  placeholder?: string;
  error?: string;
  showErrors?: boolean;
  onChange: (value: string) => void;
};

export function VamSelect({
  label,
  hint,
  value,
  options,
  placeholder = "انتخاب کنید",
  error,
  showErrors,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="mb-5 relative" ref={rootRef}>
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{label}</label>
      {hint && <p className="text-[10px] text-silver/70 mb-2 pr-1 leading-5">{hint}</p>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full surface rounded-2xl py-3.5 px-4 text-[15px] font-bold outline-none transition-all duration-300 flex items-center justify-between gap-3 text-right
          ${
            showErrors && error
              ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
              : open
                ? "border border-brand/40 ring-4 ring-brand/10 text-ink"
                : "border border-transparent text-ink"
          }`}
        aria-expanded={open}
      >
        <span className={selected ? "text-ink" : "text-silver/50"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-silver transition-transform ${open ? "rotate-180 text-brand" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-line/10 bg-card shadow-[var(--sh)] animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-right text-sm font-bold text-silver hover:bg-tile/60 transition-colors"
          >
            {placeholder}
          </button>
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center justify-between gap-2 transition-colors
                  ${active ? "bg-brand text-white" : "text-ink hover:bg-tile/70"}`}
              >
                <span>{opt.label}</span>
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ${
          showErrors && error ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[10px] text-red-500 font-bold pr-1">{error}</p>
      </div>
    </div>
  );
}

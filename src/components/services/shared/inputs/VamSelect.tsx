"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export const VamSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید...",
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-5 relative" ref={ref}>
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full surface rounded-2xl py-3.5 px-4 text-sm font-bold flex items-center justify-between transition-all duration-300 border
          ${open ? "border-brand/40 ring-4 ring-brand/10" : "border-transparent"}
        `}
      >
        <div className="flex items-center gap-2.5">
          {selected?.icon && <span className="text-brand">{selected.icon}</span>}
          <span className={selected ? "text-ink" : "text-silver/50"}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-silver transition-transform duration-300 ${open ? "rotate-180 text-brand" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full surface rounded-2xl border border-line/10 shadow-xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold transition-colors border-b border-line/5 last:border-0
                  ${isSelected ? "bg-brand/10 text-brand" : "text-ink hover:bg-tile/50"}
                `}
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon && (
                    <span className={isSelected ? "text-brand" : "text-silver"}>
                      {opt.icon}
                    </span>
                  )}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={16} className="text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
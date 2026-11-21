"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface CarPlateValue {
  p1: string;     // ۲ رقم اول
  letter: string; // حرف پلاک
  p2: string;     // ۳ رقم دوم
  code: string;   // کد ایران (۲ رقم)
}

export const PLATE_LETTER_CODES: Record<string, string> = {
  ب: "02",
  ت: "04",
  ج: "06",
  د: "10",
  س: "15",
  ص: "17",
  ط: "19",
  ع: "21",
  ق: "24",
  ل: "27",
  م: "28",
  ن: "29",
  و: "30",
  ه: "31",
  ی: "32",
  الف: "01",
  پ: "03",
  ث: "05",
  ز: "13",
  ژ: "14",
  ش: "16",
  ف: "23",
  ک: "25",
  گ: "26",
};

const PLATE_LETTERS = Object.keys(PLATE_LETTER_CODES);

export const isValidCarPlate = (plate: CarPlateValue) =>
  /^\d{2}$/.test(plate.p1) &&
  Boolean(PLATE_LETTER_CODES[plate.letter]) &&
  /^\d{3}$/.test(plate.p2) &&
  /^\d{2}$/.test(plate.code);

export const toFinnotechPlateNumber = (plate: CarPlateValue) => {
  const letterCode = PLATE_LETTER_CODES[plate.letter] ?? "02";
  return `${plate.p1}${letterCode}${plate.p2}${plate.code}`;
};

export const CarPlateInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: CarPlateValue;
  onChange: (val: CarPlateValue) => void;
  showErrors?: boolean;
}) => {
  const [letterOpen, setLetterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const valid = isValidCarPlate(value);
  const errorMsg =
    showErrors && !valid ? "لطفاً تمام بخش‌های پلاک خودرو را به درستی وارد کنید." : "";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLetterOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const updateDigit = (field: "p1" | "p2" | "code", raw: string, max: number) => {
    const digits = raw.replace(/\D/g, "").slice(0, max);
    onChange({ ...value, [field]: digits });

    if (field === "p1" && digits.length === 2) p2Ref.current?.focus();
    if (field === "p2" && digits.length === 3) codeRef.current?.focus();
  };

  return (
    <div className="mb-5 relative" ref={dropdownRef}>
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        شماره پلاک خودرو
      </label>

      <div
        dir="ltr"
        className={`flex h-[60px] w-full overflow-hidden rounded-2xl surface border-2 shadow-sm transition-all duration-300
          ${
            errorMsg
              ? "border-red-500/60 ring-4 ring-red-500/10 bg-red-500/5"
              : valid
                ? "border-emerald-500/60 ring-4 ring-emerald-500/10"
                : "border-line/20 focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10"
          }
        `}
      >
        {/* نوار آبی سمت چپ همراه با پرچم ایران */}
        <div className="flex w-11 shrink-0 flex-col items-center justify-between bg-[#003399] py-2 text-white select-none">
          <div className="flex h-3 w-6 flex-col overflow-hidden rounded-[2px] ring-1 ring-white/20">
            <span className="flex-1 bg-[#239F40]" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#DA0000]" />
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[7px] font-bold tracking-wider opacity-90">I.R.</span>
            <span className="text-[8.5px] font-black tracking-tight mt-0.5">IRAN</span>
          </div>
        </div>

        {/* ۲ رقم اول */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="۱۲"
          value={value.p1}
          onChange={(e) => updateDigit("p1", e.target.value, 2)}
          className="w-[70px] bg-transparent text-center text-xl font-black text-ink outline-none placeholder:text-silver/30 tracking-wider"
        />

        {/* انتخاب حرف پلاک */}
        <button
          type="button"
          onClick={() => setLetterOpen((o) => !o)}
          className="flex items-center justify-center gap-1 px-2.5 bg-tile/50 hover:bg-tile text-ink font-black text-lg transition-colors border-x border-line/10 min-w-[64px]"
        >
          <span>{value.letter || "ب"}</span>
          <ChevronDown
            size={14}
            className={`text-silver transition-transform duration-200 ${letterOpen ? "rotate-180 text-brand" : ""}`}
          />
        </button>

        {/* ۳ رقم دوم */}
        <input
          ref={p2Ref}
          type="text"
          inputMode="numeric"
          placeholder="۳۴۵"
          value={value.p2}
          onChange={(e) => updateDigit("p2", e.target.value, 3)}
          className="flex-1 min-w-0 bg-transparent text-center text-xl font-black text-ink outline-none placeholder:text-silver/30 tracking-widest"
        />

        {/* بخش کد ایران */}
        <div className="flex w-[68px] shrink-0 flex-col items-center justify-center border-l-2 border-line/15 bg-tile/30 px-1 py-1">
          <span className="text-[9px] font-extrabold text-silver leading-none">ایران</span>
          <input
            ref={codeRef}
            type="text"
            inputMode="numeric"
            placeholder="۶۶"
            value={value.code}
            onChange={(e) => updateDigit("code", e.target.value, 2)}
            className="w-full bg-transparent text-center text-lg font-black text-ink outline-none placeholder:text-silver/30 mt-0.5"
          />
        </div>
      </div>

      {/* دراپ‌داون حروف پلاک */}
      {letterOpen && (
        <div className="absolute z-40 mt-2 w-full surface rounded-2xl border border-line/10 shadow-xl shadow-black/25 p-2.5 grid grid-cols-6 gap-1.5 animate-in fade-in zoom-in-95 duration-200">
          {PLATE_LETTERS.map((l) => {
            const active = value.letter === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => {
                  onChange({ ...value, letter: l });
                  setLetterOpen(false);
                  p2Ref.current?.focus();
                }}
                className={`h-9 rounded-xl text-sm font-extrabold transition-colors ${
                  active ? "bg-brand text-white" : "bg-tile/60 text-ink hover:bg-tile"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}

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
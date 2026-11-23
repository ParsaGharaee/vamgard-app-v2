"use client";
import React from "react";
import { Landmark } from "lucide-react";

// اعتبارسنجی استاندارد شماره شبا ایران (IR + ۲۴ رقم با الگوریتم ISO 7064 Mod 97)
export const isValidIban = (iban: string) => {
  const cleaned = iban.toUpperCase().replace(/\s/g, "");
  if (!/^IR\d{24}$/.test(cleaned)) return false;

  // انتقال ۴ کاراکتر اول به انتها و تبدیل IR به 1827
  const rearranged = cleaned.slice(4) + "1827" + cleaned.slice(2, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    remainder = (remainder * 10 + Number(rearranged[i])) % 97;
  }
  return remainder === 1;
};

const formatIbanDigits = (digits: string) =>
  digits.replace(/(\d{4})(?=\d)/g, "$1 ");

export const IbanInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  // فقط ۲۴ رقم بعد از IR در ورودی نمایش داده می‌شود و مقدار خروجی با پیشوند IR برمی‌گردد
  const digits = value.replace(/^IR/i, "").replace(/\D/g, "").slice(0, 24);
  const fullIban = digits ? `IR${digits}` : "";
  const valid = isValidIban(fullIban);

  const errorMsg =
    showErrors && !valid
      ? digits.length < 24
        ? "شماره شبا باید شامل IR و ۲۴ رقم باشد."
        : "شماره شبا وارد شده نامعتبر است."
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedDigits = e.target.value
      .replace(/^IR/i, "")
      .replace(/\D/g, "")
      .slice(0, 24);
    onChange(cleanedDigits ? `IR${cleanedDigits}` : "");
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        شماره شبا (IBAN)
      </label>

      <div
        className={`relative group flex items-center surface rounded-2xl transition-all duration-300 overflow-hidden
          ${
            errorMsg
              ? "border border-red-500/40 focus-within:ring-4 focus-within:ring-red-500/10 bg-red-500/5"
              : valid
                ? "border border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10"
                : "border border-transparent focus-within:border-brand/30 focus-within:ring-4 focus-within:ring-brand/10"
          }
        `}
      >
        <Landmark
          size={20}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            errorMsg
              ? "text-red-400"
              : valid
                ? "text-emerald-500"
                : "text-silver/60 group-focus-within:text-brand"
          }`}
        />

        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          placeholder="1111 1111 1111 1111 1111 1111"
          value={formatIbanDigits(digits)}
          onChange={handleChange}
          className={`w-full bg-transparent py-3.5 pr-11 pl-12 text-[14px] font-bold outline-none font-mono text-left tracking-wider placeholder:text-silver/40
            ${
              errorMsg
                ? "text-red-500"
                : valid
                  ? "text-emerald-600"
                  : "text-ink"
            }
          `}
        />

        {/* پیشوند ثابت IR سمت چپ */}
        <span
          dir="ltr"
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black font-mono select-none px-1.5 py-0.5 rounded-md ${
            valid
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-tile text-silver"
          }`}
        >
          IR
        </span>
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
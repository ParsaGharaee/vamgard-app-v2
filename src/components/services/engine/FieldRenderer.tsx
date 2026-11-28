"use client";
import { VamInput, CarPlate, MotorPlate, VamSelect } from "../shared";
import { NationalCodeInput } from "../shared/inputs/NationalCodeInput";
import { MobileInput } from "../shared/inputs/MobileInput";
import { OtpInput } from "../shared/inputs/OtpInput";
import type { ServiceField } from "@/src/lib/finnotech/types";
import { presentField } from "./fieldPresentation";
import { Calendar, CreditCard, FileText, Upload } from "lucide-react";

type Props = {
  field: ServiceField;
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
  error?: string;
  onOtpComplete?: (otp: string) => void;
  otpLoading?: boolean;
  otpSuccess?: boolean;
};

export function FieldRenderer({
  field,
  value,
  onChange,
  showErrors,
  error,
  onOtpComplete,
  otpLoading,
  otpSuccess,
}: Props) {
  const ui = presentField(field);

  if (field.kind === "plate") {
    return (
      <PlateField
        label={ui.label}
        hint={ui.hint}
        value={value}
        onChange={onChange}
        showErrors={showErrors}
        error={error}
      />
    );
  }
  if (field.kind === "motorPlate") {
    return (
      <MotorPlateField
        label={ui.label}
        hint={ui.hint}
        value={value}
        onChange={onChange}
        showErrors={showErrors}
        error={error}
      />
    );
  }
  if (field.kind === "nationalCode") {
    return (
      <NationalCodeInput value={value} onChange={onChange} showErrors={showErrors} />
    );
  }
  if (field.kind === "mobile") {
    return <MobileInput value={value} onChange={onChange} showErrors={showErrors} />;
  }
  if (field.kind === "otp" && onOtpComplete) {
    return (
      <OtpInput
        length={4}
        onComplete={onOtpComplete}
        error={error}
        loading={otpLoading}
        success={otpSuccess}
      />
    );
  }
  if (field.kind === "select" && field.enum?.length) {
    return (
      <VamSelect
        label={ui.label}
        hint={ui.hint}
        value={value}
        options={ui.options}
        showErrors={showErrors}
        error={error}
        onChange={onChange}
      />
    );
  }
  if (field.kind === "file") {
    return (
      <div className="mb-5">
        <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{ui.label}</label>
        {ui.hint && <p className="text-[10px] text-silver/70 mb-2 pr-1 leading-5">{ui.hint}</p>}
        <label className="surface rounded-2xl py-4 px-4 flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-brand/30 transition-all">
          <div className="text-right">
            <div className="text-sm font-bold text-ink">
              {value ? "فایل انتخاب شد" : "انتخاب فایل"}
            </div>
            <div className="text-[10px] text-silver mt-1">تصویر، ویدیو یا PDF</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand">
            <Upload size={18} />
          </span>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const result = String(reader.result || "");
                const b64 = result.includes(",") ? result.split(",")[1] : result;
                onChange(b64);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {value && (
          <p className="text-[11px] text-emerald-500 mt-2 font-bold pr-1">فایل آماده ارسال است</p>
        )}
        {showErrors && error && (
          <p className="text-red-500 text-[10px] mt-1.5 pr-1 font-bold">{error}</p>
        )}
      </div>
    );
  }
  if (field.kind === "boolean") {
    return (
      <label className="mb-5 flex items-center gap-3 surface rounded-2xl px-4 py-3.5 border border-transparent">
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          className="size-4 accent-[#087bff]"
        />
        <span className="text-sm font-bold text-ink">{ui.label}</span>
      </label>
    );
  }

  const icon =
    field.kind === "birthDate"
      ? Calendar
      : field.kind === "card" || field.kind === "iban"
        ? CreditCard
        : FileText;

  return (
    <VamInput
      label={ui.label}
      hint={ui.hint}
      icon={icon}
      placeholder={
        field.placeholder
          ? field.placeholder.startsWith("مثال")
            ? field.placeholder
            : `مثال: ${field.placeholder}`
          : ui.label
      }
      value={value}
      maxLength={field.maxLength}
      showErrors={showErrors}
      error={error}
      onChange={(e) => onChange(e.target.value)}
      inputMode={field.kind === "number" ? "numeric" : undefined}
    />
  );
}

function PlateField({
  label,
  hint,
  value,
  onChange,
  showErrors,
  error,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
  error?: string;
}) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const code = digits.slice(5, 7);
  const letterCode = digits.slice(7, 9);
  const letter = letterCode || "الف";

  return (
    <div className="mb-5">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{label}</label>
      {hint && <p className="text-[10px] text-silver/70 mb-2 pr-1 leading-5">{hint}</p>}
      <CarPlate p1={p1 || "۱۲"} letter={letter} p2={p2 || "۳۴۵"} code={code || "۱۱"} />
      <VamInput
        label="کد ۹ رقمی پلاک"
        icon={FileText}
        placeholder="مثال: 121234511"
        value={digits}
        maxLength={9}
        inputMode="numeric"
        showErrors={showErrors}
        error={error}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
      />
    </div>
  );
}

function MotorPlateField({
  label,
  hint,
  value,
  onChange,
  showErrors,
  error,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
  error?: string;
}) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const top = digits.slice(0, 3);
  const bottom = digits.slice(3, 8);

  return (
    <div className="mb-5">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{label}</label>
      {hint && <p className="text-[10px] text-silver/70 mb-2 pr-1 leading-5">{hint}</p>}
      <MotorPlate top={top || "۱۲۳"} bottom={bottom || "۴۵۶۷۸"} />
      <VamInput
        label="کد ۸ رقمی پلاک موتور"
        icon={FileText}
        placeholder="مثال: 12345678"
        value={digits}
        maxLength={8}
        inputMode="numeric"
        showErrors={showErrors}
        error={error}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
      />
    </div>
  );
}

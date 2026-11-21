"use client";
import { IdCard } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidLicenseNumber = (code: string) => /^\d{10}$/.test(code);

export const LicenseNumberInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidLicenseNumber(value);
  const errorMsg =
    showErrors && !valid ? "شماره گواهینامه باید دقیقاً ۱۰ رقم باشد." : "";

  return (
    <BaseNumericInput
      label="شماره گواهینامه"
      icon={IdCard}
      placeholder="مثال: 9607173353"
      value={value}
      onChange={onChange}
      maxLength={10}
      isValid={valid}
      error={errorMsg}
    />
  );
};
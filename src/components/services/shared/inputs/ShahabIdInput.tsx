"use client";
import { Fingerprint } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidShahabId = (code: string) => /^\d{16}$/.test(code);

export const ShahabIdInput = ({
  value,
  onChange,
  label = "کد شهاب (۱۶ رقم)",
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  showErrors?: boolean;
}) => {
  const valid = isValidShahabId(value);
  const errorMsg =
    showErrors && !valid ? "کد شهاب باید دقیقاً ۱۶ رقم باشد." : "";

  return (
    <BaseNumericInput
      label={label}
      icon={Fingerprint}
      placeholder="مثال: 2000014000000000"
      value={value}
      onChange={onChange}
      maxLength={16}
      isValid={valid}
      error={errorMsg}
    />
  );
};
"use client";
import { Building2 } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidLegalId = (code: string) => /^\d{11}$/.test(code);

export const LegalIdInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidLegalId(value);
  const errorMsg =
    showErrors && !valid ? "شناسه ملی شخص حقوقی باید دقیقاً ۱۱ رقم باشد." : "";

  return (
    <BaseNumericInput
      label="شناسه ملی شخص حقوقی"
      icon={Building2}
      placeholder="مثال: 10101234567"
      value={value}
      onChange={onChange}
      maxLength={11}
      isValid={valid}
      error={errorMsg}
    />
  );
};
"use client";
import { FileDigit } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidSayadId = (code: string) => /^\d{16}$/.test(code);

export const SayadIdInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidSayadId(value);
  const errorMsg =
    showErrors && !valid ? "شناسه چک صیادی باید دقیقاً ۱۶ رقم باشد." : "";

  return (
    <BaseNumericInput
      label="شناسه چک صیادی"
      icon={FileDigit}
      placeholder="مثال: 1234567890123456"
      value={value}
      onChange={onChange}
      maxLength={16}
      isValid={valid}
      error={errorMsg}
    />
  );
};
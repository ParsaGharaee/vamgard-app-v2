"use client";
import { Globe } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

// شناسه یکتا / کد فراگیر اتباع خارجی (معمولاً ۱۰ تا ۱۲ رقم)
export const isValidForeignerId = (code: string) => /^\d{10,12}$/.test(code);

export const ForeignerIdInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidForeignerId(value);
  const errorMsg =
    showErrors && !valid
      ? "شناسه تبعه باید بین ۱۰ تا ۱۲ رقم باشد."
      : "";

  return (
    <BaseNumericInput
      label="شناسه تبعه (کد فراگیر)"
      icon={Globe}
      placeholder="مثال: 997524867412"
      value={value}
      onChange={onChange}
      maxLength={12}
      isValid={valid}
      error={errorMsg}
    />
  );
};
"use client";
import { PackageSearch } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

// کد رهگیری استاندارد شرکت پست جمهوری اسلامی ایران ۲۴ رقم است
export const isValidPostalTrackingCode = (code: string) => /^\d{24}$/.test(code);

export const PostalTrackingCodeInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidPostalTrackingCode(value);
  const errorMsg =
    showErrors && !valid
      ? "کد رهگیری مرسوله پستی باید دقیقاً ۲۴ رقم باشد."
      : "";

  return (
    <BaseNumericInput
      label="کد رهگیری مرسوله پستی"
      icon={PackageSearch}
      placeholder="مثال: 000000000000000000000000"
      value={value}
      onChange={onChange}
      maxLength={24}
      isValid={valid}
      error={errorMsg}
    />
  );
};
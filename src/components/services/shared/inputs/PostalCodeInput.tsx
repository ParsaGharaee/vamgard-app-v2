"use client";
import { MapPin } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidPostalCode = (code: string) =>
  /^\d{10}$/.test(code) && !/^(\d)\1{9}$/.test(code);

export const PostalCodeInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidPostalCode(value);
  const errorMsg =
    showErrors && !valid
      ? value.length < 10
        ? "کد پستی باید دقیقاً ۱۰ رقم باشد."
        : "کد پستی وارد شده نامعتبر است."
      : "";

  return (
    <BaseNumericInput
      label="کد پستی"
      icon={MapPin}
      placeholder="مثال: 1341666958"
      value={value}
      onChange={onChange}
      maxLength={10}
      isValid={valid}
      error={errorMsg}
    />
  );
};
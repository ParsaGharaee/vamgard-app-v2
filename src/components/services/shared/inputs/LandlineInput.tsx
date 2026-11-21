"use client";
import { PhoneCall } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

// شماره تلفن ثابت ۱۱ رقمی با کد شهر (شروع با ۰، غیر از ۰۹)
export const isValidLandline = (phone: string) => /^0[1-8]\d{9}$/.test(phone);

export const LandlineInput = ({
  value,
  onChange,
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const valid = isValidLandline(value);
  const errorMsg =
    showErrors && !valid
      ? "شماره تلفن ثابت باید ۱۱ رقم و همراه با کد شهر باشد (مثال: 02177689361)."
      : "";

  return (
    <BaseNumericInput
      label="شماره تلفن ثابت (با کد شهر)"
      icon={PhoneCall}
      placeholder="مثال: 02177689361"
      value={value}
      onChange={onChange}
      maxLength={11}
      isValid={valid}
      error={errorMsg}
    />
  );
};
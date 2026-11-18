"use client";
import { Phone } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidMobile = (mobile: string) => /^09\d{9}$/.test(mobile);

export const MobileInput = ({ value, onChange, showErrors }: { value: string, onChange: (v: string) => void, showErrors?: boolean }) => {
  const valid = value.length === 11 && isValidMobile(value);
  const errorMsg = showErrors && !valid ? "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود." : "";
  
  return (
    <BaseNumericInput 
      label="شماره موبایل" icon={Phone} placeholder="مثال: 09123456789" 
      value={value} onChange={onChange} maxLength={11} 
      isValid={valid} error={errorMsg} 
    />
  );
};
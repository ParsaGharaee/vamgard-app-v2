"use client";
import { User } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export const isValidNationalCode = (code: string) => {
  if (!/^\d{10}$/.test(code)) return false;
  const isAllSame = /^[0]{10}|[1]{10}|[2]{10}|[3]{10}|[4]{10}|[5]{10}|[6]{10}|[7]{10}|[8]{10}|[9]{10}$/;
  if (isAllSame.test(code)) return false;

  const check = parseInt(code[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

export const NationalCodeInput = ({ value, onChange, showErrors }: { value: string, onChange: (v: string) => void, showErrors?: boolean }) => {
  const valid = value.length === 10 && isValidNationalCode(value);
  const errorMsg = showErrors && !valid ? (value.length < 10 ? "کد ملی باید ۱۰ رقم باشد." : "کد ملی وارد شده نامعتبر است.") : "";
  
  return (
    <BaseNumericInput 
      label="کد ملی" icon={User} placeholder="مثال: 0012345678" 
      value={value} onChange={onChange} maxLength={10} 
      isValid={valid} error={errorMsg} 
    />
  );
};
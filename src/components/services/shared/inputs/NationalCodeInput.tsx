"use client";
import { useEffect, useState } from "react";
import { CreditCard, UserCheck } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";
import { loadSession, useSessionListener } from "@/src/lib/session";

export const isValidNationalCode = (code: string) => {
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false;
  const check = +code[9];
  const sum =
    code
      .slice(0, 9)
      .split("")
      .reduce((acc, digit, i) => acc + +digit * (10 - i), 0) % 11;
  return sum < 2 ? check === sum : check + sum === 11;
};

export const NationalCodeInput = ({
  value,
  onChange,
  label = "کد ملی",
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  showErrors?: boolean;
}) => {
  const [myNid, setMyNid] = useState<string | undefined>();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setMyNid(s.loggedIn && s.nationalCode ? s.nationalCode : undefined);
    };
    sync();
    return useSessionListener(sync);
  }, []);

  const valid = isValidNationalCode(value);
  const errorMsg =
    showErrors && !valid ? "کد ملی ۱۰ رقمی معتبر وارد کنید." : "";

  return (
    <div>
      <BaseNumericInput
        label={label}
        icon={CreditCard}
        placeholder="مثال: 0012345678"
        value={value}
        onChange={onChange}
        maxLength={10}
        isValid={valid}
        error={errorMsg}
      />

      {myNid && value !== myNid && (
        <button
          type="button"
          onClick={() => onChange(myNid)}
          className="-mt-3 mb-4 inline-flex items-center gap-1.5 rounded-xl border border-brand/25 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
        >
          <UserCheck size={13} />
          <span>استفاده از کد ملی خودم</span>
        </button>
      )}
    </div>
  );
};
"use client";
import { useEffect, useState } from "react";
import { Smartphone, UserCheck } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";
import { loadSession, useSessionListener } from "@/src/lib/session";

export const isValidMobile = (mobile: string) => /^09\d{9}$/.test(mobile);

export const MobileInput = ({
  value,
  onChange,
  label = "شماره موبایل",
  showErrors,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  showErrors?: boolean;
}) => {
  const [myMobile, setMyMobile] = useState<string | undefined>();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setMyMobile(s.loggedIn && s.mobile ? s.mobile : undefined);
    };
    sync();
    return useSessionListener(sync);
  }, []);

  const valid = isValidMobile(value);
  const errorMsg =
    showErrors && !valid ? "شماره موبایل معتبر (با ۰۹) وارد کنید." : "";

  return (
    <div>
      <BaseNumericInput
        label={label}
        icon={Smartphone}
        placeholder="مثال: 09123456789"
        value={value}
        onChange={onChange}
        maxLength={11}
        isValid={valid}
        error={errorMsg}
      />

      {myMobile && value !== myMobile && (
        <button
          type="button"
          onClick={() => onChange(myMobile)}
          className="-mt-3 mb-4 inline-flex items-center gap-1.5 rounded-xl border border-brand/25 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
        >
          <UserCheck size={13} />
          <span>استفاده از شماره موبایل خودم</span>
        </button>
      )}
    </div>
  );
};
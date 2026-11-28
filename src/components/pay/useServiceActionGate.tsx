"use client";

import { useRef, useState } from "react";
import { LoginSheet } from "@/src/components/auth/LoginSheet";
import { PayOrWalletModal, tryDirectWalletSpend } from "./PayOrWalletModal";
import { loadSession } from "@/src/lib/session";

export function useServiceActionGate(priceToman: number, serviceTitle: string) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const proceedPayment = () => {
    if (tryDirectWalletSpend(priceToman, serviceTitle)) {
      pendingAction.current?.();
      pendingAction.current = null;
    } else {
      setPayOpen(true);
    }
  };

  const runWithGate = (action: () => void) => {
    pendingAction.current = action;
    if (!loadSession().loggedIn) {
      setLoginOpen(true);
      return;
    }
    proceedPayment();
  };

  const GateSheets = (
    <>
      <LoginSheet
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title={`ورود برای ${serviceTitle}`}
        subtitle="برای ادامه و ثبت نتیجه استعلام در تاریخچه حساب، ابتدا وارد شوید."
        onSuccess={() => proceedPayment()}
      />
      <PayOrWalletModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amountToman={priceToman}
        serviceTitle={serviceTitle}
        onPaid={() => {
          pendingAction.current?.();
          pendingAction.current = null;
        }}
      />
    </>
  );

  return { runWithGate, GateSheets };
}
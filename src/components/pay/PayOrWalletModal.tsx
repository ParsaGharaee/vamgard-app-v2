"use client";

import { useEffect, useState } from "react";
import { CreditCard, Wallet, X } from "lucide-react";
import { VamButton } from "@/src/components/services/shared";
import { fa } from "@/src/lib/format";
import { gatewayFetch } from "@/src/lib/gateway/client";
import { loadSession } from "@/src/lib/session";

type Props = {
  open: boolean;
  onClose: () => void;
  amountToman: number;
  serviceTitle: string;
  onPaid?: () => void;
};

export function PayOrWalletModal({ open, onClose, amountToman, serviceTitle, onPaid }: Props) {
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState<"wallet" | "gateway">("wallet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    (async () => {
      const res = await gatewayFetch<{ balance?: number }>("me/wallet");
      if (res.ok && typeof res.data.balance === "number") setBalance(res.data.balance);
    })();
  }, [open]);

  if (!open) return null;

  const canWallet = balance >= amountToman && loadSession().loggedIn;

  const pay = async () => {
    setLoading(true);
    setError(null);
    if (mode === "wallet") {
      const res = await gatewayFetch("me/wallet/spend", {
        method: "POST",
        json: { amount: amountToman, title: serviceTitle },
      });
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "پرداخت از کیف پول ناموفق بود.");
        return;
      }
      onPaid?.();
      onClose();
      return;
    }
    const res = await gatewayFetch<{ paymentUrl?: string }>("me/wallet/charge", {
      method: "POST",
      json: { amount: Math.max(amountToman, 100_000) },
    });
    setLoading(false);
    const url = res.data.paymentUrl;
    if (typeof url === "string") window.location.href = url;
    else setError(res.error || "درگاه مستقیم به‌زودی فعال می‌شود.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="w-full max-w-[400px] rounded-[28px] border border-line/10 bg-card p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold">پرداخت سرویس</h3>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
            <X size={18} />
          </button>
        </div>
        <p className="text-right text-xs text-silver">{serviceTitle}</p>
        <p className="mt-2 text-2xl font-black text-brand">{fa(amountToman.toLocaleString("en-US"))} تومان</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("wallet")}
            className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold ${
              mode === "wallet" ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface"
            }`}
          >
            <Wallet size={22} />
            کیف پول
            <span className="text-[10px] font-normal text-silver">{fa(balance.toLocaleString("en-US"))} ت</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("gateway")}
            className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold ${
              mode === "gateway" ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface"
            }`}
          >
            <CreditCard size={22} />
            درگاه بانکی
          </button>
        </div>

        {mode === "wallet" && !canWallet && (
          <p className="mt-3 text-center text-[11px] text-amber-400">موجودی کافی نیست یا وارد نشده‌اید.</p>
        )}
        {error && <p className="mt-3 text-center text-[11px] text-red-400">{error}</p>}

        <VamButton className="mt-4" onClick={pay} loading={loading} disabled={mode === "wallet" && !canWallet}>
          تأیید پرداخت
        </VamButton>
      </div>
    </div>
  );
}
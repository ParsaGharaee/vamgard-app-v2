"use client";

import { useEffect, useState } from "react";
import { CreditCard, Wallet, X } from "lucide-react";
import { VamButton } from "@/src/components/services/shared";
import { fa, toEnDigits } from "@/src/lib/format";
import {
  MIN_WALLET_CHARGE,
  chargeWallet,
  loadWallet,
  spendWallet,
  useWalletListener,
} from "@/src/lib/walletStore";

export function tryDirectWalletSpend(amountToman: number, serviceTitle: string): boolean {
  const wallet = loadWallet();
  if (wallet.balance >= amountToman) {
    const res = spendWallet(amountToman, serviceTitle);
    return res.ok;
  }
  return false;
}

type Props = {
  open: boolean;
  onClose: () => void;
  amountToman: number;
  serviceTitle: string;
  onPaid: () => void;
};

export function PayOrWalletModal({ open, onClose, amountToman, serviceTitle, onPaid }: Props) {
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState<"direct" | "charge">("direct");
  const [chargeAmount, setChargeAmount] = useState(String(Math.max(MIN_WALLET_CHARGE, amountToman)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setBalance(loadWallet().balance);
    return useWalletListener(() => setBalance(loadWallet().balance));
  }, [open]);

  if (!open) return null;

  const chargeNum = Number(chargeAmount) || 0;
  const chargeValid = chargeNum >= MIN_WALLET_CHARGE;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (mode === "direct") {
      setLoading(false);
      onClose();
      onPaid();
      return;
    }

    if (!chargeValid) {
      setLoading(false);
      setError(`حداقل مبلغ شارژ کیف پول ${fa(MIN_WALLET_CHARGE.toLocaleString("en-US"))} تومان است.`);
      return;
    }

    const charged = chargeWallet(chargeNum, "شارژ کیف پول");
    if (!charged.ok) {
      setLoading(false);
      setError(charged.error || "خطا در شارژ کیف پول.");
      return;
    }

    const spent = spendWallet(amountToman, serviceTitle);
    setLoading(false);
    if (!spent.ok) {
      setError("موجودی پس از شارژ همچنان کمتر از هزینه سرویس است.");
      return;
    }

    onClose();
    onPaid();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-[30px] border-t border-line/10 bg-card px-5 pb-8 pt-3 shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line/20" />

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold">موجودی کیف پول کافی نیست</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-tile"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-2xl bg-tile/40 p-3 text-right">
          <div className="text-xs text-silver">{serviceTitle}</div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[11px] text-amber-500">
              موجودی فعلی: {fa(balance.toLocaleString("en-US"))} تومان
            </span>
            <span className="text-lg font-black text-brand">
              {fa(amountToman.toLocaleString("en-US"))} تومان
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-xs font-extrabold transition-all ${
              mode === "direct" ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface text-ink"
            }`}
          >
            <CreditCard size={22} />
            <span>پرداخت مستقیم</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("charge")}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-xs font-extrabold transition-all ${
              mode === "charge" ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface text-ink"
            }`}
          >
            <Wallet size={22} />
            <span>شارژ کیف پول</span>
          </button>
        </div>

        {mode === "charge" && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {[100_000, 200_000, 500_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setChargeAmount(String(amt))}
                  className={`rounded-xl border py-2 text-[11px] font-bold ${
                    chargeNum === amt ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface"
                  }`}
                >
                  {fa(amt.toLocaleString("en-US"))}
                </button>
              ))}
            </div>

            <input
              dir="ltr"
              value={chargeAmount ? fa(chargeAmount) : ""}
              onChange={(e) => setChargeAmount(toEnDigits(e.target.value).replace(/\D/g, ""))}
              inputMode="numeric"
              className="surface w-full rounded-xl border border-line/15 px-3 py-2.5 text-left text-sm font-bold outline-none focus:border-brand"
              placeholder={fa(String(MIN_WALLET_CHARGE))}
            />
            <p className="text-[10px] text-silver">
              حداقل مبلغ شارژ {fa(MIN_WALLET_CHARGE.toLocaleString("en-US"))} تومان است.
            </p>
          </div>
        )}

        {error && <p className="mt-3 text-center text-[11px] font-bold text-red-400">{error}</p>}

        <VamButton
          className="mt-4"
          onClick={handleConfirm}
          loading={loading}
          disabled={mode === "charge" && !chargeValid}
        >
          {mode === "direct"
            ? `پرداخت مستقیم ${fa(amountToman.toLocaleString("en-US"))} تومان`
            : "شارژ کیف پول و انجام استعلام"}
        </VamButton>
      </div>
    </div>
  );
}
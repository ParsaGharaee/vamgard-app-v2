"use client";

import { Wallet } from "lucide-react";
import { fa } from "@/src/lib/format";

type Props = {
  title: string;
  priceToman: number;
  balanceToman?: number;
  onPay?: () => void;
};

export function ServicePriceBar({ title, priceToman, balanceToman, onPay }: Props) {
  const enough = balanceToman == null || balanceToman >= priceToman;
  return (
    <div className="sticky bottom-0 z-30 border-t border-line/10 bg-card/95 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-right">
          <div className="truncate text-xs text-silver">{title}</div>
          <div className="text-lg font-extrabold text-ink">
            {fa(priceToman.toLocaleString("en-US"))}
            <span className="mr-1 text-xs font-bold text-silver">تومان</span>
          </div>
          {balanceToman != null && (
            <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-silver">
              <Wallet size={12} className="text-brand" />
              موجودی: {fa(balanceToman.toLocaleString("en-US"))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onPay}
          disabled={!onPay}
          className="shrink-0 rounded-2xl bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_20px_rgb(8_123_255_/_0.35)] disabled:opacity-60"
        >
          {enough ? "پرداخت" : "شارژ کیف پول"}
        </button>
      </div>
    </div>
  );
}
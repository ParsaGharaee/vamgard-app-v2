"use client";

import { useEffect, useState } from "react";
import { Info, Wallet } from "lucide-react";
import { fa } from "@/src/lib/format";
import { loadWallet, useWalletListener } from "@/src/lib/walletStore";

type Props = {
  priceToman: number;
  serviceTitle?: string;
};

export function ServicePriceBar({ priceToman, serviceTitle }: Props) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    setBalance(loadWallet().balance);
    return useWalletListener(() => setBalance(loadWallet().balance));
  }, []);

  const enough = balance >= priceToman;

  return (
    <div className="mb-4 rounded-2xl border border-line/10 bg-tile/40 p-3.5 text-right">
      <div className="flex items-start gap-2 text-[11px] leading-5 text-silver">
        <Info size={15} className="mt-0.5 shrink-0 text-brand" />
        <span>
          هزینه {serviceTitle ? `درخواست «${serviceTitle}»` : "این درخواست"} در صورت کافی بودن موجودی کیف پول، به‌صورت مستقیم کسر و استعلام بلافاصله انجام می‌شود.
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line/10 pt-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-silver">
          <Wallet size={14} className={enough ? "text-emerald-500" : "text-amber-500"} />
          <span>موجودی: {fa(balance.toLocaleString("en-US"))} ت</span>
        </div>

        <div className="text-base font-black text-brand">
          {fa(priceToman.toLocaleString("en-US"))}
          <span className="mr-1 text-[11px] font-bold text-silver">تومان</span>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";

import { LoanCard } from "./LoanCard";
import { loanCategories, loans } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { TitleBar } from "../layout/TitleBar";
import { brandGradient } from "@/src/lib/styles";
import { Ic, LottieSlot } from "../ui";

export function LoansScreen({ go }: ScreenProps) {
  const [cat, setCat] = useState("همه");
  const [sent, setSent] = useState<string[]>([]);
  const shown = loans.filter((l) => cat === "همه" || l.cat === cat);
  return (
    <>
      <TitleBar title="وام‌ها" go={go} />
      <div className={`mx-4 mt-5 flex items-center justify-between rounded-3xl ${brandGradient} p-5 shadow-lg shadow-brand/30`}>
        <div className="text-right"><div className="text-xl font-extrabold leading-8">وام مناسبت را پیدا کن</div><p className="mt-1 text-xs text-white/85">شرایط و اقساط را مقایسه کن و درخواست بده</p></div>
        <LottieSlot name="coins" size={72} fallback={<Ic n="coins" size={64} />} />
      </div>

      <div className="mt-4 pb-3.5 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {loanCategories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${cat === c ? "bg-brand text-white" : "surface text-silver"}`}>{c}</button>
        ))}
      </div>

      <div className="mx-4 mt-4 space-y-3 ">
        {shown.map((l) => (
          <LoanCard
            key={l.t}
            loan={l}
            requested={sent.includes(l.t)}
            onRequest={() => setSent((s) => (s.includes(l.t) ? s : [...s, l.t]))}
          />
        ))}
      </div>
    </>
  );
}

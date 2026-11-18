"use client";
import { ArrowLeft, ChevronLeft } from "lucide-react";

import { BannerDeck } from "./BannerDeck";
import { quickActions, suggestedLoans } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { Bank, Ic, Section } from "../ui";
import { fa } from "@/src/lib/format";
import { BANKS } from "@/src/lib/constants/banks";
import { CreditGauge } from "../credit/CreditGauge";

export function HomeScreen({ go }: ScreenProps) {
  return (
    <>
      <button onClick={() => go("profile")} className="surface mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 text-[15px] font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand"><Ic n="wallet2" size={26} /></span>
          سطح مالی من <span className="text-accent">{fa(68)}</span>
        </div>
        <ChevronLeft className="text-silver" />
      </button>

      <BannerDeck go={go} />

      <div className="mt-5 grid grid-cols-4 gap-3 px-4">
        {quickActions.map(({ t, ic, badge, to }) => (
          <button key={t} onClick={() => go(to)} className="surface relative flex h-[90px] flex-col items-center justify-center gap-1.5 rounded-[22px]">
            {badge != null && <span className="absolute -right-1.5 -top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">{fa(badge)}</span>}
            <Ic n={ic} size={35} className="invert-0 brightness-115" />
            <span className="text-[11.5px] font-bold">{t}</span>
          </button>
        ))}
        <button onClick={() => go("services")} className="surface flex h-[90px] flex-col items-center justify-center gap-2 rounded-[22px]">
          <div className="grid grid-cols-2 gap-1.5">{["bg-brand", "bg-accent", "bg-accent", "bg-brand"].map((c, k) => <span key={k} className={`h-3.5 w-3.5 rounded-full ${c}`} />)}</div>
          <span className="text-[11.5px] font-bold">همه خدمات</span>
        </button>
      </div>

      <Section title="وام‌های پیشنهادی" link="مشاهده همه" onLink={() => go("loans")} />
      <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-5">
        {suggestedLoans.map((l) => (
          <div key={l.a} className="surface w-[230px] shrink-0 rounded-3xl p-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Bank k={l.bank} size={40} />
                <div>
                  <div className="text-[15px] font-extrabold">وام {fa(l.a)} میلیون</div>
                  <div className="mt-0.5 text-[10.5px] text-silver">بانک {BANKS[l.bank].n}</div>
                </div>
              </div>
              <span className="rounded-md bg-accent px-1.5 text-[10px] font-bold text-onaccent">تا ٪ {l.r}</span>
            </div>
            <div className="mt-2 text-[11px] text-silver">قسط ماهانه {l.q} تومان</div>
            <button onClick={() => go("loans")} className="mt-2 flex w-full items-center justify-between rounded-xl bg-brand/15 px-3 py-2 text-xs font-bold text-accent">بررسی شرایط وام<ArrowLeft size={16} /></button>
          </div>
        ))}
      </div>

      <Section title="اعتبارسنجی" icon={<Ic n="shieldCheck" size={22} />} />
      <CreditGauge />
      <div className="h-4" />
    </>
  );
}

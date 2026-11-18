"use client";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, Clock } from "lucide-react";

import { ProgressRing } from "./ProgressRing";
import { IconKey } from "@/src/lib/constants/icons";
import { ScreenProps } from "@/src/types/navigation";
import { TitleBar } from "../layout/TitleBar";
import { brandGradient } from "@/src/lib/styles";
import { Card, Ic, LottieSlot, Section } from "../ui";
import { fa } from "@/src/lib/format";

const perks: { t: string; ic: IconKey }[] = [
  { t: "تخفیف بیشتر", ic: "tag" },
  { t: "خرید با دوستان", ic: "users" },
  { t: "خرید مطمئن", ic: "shieldCheck" },
];

export function GroupScreen({ go }: ScreenProps) {
  const [tab, setTab] = useState<"active" | "all">("active");
  const [sent, setSent] = useState(false);
  return (
    <>
      <TitleBar title="خرید گروهی" go={go} />

      <div className={`relative mx-4 mt-4 overflow-hidden rounded-[28px] ${brandGradient} p-5 shadow-lg shadow-brand/30`}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-right">
            <div className="text-lg font-extrabold leading-8">با خرید گروهی،<br />هوشمندتر بخر!</div>
            <p className="mt-1 text-xs text-white/80">با همراهی دیگران، تخفیف بیشتری بگیر</p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-[#0B3FA8]">چطور کار می‌کنه؟<ArrowLeft size={14} /></button>
          </div>
          <LottieSlot name="shopping" size={96} fallback={<Ic n="tag" size={80} />} />
        </div>
      </div>

      <Card className="mx-4 mt-4 p-4">
        <div className="flex items-center gap-3">
          <ProgressRing p={60} />
          <div className="flex-1 text-right">
            <div className="text-[15px] font-extrabold leading-7">تا تخفیف ویژه فقط {fa(4)} نفر دیگه مونده!</div>
            <div className="mt-2 h-2 rounded-full bg-tile"><div className="h-full w-[60%] rounded-full bg-linear-to-l from-brand to-accent" /></div>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-500"><Clock size={14} />زمان باقی‌مانده: {fa(24)} ساعت</div>
          </div>
        </div>
      </Card>

      <Section title="مزایای خرید گروهی" />
      <div className="mx-4 grid grid-cols-3 gap-3">
        {perks.map(({ t, ic }) => (
          <div key={t} className="surface flex flex-col items-center gap-2 rounded-2xl py-4 text-center">
            <Ic n={ic} size={36} />
            <span className="text-[11.5px] font-bold">{t}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setTab("active")} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-full bg-brand py-3 pl-3 pr-6 font-bold text-white shadow-lg shadow-brand/30">
        مشاهده گروه‌های فعال
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><ChevronLeft size={18} /></span>
      </button>

      <div className="mx-4 mt-5 grid grid-cols-2 gap-2 text-sm font-bold">
        <button onClick={() => setTab("active")} className={`rounded-xl py-3 ${tab === "active" ? "bg-brand text-white" : "surface text-silver"}`}>در حال برگزاری</button>
        <button onClick={() => setTab("all")} className={`rounded-xl py-3 ${tab === "all" ? "bg-brand text-white" : "surface text-silver"}`}>تمام‌شده‌ها</button>
      </div>
      {tab === "active" ? (
        <Card className="mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-right"><div className="text-lg font-bold">خرید گروهی لپ‌تاپ</div><div className="text-xs text-silver">{fa(37)} نفر از {fa(50)} نفر</div></div>
            <span className="text-6xl">💻</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-tile"><div className="h-full w-[74%] rounded-full bg-linear-to-l from-brand to-accent" /></div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-500"><Clock size={14} /> {fa(3)} روز دیگر</div>
          <button className="mt-3 w-full rounded-xl bg-tile py-2.5 text-sm font-bold text-accent">مشاهده جزئیات</button>
        </Card>
      ) : (
        <Card className="mx-4 mt-4 flex flex-col items-center p-8 text-center text-sm text-silver">
          <LottieSlot name="empty" size={110} />
          هنوز خرید تمام‌شده‌ای ندارید
        </Card>
      )}

      <Card className="mx-4 mt-4 p-4">
        <h3 className="font-bold">ثبت درخواست جدید</h3>
        <p className="mb-3 mt-1 text-xs text-silver">کالای مورد نظرتان را برای خرید گروهی ثبت کنید</p>
        <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }} className="w-full rounded-xl bg-brand py-3 font-bold text-white">{sent ? "ثبت شد ✓" : "ثبت درخواست"}</button>
      </Card>
      <div className="h-4" />
    </>
  );
}

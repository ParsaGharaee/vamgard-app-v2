"use client";
import { Briefcase, Camera, ChevronLeft, MapPin, Star } from "lucide-react";

import { accountMenu } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { TitleBar } from "../layout/TitleBar";
import { Avatar, Card, Ic, LottieSlot, Section } from "../ui";
import { fa } from "@/src/lib/format";
import { CreditGauge } from "../credit/CreditGauge";
import { brandGradient } from "@/src/lib/styles";

export function ProfileScreen({ go }: ScreenProps) {
  return (
    <>
      <TitleBar title="پروفایل" go={go} />

      <Card className="mx-4 mt-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2 text-right">
            <div className="text-lg font-extrabold">علی رضایی <span className="text-accent">✓</span></div>
            <div className="flex items-center gap-2 text-xs text-silver"><MapPin size={15} className="text-brand" />تهران</div>
            <div className="flex items-center gap-2 text-xs text-silver"><Briefcase size={15} className="text-brand" />شغل ثبت نشده</div>
            <div className="text-xs text-silver">{fa("۰۹۱۲ ۳۴۵ ۶۷۸۹")}</div>
          </div>
          <div className="relative shrink-0">
            <div className="grid place-items-center rounded-full p-1 ring-2 ring-brand/30">
              <LottieSlot name="profile-hero" size={96} fallback={<Avatar size={92} />} />
            </div>
            <span className="surface absolute bottom-0 left-0 grid h-8 w-8 place-items-center rounded-full text-brand"><Camera size={15} /></span>
          </div>
        </div>
      </Card>

      <div className={`mx-4 mt-3 flex items-center justify-between rounded-3xl ${brandGradient} p-4 shadow-lg shadow-brand/30`}>
        <div className="text-right"><div className="text-xs text-white/80">سطح مالی شما</div><div className="text-3xl font-extrabold">{fa(68)} <span className="text-xs font-normal">از {fa(100)}</span></div></div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
          <LottieSlot name="level-star" size={44} fallback={<Star className="fill-yellow-400 text-yellow-400" />} />
        </div>
      </div>

      <Section title="اعتبارسنجی" />
      <CreditGauge />

      <Section title="حساب من" />
      <Card className="mx-4 divide-y divide-line/10 px-3">
        {accountMenu.map(({ t, s, ic }) => (
          <button key={t} className="flex w-full items-center gap-3 py-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tile"><Ic n={ic} size={30} /></span>
            <span className="flex-1 text-right"><span className="block text-sm font-bold">{t}</span><span className="block text-[11px] text-silver">{s}</span></span>
            <ChevronLeft size={18} className="text-silver/60" />
          </button>
        ))}
      </Card>
      <div className="h-4" />
    </>
  );
}

"use client";
import { useState } from "react";
import { ArrowLeft, Package, SearchX, ShieldCheck, ShoppingBag, Store, TrendingDown, Users, Zap } from "lucide-react";
import { ScreenProps } from "@/src/types/navigation";
import { brandGradient } from "@/src/lib/styles";
import { fa } from "@/src/lib/format";
import { TitleBar } from "../layout/TitleBar";
import { Card, Section } from "../ui";
import { AvatarStack, OfferCard } from "./OfferCard";
import { PublishedSheet } from "./PublishedSheet";
import { SellForm, type PublishSummary } from "./SellForm";
import { categories, offers, type Mode } from "./data";

const stats = [
  { v: "۱۲۸", l: "معامله فعال", ic: Package },
  { v: "۸۶۰", l: "خریدار", ic: Users },
  { v: "۲.۴ میلیارد", l: "صرفه‌جویی", ic: TrendingDown },
];

const steps = [
  { t: "عرضه", s: "فروشنده موجودی و قیمت گروهی رو ثبت می‌کنه" },
  { t: "پیوستن", s: "خریداران به گروه می‌پیوندن" },
  { t: "تکمیل", s: "با پر شدن ظرفیت، خرید نهایی می‌شه" },
];

export function GroupScreen({ go }: ScreenProps) {
  const [mode, setMode] = useState<Mode>("buy");
  const [cat, setCat] = useState(categories[0]);
  const [joined, setJoined] = useState<number[]>([]);
  const [published, setPublished] = useState<PublishSummary | null>(null);

  const toggle = (id: number) => setJoined((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const shown = offers.filter((o) => cat === categories[0] || o.category === cat);

  return (
    <>
      <TitleBar title="معامله جمعی" go={go} />

      {/* هیرو */}
      <div className={`relative mx-4 mt-4 overflow-hidden rounded-[28px] ${brandGradient} p-5 shadow-xl shadow-brand/25`}>
        <span aria-hidden className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <span aria-hidden className="absolute -bottom-16 right-8 h-44 w-44 rounded-full bg-accent/30 blur-2xl" />
        <span aria-hidden className="absolute -left-2 top-10 -rotate-12 text-[88px] opacity-25"></span>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" /></span>
            <Zap size={12} />معامله‌ی جمعی
          </div>

          <h2 className="mt-3 text-[22px] font-black leading-9">وقتی با هم معامله می‌کنیم،<br />همه سود می‌کنیم!</h2>
          <p className="mt-2 max-w-[220px] text-xs leading-6 text-white/80">فروشنده یکجا می‌فروشه، خریداران ارزون‌تر می‌خرن. یه معامله، چند برنده!</p>

          <div className="mt-4 flex items-center gap-2.5">
            <AvatarStack n={860} />
            <span className="text-[11px] font-bold text-white/90">{fa(860)} نفر عضوند</span>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-x-reverse divide-white/15 rounded-2xl bg-white/12 py-3 text-center backdrop-blur">
            {stats.map(({ v, l, ic: Icon }) => (
              <div key={l} className="px-1">
                <Icon size={16} className="mx-auto text-white/80" />
                <div className="mt-1 text-[13px] font-black">{v}</div>
                <div className="text-[10px] text-white/75">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* سوئیچ حالت */}
      <div className="surface relative mx-4 mt-5 grid grid-cols-2 rounded-2xl p-1">
        <span
          aria-hidden
          className="absolute inset-y-1 right-1 w-[calc(50%-0.25rem)] rounded-xl bg-linear-to-bl from-[#0B3FA8] via-brand to-accent shadow-lg shadow-brand/30 transition-transform duration-300 ease-[cubic-bezier(.34,1.3,.5,1)]"
          style={{ transform: `translateX(${mode === "buy" ? 0 : -100}%)` }}
        />
        {([["buy", "خریدارم", ShoppingBag], ["sell", "فروشنده‌ام", Store]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setMode(id)} className={`relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-black transition-colors ${mode === id ? "text-white" : "text-silver"}`}>
            <Icon size={18} />{label}
          </button>
        ))}
      </div>

      {mode === "buy" ? (
        <>
          <Section title="فرصت‌های خرید گروهی" link={`${fa(shown.length)} عرضه`} />

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold transition-colors ${cat === c ? "bg-brand text-white shadow-md shadow-brand/30" : "surface text-silver"}`}>{c}</button>
            ))}
          </div>

          <div className="mx-4 space-y-4">
            {shown.map((o) => <OfferCard key={o.id} offer={o} joined={joined.includes(o.id)} onToggle={() => toggle(o.id)} />)}
            {shown.length === 0 && (
              <Card className="flex flex-col items-center gap-2 p-8 text-center text-sm text-silver"><SearchX size={32} />عرضه‌ای تو این دسته نیست</Card>
            )}
          </div>

          <Card className="mx-4 mt-4 flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10"><ShieldCheck size={24} className="text-emerald-500" /></span>
            <div className="text-right">
              <div className="text-sm font-bold">خرید با اطمینان بیشتر</div>
              <p className="mt-1 text-[10px] leading-5 text-silver">قیمت، تعداد، مشخصات کالا و شرایط معامله قبل از پرداخت مشخص می‌شه.</p>
            </div>
          </Card>
        </>
      ) : (
        <SellForm onPublish={setPublished} />
      )}

      {/* چطور کار می‌کنه */}
      <Section title="چطور کار می‌کنه؟" />
      <Card className="mx-4 p-4">
        {steps.map((s, i) => (
          <div key={s.t} className="relative flex gap-3 pb-4 last:pb-0">
            {i !== steps.length - 1 && <span className="absolute right-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-line/15" />}
            <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">{fa(i + 1)}</span>
            <div className="text-right"><div className="text-sm font-bold">{s.t}</div><div className="mt-0.5 text-xs text-silver">{s.s}</div></div>
          </div>
        ))}
      </Card>

      <div className="h-6" />
      {published && <PublishedSheet summary={published} onClose={() => setPublished(null)} />}
    </>
  );
}
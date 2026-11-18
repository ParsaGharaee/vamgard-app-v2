"use client";
import { Check, Clock, Flame, ShieldCheck, Store } from "lucide-react";
import { fa } from "@/src/lib/format";
import { Card } from "../ui";
import { discountPct, money, type Offer } from "./data";

const AVATAR_BG = ["bg-brand", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];
const LETTERS = ["ع", "م", "ز", "ر", "ک"];

export function AvatarStack({ n, max = 4 }: { n: number; max?: number }) {
  const shown = Math.min(n, max);
  return (
    <div className="flex items-center">
      {Array.from({ length: shown }).map((_, i) => (
        <span key={i} className={`-ms-2 first:ms-0 grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-bg ${AVATAR_BG[i % 5]}`}>
          {LETTERS[i % 5]}
        </span>
      ))}
      {n > shown && (
        <span className="-ms-2 grid h-6 min-w-6 place-items-center rounded-full bg-tile px-1 text-[9px] font-bold ring-2 ring-bg">+{fa(n - shown)}</span>
      )}
    </div>
  );
}

type Props = { offer: Offer; joined: boolean; onToggle: () => void };

export function OfferCard({ offer: o, joined, onToggle }: Props) {
  const count = o.joined + (joined ? 1 : 0);
  const left = o.quantity - count;
  const pct = discountPct(o.singlePrice, o.groupPrice);
  const save = (o.singlePrice - o.groupPrice) * o.quantity;

  return (
    <Card className="overflow-hidden">
      {/* تصویر */}
      
{/* تصویر واقعی محصول */}
<div className="relative grid h-32 place-items-center overflow-hidden bg-[radial-gradient(80%_110%_at_50%_0%,rgb(8_123_255/0.16),transparent)]">
  <img
    src={o.image}
    alt={o.name}
    loading="lazy"
    className="h-full w-full absolute object-cover p-3"
  />

  <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white shadow-lg shadow-emerald-500/30">
    ٪{fa(pct)} تخفیف
  </span>

  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
    <Clock size={12} />
    {fa(o.time)} ساعت
  </span>

  {left > 0 && left <= 3 && (
    <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold text-white">
      <Flame size={12} />
      فقط {fa(left)} جای خالی
    </span>
  )}
</div>


      <div className="p-4">
        {/* عنوان */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 text-right">
            <div className="truncate text-[15px] font-black">{o.name}</div>
            <div className="mt-1 flex items-center gap-1 text-[10.5px] text-silver">
              <Store size={12} />{o.seller}
              {o.verified && <ShieldCheck size={13} className="text-brand" />}
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand">{o.category}</span>
        </div>

        {/* قیمت */}
        <div className="mt-4 flex items-end justify-between rounded-2xl bg-tile/60 px-4 py-3">
          <div className="text-right">
            <div className="text-[10px] text-silver">قیمت گروهی هر واحد</div>
            <div className="mt-0.5 text-xl font-black text-accent">{money(o.groupPrice)} <span className="text-[11px] font-bold">میلیون</span></div>
          </div>
          <div className="text-left">
            <div className="text-[10px] text-silver">قیمت تکی</div>
            <div className="mt-0.5 text-sm font-bold text-silver line-through decoration-red-400/70">{money(o.singlePrice)}</div>
          </div>
        </div>

        {/* ظرفیت */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AvatarStack n={count} />
            <span className="font-bold">{fa(count)} از {fa(o.quantity)} نفر</span>
          </div>
          <span className="font-bold text-emerald-500">{fa(left)} جای خالی</span>
        </div>
        <div className="mt-2.5 flex gap-[3px]">
          {Array.from({ length: o.quantity }).map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < count ? "bg-linear-to-l from-brand to-accent" : "bg-tile"}`} />
          ))}
        </div>

        {/* پایین */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-right">
            <div className="text-[10px] text-silver">صرفه‌جویی کل گروه</div>
            <div className="mt-0.5 text-[13px] font-black text-emerald-500">{money(save)} میلیون</div>
          </div>
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all active:scale-95 ${
              joined ? "bg-emerald-500/15 text-emerald-500" : "bg-linear-to-bl from-[#0B3FA8] via-brand to-accent text-white shadow-lg shadow-brand/30"
            }`}
          >
            {joined ? <><Check size={15} />عضو شدی</> : "پیوستن به گروه"}
          </button>
        </div>
      </div>
    </Card>
  );
}
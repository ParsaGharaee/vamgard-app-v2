"use client";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Minus, Package, Plus, Sparkles, TrendingDown, Users } from "lucide-react";
import { fa } from "@/src/lib/format";
import { Card, Section } from "../ui";
import { discountPct, money } from "./data";

export type PublishSummary = { product: string; quantity: number; pct: number; save: number };

const inputCls = "w-full rounded-xl bg-tile px-3 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand/50";

function Field({ label, suffix, children }: { label: string; suffix?: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <div className="relative mt-2">
        {children}
        {suffix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-silver">{suffix}</span>}
      </div>
    </label>
  );
}

export function SellForm({ onPublish }: { onPublish: (s: PublishSummary) => void }) {
  const [product, setProduct] = useState("آیفون ۱۶ پرو ۲۵۶ گیگ");
  const [qty, setQty] = useState(10);
  const [single, setSingle] = useState("500");
  const [group, setGroup] = useState("480");

  const s = Number(single), g = Number(group);
  const valid = product.trim() && qty >= 1 && s > 0 && g > 0 && g <= s;
  const pct = discountPct(s, g);
  const save = Math.max(0, (s - g) * qty);

  return (
    <>
      <Card className="mx-4 mt-5 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-bl from-brand to-accent text-white shadow-lg shadow-brand/30"><Package size={24} /></span>
          <div className="text-right">
            <h3 className="font-black">عرضه‌ی عمده‌ی محصول</h3>
            <p className="mt-0.5 text-[11px] text-silver">موجودی‌ات رو به یه فرصت خرید گروهی تبدیل کن</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="نام و مشخصات کالا">
            <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="مثلاً آیفون ۱۶ پرو ۲۵۶ گیگ" className={inputCls} />
          </Field>

          <div className="text-xs font-bold">
            تعداد موجودی
            <div className="mt-2 flex items-center justify-between rounded-xl bg-tile p-1.5">
              <button onClick={() => setQty((q) => q + 1)} aria-label="افزایش" className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white active:scale-95"><Plus size={16} /></button>
              <span className="text-base font-black">{fa(qty)} <span className="text-[11px] font-normal text-silver">عدد</span></span>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش" className="grid h-9 w-9 place-items-center rounded-lg bg-card text-silver active:scale-95"><Minus size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="قیمت تکی هر کالا" suffix="میلیون">
              <input type="number" inputMode="decimal" value={single} onChange={(e) => setSingle(e.target.value)} className={`${inputCls} pl-16`} />
            </Field>
            <Field label="قیمت گروهی هر کالا" suffix="میلیون">
              <input type="number" inputMode="decimal" value={group} onChange={(e) => setGroup(e.target.value)} className={`${inputCls} pl-16`} />
            </Field>
          </div>
          {g > s && s > 0 && <p className="text-[11px] font-bold text-red-500">قیمت گروهی باید کمتر یا مساوی قیمت تکی باشه.</p>}
        </div>
      </Card>

      {/* پیش‌نمایش */}
      <Section title="پیش‌نمایش برای خریداران" icon={<Sparkles size={18} className="text-accent" />} />
      <div className="mx-4 overflow-hidden rounded-3xl bg-linear-to-bl from-[#0B3FA8] via-brand to-accent p-px shadow-lg shadow-brand/25">
        <div className="rounded-[23px] bg-bg/90 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tile text-3xl relative overflow-hidden"><img src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800" className="absolute object-cover" alt="" /></span>
              <div className="text-right">
                <div className="max-w-[170px] truncate text-sm font-black">{product || "نام کالا"}</div>
                <div className="mt-0.5 text-[10.5px] text-silver">{fa(qty)} عدد · ظرفیت گروه</div>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">٪{fa(pct)}</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "قیمت گروهی", v: money(g || 0), c: "text-accent" },
              { l: "ارزش کل", v: money(qty * (g || 0)), c: "" },
              { l: "تخفیف کل", v: money(save), c: "text-emerald-500" },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl bg-tile/60 py-2.5">
                <div className="text-[10px] text-silver">{x.l}</div>
                <div className={`mt-1 text-sm font-black ${x.c}`}>{x.v}</div>
                <div className="text-[9px] text-silver">میلیون</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={() => onPublish({ product: product.trim(), quantity: qty, pct, save })}
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl bg-linear-to-bl from-[#0B3FA8] via-brand to-accent py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
      >
        انتشار عرضه<ArrowLeft size={17} />
      </button>

      <div className="mx-4 mt-5 grid grid-cols-2 gap-3">
        {[
          { ic: TrendingDown, t: "فروش یکجای موجودی", s: "بدون پیدا کردن خریدار برای تک‌تک کالاها" },
          { ic: Users, t: "جذب چند خریدار", s: "هر خریدار سهم خودش رو انتخاب می‌کنه" },
        ].map(({ ic: Icon, t, s }) => (
          <Card key={t} className="p-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand"><Icon size={19} /></span>
            <div className="mt-2.5 text-xs font-bold">{t}</div>
            <p className="mt-1 text-[10px] leading-5 text-silver">{s}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
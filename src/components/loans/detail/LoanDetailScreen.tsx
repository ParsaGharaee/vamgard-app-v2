"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Check, FileText, Lock } from "lucide-react";
import { Bank } from "@/src/components/ui/Bank";
import { Card } from "@/src/components/ui/Card";
import { Section } from "@/src/components/ui/Section";
import { InfoRow, ServiceHeader } from "@/src/components/services/shared";
import { BANKS } from "@/src/lib/constants/banks";
import { fa } from "@/src/lib/format";
import type { Loan } from "../data";
import { CreditGateCard } from "./CreditGateCard";
import { LoanFaq } from "./LoanFaq";
import { getLoanDetail, money } from "./detail-data";

export function LoanDetailScreen({ loan: l }: { loan: Loan }) {
  const d = getLoanDetail(l);
  const [verified, setVerified] = useState(false);
  const [requested, setRequested] = useState(false);
  const gate = useRef<HTMLDivElement>(null);

  const onCta = () => {
    if (!verified) gate.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    else setRequested(true);
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="جزئیات وام" />

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* هیرو */}
        <Card className="mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bank k={l.bank} size={52} />
              <div className="text-right">
                <div className="text-lg font-extrabold">{l.t}</div>
                <div className="text-xs text-silver">بانک {BANKS[l.bank].n} · {l.cat}</div>
              </div>
            </div>
            <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-onaccent">٪ {fa(l.r)} سالانه</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-tile/50 p-3 text-center">
            <div><div className="text-[11px] text-silver">مبلغ</div><div className="mt-1 text-sm font-extrabold">{fa(l.a)} میلیون</div></div>
            <div><div className="text-[11px] text-silver">مدت</div><div className="mt-1 text-sm font-extrabold">{fa(l.n)} ماه</div></div>
            <div><div className="text-[11px] text-silver">قسط ماهانه</div><div className="mt-1 text-sm font-extrabold">{fa(l.q)}</div></div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs"><span className="text-silver">احتمال تأیید برای شما</span><span className="font-bold text-accent">٪ {fa(l.ok)}</span></div>
          <div className="mt-1.5 h-2 rounded-full bg-tile"><div style={{ width: `${l.ok}%` }} className="h-full rounded-full bg-linear-to-l from-brand to-accent" /></div>
          {!verified && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-silver"><Lock size={12} />این عدد تخمینی است؛ بعد از اعتبارسنجی دقیق می‌شود.</p>
          )}
        </Card>

        {/* اعتبارسنجی */}
        <div ref={gate} className="scroll-mt-24">
          <Section title="مرحله اول: اعتبارسنجی" />
          <CreditGateCard bankName={BANKS[l.bank].n} verified={verified} onComplete={() => setVerified(true)} />
        </div>

        {/* مراحل */}
        <Section title="مراحل دریافت وام" />
        <Card className="mx-4 p-4">
          {d.steps.map((s, i) => {
            const done = i === 0 && verified;
            return (
              <div key={s.t} className="relative flex gap-3 pb-5 last:pb-0">
                {i !== d.steps.length - 1 && <span className="absolute right-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-line/15" />}
                <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${done ? "bg-emerald-500 text-white" : i === 0 ? "bg-brand text-white ring-4 ring-brand/20" : "bg-tile text-silver"}`}>
                  {done ? <Check size={14} /> : fa(i + 1)}
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {s.t}
                    {s.required && !done && <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-500">الزامی</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-silver">{s.s}</div>
                </div>
              </div>
            );
          })}
        </Card>

       

        {/* شرایط */}
        <Section title="شرایط وام" />
        <Card className="mx-4 px-4">
          {d.conditions.map((c) => <InfoRow key={c.label} label={c.label} value={c.value} />)}
        </Card>

        {/* بازپرداخت */}
        <Section title="محاسبه‌ی بازپرداخت" />
        <Card className="mx-4 px-4">
          <InfoRow label="قسط ماهانه" value={`${money(d.monthly)} تومان`} />
          <InfoRow label="مجموع بازپرداخت" value={`${money(d.total)} تومان`} />
          <InfoRow label="مجموع سود و کارمزد" value={`${money(d.interest)} تومان`} />
        </Card>

        {/* مدارک */}
        <Section title="مدارک لازم" />
        <Card className="mx-4 space-y-3 p-4">
          {d.docs.map((doc) => (
            <div key={doc} className="flex items-center gap-2.5 text-sm">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand"><FileText size={15} /></span>
              {doc}
            </div>
          ))}
        </Card>
 {/* توضیحات */}
        <Section title="درباره‌ی این وام" />
        <Card className="mx-4 p-4"><p className="text-right text-sm leading-7 text-silver">{d.about}</p></Card>
        {/* سوالات */}
        <Section title="سوالات متداول" />
        <LoanFaq items={d.faq} />
      </main>

      {/* نوار پایین چسبان */}
      <div className="fixed max-w-[430px] mx-auto inset-x-0 bottom-0 z-30 border-t border-line/10 bg-bg/90 p-4 backdrop-blur-xl">
        <button
          onClick={onCta}
          disabled={requested}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-colors ${requested ? "bg-emerald-500" : verified ? "bg-brand" : "bg-brand/90"}`}
        >
          {requested ? <><Check size={18} />درخواست ثبت شد</> : verified ? "ثبت درخواست وام" : <><Lock size={16} />ابتدا اعتبارسنجی کن</>}
        </button>
        {!verified && (
          <Link href="/services/credit-score" className="mt-2 block text-center text-[11px] font-bold text-accent">
            استعلام کامل اعتبار از صفحه‌ی خدمات
          </Link>
        )}
      </div>
    </div>
  );
}
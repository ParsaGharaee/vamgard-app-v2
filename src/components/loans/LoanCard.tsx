"use client";

import { BANKS } from "@/src/lib/constants/banks";
import { Bank, Card } from "../ui";
import type { Loan } from "./data";
import { fa } from "@/src/lib/format";
import Link from "next/link";

type LoanCardProps = { loan: Loan; requested: boolean; onRequest: () => void };

export function LoanCard({ loan: l, requested: done, onRequest }: LoanCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bank k={l.bank} size={48} />
          <div className="text-right"><div className="font-bold">{l.t}</div><div className="text-xs text-silver">بانک {BANKS[l.bank].n} · {l.cat}</div></div>
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
      <Link href={`/loans/${l.id}`} className="mt-4 block w-full rounded-xl bg-brand py-2.5 text-center text-sm font-bold text-white">
    بررسی شرایط و درخواست
  </Link>
    </Card>
  );
}

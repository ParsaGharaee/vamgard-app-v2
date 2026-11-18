"use client";
import { Lock, ShieldCheck } from "lucide-react";
import { CreditGauge } from "@/src/components/credit/CreditGauge";

export function CreditGateCard({ bankName, verified, onComplete }: { bankName: string; verified: boolean; onComplete: () => void }) {
  return (
    <>
      <div className={`mx-4 mb-3 flex items-start gap-3 rounded-2xl border p-3.5 ${verified ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/30 bg-amber-500/10"}`}>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${verified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
          {verified ? <ShieldCheck size={18} /> : <Lock size={18} />}
        </span>
        <div className="text-right">
          <div className="text-sm font-extrabold">{verified ? "اعتبارسنجی انجام شد" : "برای دریافت این وام اعتبارسنجی لازم است"}</div>
          <p className="mt-1 text-xs leading-6 text-silver">
            {verified
              ? "حالا می‌توانی درخواست وام را ثبت کنی."
              : `بانک ${bankName} برای بررسی درخواست به رتبه اعتباری شما نیاز دارد. اعتبارسنجی را انجام بده تا دکمه‌ی ثبت درخواست باز شود.`}
          </p>
        </div>
      </div>
      <CreditGauge onComplete={onComplete} />
    </>
  );
}
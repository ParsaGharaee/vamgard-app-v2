"use client";
import { Check } from "lucide-react";
import { fa } from "@/src/lib/format";
import { money } from "./data";
import type { PublishSummary } from "./SellForm";

export function PublishedSheet({ summary, onClose }: { summary: PublishSummary; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="pop w-full rounded-t-[32px] border-t border-line/10 bg-bg p-6 text-center">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/25" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"><Check size={32} /></span>
        </div>
        <h3 className="mt-4 text-lg font-black">عرضه آماده‌ی ثبته!</h3>
        <p className="mt-1.5 text-xs leading-6 text-silver">برای انتشار نهایی، فرم باید به سرویس ثبت عرضه وصل بشه.</p>

        <div className="mt-4 divide-y divide-line/10 rounded-2xl bg-tile/60 px-4 text-sm">
          <div className="flex justify-between py-3"><span className="text-silver">کالا</span><span className="font-bold">{summary.product}</span></div>
          <div className="flex justify-between py-3"><span className="text-silver">تعداد</span><span className="font-bold">{fa(summary.quantity)} عدد</span></div>
          <div className="flex justify-between py-3"><span className="text-silver">تخفیف گروهی</span><span className="font-bold text-emerald-500">٪{fa(summary.pct)} ({money(summary.save)} میلیون)</span></div>
        </div>

        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white">متوجه شدم</button>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { ChevronLeft, Send, X } from "lucide-react";
import { Mascot } from "./Mascot";
import { LottieSlot } from "../ui";

const QUICK_QUESTIONS = [
  "با شرایط من چه وامی مناسبه؟",
  "چطور تا ۶ ماه آینده ۳۰۰ میلیون تأمین کنم؟",
  "اقساط این وام چقدر میشه؟",
  "بین پس‌انداز و وام کدوم بهتره؟",
];

export function VamyarSheet({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([]);
  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { me: true, t }, { me: false, t: "در حال بررسی شرایط شما هستم؛ لطفاً چند لحظه صبر کنید…" }]);
    setText("");
  };
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="pop flex h-[82%] w-full flex-col rounded-t-[32px] border-t border-line/10 bg-bg">
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-2 text-lg font-extrabold"><Mascot size={44} />وام‌یار</div>
          <button onClick={onClose} aria-label="بستن" className="grid h-9 w-9 place-items-center rounded-full bg-card"><X size={18} /></button>
        </div>
        <p className="px-6 pt-2 text-center text-sm leading-7 text-silver">هر سوالی درباره وام، شرایط یا برنامه مالی دارید از من بپرسید…</p>
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto px-4 no-scrollbar">
          {!msgs.length && <div className="flex justify-center"><LottieSlot name="vamyar-hello" size={120} /></div>}
          {msgs.map((m, i) => <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.me ? "mr-auto bg-brand text-white" : "surface ml-auto"}`}>{m.t}</div>)}
          {!msgs.length && QUICK_QUESTIONS.map((q) => (
            <button key={q} onClick={() => send(q)} className="surface flex w-full items-center justify-between rounded-2xl p-4 text-right text-sm font-bold">{q}<ChevronLeft size={18} className="text-silver/60" /></button>
          ))}
        </div>
        <div className="surface m-4 flex items-center gap-2 rounded-2xl p-2">
          <button onClick={() => send(text)} className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><Send size={18} className="-scale-x-100" /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)} placeholder="سوال خود را بپرسید..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-silver/60" />
        </div>
      </div>
    </div>
  );
}

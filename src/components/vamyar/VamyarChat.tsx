"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUp, ChevronLeft, Mic, Square, SquarePen } from "lucide-react";
import { Ic } from "@/src/components/ui/Ic";
import { Mascot } from "./Mascot";
import { AuroraBackground } from "./AuroraBackground";
import { ChatMessage, ThinkingRow } from "./ChatMessage";
import { PROMPTS, replyForQuestion, type Msg } from "./ai";

export function VamyarChat() {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "thinking" | "streaming">("idle");
  const timers = useRef<number[]>([]);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const busy = phase !== "idle";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, phase]);
  useEffect(() => () => timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }), []);

  const clearTimers = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.current = []; };

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    const uid = ++idRef.current, aid = ++idRef.current;
    setMsgs((m) => [...m, { id: uid, me: true, text: q }]);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
    setPhase("thinking");

    void replyForQuestion(q).then((r) => {
      const t1 = window.setTimeout(() => {
        setMsgs((m) => [...m, { id: aid, me: false, text: "" }]);
        setPhase("streaming");
        let i = 0;
        const iv = window.setInterval(() => {
          i += 2;
          setMsgs((m) => m.map((x) => (x.id === aid ? { ...x, text: r.text.slice(0, i) } : x)));
          if (i >= r.text.length) {
            clearInterval(iv);
            setMsgs((m) => m.map((x) => (x.id === aid ? { ...x, text: r.text, loanIds: r.loanIds, done: true } : x)));
            setPhase("idle");
          }
        }, 22);
        timers.current.push(iv);
      }, r.fromGateway ? 400 : 1000);
      timers.current.push(t1);
    });
  };

  const stop = () => {
    clearTimers();
    setMsgs((m) => m.map((x) => (!x.me && !x.done ? { ...x, done: true } : x)));
    setPhase("idle");
  };

  const reset = () => { clearTimers(); setMsgs([]); setPhase("idle"); setText(""); };

  const empty = msgs.length === 0 && phase === "idle";

  return (
    <div className="app-bg relative mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <AuroraBackground />

      {/* هدر */}
      <header className="relative z-20 flex items-center justify-between px-4 pb-2 pt-4">
        <div className="w-10 h-10"></div>
       
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className="text-base font-extrabold leading-5">وام‌یار</div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-silver">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />دستیار هوشمند مالی
            </div>
          </div>
        </div>
         <button onClick={() => router.back()} aria-label="بازگشت" className="surface grid h-10 w-10 place-items-center rounded-full text-silver">
          <ChevronLeft size={20} />
        </button>
      </header>

      {/* محتوا */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 no-scrollbar">
        {empty ? (
          <div className="flex min-h-full flex-col items-center justify-center pb-6 pt-2 text-center">
            <div className="relative grid h-40 w-40 place-items-center">

              <span className="absolute inset-6 rounded-full bg-brand/30 blur-2xl" />
              <div className="mascot-float relative drop-shadow-[0_10px_24px_rgba(8,123,255,.55)]"><Mascot size={104} /></div>
            </div>

            <h1 className="msg-in mt-3 text-2xl font-black leading-10">
              <span className="text-ai-gradient">سلام! من وام‌یارم</span>
            </h1>
            <p className="msg-in mt-1 max-w-[270px] text-sm leading-7 text-silver" style={{ animationDelay: ".08s" }}>
              درباره‌ی وام، اقساط و برنامه‌ی مالی هر چی می‌خوای بپرس؛ سریع و ساده جواب می‌دم.
            </p>

            <div className="mt-6 grid w-full grid-cols-2 gap-2.5">
              {PROMPTS.map((p, i) => (
                <button
                  key={p.t}
                  onClick={() => send(p.t)}
                  className="msg-in surface group flex flex-col items-start gap-2 rounded-2xl p-3.5 text-right transition-transform active:scale-[0.97]"
                  style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10"><Ic n={p.ic} size={22} /></span>
                  <span className="text-[13px] font-extrabold leading-5">{p.t}</span>
                  <span className="flex w-full items-center justify-between text-[11px] text-silver">{p.s}<ChevronLeft size={14} className="text-accent" /></span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-4 pt-3">
            {msgs.map((m) => <ChatMessage key={m.id} msg={m} />)}
            {phase === "thinking" && <ThinkingRow />}
            <div ref={endRef} />
          </div>
        )}
      </main>

      {/* ورودی */}
      <div className="relative z-20 px-4 pb-4 pt-2">
        <div className="rounded-[26px] bg-linear-to-bl from-brand/50 via-line/10 to-accent/50 p-px transition-colors focus-within:from-brand focus-within:to-accent">
          <div className="flex items-end gap-2 rounded-[25px] bg-bg/95 p-2 backdrop-blur-xl">
            {busy ? (
              <button onClick={stop} aria-label="توقف" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bg"><Square size={14} fill="currentColor" /></button>
            ) : (
              <button
                onClick={() => send(text)}
                disabled={!text.trim()}
                aria-label="ارسال"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-bl from-brand to-accent text-white shadow-lg shadow-brand/30 transition-all disabled:opacity-40 disabled:shadow-none"
              >
                <ArrowUp size={20} />
              </button>
            )}
            <textarea
              ref={taRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }}
              placeholder="هر سوالی داری بپرس..."
              className="max-h-[120px] flex-1 resize-none bg-transparent px-1 py-3 text-sm leading-5 outline-none placeholder:text-silver/60"
            />
            <button aria-label="ورودی صوتی" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-silver hover:bg-tile"><Mic size={20} /></button>
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-silver/70">وام‌یار ممکنه اشتباه کنه؛ برای تصمیم‌های مهم شرایط رو از بانک هم بررسی کن.</p>
      </div>
    </div>
  );
}
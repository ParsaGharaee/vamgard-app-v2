"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { Bank } from "@/src/components/ui/Bank";
import { loans } from "@/src/components/loans/data";
import { BANKS } from "@/src/lib/constants/banks";
import { fa } from "@/src/lib/format";
import type { Msg } from "./ai";
import { Mascot } from "./Mascot";

const AiAvatar = () => (
  <span className="mt-0.5 grid h-8 w-8 ">
                 <div className="mascot-float relative drop-shadow-[0_10px_24px_rgba(8,123,255,.55)]"><Mascot size={35} variant="idle"/></div>
   
  </span>
);

export function ThinkingRow() {
  return (
    <div className="msg-in flex items-center gap-2.5">
      <AiAvatar />
      <div className="surface flex items-center gap-1.5 rounded-2xl px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="dot h-1.5 w-1.5 rounded-full bg-accent" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
        <span className="mr-1.5 text-xs text-silver">در حال فکر کردن…</span>
      </div>
    </div>
  );
}

export function ChatMessage({ msg }: { msg: Msg }) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  if (msg.me) {
    return (
      <div className="msg-in max-w-[82%] self-end rounded-2xl rounded-bl-md bg-linear-to-bl from-[#0B3FA8] via-brand to-accent px-4 py-2.5 text-sm leading-7 text-white shadow-lg shadow-brand/25">
        {msg.text}
      </div>
    );
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(msg.text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="msg-in flex items-start gap-2.5">
      <AiAvatar />
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-line text-sm leading-7">
          {msg.text}
          {!msg.done && <span className="caret mr-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-accent" />}
        </p>

        {msg.done && msg.loanIds && (
          <div className="mt-3 space-y-2">
            {msg.loanIds.map((id) => {
              const l = loans.find((x) => x.id === id);
              if (!l) return null;
              return (
                <Link key={id} href={`/loans/${id}`} className="surface flex items-center gap-3 rounded-2xl p-3 transition-transform active:scale-[0.98]">
                  <Bank k={l.bank} size={42} />
                  <div className="min-w-0 flex-1 text-right">
                    <div className="truncate text-sm font-extrabold">{l.t}</div>
                    <div className="mt-0.5 text-[11px] text-silver">بانک {BANKS[l.bank].n} · {fa(l.a)} میلیون · قسط {fa(l.q)}</div>
                  </div>
                  <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-onaccent">٪ {fa(l.ok)} تأیید</span>
                  <ChevronLeft size={16} className="text-silver/60" />
                </Link>
              );
            })}
          </div>
        )}

        {msg.done && (
          <div className="mt-2 flex items-center gap-1 text-silver">
            <button onClick={copy} aria-label="کپی" className="grid h-7 w-7 place-items-center rounded-lg hover:bg-tile">
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
            <button onClick={() => setVote("up")} aria-label="خوب بود" className={`grid h-7 w-7 place-items-center rounded-lg hover:bg-tile ${vote === "up" ? "text-brand" : ""}`}><ThumbsUp size={14} /></button>
            <button onClick={() => setVote("down")} aria-label="بد بود" className={`grid h-7 w-7 place-items-center rounded-lg hover:bg-tile ${vote === "down" ? "text-red-500" : ""}`}><ThumbsDown size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
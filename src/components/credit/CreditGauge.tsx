"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Card } from "../ui";
import { fa } from "@/src/lib/format";
import { gradeFromScore, loadSession, useSessionListener } from "@/src/lib/session";

const GCX = 110, GCY = 102, GR = 76;
const gpt = (t: number, r: number): [number, number] => {
  const a = Math.PI * (1 - t);
  return [GCX + r * Math.cos(a), GCY - r * Math.sin(a)];
};
const SEGS = [["#ef4444", "E3"], ["#f59e0b", "D2"], ["#facc15", "C1"], ["#84cc16", "B1"], ["#22c55e", "A1"]] as const;

function gradeToIdx(grade?: string, ratio = 0.5): number {
  const letter = (grade || "").trim().charAt(0).toUpperCase();
  if (letter === "A") return 4;
  if (letter === "B") return 3;
  if (letter === "C") return 2;
  if (letter === "D") return 1;
  if (letter === "E") return 0;
  return Math.min(4, Math.max(0, Math.floor(ratio * 5)));
}

type Props = {
  /** Absolute score (default scale 0–900 like vamgard.org) */
  score?: number;
  scoreMax?: number;
  /** ICS risk code from Finnotech (e.g. E3) — preferred over gradeFromScore */
  grade?: string;
  onBoost?: () => void;
  onComplete?: () => void;
  /** If set, CTA navigates here instead of animating locally */
  href?: string;
  /** Force filled state (e.g. after verification on a loan page) */
  filled?: boolean;
};

export function CreditGauge({
  score: scoreProp,
  scoreMax = 900,
  grade: gradeProp,
  onBoost,
  onComplete,
  href = "/services/credit-assessment-report",
  filled,
}: Props) {
  const router = useRouter();
  const [sessionScore, setSessionScore] = useState<number | undefined>();
  const [sessionGrade, setSessionGrade] = useState<string | undefined>();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setSessionScore(s.creditScore);
      setSessionGrade(s.creditGrade);
    };
    sync();
    return useSessionListener(sync);
  }, []);

  const resolvedScore = scoreProp ?? sessionScore;
  const known = filled || typeof resolvedScore === "number";
  const score = resolvedScore ?? 720;
  const gradeLabel =
    gradeProp || sessionGrade || (known ? gradeFromScore(Math.round(score)) : undefined);

  const [v, setV] = useState(known ? score / scoreMax : 0.5);
  const [phase, setPhase] = useState<"idle" | "run" | "done">(known ? "done" : "idle");
  const vr = useRef(known ? score / scoreMax : 0.5);
  const raf = useRef(0);

  useEffect(() => {
    if (!known) return;
    const t = Math.min(1, Math.max(0, score / scoreMax));
    vr.current = t;
    setV(t);
    setPhase("done");
  }, [known, score, scoreMax]);

  const glide = (to: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(raf.current);
    const from = vr.current, t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      vr.current = from + (to - from) * e;
      setV(vr.current);
      if (k < 1) raf.current = requestAnimationFrame(step);
      else done?.();
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (phase !== "idle") return;
    const wander = () => glide(0.08 + Math.random() * 0.86, 1100 + Math.random() * 700);
    wander();
    const t = setInterval(wander, 1900);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = () => {
    if (href) {
      router.push(href);
      return;
    }
    if (phase !== "idle") return;
    setPhase("run");
    glide(0, 450, () =>
      glide(score / scoreMax, 2200, () => {
        setPhase("done");
        onComplete?.();
      }),
    );
  };

  const g = gradeToIdx(known || phase === "done" ? gradeLabel : undefined, v);
  const tip = gpt(v, GR - 12);
  const idle = phase === "idle";
  const label = known || phase === "done" ? gradeLabel || SEGS[g][1] : "—";

  return (
    <Card className="mx-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="text-[15px] font-extrabold">
            {phase === "done" || known ? "رتبه اعتباری شما" : "رتبه اعتباری خود را بسنج"}
          </div>
          <p className="mt-1.5 text-xs leading-6 text-silver">
            {phase === "done" || known
              ? "با انجام تسک‌ها، رتبه‌ات را بالا ببر و به وام‌های بهتری دسترسی داشته باش."
              : "با یک اعتبارسنجی بانکی سریع، وضعیت اعتبارت را ببین و وام مناسب پیدا کن."}
          </p>
          {phase === "done" || known ? (
            <button
              type="button"
              onClick={() => (onBoost ? onBoost() : router.push(href))}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white"
            >
              <TrendingUp size={16} />افزایش اعتبار
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              disabled={phase === "run"}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-70"
            >
              {phase === "run" ? "در حال بررسی…" : "اعتبارسنجی کن"}
            </button>
          )}
        </div>

        <div className="w-[170px] shrink-0 text-center">
          <svg viewBox="0 0 220 120" className="w-full">
            {SEGS.map(([c], k) => {
              const [x0, y0] = gpt(k / 5 + 0.012, GR);
              const [x1, y1] = gpt((k + 1) / 5 - 0.012, GR);
              const d = `M ${x0} ${y0} A ${GR} ${GR} 0 0 1 ${x1} ${y1}`;
              const f = idle ? 0 : Math.max(0, Math.min(1, (v - k / 5) * 5));
              return (
                <g key={k}>
                  <path d={d} pathLength={1} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={14} />
                  <path d={d} pathLength={1} fill="none" stroke={c} strokeWidth={14} strokeDasharray={`${f} 1`} />
                </g>
              );
            })}
            {SEGS.map(([, l], k) => {
              const [x, y] = gpt((k + 0.5) / 5, GR + 17);
              return <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="currentColor" opacity={0.6}>{l}</text>;
            })}
            <line x1={GCX} y1={GCY} x2={tip[0]} y2={tip[1]} strokeWidth={4} strokeLinecap="round" className="stroke-brand" />
            <circle cx={GCX} cy={GCY} r={8} className="fill-brand" />
            <circle cx={GCX} cy={GCY} r={3} fill="#fff" />
          </svg>
          <div className="-mt-1 text-4xl font-black leading-none" style={{ color: idle ? undefined : SEGS[g][0] }} dir="ltr">
            {idle ? "—" : label}
          </div>
          <div className="mt-1 text-sm font-bold text-silver">
            {idle ? "اعتبارسنجی نشده" : `${fa(Math.round(v * scoreMax))} / ${fa(scoreMax)}`}
          </div>
        </div>
      </div>
    </Card>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Card } from "../ui";
import { fa } from "@/src/lib/format";
import { gradeFromScore, loadSession, useSessionListener } from "@/src/lib/session";

const GCX = 110;
const GCY = 102;
const GR = 76;

const gpt = (t: number, r: number): [number, number] => {
  const a = Math.PI * (1 - t);
  return [GCX + r * Math.cos(a), GCY - r * Math.sin(a)];
};

const SEGS = [
  { color: "#ef4444", label: "E", min: 0, max: 420 },
  { color: "#f59e0b", label: "D", min: 420, max: 460 },
  { color: "#facc15", label: "C", min: 460, max: 540 },
  { color: "#84cc16", label: "B", min: 540, max: 620 },
  { color: "#22c55e", label: "A", min: 620, max: 900 },
] as const;

function scoreToGaugeRatio(score: number): { ratio: number; segIdx: number } {
  const clamped = Math.min(900, Math.max(0, score));
  for (let i = 0; i < SEGS.length; i++) {
    const seg = SEGS[i];
    if (clamped < seg.max || i === SEGS.length - 1) {
      const local = (clamped - seg.min) / Math.max(1, seg.max - seg.min);
      const ratio = i * 0.2 + Math.min(1, Math.max(0, local)) * 0.2;
      return { ratio, segIdx: i };
    }
  }
  return { ratio: 0, segIdx: 0 };
}

type Props = {
  score?: number;
  scoreMax?: number;
  grade?: string;
  onBoost?: () => void;
  /** مسیر صفحه انجام سرویس اعتبارسنجی */
  serviceHref?: string;
  /** مسیر صفحه پروفایل اعتباری (برای دکمه افزایش اعتبار) */
  profileHref?: string;
  filled?: boolean;
};

export function CreditGauge({
  score: scoreProp,
  scoreMax = 900,
  grade: gradeProp,
  onBoost,
  serviceHref = "/services/credit-assessment",
  profileHref = "/profile/credit",
  filled,
}: Props) {
  const router = useRouter();
  const [sessionScore, setSessionScore] = useState<number | undefined>();
  const [sessionGrade, setSessionGrade] = useState<string | undefined>();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      if (s.loggedIn && typeof s.creditScore === "number") {
        setSessionScore(s.creditScore);
        setSessionGrade(s.creditGrade);
      } else {
        setSessionScore(undefined);
        setSessionGrade(undefined);
      }
    };
    sync();
    return useSessionListener(sync);
  }, []);

  const resolvedScore = scoreProp ?? sessionScore;
  const known = Boolean(filled || typeof resolvedScore === "number");
  const score = resolvedScore ?? 0;
  const gradeLabel = known ? gradeProp || sessionGrade || gradeFromScore(Math.round(score)) : "—";
  const target = known ? scoreToGaugeRatio(score) : { ratio: 0.5, segIdx: 0 };

  // انیمیشن نرم حرکت عقربه
  const [v, setV] = useState(known ? target.ratio : 0.5);
  const vr = useRef(known ? target.ratio : 0.5);
  const raf = useRef(0);

  const glide = (to: number, ms: number) => {
    cancelAnimationFrame(raf.current);
    const from = vr.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      vr.current = from + (to - from) * e;
      setV(vr.current);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  // اگر اعتبارسنجی انجام شده بود: انیمیشن نرم تا زاویه دقیق امتیاز واقعی
  // اگر هنوز انجام نشده بود: انیمیشن حرکت آرام و رفت‌وبرگشتی عقربه (idle)
  useEffect(() => {
    if (known) {
      glide(target.ratio, 900);
      return () => cancelAnimationFrame(raf.current);
    }

    const wander = () => glide(0.1 + Math.random() * 0.8, 1100 + Math.random() * 600);
    wander();
    const timer = setInterval(wander, 1900);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [known, target.ratio]);

  const tip = gpt(v, GR - 12);

  return (
    <Card className="mx-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="text-[15px] font-extrabold">
            {known ? "رتبه اعتباری شما" : "رتبه اعتباری خود را بسنج"}
          </div>
          <p className="mt-1.5 text-xs leading-6 text-silver">
            {known
              ? "بر اساس آخرین گزارش اعتبارسنجی بانکی شما محاسبه شده است."
              : "با یک اعتبارسنجی بانکی سریع، وضعیت اعتبارت را ببین و وام مناسب پیدا کن."}
          </p>

          {known ? (
            <button
              type="button"
              onClick={() => (onBoost ? onBoost() : router.push(profileHref))}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-extrabold text-white active:scale-95 transition-transform"
            >
              <TrendingUp size={15} />
              <span>افزایش اعتبار</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push(serviceHref)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-extrabold text-white active:scale-95 transition-transform"
            >
              اعتبارسنجی کن
            </button>
          )}
        </div>

        <div className="w-[170px] shrink-0 text-center">
          <svg viewBox="0 0 220 120" className="w-full">
            {SEGS.map((seg, k) => {
              const [x0, y0] = gpt(k / 5 + 0.014, GR);
              const [x1, y1] = gpt((k + 1) / 5 - 0.014, GR);
              const d = `M ${x0} ${y0} A ${GR} ${GR} 0 0 1 ${x1} ${y1}`;
              const fillRatio = !known ? 0 : Math.max(0, Math.min(1, (v - k / 5) * 5));
              return (
                <g key={seg.label}>
                  <path
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeWidth={14}
                  />
                  <path
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={14}
                    strokeDasharray={`${fillRatio} 1`}
                  />
                </g>
              );
            })}
            {SEGS.map((seg, k) => {
              const [x, y] = gpt((k + 0.5) / 5, GR + 17);
              return (
                <text
                  key={seg.label}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill="currentColor"
                  opacity={known && k === target.segIdx ? 1 : 0.55}
                >
                  {seg.label}
                </text>
              );
            })}
            <line
              x1={GCX}
              y1={GCY}
              x2={tip[0]}
              y2={tip[1]}
              strokeWidth={4}
              strokeLinecap="round"
              className="stroke-brand"
            />
            <circle cx={GCX} cy={GCY} r={8} className="fill-brand" />
            <circle cx={GCX} cy={GCY} r={3} fill="#fff" />
          </svg>

          <div
            className="-mt-1 text-4xl font-black leading-none"
            style={{ color: known ? SEGS[target.segIdx].color : undefined }}
            dir="ltr"
          >
            {gradeLabel}
          </div>
          <div className="mt-1 text-xs font-bold text-silver">
            {known ? `${fa(Math.round(score))} / ${fa(scoreMax)}` : "اعتبارسنجی نشده"}
          </div>
        </div>
      </div>
    </Card>
  );
}
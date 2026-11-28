"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { CreditGauge } from "./CreditGauge";
import { ResultExport } from "@/src/components/pay/ResultExport";
import { fa } from "@/src/lib/format";
import { loadSession, useSessionListener, type AppUser } from "@/src/lib/session";
import { loadCreditHistory, type CreditHistoryPoint } from "@/src/lib/historyStore";

const CREDIT_SERVICE_HREF = "/services/credit-assessment";

const BOOST_TASKS = [
  { id: "t1", title: "تسویه اقساط معوق یا سررسید گذشته در تمام بانک‌ها", impact: "+۴۵ امتیاز" },
  { id: "t2", title: "رفع سوءاثر چک‌های برگشتی ثبت‌شده در سامانه صیاد", impact: "+۶۰ امتیاز" },
  { id: "t3", title: "کاهش تعداد استعلام‌های اعتباری پیاپی در ۳۰ روز آینده", impact: "+۲۰ امتیاز" },
  { id: "t4", title: "نگهداری میانگین حساب فعال و گردش منظم به مدت ۳ ماه", impact: "+۳۰ امتیاز" },
  { id: "t5", title: "پرداخت به‌موقع اقساط جاری بدون تاخیر بیش از ۳ روز", impact: "+۳۵ امتیاز" },
];

function ScoreHistoryChart({ points }: { points: CreditHistoryPoint[] }) {
  if (points.length === 0) return null;
  const w = 300;
  const h = 95;
  const padX = 16;
  const padY = 18;

  const coords = points.map((p, i) => {
    const x =
      points.length === 1
        ? w / 2
        : padX + (i / (points.length - 1)) * (w - padX * 2);
    const y = h - padY - (Math.min(900, Math.max(0, p.score)) / 900) * (h - padY * 2);
    return { x, y, ...p };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible text-brand" aria-hidden>
        {coords.length > 1 && (
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {coords.map((c) => (
          <g key={c.id}>
            <circle cx={c.x} cy={c.y} r={4.5} fill="#fff" stroke="currentColor" strokeWidth={2.5} />
            <text
              x={c.x}
              y={c.y - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="currentColor"
            >
              {fa(c.score)} ({c.grade})
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between px-2 text-[10px] text-silver">
        {points.map((p, idx) => (
          <span key={p.id}>دفعه {fa(idx + 1)}</span>
        ))}
      </div>
    </div>
  );
}

export function CreditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser>({ loggedIn: false });
  const [history, setHistory] = useState<CreditHistoryPoint[]>([]);
  const [showBoost, setShowBoost] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const boostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      setUser(loadSession());
      setHistory(loadCreditHistory());
    };
    sync();
    return useSessionListener(sync);
  }, []);

  const hasScore = Boolean(user.loggedIn && typeof user.creditScore === "number");
  const lastReport = history[history.length - 1];

  const toggleTask = (id: string) =>
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="اعتبارسنجی بانکی" />

      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <div className="mt-4">
          <CreditGauge
            filled={hasScore}
            score={user.creditScore}
            grade={user.creditGrade}
            serviceHref={CREDIT_SERVICE_HREF}
            onBoost={() => {
              setShowBoost(true);
              setTimeout(() => boostRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
          />
        </div>

        {/* اگر هنوز اعتبارسنجی انجام نشده */}
        {!hasScore ? (
          <Card className="mx-4 mt-4 space-y-3 p-5 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
              <ShieldCheck size={24} />
            </span>
            <div className="text-sm font-extrabold">هنوز گزارش اعتباری ثبت نشده است</div>
            <p className="text-xs leading-6 text-silver">
              برای مشاهده رتبه اعتباری، نمودار پیشرفت و شانس دریافت وام‌ها، اعتبارسنجی بانکی خود را انجام دهید.
            </p>
            <VamButton onClick={() => router.push(CREDIT_SERVICE_HREF)}>
              شروع اعتبارسنجی بانکی
            </VamButton>
          </Card>
        ) : (
          <>
            {/* جزئیات آخرین اعتبارسنجی */}
            <Card className="mx-4 mt-4 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-extrabold">جزئیات آخرین اعتبارسنجی</span>
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-extrabold text-emerald-500">
                  رتبه {user.creditGrade}
                </span>
              </div>

              {user.name && <InfoRow label="نام و نام خانوادگی" value={user.name} />}
              <InfoRow label="کد ملی" value={fa(user.nationalCode || "—")} />
              <InfoRow
                label="امتیاز اعتباری"
                value={`${fa(user.creditScore ?? 0)} از ${fa(900)}`}
              />
              <InfoRow label="سطح ریسک" value={lastReport?.riskLabel || "کم‌ریسک"} />
              <InfoRow
                label="چک برگشتی فعال"
                value={`${fa(lastReport?.bouncedCheques ?? 0)} فقره`}
              />
              <InfoRow label="تاریخ آخرین بررسی" value={lastReport?.date || "امروز"} />

              <ResultExport
                title="گزارش اعتبارسنجی بانکی"
                fileName={`credit-report-${user.nationalCode || "user"}`}
                rows={[
                  { label: "کد ملی", value: fa(user.nationalCode || "—") },
                  { label: "امتیاز اعتباری", value: `${fa(user.creditScore ?? 0)} از ۹۰۰` },
                  { label: "رتبه اعتباری", value: user.creditGrade || "—" },
                  { label: "سطح ریسک", value: lastReport?.riskLabel || "کم‌ریسک" },
                ]}
              />
            </Card>

            {/* نمودار روند تغییر رتبه‌ها */}
            {history.length > 0 && (
              <Card className="mx-4 mt-4 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold">نمودار روند رتبه‌های شما</span>
                  <TrendingUp size={18} className="text-brand" />
                </div>
                <ScoreHistoryChart points={history} />
              </Card>
            )}

            {/* چک‌لیست افزایش اعتبار + دکمه اعتبارسنجی مجدد */}
            <div ref={boostRef}>
              <Card className="mx-4 mt-4 space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <Sparkles size={18} className="text-brand" />
                    <span>چک‌لیست افزایش اعتبار</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBoost((b) => !b)}
                    className="text-xs font-bold text-brand"
                  >
                    {showBoost ? "بستن" : "مشاهده راهکارها"}
                  </button>
                </div>

                {showBoost && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    {BOOST_TASKS.map((task) => {
                      const done = Boolean(checkedTasks[task.id]);
                      return (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`flex w-full items-start gap-2.5 rounded-2xl border p-3 text-right transition-all ${
                            done
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-line/10 bg-tile/30"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle size={18} className="mt-0.5 shrink-0 text-silver" />
                          )}
                          <div className="flex-1">
                            <div
                              className={`text-xs font-bold leading-5 ${
                                done ? "text-silver line-through" : "text-ink"
                              }`}
                            >
                              {task.title}
                            </div>
                            <span className="mt-1 inline-block rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-extrabold text-brand">
                              {task.impact}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <VamButton onClick={() => router.push(CREDIT_SERVICE_HREF)}>
                  <RefreshCcw size={17} />
                  <span>اعتبارسنجی مجدد</span>
                </VamButton>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
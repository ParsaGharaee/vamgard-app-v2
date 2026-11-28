"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import * as jalaali from "jalaali-js";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { fa, toEnDigits } from "@/src/lib/format";

type RepeatMode = "monthly" | "bimonthly" | "quarterly" | "weekly";

type InstallmentPlan = {
  id: string;
  title: string;
  amount: number;
  startJy: number;
  startJm: number;
  startJd: number;
  totalCount: number;
  repeat: RepeatMode;
  notifyDaysBefore: number;
  color: string;
  /** اندیس قسط‌های پرداخت‌شده (مثلاً [1, 2]) */
  paidIndices: number[];
};

type InstallmentOccurrence = {
  planId: string;
  title: string;
  amount: number;
  color: string;
  index: number;
  totalCount: number;
  jy: number;
  jm: number;
  jd: number;
  notifyDaysBefore: number;
  paid: boolean;
};

const STORAGE_KEY = "vamgard_installment_plans_v2";

const COLORS = [
  { hex: "#087bff", name: "آبی" },
  { hex: "#22c55e", name: "سبز" },
  { hex: "#f59e0b", name: "نارنجی" },
  { hex: "#ef4444", name: "قرمز" },
  { hex: "#a855f7", name: "بنفش" },
];

const REPEAT_OPTIONS: { id: RepeatMode; label: string }[] = [
  { id: "monthly", label: "ماهانه" },
  { id: "bimonthly", label: "دوماهه" },
  { id: "quarterly", label: "سه‌ماهه" },
  { id: "weekly", label: "هفتگی" },
];

const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const WEEKDAYS_FULL = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

function daysInJMonth(jy: number, jm: number) {
  return jm <= 6 ? 31 : jm <= 11 ? 30 : jalaali.isLeapJalaaliYear(jy) ? 30 : 29;
}

function addMonthsJalali(jy: number, jm: number, jd: number, monthsToAdd: number) {
  const totalMonths = (jy * 12 + (jm - 1)) + monthsToAdd;
  const ny = Math.floor(totalMonths / 12);
  const nm = (totalMonths % 12) + 1;
  const nd = Math.min(jd, daysInJMonth(ny, nm));
  return { jy: ny, jm: nm, jd: nd };
}

function addDaysJalali(jy: number, jm: number, jd: number, daysToAdd: number) {
  const g = jalaali.toGregorian(jy, jm, jd);
  const d = new Date(g.gy, g.gm - 1, g.gd + daysToAdd);
  return jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** تولید خودکار تمام اقساط یک طرح روی تقویم */
function expandPlan(plan: InstallmentPlan): InstallmentOccurrence[] {
  const result: InstallmentOccurrence[] = [];
  for (let i = 0; i < plan.totalCount; i++) {
    const dt =
      plan.repeat === "weekly"
        ? addDaysJalali(plan.startJy, plan.startJm, plan.startJd, i * 7)
        : addMonthsJalali(
            plan.startJy,
            plan.startJm,
            plan.startJd,
            i * (plan.repeat === "monthly" ? 1 : plan.repeat === "bimonthly" ? 2 : 3),
          );
    const index = i + 1;
    result.push({
      planId: plan.id,
      title: plan.title,
      amount: plan.amount,
      color: plan.color,
      index,
      totalCount: plan.totalCount,
      jy: dt.jy,
      jm: dt.jm,
      jd: dt.jd,
      notifyDaysBefore: plan.notifyDaysBefore,
      paid: plan.paidIndices.includes(index),
    });
  }
  return result;
}

function diffDaysFromToday(jy: number, jm: number, jd: number) {
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const g = jalaali.toGregorian(jy, jm, jd);
  const targetMid = new Date(g.gy, g.gm - 1, g.gd).getTime();
  return Math.round((targetMid - todayMid) / (1000 * 60 * 60 * 24));
}

function getStatus(occ: InstallmentOccurrence) {
  if (occ.paid) return { label: "پرداخت شده", cls: "bg-emerald-500/15 text-emerald-500", dot: "#22c55e" };
  const diff = diffDaysFromToday(occ.jy, occ.jm, occ.jd);
  if (diff < 0) return { label: `${fa(Math.abs(diff))} روز عقب افتاده`, cls: "bg-red-500/15 text-red-500", dot: "#ef4444" };
  if (diff === 0) return { label: "سررسید امروز", cls: "bg-amber-500/15 text-amber-500", dot: "#f59e0b" };
  if (diff <= occ.notifyDaysBefore) return { label: `${fa(diff)} روز تا سررسید`, cls: "bg-amber-500/15 text-amber-500", dot: "#f59e0b" };
  return { label: "پرداخت نشده", cls: "bg-brand/15 text-brand", dot: "#087bff" };
}

export default function RemindersPage() {
  const todayInfo = useMemo(() => {
    const g = new Date();
    const j = jalaali.toJalaali(g.getFullYear(), g.getMonth() + 1, g.getDate());
    return { ...j, weekdayName: WEEKDAYS_FULL[g.getDay()] };
  }, []);

  const [view, setView] = useState({ jy: todayInfo.jy, jm: todayInfo.jm });
  const [selectedJd, setSelectedJd] = useState<number | null>(null);
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);

  // فیلدهای فرم افزودن طرح قسط
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [totalCount, setTotalCount] = useState("12");
  const [repeat, setRepeat] = useState<RepeatMode>("monthly");
  const [notifyDays, setNotifyDays] = useState("3");
  const [startDay, setStartDay] = useState(String(todayInfo.jd));
  const [color, setColor] = useState(COLORS[0].hex);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setPlans(JSON.parse(raw));
      } else {
        const seed: InstallmentPlan[] = [
          {
            id: "plan-1",
            title: "قسط وام بانک ملی",
            amount: 3_500_000,
            startJy: todayInfo.jy,
            startJm: todayInfo.jm,
            startJd: Math.min(daysInJMonth(todayInfo.jy, todayInfo.jm), todayInfo.jd + 2),
            totalCount: 12,
            repeat: "monthly",
            notifyDaysBefore: 3,
            color: "#087bff",
            paidIndices: [],
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        setPlans(seed);
      }
    } catch {
      setPlans([]);
    }
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifEnabled(Notification.permission === "granted");
    }
  }, [todayInfo.jd, todayInfo.jm, todayInfo.jy]);

  const persist = (next: InstallmentPlan[]) => {
    setPlans(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const allOccurrences = useMemo(() => plans.flatMap(expandPlan), [plans]);
  const monthOccurrences = useMemo(
    () => allOccurrences.filter((o) => o.jy === view.jy && o.jm === view.jm),
    [allOccurrences, view.jm, view.jy],
  );
  const visibleOccurrences = selectedJd
    ? monthOccurrences.filter((o) => o.jd === selectedJd)
    : monthOccurrences;

  const gridDays = useMemo(() => {
    const firstGreg = jalaali.toGregorian(view.jy, view.jm, 1);
    const firstDate = new Date(firstGreg.gy, firstGreg.gm - 1, firstGreg.gd);
    const weekday = (firstDate.getDay() + 1) % 7;
    const total = daysInJMonth(view.jy, view.jm);
    const cells: (number | null)[] = [];
    for (let i = 0; i < weekday; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [view]);

  const shiftMonth = (delta: number) => {
    let jy = view.jy;
    let jm = view.jm + delta;
    if (jm < 1) {
      jm = 12;
      jy -= 1;
    } else if (jm > 12) {
      jm = 1;
      jy += 1;
    }
    setView({ jy, jm });
    setSelectedJd(null);
  };

  const goToday = () => {
    setView({ jy: todayInfo.jy, jm: todayInfo.jm });
    setSelectedJd(todayInfo.jd);
  };

  const addPlan = () => {
    if (title.trim().length < 2) {
      setFormError("نام قسط را وارد کنید.");
      return;
    }
    const amt = Number(amount) || 0;
    const cnt = Math.min(60, Math.max(1, Number(totalCount) || 1));
    const maxDay = daysInJMonth(view.jy, view.jm);
    const sDay = Math.min(maxDay, Math.max(1, Number(startDay) || todayInfo.jd));

    if (amt <= 0) {
      setFormError("مبلغ قسط را وارد کنید.");
      return;
    }

    const newPlan: InstallmentPlan = {
      id: `plan-${Date.now()}`,
      title: title.trim(),
      amount: amt,
      startJy: view.jy,
      startJm: view.jm,
      startJd: sDay,
      totalCount: cnt,
      repeat,
      notifyDaysBefore: Math.max(0, Number(notifyDays) || 3),
      color,
      paidIndices: [],
    };

    persist([newPlan, ...plans]);
    setTitle("");
    setAmount("");
    setTotalCount("12");
    setFormError("");
    setFormOpen(false);
  };

  const togglePaid = (planId: string, index: number) => {
    persist(
      plans.map((p) => {
        if (p.id !== planId) return p;
        const exists = p.paidIndices.includes(index);
        return {
          ...p,
          paidIndices: exists ? p.paidIndices.filter((x) => x !== index) : [...p.paidIndices, index],
        };
      }),
    );
  };

  const deletePlan = (planId: string) => {
    persist(plans.filter((p) => p.id !== planId));
  };

  const requestNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === "granted");
    if (perm === "granted") {
      new Notification("اعلان یادآور اقساط فعال شد", {
        body: "پیش از سررسید اقساط ثبت‌شده به شما اطلاع می‌دهیم.",
      });
    }
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="یادآور پرداخت اقساط" />

      <main className="flex-1 overflow-y-auto pb-12 no-scrollbar">
        {/* نوار تاریخ امروز */}
        <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl border border-brand/20 bg-brand/10 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-ink">
            <CalendarDays size={16} className="text-brand" />
            <span>
              امروز: {todayInfo.weekdayName} {fa(todayInfo.jd)} {MONTH_NAMES[todayInfo.jm - 1]} {fa(todayInfo.jy)}
            </span>
          </div>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg bg-brand px-2.5 py-1 text-[10px] font-extrabold text-white"
          >
            امروز
          </button>
        </div>

        {/* تقویم شمسی */}
        <Card className="mx-4 mt-3 p-4">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
              <ChevronRight size={18} />
            </button>
            <div className="text-base font-black">
              {MONTH_NAMES[view.jm - 1]} {fa(view.jy)}
            </div>
            <button type="button" onClick={() => shiftMonth(1)} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-silver">
            {WEEKDAYS_SHORT.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {gridDays.map((d, i) => {
              if (d == null) return <span key={`e-${i}`} />;
              const items = monthOccurrences.filter((o) => o.jd === d);
              const isToday = view.jy === todayInfo.jy && view.jm === todayInfo.jm && d === todayInfo.jd;
              const isSelected = selectedJd === d;
              const primaryColor = items[0]?.color;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedJd(isSelected ? null : d)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition-all ${
                    isSelected
                      ? "bg-brand text-white shadow-md shadow-brand/30"
                      : isToday
                        ? "border-2 border-brand bg-brand/15 text-brand"
                        : primaryColor
                          ? "border text-ink"
                          : "surface text-ink"
                  }`}
                  style={
                    !isSelected && !isToday && primaryColor
                      ? { backgroundColor: `${primaryColor}1F`, borderColor: `${primaryColor}55` }
                      : undefined
                  }
                >
                  <span>{fa(d)}</span>
                  {items.length > 0 && (
                    <span className="mt-0.5 flex items-center gap-0.5">
                      {items.slice(0, 3).map((o) => (
                        <span
                          key={`${o.planId}-${o.index}`}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? "#fff" : o.color }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mx-4 mt-4">
          <VamButton
            onClick={() => {
              setStartDay(String(selectedJd ?? todayInfo.jd));
              setFormOpen(true);
            }}
          >
            <Plus size={18} />
            <span>افزودن یادآور جدید</span>
          </VamButton>
        </div>

        <div className="mx-4 mt-5 flex items-center justify-between">
          <h2 className="text-sm font-extrabold">
            {selectedJd
              ? `اقساط ${fa(selectedJd)} ${MONTH_NAMES[view.jm - 1]}`
              : `اقساط ${MONTH_NAMES[view.jm - 1]} ${fa(view.jy)}`}
          </h2>
          {selectedJd && (
            <button type="button" onClick={() => setSelectedJd(null)} className="text-xs font-bold text-brand">
              نمایش کل ماه
            </button>
          )}
        </div>

        <div className="mx-4 mt-3 space-y-3">
          {visibleOccurrences.length === 0 ? (
            <Card className="flex flex-col items-center gap-2 p-6 text-center text-xs text-silver">
              <Bell size={22} />
              <span>قسطی در این بازه ثبت نشده است.</span>
            </Card>
          ) : (
            visibleOccurrences.map((occ) => {
              const st = getStatus(occ);
              return (
                <Card key={`${occ.planId}-${occ.index}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black text-white"
                        style={{ backgroundColor: occ.color }}
                      >
                        {fa(occ.jd)}
                      </span>
                      <div className="min-w-0 text-right">
                        <div className="truncate text-sm font-extrabold text-ink">{occ.title}</div>
                        <div className="mt-0.5 text-[11px] text-silver">
                          قسط {fa(occ.index)} از {fa(occ.totalCount)} · {fa(occ.jd)} {MONTH_NAMES[occ.jm - 1]} {fa(occ.jy)}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-ink">
                            {fa(occ.amount.toLocaleString("en-US"))} تومان
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${st.cls}`}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
                            {st.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deletePlan(occ.planId)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-400"
                      title="حذف کامل این طرح قسط"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePaid(occ.planId, occ.index)}
                    className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all active:scale-[0.98] ${
                      occ.paid
                        ? "bg-tile text-silver"
                        : "bg-emerald-500/15 text-emerald-500"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    <span>{occ.paid ? "لغو وضعیت پرداخت‌شده" : "پرداخت کردم"}</span>
                  </button>
                </Card>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={requestNotifications}
          className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between gap-3 rounded-2xl border border-brand/20 bg-brand/10 p-3.5 text-right text-xs font-bold text-ink"
        >
          <div className="flex items-center gap-2.5">
            {notifEnabled ? (
              <BellRing size={20} className="shrink-0 text-emerald-500" />
            ) : (
              <Lightbulb size={20} className="shrink-0 text-brand" />
            )}
            <span>
              {notifEnabled
                ? "اعلان‌های یادآور اقساط فعال است."
                : "با فعال کردن اعلان‌ها، هیچ قسطی را فراموش نکنید."}
            </span>
          </div>
          {!notifEnabled && (
            <span className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-[10px] font-extrabold text-white">
              فعال‌سازی
            </span>
          )}
        </button>
      </main>

      {/* باتن‌شیت افزودن یادآور جدید */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-[2px]"
          onClick={() => setFormOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[430px] rounded-t-[30px] border-t border-line/10 bg-card px-5 pb-8 pt-3 shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line/20" />

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-extrabold">ثبت طرح یادآور قسط</h3>
              <button type="button" onClick={() => setFormOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="اسم قسط (مثلاً قسط خودرو)"
                className="surface w-full rounded-xl border border-line/10 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-brand"
              />

              <input
                dir="ltr"
                value={amount ? fa(amount) : ""}
                onChange={(e) => setAmount(toEnDigits(e.target.value).replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder="مبلغ هر قسط (تومان)"
                className="surface w-full rounded-xl border border-line/10 px-3.5 py-2.5 text-left text-sm font-bold outline-none focus:border-brand"
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-silver">تعداد اقساط</label>
                  <input
                    dir="ltr"
                    value={totalCount ? fa(totalCount) : ""}
                    onChange={(e) => setTotalCount(toEnDigits(e.target.value).replace(/\D/g, ""))}
                    inputMode="numeric"
                    className="surface w-full rounded-xl border border-line/10 px-2.5 py-2 text-center text-sm font-bold outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-silver">روز اولین قسط</label>
                  <input
                    dir="ltr"
                    value={startDay ? fa(startDay) : ""}
                    onChange={(e) => setStartDay(toEnDigits(e.target.value).replace(/\D/g, ""))}
                    inputMode="numeric"
                    className="surface w-full rounded-xl border border-line/10 px-2.5 py-2 text-center text-sm font-bold outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-silver">اعلان (روز قبل)</label>
                  <input
                    dir="ltr"
                    value={notifyDays ? fa(notifyDays) : ""}
                    onChange={(e) => setNotifyDays(toEnDigits(e.target.value).replace(/\D/g, ""))}
                    inputMode="numeric"
                    className="surface w-full rounded-xl border border-line/10 px-2.5 py-2 text-center text-sm font-bold outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-silver">دوره تکرار خودکار</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {REPEAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRepeat(opt.id)}
                      className={`rounded-xl border py-2 text-[11px] font-extrabold transition-all ${
                        repeat === opt.id ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface text-silver"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-silver">رنگ نمایش روی تقویم</label>
                <div className="flex items-center gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        color === c.hex ? "scale-110 border-white ring-2 ring-brand" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              {formError && <p className="text-xs font-bold text-red-400">{formError}</p>}

              <VamButton onClick={addPlan}>ساخت خودکار اقساط روی تقویم</VamButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
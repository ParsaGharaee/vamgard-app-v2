"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import * as jalaali from "jalaali-js";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { fa } from "@/src/lib/format";
import { gatewayFetch } from "@/src/lib/gateway/client";
import { loadSession } from "@/src/lib/session";

type Reminder = {
  id: string;
  title: string;
  amount: number;
  jy: number;
  jm: number;
  jd: number;
  hour: number;
  minute: number;
  notify: boolean;
  color?: string;
  intervalDays?: number;
  notifyDaysBefore?: number;
  installmentCount?: number;
  paid?: boolean;
};

const COLORS = ["#087bff", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

const MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function daysInJMonth(jy: number, jm: number) {
  return jm <= 6 ? 31 : jm <= 11 ? 30 : jalaali.isLeapJalaaliYear(jy) ? 30 : 29;
}

export default function RemindersPage() {
  const today = useMemo(() => {
    const g = new Date();
    return jalaali.toJalaali(g.getFullYear(), g.getMonth() + 1, g.getDate());
  }, []);

  const [view, setView] = useState({ jy: today.jy, jm: today.jm });
  const [selectedJd, setSelectedJd] = useState(today.jd);
  const [list, setList] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [intervalDays, setIntervalDays] = useState("30");
  const [notifyDays, setNotifyDays] = useState("3");
  const [count, setCount] = useState("12");
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await gatewayFetch<{ reminders?: Reminder[] }>("me/reminders");
    if (res.ok && Array.isArray(res.data.reminders)) {
      setList(res.data.reminders);
    } else {
      try {
        const raw = localStorage.getItem("vamgard_reminders_v1");
        if (raw) setList(JSON.parse(raw));
      } catch {
        setList([]);
      }
      if (!res.ok) setNote("یادآورها به‌صورت آفلاین ذخیره می‌شوند.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = async (next: Reminder[]) => {
    setList(next);
    try {
      localStorage.setItem("vamgard_reminders_v1", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    const session = loadSession();
    if (!session.loggedIn) return;
    const sid = session.sessionToken || crypto.randomUUID().replace(/-/g, "");
    await gatewayFetch("me/reminders", {
      method: "POST",
      json: next[next.length - 1],
    });
  };

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

  const dayReminders = list.filter((r) => r.jy === view.jy && r.jm === view.jm && r.jd === selectedJd);

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
    setSelectedJd(1);
  };

  const addReminder = async () => {
    if (!title.trim()) return;
    const item: Reminder = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: Number(amount.replace(/\D/g, "")) || 0,
      jy: view.jy,
      jm: view.jm,
      jd: selectedJd,
      hour: 9,
      minute: 0,
      notify: true,
      color,
      intervalDays: Number(intervalDays) || 30,
      notifyDaysBefore: Number(notifyDays) || 3,
      installmentCount: Number(count) || 1,
      paid: false,
    };
    const next = [...list, item];
    await persist(next);
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
    setTitle("");
    setAmount("");
    setFormOpen(false);
  };

  const markPaid = async (id: string) => {
    const next = list.map((r) => (r.id === id ? { ...r, paid: true } : r));
    setList(next);
    try {
      localStorage.setItem("vamgard_reminders_v1", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    const item = next.find((r) => r.id === id);
    if (item && loadSession().loggedIn) {
      await gatewayFetch("me/reminders", { method: "POST", json: item });
    }
  };

  const remove = async (id: string) => {
    const next = list.filter((r) => r.id !== id);
    setList(next);
    localStorage.setItem("vamgard_reminders_v1", JSON.stringify(next));
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="یادآور اقساط" />
      <main className="flex-1 overflow-y-auto pb-12 no-scrollbar">
        {note && (
          <p className="mx-4 mt-2 rounded-xl border border-line/10 bg-tile/40 px-3 py-2 text-center text-[11px] text-silver">
            {note}
          </p>
        )}

        <Card className="mx-4 mt-3 p-4">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
              <ChevronRight size={18} />
            </button>
            <div className="text-sm font-extrabold">
              {MONTH_NAMES[view.jm - 1]} {fa(view.jy)}
            </div>
            <button type="button" onClick={() => shiftMonth(1)} className="grid h-9 w-9 place-items-center rounded-full bg-tile">
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-silver">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {gridDays.map((d, i) =>
              d == null ? (
                <span key={`e-${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedJd(d)}
                  className={`aspect-square rounded-xl text-xs font-bold transition ${
                    selectedJd === d ? "bg-brand text-white" : "surface text-ink"
                  }`}
                >
                  {fa(d)}
                  {list
                    .filter((r) => r.jy === view.jy && r.jm === view.jm && r.jd === d)
                    .slice(0, 3)
                    .map((r) => (
                      <span
                        key={r.id}
                        className="mx-auto mt-0.5 block h-1 w-1 rounded-full"
                        style={{ background: r.color || "#087bff" }}
                      />
                    ))}
                </button>
              ),
            )}
          </div>
        </Card>

        <div className="mx-4 mt-4 flex items-center justify-between">
          <h2 className="text-sm font-extrabold">
            یادآورهای {fa(selectedJd)} {MONTH_NAMES[view.jm - 1]}
          </h2>
          <button
            type="button"
            onClick={() => setFormOpen((o) => !o)}
            className="flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-[11px] font-bold text-white"
          >
            <Plus size={14} /> جدید
          </button>
        </div>

        {formOpen && (
          <Card className="mx-4 mt-2 space-y-2 p-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان (مثلاً قسط وام مسکن)"
              className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="مبلغ هر قسط (تومان)"
              className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={count}
                onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder="تعداد اقساط"
                className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              />
              <input
                value={intervalDays}
                onChange={(e) => setIntervalDays(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder="هر چند روز"
                className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <input
              value={notifyDays}
              onChange={(e) => setNotifyDays(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="چند روز قبل خبر بدهد"
              className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            />
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                  aria-label="رنگ"
                />
              ))}
            </div>
            <VamButton onClick={addReminder}>ذخیره یادآور</VamButton>
          </Card>
        )}

        <Card className="mx-4 mt-3 divide-y divide-line/10 p-0">
          {loading ? (
            <p className="p-6 text-center text-xs text-silver">در حال بارگذاری…</p>
          ) : dayReminders.length === 0 ? (
            <p className="flex items-center justify-center gap-2 p-6 text-xs text-silver">
              <Bell size={16} /> یادآوری برای این روز نیست
            </p>
          ) : (
            dayReminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0 text-right">
                  <div className="flex items-center justify-end gap-2 text-sm font-bold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color || "#087bff" }} />
                    {r.title}
                  </div>
                  {r.amount > 0 && (
                    <div className="text-[10px] text-silver">{fa(r.amount.toLocaleString("en-US"))} تومان</div>
                  )}
                  <div className="mt-1 text-[10px]">
                    {r.paid ? (
                      <span className="text-emerald-400">پرداخت شده</span>
                    ) : (
                      <span className="text-amber-400">پرداخت نشده</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.paid && (
                    <button
                      type="button"
                      onClick={() => markPaid(r.id)}
                      className="rounded-full bg-brand/15 px-2.5 py-1 text-[10px] font-bold text-brand"
                    >
                      پرداخت کردم
                    </button>
                  )}
                  <button type="button" onClick={() => remove(r.id)} className="text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </Card>
      </main>
    </div>
  );
}
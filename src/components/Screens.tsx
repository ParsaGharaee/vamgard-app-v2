"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import dynamic from "next/dynamic";
import {
  Search, ChevronLeft, ArrowLeft, Check, Star, Send, Clock, X, Sun, Moon,
  TrendingUp, MapPin, Briefcase, Camera,
} from "lucide-react";
import { Ic, Bank, BANKS, type IconKey, type BankKey } from "./assets";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export type Tab = "home" | "services" | "loans" | "group" | "profile";
type P = { go: (t: Tab) => void };
const fa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
const grad = "bg-linear-to-bl from-[#0B3FA8] via-brand to-accent text-white";

/* ---------- shared ---------- */
const Logo = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#087BFF" /><stop offset="1" stopColor="#00CFFF" /></linearGradient></defs>
    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#lg)" strokeWidth="6" strokeDasharray="95 20" strokeLinecap="round" />
    <circle cx="24" cy="24" r="6" fill="#087BFF" />
  </svg>
);

/* انیمیشن لاتی: فایل را از /public/lottie/<name>.json می‌خواند؛ اگر نبود، جایگزین (fallback) نشان می‌دهد */
const lottieCache = new Map<string, object | null>();
function LottieSlot({ name, size, fallback = null, loop = true }: { name: string; size: number; fallback?: ReactNode; loop?: boolean }) {
  const [data, setData] = useState<object | null>(lottieCache.get(name) ?? null);
  useEffect(() => {
    if (lottieCache.has(name)) { setData(lottieCache.get(name) ?? null); return; }
    let on = true;
    fetch(`/lottie/${name}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => { lottieCache.set(name, d); if (on) setData(d); });
    return () => { on = false; };
  }, [name]);
  if (!data) return <>{fallback}</>;
  return <Lottie animationData={data} loop={loop} style={{ width: size, height: size }} />;
}

/* دکمه تم روشن/تاریک (ذخیره در localStorage) */
export function ThemeToggle() {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => { setT(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const v = t === "dark" ? "light" : "dark";
    setT(v);
    document.documentElement.dataset.theme = v;
    try { localStorage.setItem("theme", v); } catch {}
  };
  return (
    <button dir="ltr" onClick={flip} role="switch" aria-checked={t === "dark"} aria-label="تغییر تم"
      className="surface relative h-8 w-[58px] shrink-0 rounded-full">
      <Sun size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-500" />
      <Moon size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-silver" />
      <span className={`absolute left-0.5 top-0.5 grid h-7 w-7 place-items-center rounded-full shadow transition-transform duration-300 ease-out ${t === "dark" ? "translate-x-[26px] bg-brand text-white" : "translate-x-0 bg-white text-amber-500"}`}>
        {t === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}

export default function VamGardLogo({ className = "" }: { className?: string }) {
  return (
    <div
      dir="rtl"
      aria-label="وام‌گرد"
      className={`inline-flex items-center font-vazirmatn text-[24px] font-black leading-none ${className}`}
    >
      <span className="bg-gradient-to-l from-[#21C6B5] via-[#16AFAF] to-[#1688D8] bg-clip-text text-transparent">
        وام
      </span>
      <span className="drak:text-white ">‌گرد</span>
    </div>
  );
}


/* هدر ثابت بالای همه صفحه‌ها */
export function AppHeader() {
  return (
    <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-line/10 bg-bg/80 px-5 pb-3 pt-4 backdrop-blur-xl">
    <div className="flex items-center gap-2">
      <Image src={"/icons/vamgard.png"} width={35} height={35} alt="vamgard" />
      <VamGardLogo/></div>
      <div className="flex items-center gap-3">
        <button aria-label="جستجو"><Search size={26} /></button>
        <ThemeToggle />
      </div>
    </header>
  );
}

/* عنوان بدون باکس سمت راست، دکمه بازگشت سمت چپ */
const TitleBar = ({ title, go }: { title: string; go: P["go"] }) => (
  <div className="mx-5 mt-4 flex items-center justify-between">
    <h1 className="text-xl font-extrabold">{title}</h1>
    <button onClick={() => go("home")} aria-label="بازگشت" className="surface grid h-10 w-10 place-items-center rounded-full text-silver">
      <ChevronLeft size={22} />
    </button>
  </div>
);
const Section = ({ title, link, onLink, icon }: { title: string; link?: string; onLink?: () => void; icon?: ReactNode }) => (
  <div className="mb-3 mt-6 flex items-center justify-between px-5">
    <h2 className="flex items-center gap-2 text-[17px] font-extrabold">{icon ?? <span className="h-2 w-2 rounded-full bg-brand" />}{title}</h2>
    {link && <button onClick={onLink} className="flex items-center gap-1 text-sm font-bold text-brand"><ArrowLeft size={16} />{link}</button>}
  </div>
);
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`surface rounded-3xl ${className}`}>{children}</div>
);
const Avatar = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className="rounded-full bg-[#cfe0f5]">
    <circle cx="20" cy="17" r="8" fill="#e0a982" /><path d="M12 15c0-8 16-8 16 0-3-3-13-3-16 0z" fill="#2b2118" />
    <path d="M13 21c2 9 12 9 14 0-1 6-13 6-14 0z" fill="#2b2118" /><path d="M5 40c2-10 28-10 30 0z" fill="#27415f" />
  </svg>
);

/* ---------- وام‌یار: کارکتر رنگی با چشم‌های دنبال‌کننده ---------- */
export function Mascot({ size = 72 }: { size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const pg = useRef<SVGGElement>(null);

  useEffect(() => {
    let last = 0, px = 0, py = 0, raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const set = (x: number, y: number) => {
      x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10;
      if (x === px && y === py) return;
      px = x; py = y;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { if (pg.current) pg.current.style.transform = `translate(${x * 4}px, ${y * 4}px)`; });
    };
    const aim = (cx: number, cy: number) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 120);
      set((dx / d) * k, (dy / d) * k);
    };
    const onMouse = (e: MouseEvent) => aim(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) aim(t.clientX, t.clientY); };
    const onScroll = (e: Event) => {
      const t = e.target as HTMLElement | Document;
      const y = t instanceof HTMLElement ? t.scrollTop : window.scrollY;
      if (y === last) return;
      set(0, y > last ? 1 : -1);
      last = y;
      clearTimeout(timer);
      timer = setTimeout(() => set(0, 0), 700);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      clearTimeout(timer); cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="mb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#087BFF" /><stop offset="1" stopColor="#00CFFF" /></linearGradient>
      </defs>
      <rect x="11" y="18" width="78" height="68" rx="30" fill="url(#mb)" />
      <ellipse cx="32" cy="27" rx="14" ry="5" fill="#fff" opacity=".25" />
      <rect x="21" y="30" width="58" height="42" rx="21" fill="#060C1B" />
      {[38, 62].map((cx) => <ellipse key={cx} cx={cx} cy="49" rx="9" ry="10" fill="#fff" className="eye-blink" />)}
      <g ref={pg} style={{ transition: "transform .15s ease-out" }}>
        {[38, 62].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="49" r="5" fill="#060C1B" />
            <circle cx={cx - 1.8} cy="46.8" r="1.6" fill="#fff" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- وام‌یار: چت ---------- */
export function VamyarSheet({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([]);
  const qs = ["با شرایط من چه وامی مناسبه؟", "چطور تا ۶ ماه آینده ۳۰۰ میلیون تأمین کنم؟", "اقساط این وام چقدر میشه؟", "بین پس‌انداز و وام کدوم بهتره؟"];
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
          {!msgs.length && qs.map((q) => (
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

/* ---------- کیلومترشمار اعتبارسنجی ---------- */
const GCX = 110, GCY = 102, GR = 76;
const gpt = (t: number, r: number): [number, number] => {
  const a = Math.PI * (1 - t);
  return [GCX + r * Math.cos(a), GCY - r * Math.sin(a)];
};
const SEGS = [["#ef4444", "E3"], ["#f59e0b", "D2"], ["#facc15", "C1"], ["#84cc16", "B1"], ["#22c55e", "A1"]] as const;
const gradeIdx = (v: number) => Math.min(4, Math.floor(v * 5));

export function CreditGauge({ score = 870, onBoost }: { score?: number; onBoost?: () => void }) {
  const [v, setV] = useState(0.5);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const vr = useRef(0.5);
  const raf = useRef(0);

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

  // قبل از اعتبارسنجی: عقربه نرم و تصادفی جابه‌جا می‌شود
  useEffect(() => {
    if (phase !== "idle") return;
    const wander = () => glide(0.08 + Math.random() * 0.86, 1100 + Math.random() * 700);
    wander();
    const t = setInterval(wander, 1900);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = () => {
    if (phase !== "idle") return;
    setPhase("run");
    glide(0, 450, () => glide(score / 1000, 2200, () => setPhase("done")));
  };

  const g = gradeIdx(v);
  const tip = gpt(v, GR - 12);
  const idle = phase === "idle";

  return (
    <Card className="mx-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-right">
          <div className="text-[15px] font-extrabold">{phase === "done" ? "رتبه اعتباری شما" : "رتبه اعتباری خود را بسنج"}</div>
          <p className="mt-1.5 text-xs leading-6 text-silver">
            {phase === "done" ? "با انجام تسک‌ها، رتبه‌ات را بالا ببر و به وام‌های بهتری دسترسی داشته باش." : "با یک اعتبارسنجی سریع، وضعیت اعتبارت را ببین و وام مناسب پیدا کن."}
          </p>
          {phase === "done" ? (
            <button onClick={onBoost} className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">
              <TrendingUp size={16} />افزایش اعتبار
            </button>
          ) : (
            <button onClick={start} disabled={phase === "run"} className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-70">
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
            {idle ? "—" : SEGS[g][1]}
          </div>
          <div className="mt-1 text-sm font-bold text-silver">
            {idle ? "اعتبارسنجی نشده" : fa(Math.round(v * 1000))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Home ---------- */
const banners: { t: string; s: string; b: string; ic: IconKey; lottie?: string; to: Tab }[] = [
  { t: "وام بگیر، آسوده بخر!", s: "تا ۳۰۰ میلیون تومان با اقساط بلندمدت", b: "بررسی شرایط", ic: "coins", to: "loans" },
  { t: "با هم بخر، ارزان‌تر بخر", s: "خرید گروهی لپ‌تاپ و لوازم دیجیتال", b: "شرکت در خرید", ic: "tag", to: "group" },
  { t: "سطح مالی‌ات را بالا ببر", s: "با تکمیل پرسشنامه امتیاز بگیر", b: "شروع کن", ic: "shieldCheck", to: "services" },
  { t: "با وام‌گرد پس‌انداز کن، جایزه ببر!", s: "قرعه‌کشی ماهانه بین ۱۰ نفر از کاربران", b: "شرکت در قرعه‌کشی", ic: "gift", lottie: "gift", to: "home" },
];

const suggested: { a: number; r: string; q: string; bank: BankKey }[] = [
  { a: 300, r: "۳.۷", q: "۸,۰۰۰,۰۰۰", bank: "melli" },
  { a: 150, r: "۴.۲", q: "۴,۵۰۰,۰۰۰", bank: "mellat" },
  { a: 500, r: "۳.۱", q: "۱۳,۲۰۰,۰۰۰", bank: "tejarat" },
];

function BannerSlide({ k, go, onDot }: { k: number; go: P["go"]; onDot?: (k: number) => void }) {
  const b = banners[k];
  return (
    <div className="banner select-none overflow-hidden rounded-[28px] p-5">
      <div className="flex items-center gap-2">
        <div className="flex-1 text-right">
          <div className="text-[17px] font-extrabold leading-7">{b.t}</div>
          <div className="mt-1 text-xs text-ink/80">{b.s}</div>
          <button onClick={() => go(b.to)} className="banner-btn mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold">{b.b}<ArrowLeft size={14} /></button>
        </div>
        <div className="grid h-28 w-28 shrink-0 place-items-center drop-shadow-[0_10px_16px_rgba(0,0,0,.35)]">
          {b.lottie
            ? <LottieSlot name={b.lottie} size={112} fallback={<Ic n={b.ic} size={96} />} />
            : <Ic n={b.ic} size={96} />}
        </div>
      </div>
      <div className="mx-auto mt-1 flex w-fit gap-1.5 rounded-full bg-ink/10 px-2 py-1.5">
        {banners.map((_, j) => <button key={j} onClick={() => onDot?.(j)} aria-label={`بنر ${j + 1}`} className={`h-2 w-2 rounded-full ${j === k ? "bg-brand" : "bg-ink/30"}`} />)}
      </div>
    </div>
  );
}

/* بنرها مثل کارت‌های روی هم: با کشیدن انگشت، کارت به همان سمت پرت می‌شود */
function BannerDeck({ go }: P) {
  const [i, setI] = useState(3);
  const [dx, setDx] = useState(0);
  const [fly, setFly] = useState<0 | 1 | -1>(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const captured = useRef(false);
  const dragRef = useRef(false);
  const busy = useRef(false);
  const n = banners.length;

  const fling = (d: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setFly(d);
    setTimeout(() => { setI((x) => (x + 1) % n); setFly(0); setDx(0); busy.current = false; }, 280);
  };

  useEffect(() => {
    const t = setInterval(() => { if (!dragRef.current) fling(-1); }, 4000);
    return () => clearInterval(t);
  }, []);

  const down = (e: React.PointerEvent) => { startX.current = e.clientX; captured.current = false; dragRef.current = true; setDragging(true); };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current == null || busy.current) return;
    const d = e.clientX - startX.current;
    if (!captured.current && Math.abs(d) > 6) { e.currentTarget.setPointerCapture(e.pointerId); captured.current = true; }
    if (captured.current) setDx(d);
  };
  const up = () => {
    if (startX.current == null) return;
    const d = dx;
    startX.current = null; dragRef.current = false; setDragging(false);
    if (Math.abs(d) > 70) fling(d > 0 ? 1 : -1); else setDx(0);
  };

  const prog = Math.min(1, (fly ? 1 : Math.abs(dx) / 160));
  const front: React.CSSProperties = {
    transform: fly ? `translateX(${fly * 110}%) rotate(${fly * 14}deg)` : `translateX(${dx}px) rotate(${dx / 18}deg)`,
    opacity: fly ? 0 : 1,
    transition: dragging ? "none" : "transform .28s ease-out, opacity .28s ease-out",
    touchAction: "pan-y",
  };

  return (
    <div className="relative mx-4 mt-4">
      <div className="pointer-events-none absolute inset-0" style={{ transform: `translateY(${10 - prog * 10}px) scale(${0.92 + prog * 0.08})`, opacity: 0.6 + prog * 0.4, transition: dragging ? "none" : "all .28s ease-out" }}>
        <BannerSlide k={(i + 1) % n} go={go} />
      </div>
      <div key={i} className="relative" style={front} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <BannerSlide k={i} go={go} onDot={setI} />
      </div>
    </div>
  );
}

export function HomeScreen({ go }: P) {
  const grid: { t: string; ic: IconKey; badge?: number; to: Tab }[] = [
    { t: "استعلام اعتبار", ic: "shieldCheck", to: "services" },
    { t: "پرسشنامه مالی", ic: "shieldNote", to: "services" },
    { t: "استعلام چک", ic: "search", to: "services" },
    { t: "وام‌ها", ic: "bank", to: "loans" },
    { t: "بیمه", ic: "shieldCar", to: "services" },
    { t: "سرمایه گذاری", ic: "chart", to: "services" },
    { t: "خدمات خودرو", ic: "car", to: "services" },
    { t: "نیکوکاری", ic: "heart", to: "services" },
    { t: "تبدیل اقساط", ic: "refresh", to: "services" },
    { t: "خرید گروهی", ic: "users", to: "group" },
    { t: "یادآور اقساط", ic: "bell", badge: 2, to: "services" },
  ];
  return (
    <>
      <button onClick={() => go("profile")} className="surface mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 text-[15px] font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand"><Ic n="wallet2" size={26} /></span>
          سطح مالی من <span className="text-accent">{fa(68)}</span>
        </div>
        <ChevronLeft className="text-silver" />
      </button>

      <BannerDeck go={go} />

      <div className="mt-5 grid grid-cols-4 gap-3 px-4">
        {grid.map(({ t, ic, badge, to }) => (
          <button key={t} onClick={() => go(to)} className="surface relative flex h-[90px] flex-col items-center justify-center gap-1.5 rounded-[22px]">
            {badge != null && <span className="absolute -right-1.5 -top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">{fa(badge)}</span>}
            <Ic n={ic} size={35} className="invert-0 brightness-115" />
            <span className="text-[11.5px] font-bold">{t}</span>
          </button>
        ))}
        <button onClick={() => go("services")} className="surface flex h-[90px] flex-col items-center justify-center gap-2 rounded-[22px]">
          <div className="grid grid-cols-2 gap-1.5">{["bg-brand", "bg-accent", "bg-accent", "bg-brand"].map((c, k) => <span key={k} className={`h-3.5 w-3.5 rounded-full ${c}`} />)}</div>
          <span className="text-[11.5px] font-bold">همه خدمات</span>
        </button>
      </div>

      <Section title="وام‌های پیشنهادی" link="مشاهده همه" onLink={() => go("loans")} />
      <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-5">
        {suggested.map((l) => (
          <div key={l.a} className="surface w-[230px] shrink-0 rounded-3xl p-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Bank k={l.bank} size={40} />
                <div>
                  <div className="text-[15px] font-extrabold">وام {fa(l.a)} میلیون</div>
                  <div className="mt-0.5 text-[10.5px] text-silver">بانک {BANKS[l.bank].n}</div>
                </div>
              </div>
              <span className="rounded-md bg-accent px-1.5 text-[10px] font-bold text-onaccent">تا ٪ {l.r}</span>
            </div>
            <div className="mt-2 text-[11px] text-silver">قسط ماهانه {l.q} تومان</div>
            <button onClick={() => go("loans")} className="mt-2 flex w-full items-center justify-between rounded-xl bg-brand/15 px-3 py-2 text-xs font-bold text-accent">بررسی شرایط وام<ArrowLeft size={16} /></button>
          </div>
        ))}
      </div>

      <Section title="اعتبارسنجی" icon={<Ic n="shieldCheck" size={22} />} />
      <CreditGauge />
      <div className="h-4" />
    </>
  );
}

/* ---------- Services ---------- */
export function ServicesScreen({ go }: P) {
  const list: { t: string; s: string; ic: IconKey }[] = [
    { t: "استعلام اعتبارسنجی", s: "بررسی وضعیت اعتبار شما", ic: "shieldCheck" },
    { t: "پرسشنامه مالی", s: "ارزیابی و بهبود رتبه اعتباری", ic: "shieldNote" },
    { t: "استعلام چک", s: "بررسی وضعیت چک‌های بانکی", ic: "search" },
    { t: "تبدیل شبا و حساب", s: "تبدیل حساب به شبا", ic: "refresh" },
    { t: "سایر استعلام‌ها", s: "استعلام‌های متنوع بانکی", ic: "folder" },
    { t: "ماموریت‌های ارتقای رتبه", s: "تکمیل وظایف و کسب امتیاز", ic: "coins" },
    { t: "یادآور اقساط", s: "دریافت یادآوری هوشمند اقساط", ic: "bell" },
  ];
  return (
    <>
      <TitleBar title="خدمات" go={go} />
      <div className={`mx-4 mt-5 rounded-3xl ${grad} p-6 text-center shadow-lg shadow-brand/30`}>
        <Ic n="shieldCheck" size={56} className="mx-auto mb-2" />
        <div className="text-lg font-extrabold">خدمات مالی و استعلام‌ها</div>
        <p className="mt-1 text-sm text-white/80">همه خدمات مورد نیاز شما در یک جا</p>
      </div>
      <Section title="لیست خدمات" />
      <div className="mx-4 space-y-2">
        {list.map(({ t, s, ic }) => (
          <button key={t} className="surface flex w-full items-center gap-3 rounded-2xl p-3 text-right active:opacity-80">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-tile"><Ic n={ic} size={38} /></div>
            <div className="flex-1"><div className="font-bold">{t}</div><div className="text-xs text-silver">{s}</div></div>
            <ChevronLeft className="text-silver/60" />
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------- Loans ---------- */
const loans: { t: string; bank: BankKey; cat: string; a: number; r: number; n: number; q: string; ok: number }[] = [
  { t: "وام ضروری", bank: "melli", cat: "شخصی", a: 300, r: 23, n: 36, q: "11,800,000", ok: 82 },
  { t: "وام خرید خودرو", bank: "saman", cat: "خودرو", a: 500, r: 18, n: 48, q: "14,900,000", ok: 64 },
  { t: "وام مسکن", bank: "maskan", cat: "مسکن", a: 800, r: 14, n: 60, q: "18,400,000", ok: 48 },
  { t: "وام خرید کالا", bank: "mellat", cat: "کالا", a: 150, r: 20, n: 18, q: "9,600,000", ok: 91 },
  { t: "وام قرض‌الحسنه", bank: "mehr", cat: "شخصی", a: 100, r: 4, n: 24, q: "4,200,000", ok: 75 },
  { t: "وام ازدواج", bank: "saderat", cat: "شخصی", a: 200, r: 4, n: 48, q: "4,600,000", ok: 70 },
  { t: "وام لوازم خانگی", bank: "pasargad", cat: "کالا", a: 100, r: 20, n: 12, q: "9,300,000", ok: 88 },
];
const cats = ["همه", "شخصی", "خودرو", "مسکن", "کالا"];

export function LoansScreen({ go }: P) {
  const [cat, setCat] = useState("همه");
  const [sent, setSent] = useState<string[]>([]);
  const shown = loans.filter((l) => cat === "همه" || l.cat === cat);
  return (
    <>
      <TitleBar title="وام‌ها" go={go} />
      <div className={`mx-4 mt-5 flex items-center justify-between rounded-3xl ${grad} p-5 shadow-lg shadow-brand/30`}>
        <div className="text-right"><div className="text-xl font-extrabold leading-8">وام مناسبت را پیدا کن</div><p className="mt-1 text-xs text-white/85">شرایط و اقساط را مقایسه کن و درخواست بده</p></div>
        <LottieSlot name="coins" size={72} fallback={<Ic n="coins" size={64} />} />
      </div>

      <div className="mt-4 pb-3.5 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${cat === c ? "bg-brand text-white" : "surface text-silver"}`}>{c}</button>
        ))}
      </div>

      <div className="mx-4 mt-4 space-y-3 ">
        {shown.map((l) => {
          const done = sent.includes(l.t);
          return (
            <Card key={l.t} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bank k={l.bank} size={48} />
                  <div className="text-right"><div className="font-bold">{l.t}</div><div className="text-xs text-silver">بانک {BANKS[l.bank].n} · {l.cat}</div></div>
                </div>
                <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-onaccent">٪ {fa(l.r)} سالانه</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-tile/50 p-3 text-center">
                <div><div className="text-[11px] text-silver">مبلغ</div><div className="mt-1 text-sm font-extrabold">{fa(l.a)} میلیون</div></div>
                <div><div className="text-[11px] text-silver">مدت</div><div className="mt-1 text-sm font-extrabold">{fa(l.n)} ماه</div></div>
                <div><div className="text-[11px] text-silver">قسط ماهانه</div><div className="mt-1 text-sm font-extrabold">{fa(l.q)}</div></div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs"><span className="text-silver">احتمال تأیید برای شما</span><span className="font-bold text-accent">٪ {fa(l.ok)}</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-tile"><div style={{ width: `${l.ok}%` }} className="h-full rounded-full bg-linear-to-l from-brand to-accent" /></div>
              <button onClick={() => setSent((s) => (done ? s : [...s, l.t]))} className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold text-white ${done ? "bg-emerald-500" : "bg-brand"}`}>
                {done ? "درخواست ثبت شد ✓" : "بررسی شرایط و درخواست"}
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Group buy ---------- */
const Ring = ({ p, size = 68 }: { p: number; size?: number }) => {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-tile" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(c * p) / 100} ${c}`} className="stroke-brand" />
      </svg>
      <span className="absolute text-sm font-extrabold">٪{fa(p)}</span>
    </div>
  );
};

export function GroupScreen({ go }: P) {
  const [tab, setTab] = useState<"active" | "all">("active");
  const [sent, setSent] = useState(false);
  const perks: { t: string; ic: IconKey }[] = [
    { t: "تخفیف بیشتر", ic: "tag" }, { t: "خرید با دوستان", ic: "users" }, { t: "خرید مطمئن", ic: "shieldCheck" },
  ];
  return (
    <>
      <TitleBar title="خرید گروهی" go={go} />

      <div className={`relative mx-4 mt-4 overflow-hidden rounded-[28px] ${grad} p-5 shadow-lg shadow-brand/30`}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-right">
            <div className="text-lg font-extrabold leading-8">با خرید گروهی،<br />هوشمندتر بخر!</div>
            <p className="mt-1 text-xs text-white/80">با همراهی دیگران، تخفیف بیشتری بگیر</p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-[#0B3FA8]">چطور کار می‌کنه؟<ArrowLeft size={14} /></button>
          </div>
          <LottieSlot name="shopping" size={96} fallback={<Ic n="tag" size={80} />} />
        </div>
      </div>

      <Card className="mx-4 mt-4 p-4">
        <div className="flex items-center gap-3">
          <Ring p={60} />
          <div className="flex-1 text-right">
            <div className="text-[15px] font-extrabold leading-7">تا تخفیف ویژه فقط {fa(4)} نفر دیگه مونده!</div>
            <div className="mt-2 h-2 rounded-full bg-tile"><div className="h-full w-[60%] rounded-full bg-linear-to-l from-brand to-accent" /></div>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-500"><Clock size={14} />زمان باقی‌مانده: {fa(24)} ساعت</div>
          </div>
        </div>
      </Card>

      <Section title="مزایای خرید گروهی" />
      <div className="mx-4 grid grid-cols-3 gap-3">
        {perks.map(({ t, ic }) => (
          <div key={t} className="surface flex flex-col items-center gap-2 rounded-2xl py-4 text-center">
            <Ic n={ic} size={36} />
            <span className="text-[11.5px] font-bold">{t}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setTab("active")} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-full bg-brand py-3 pl-3 pr-6 font-bold text-white shadow-lg shadow-brand/30">
        مشاهده گروه‌های فعال
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><ChevronLeft size={18} /></span>
      </button>

      <div className="mx-4 mt-5 grid grid-cols-2 gap-2 text-sm font-bold">
        <button onClick={() => setTab("active")} className={`rounded-xl py-3 ${tab === "active" ? "bg-brand text-white" : "surface text-silver"}`}>در حال برگزاری</button>
        <button onClick={() => setTab("all")} className={`rounded-xl py-3 ${tab === "all" ? "bg-brand text-white" : "surface text-silver"}`}>تمام‌شده‌ها</button>
      </div>
      {tab === "active" ? (
        <Card className="mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-right"><div className="text-lg font-bold">خرید گروهی لپ‌تاپ</div><div className="text-xs text-silver">{fa(37)} نفر از {fa(50)} نفر</div></div>
            <span className="text-6xl">💻</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-tile"><div className="h-full w-[74%] rounded-full bg-linear-to-l from-brand to-accent" /></div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-500"><Clock size={14} /> {fa(3)} روز دیگر</div>
          <button className="mt-3 w-full rounded-xl bg-tile py-2.5 text-sm font-bold text-accent">مشاهده جزئیات</button>
        </Card>
      ) : (
        <Card className="mx-4 mt-4 flex flex-col items-center p-8 text-center text-sm text-silver">
          <LottieSlot name="empty" size={110} />
          هنوز خرید تمام‌شده‌ای ندارید
        </Card>
      )}

      <Card className="mx-4 mt-4 p-4">
        <h3 className="font-bold">ثبت درخواست جدید</h3>
        <p className="mb-3 mt-1 text-xs text-silver">کالای مورد نظرتان را برای خرید گروهی ثبت کنید</p>
        <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }} className="w-full rounded-xl bg-brand py-3 font-bold text-white">{sent ? "ثبت شد ✓" : "ثبت درخواست"}</button>
      </Card>
      <div className="h-4" />
    </>
  );
}

/* ---------- Profile ---------- */
export function ProfileScreen({ go }: P) {
  const rows: { t: string; s: string; ic: IconKey }[] = [
    { t: "اطلاعات هویتی", s: "نام، کد ملی و تماس", ic: "folder" },
    { t: "اطلاعات شغلی و درآمد", s: "شغل، درآمد و تعهدات", ic: "wallet2" },
    { t: "وضعیت تعهدات مالی", s: "اقساط و بدهی‌های جاری", ic: "calendar" },
    { t: "تاریخچه فعالیت‌ها", s: "استعلام‌ها و درخواست‌ها", ic: "chart2" },
    { t: "اعلان‌ها و یادآوری‌ها", s: "مدیریت اعلان‌های برنامه", ic: "bell" },
    { t: "تنظیمات برنامه", s: "ظاهر، امنیت و زبان", ic: "setting" },
    { t: "راهنما و پشتیبانی", s: "سوالات پرتکرار و تماس", ic: "headset" },
  ];
  return (
    <>
      <TitleBar title="پروفایل" go={go} />

      <Card className="mx-4 mt-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2 text-right">
            <div className="text-lg font-extrabold">علی رضایی <span className="text-accent">✓</span></div>
            <div className="flex items-center gap-2 text-xs text-silver"><MapPin size={15} className="text-brand" />تهران</div>
            <div className="flex items-center gap-2 text-xs text-silver"><Briefcase size={15} className="text-brand" />شغل ثبت نشده</div>
            <div className="text-xs text-silver">{fa("۰۹۱۲ ۳۴۵ ۶۷۸۹")}</div>
          </div>
          <div className="relative shrink-0">
            <div className="grid place-items-center rounded-full p-1 ring-2 ring-brand/30">
              <LottieSlot name="profile-hero" size={96} fallback={<Avatar size={92} />} />
            </div>
            <span className="surface absolute bottom-0 left-0 grid h-8 w-8 place-items-center rounded-full text-brand"><Camera size={15} /></span>
          </div>
        </div>
      </Card>

      <div className={`mx-4 mt-3 flex items-center justify-between rounded-3xl ${grad} p-4 shadow-lg shadow-brand/30`}>
        <div className="text-right"><div className="text-xs text-white/80">سطح مالی شما</div><div className="text-3xl font-extrabold">{fa(68)} <span className="text-xs font-normal">از {fa(100)}</span></div></div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
          <LottieSlot name="level-star" size={44} fallback={<Star className="fill-yellow-400 text-yellow-400" />} />
        </div>
      </div>

      <Section title="اعتبارسنجی" />
      <CreditGauge />

      <Section title="حساب من" />
      <Card className="mx-4 divide-y divide-line/10 px-3">
        {rows.map(({ t, s, ic }) => (
          <button key={t} className="flex w-full items-center gap-3 py-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tile"><Ic n={ic} size={30} /></span>
            <span className="flex-1 text-right"><span className="block text-sm font-bold">{t}</span><span className="block text-[11px] text-silver">{s}</span></span>
            <ChevronLeft size={18} className="text-silver/60" />
          </button>
        ))}
      </Card>
      <div className="h-4" />
    </>
  );
}
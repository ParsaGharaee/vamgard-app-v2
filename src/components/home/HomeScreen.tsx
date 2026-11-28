
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { loadSession, useSessionListener, type AppUser } from "@/src/lib/session";
import { BannerDeck } from "./BannerDeck";
import { quickActions, suggestedLoans } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { Bank, Ic, Section } from "../ui";
import { fa } from "@/src/lib/format";
import { BANKS } from "@/src/lib/constants/banks";
import { CreditGauge } from "../credit/CreditGauge";

const HEADER_COLLAPSE = 88;

// مسیر تصاویر Quick Actions
function getQuickActionIcon(fileName: string): string {
  return `/icons-new/quick-actions/${fileName}.png`;
}

export function HomeScreen({ go }: ScreenProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const blueContentRef = useRef<HTMLDivElement | null>(null);
  const flatCapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
const [user, setUser] = useState<AppUser>({ loggedIn: false });

useEffect(() => {
  const sync = () => setUser(loadSession());
  sync();
  return useSessionListener(sync);
}, []);

const hasCreditScore = Boolean(user.loggedIn && typeof user.creditScore === "number");
const financialLevel = hasCreditScore ? Math.round(((user.creditScore ?? 0) / 900) * 100) : null;

  useEffect(() => {
    const wrap = wrapRef.current;
    const scroller = wrap?.closest("main");
    const blueContent = blueContentRef.current;
    const flatCap = flatCapRef.current;

    if (!wrap || !scroller || !blueContent || !flatCap) return;

    let rafId = 0;
    let startY = 0;
    let startTime = 0;

    const update = () => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const y = scroller.scrollTop;
        const p = Math.min(1, Math.max(0, y / HEADER_COLLAPSE));

        blueContent.style.opacity = String(1 - p * 0.9);

        const capOpacity = Math.min(
          1,
          Math.max(0, (y - 44) / 40)
        );

        flatCap.style.opacity = String(capOpacity);
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = performance.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const y = scroller.scrollTop;

      if (y <= 2 || y >= HEADER_COLLAPSE) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const dt = Math.max(1, performance.now() - startTime);
      const velocity = Math.abs(deltaY) / dt;

      if (velocity >= 0.75) return;

      if (deltaY > 6) {
        scroller.scrollTo({
          top: HEADER_COLLAPSE,
          behavior: "smooth",
        });
      } else if (deltaY < -6) {
        scroller.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    update();

    scroller.addEventListener("scroll", update, {
      passive: true,
    });

    scroller.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });

    scroller.addEventListener("touchend", onTouchEnd, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(rafId);

      scroller.removeEventListener("scroll", update);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">

      {/* بخش آبی بالایی */}
      <div className="sticky top-0 z-0 bg-brand px-4 pt-4 pb-11 text-white">
  <div
    ref={blueContentRef}
    className="flex items-center justify-between gap-3 will-change-[opacity]"
  >
    <div>
      <div className="text-xs font-medium text-white/80">سطح مالی من</div>
      {financialLevel !== null ? (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-black">{fa(financialLevel)}</span>
          <span className="text-xs text-white/80">از {fa(100)}</span>
        </div>
      ) : (
        <div className="mt-1 text-xs font-bold text-white/95">
          با اعتبارسنجی بانکی فعال می‌شود
        </div>
      )}
    </div>

    <button
    onClick={() => router.push(financialLevel !== null ? "/profile/credit" : "/services/credit-assessment")}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/20 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm transition active:scale-95"
    >
      <span>{financialLevel !== null ? "جزئیات امتیاز" : "اعتبارسنجی کن"}</span>
      <ChevronLeft size={16} />
    </button>
  </div>
</div>
      {/* بدنه اصلی */}
      <div className="relative z-10 -mt-6 rounded-t-[28px] bg-bg pt-5">

        {/* لایه صاف‌کننده گوشه‌ها */}
        <div
          ref={flatCapRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-bg opacity-0 will-change-[opacity]"
        />

        {/* Quick Actions */}
        <div className="relative z-10 grid grid-cols-4 gap-3 px-4">

          {quickActions.map(({ t, ic, badge, to }) => (
            <button
              key={t}
              onClick={() => (String(to).startsWith("/") ? router.push(String(to)) : go(to))}
              className="surface relative flex aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-[10px] px-1.5 transition-all duration-200 active:scale-[0.96]"
            >

              {/* نشان اعلان */}
              {badge != null && (
                <span className="absolute -right-1 -top-1 z-10 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {fa(badge)}
                </span>
              )}

              {/* تصویر اختصاصی Quick Action */}
              <div className="relative grid h-10 w-10 shrink-0 place-items-center">
                <Image
                  src={getQuickActionIcon(ic)}
                  alt={t}
                  width={40}
                  height={40}
                  sizes="40px"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* عنوان */}
              <span className="w-full text-center text-[10.5px] font-bold leading-4">
                {t}
              </span>

            </button>
          ))}

          {/* همه خدمات */}
          <button
            onClick={() => go("services")}
            className="surface flex aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-[10px] px-1.5 transition-all duration-200 active:scale-[0.96]"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {["bg-brand", "bg-accent", "bg-accent", "bg-brand"].map(
                (c, k) => (
                  <span
                    key={k}
                    className={`h-3.5 w-3.5 rounded-[4px] ${c}`}
                  />
                )
              )}
            </div>

            <span className="text-center text-[10.5px] font-bold leading-4">
              همه خدمات
            </span>
          </button>

        </div>

        {/* بنرها */}
        <BannerDeck go={go} />

        {/* وام‌های پیشنهادی */}
        <Section
          title="وام‌های پیشنهادی"
          link="مشاهده همه"
          onLink={() => go("loans")}
        />

        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-5">
          {suggestedLoans.map((l) => (
            <div
              key={l.a}
              className="surface w-[230px] shrink-0 rounded-3xl p-3.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <Bank k={l.bank} size={40} />

                  <div>
                    <div className="text-[15px] font-extrabold">
                      وام {fa(l.a)} میلیون
                    </div>

                    <div className="mt-0.5 text-[10.5px] text-silver">
                      بانک {BANKS[l.bank].n}
                    </div>
                  </div>
                </div>

                <span className="rounded-md bg-accent px-1.5 text-[10px] font-bold text-onaccent">
                  تا ٪ {l.r}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-silver">
                قسط ماهانه {l.q} تومان
              </div>

              <button
                onClick={() => go("loans")}
                className="mt-2 flex w-full items-center justify-between rounded-xl bg-brand/15 px-3 py-2 text-xs font-bold text-accent"
              >
                بررسی شرایط وام
                <ArrowLeft size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* اعتبارسنجی */}
        <Section
          title="اعتبارسنجی"
          icon={<Ic n="shieldCheck" size={22} />}
        />

        <CreditGauge />

        <div className="h-4" />

      </div>
    </div>
  );
}

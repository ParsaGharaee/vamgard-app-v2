"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, ChevronLeft, MapPin, Star } from "lucide-react";

import { accountMenu } from "./data";
import { ProfileAvatar } from "./ProfileAvatar";
import type { ScreenProps } from "@/src/types/navigation";
import type { AppUser } from "@/src/lib/session";

import { TitleBar } from "../layout/TitleBar";
import { Card, Ic, LottieSlot, Section } from "../ui";
import { ComingSoonBadge } from "../ui/ComingSoon";
import { CreditGauge } from "../credit/CreditGauge";
import { MobileInput, isValidMobile } from "@/src/components/services/shared/inputs/MobileInput";
import { OtpInput } from "@/src/components/services/shared/inputs/OtpInput";
import { VamButton } from "@/src/components/services/shared";

import { fa } from "@/src/lib/format";
import { brandGradient } from "@/src/lib/styles";
import {
  clearSession,
  loadSession,
  saveSession,
  useSessionListener,
} from "@/src/lib/session";
import { LoginSheet } from "../auth/LoginSheet";

type OtpPhase = "idle" | "sending" | "code" | "verifying";

export function ProfileScreen({ go, active = true }: ScreenProps) {
  const [user, setUser] = useState<AppUser>({ loggedIn: false });

  const [loginOpen, setLoginOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpPhase, setOtpPhase] = useState<OtpPhase>("idle");
  const [otpError, setOtpError] = useState<string>();
  const [loginNote, setLoginNote] = useState<string>();

  useEffect(() => {
    const syncSession = () => setUser(loadSession());
    syncSession();
    return useSessionListener(syncSession);
  }, []);

  const displayName = user.name || (user.loggedIn ? "کاربر وام‌گرد" : "پروفایل شما");
  const mobileLabel = user.mobile ? fa(user.mobile) : "برای ادامه وارد شوید";

  const hasCreditScore = Boolean(user.loggedIn && typeof user.creditScore === "number");
  const level = hasCreditScore ? Math.round(((user.creditScore ?? 0) / 900) * 100) : null;

  const sendOtp = async () => {
    if (name.trim().length < 3 || !isValidMobile(mobile)) {
      setOtpError("نام و نام خانوادگی (حداقل ۳ حرف) و شماره موبایل معتبر وارد کنید.");
      return;
    }
    setOtpError(undefined);
    setOtpPhase("sending");
    await new Promise((r) => setTimeout(r, 600));
    setOtpPhase("code");
    setLoginNote("کد تأیید پیامک شد (در نسخه MVP هر کد ۵ رقمی مثل ۱۲۳۴۵ معتبر است).");
  };

  const verifyOtp = async (code: string) => {
    if (code.length < 5) return;
    setOtpPhase("verifying");
    setOtpError(undefined);
    await new Promise((r) => setTimeout(r, 600));

    const prev = loadSession();
    const next: AppUser = {
      ...prev,
      loggedIn: true,
      name: name.trim(),
      mobile,
    };
    saveSession(next);
    setUser(next);
    setLoginOpen(false);
    setOtpPhase("idle");
    setLoginNote(undefined);
  };

  const handleLogout = () => {
    clearSession();
    setUser({ loggedIn: false });
    setLoginOpen(false);
    setName("");
    setMobile("");
    setOtpPhase("idle");
  };

  return (
    <>
      <TitleBar title="پروفایل" go={go} />

      <div
        dir="ltr"
        className="relative mx-3 mt-4 flex min-h-[180px] items-center gap-4 overflow-hidden rounded-[26px] px-4 py-4 surface"
      >
        <ProfileAvatar active={active} className="shrink-0" />

        <div dir="rtl" className="min-w-0 flex-1 text-right">
          <h2 className="text-[15px] font-extrabold leading-7">
            {displayName}
            {user.loggedIn && <span className="mr-1 text-sky-400">✓</span>}
          </h2>

          <div className="mt-2.5 flex flex-col items-start gap-1.5 text-[11px]">
            <span>{mobileLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => (user.loggedIn ? handleLogout() : setLoginOpen((o) => !o))}
            className={`mt-3 rounded-full px-5 py-2 text-xs font-extrabold text-white transition-all active:scale-95 ${
              user.loggedIn ? "bg-red-500 hover:bg-red-600" : "bg-[#087BFA] hover:bg-[#1688FF]"
            }`}
          >
            {user.loggedIn ? "خروج از حساب" : "ورود با موبایل"}
          </button>
        </div>
      </div>

      {loginOpen && !user.loggedIn && (
        <Card className="mx-4 mt-3 space-y-3 p-4 animate-in fade-in">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام و نام خانوادگی"
            className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
          />
          <MobileInput value={mobile} onChange={setMobile} showErrors={otpPhase !== "idle"} />
          {otpPhase === "code" || otpPhase === "verifying" ? (
            <OtpInput
              length={4}
              onComplete={verifyOtp}
              error={otpError}
              loading={otpPhase === "verifying"}
            />
          ) : (
            <VamButton loading={otpPhase === "sending"} onClick={sendOtp}>
              ارسال کد تأیید
            </VamButton>
          )}
          {loginNote && <p className="text-center text-[11px] text-brand">{loginNote}</p>}
          {otpError && otpPhase !== "code" && (
            <p className="text-center text-[11px] text-red-400">{otpError}</p>
          )}
        </Card>
      )}

      {/* کارت سطح مالی: فقط پس از اعتبارسنجی عدد واقعی نشان می‌دهد */}
      <div
        className={`mx-4 mt-3 flex items-center justify-between rounded-[24px] ${brandGradient} p-4 shadow-lg shadow-brand/20`}
      >
        <div className="text-right text-white">
          <div className="text-xs text-white/80">سطح مالی شما</div>
          {level !== null ? (
            <div className="mt-1 text-3xl font-extrabold">
              {fa(level)}
              <span className="mr-1 text-xs font-normal text-white/80">از {fa(100)}</span>
            </div>
          ) : (
            <div className="mt-1.5 text-xs font-bold leading-5 text-white/95">
              با انجام اعتبارسنجی بانکی، سطح مالی و شانس دریافت وام شما محاسبه می‌شود.
            </div>
          )}
        </div>

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15">
          <LottieSlot
            name="level-star"
            size={42}
            play={active}
            fallback={<Star size={26} className="fill-yellow-400 text-yellow-400" />}
          />
        </div>
      </div>

      <Section title="اعتبارسنجی" />

      <CreditGauge filled={hasCreditScore} />

      <Section title="حساب من" />

      <Card className="mx-4 divide-y divide-line/10 px-3">
        {accountMenu.map(({ t, s, ic, image, href, soon }) => (
          <Link
            key={t}
            href={soon ? "#" : href}
            onClick={(event) => {
              if (soon) event.preventDefault();
            }}
            className={`flex w-full items-center gap-3 py-3.5 transition-all ${
              soon ? "opacity-60" : "active:opacity-70"
            }`}
          >
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-tile">
              {image ? (
                <Image
                  src={image}
                  alt={t}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] object-contain"
                />
              ) : (
                <Ic n={ic} size={27} />
              )}
            </span>

            <span className="min-w-0 flex-1 text-right">
              <span className="flex items-center gap-2 text-sm font-bold">
                {t}
                {soon && <ComingSoonBadge />}
              </span>
              <span className="mt-0.5 block text-[11px] text-silver">{s}</span>
            </span>

            <ChevronLeft size={18} className="shrink-0 text-silver/60" />
          </Link>
        ))}
      </Card>
<LoginSheet
  open={loginOpen}
  onClose={() => setLoginOpen(false)}
  onSuccess={(u) => setUser(u)}
/>
      <div className="h-4" />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  MapPin,
  Star,
} from "lucide-react";

import { accountMenu } from "./data";
import { ProfileAvatar } from "./ProfileAvatar";

import type { ScreenProps } from "@/src/types/navigation";
import type { AppUser } from "@/src/lib/session";

import { TitleBar } from "../layout/TitleBar";
import { Card, Ic, LottieSlot, Section } from "../ui";
import { ComingSoonBadge } from "../ui/ComingSoon";
import { CreditGauge } from "../credit/CreditGauge";

import { fa } from "@/src/lib/format";
import { brandGradient } from "@/src/lib/styles";

import {
  loadSession,
  saveSession,
  useSessionListener,
} from "@/src/lib/session";
import Image from "next/image";

const DEMO_USER: AppUser = {
  loggedIn: true,
  name: "علی رضایی",
  city: "تهران",
  job: "کارمند",
  mobile: "09129496396",
  creditScore: 720,
  creditGrade: "A2",
};

export function ProfileScreen({
  go,
  active = true,
}: ScreenProps) {
  const [user, setUser] = useState<AppUser>({
    loggedIn: false,
  });

  // Sync Session
  useEffect(() => {
    const syncSession = () => {
      setUser(loadSession());
    };

    syncSession();

    return useSessionListener(syncSession);
  }, []);

  // User Information
  const name =
    user.name ||
    (user.loggedIn ? "کاربر وام‌گرد" : "پروفایل شما");

  const city = user.city || "شهر ثبت نشده";
  const job = user.job || "شغل ثبت نشده";

  const mobile = user.mobile
    ? fa(user.mobile)
    : "برای ادامه وارد شوید";

  const level = user.creditScore
    ? Math.round((user.creditScore / 900) * 100)
    : 68;

  // Login
  const handleLogin = () => {
    saveSession(DEMO_USER);
  };

  // Logout
  const handleLogout = () => {
    saveSession({
      loggedIn: false,
    });
  };

  const handleAuth = () => {
    if (user.loggedIn) {
      handleLogout();
    } else {
      handleLogin();
    }
  };

  return (
    <>
      <TitleBar title="پروفایل" go={go} />

      {/* Profile Hero */}
      <div
        dir="ltr"
        className="
          relative mx-3 mt-4
          flex min-h-[180px] items-center
          gap-4 overflow-hidden
          rounded-[26px]
          px-4 py-4 surface
        "
      >
        {/* Avatar */}
        <ProfileAvatar
          active={active}
          className="shrink-0"
        />

        {/* User Information */}
        <div
          dir="rtl"
          className="min-w-0 flex-1 text-right"
        >
          <h2 className="
            text-[15px] font-extrabold
            leading-7
          ">
            {name}

            {user.loggedIn && (
              <span className="mr-1 text-sky-400">
                ✓
              </span>
            )}
          </h2>

          <div className="
            mt-2.5 flex flex-col
            items-start gap-1.5
            text-[11px]
          ">
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                size={14}
                className="text-sky-400"
              />
              {city}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Briefcase
                size={14}
                className="text-sky-400"
              />
              {job}
            </span>

            <span>{mobile}</span>
          </div>

          {/* Login / Logout */}
          <button
            type="button"
            onClick={handleAuth}
            className={`
              mt-3 rounded-full
              px-5 py-2
              text-xs font-extrabold text-white
              transition-all
              active:scale-95
              ${
                user.loggedIn
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#087BFA] hover:bg-[#1688FF]"
              }
            `}
          >
            {user.loggedIn ? "خروج از حساب" : "ورود"}
          </button>
        </div>
      </div>

      {/* Financial Level */}
      <div
        className={`
          mx-4 mt-3 flex items-center
          justify-between rounded-[24px]
          ${brandGradient}
          p-4 shadow-lg shadow-brand/20
        `}
      >
        <div className="text-right text-white">
          <div className="text-xs text-white/80">
            سطح مالی شما
          </div>

          <div className="mt-1 text-3xl font-extrabold">
            {fa(level)}

            <span className="mr-1 text-xs font-normal text-white/80">
              از {fa(100)}
            </span>
          </div>
        </div>

        <div className="
          grid h-12 w-12 shrink-0
          place-items-center rounded-full
          bg-white/15
        ">
          <LottieSlot
            name="level-star"
            size={42}
            play={active}
            fallback={
              <Star
                size={26}
                className="fill-yellow-400 text-yellow-400"
              />
            }
          />
        </div>
      </div>

      {/* Credit Assessment */}
      <Section title="اعتبارسنجی" />

      <CreditGauge href="/services/credit-assessment-report" />

      
{/* Account Menu */}
<Section title="حساب من" />

<Card className="mx-4 divide-y divide-line/10 px-3">
  {accountMenu.map(({ t, s, ic, image, href, soon }) => (
    <Link
      key={t}
      href={soon ? "#" : href}
      onClick={(event) => {
        if (soon) event.preventDefault();
      }}
      className={`
        flex w-full items-center gap-3
        py-3.5 transition-all
        ${soon ? "opacity-60" : "active:opacity-70"}
      `}
    >
      {/* Icon */}
      <span className="
        relative grid h-12 w-12 shrink-0
        place-items-center
        rounded-xl bg-tile
      ">
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

      {/* Information */}
      <span className="min-w-0 flex-1 text-right">
        <span className="flex items-center gap-2 text-sm font-bold">
          {t}

          {soon && <ComingSoonBadge />}
        </span>

        <span className="mt-0.5 block text-[11px] text-silver">
          {s}
        </span>
      </span>

      {/* Arrow */}
      <ChevronLeft
        size={18}
        className="shrink-0 text-silver/60"
      />
    </Link>
  ))}
</Card>


      <div className="h-4" />
    </>
  );
}

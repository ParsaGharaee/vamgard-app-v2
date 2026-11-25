"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Sparkles } from "lucide-react";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { CreditGauge } from "./CreditGauge";
import { gatewayFetch } from "@/src/lib/gateway/client";
import { fa } from "@/src/lib/format";
import { gradeFromScore, loadSession, saveSession, type AppUser } from "@/src/lib/session";

const TIPS = [
  "پرداخت به‌موقع اقساط، بیشترین اثر را روی رتبه دارد.",
  "قبل از درخواست وام جدید، تعهدات جاری را تسویه کنید.",
  "ماهانه یک بار اعتبارسنجی، پیشنهاد وام را دقیق‌تر می‌کند.",
];

export function CreditProfileScreen() {
  const [user, setUser] = useState<AppUser>({ loggedIn: false });
  const [rechecking, setRechecking] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setUser(loadSession());
  }, []);

  const recheck = async () => {
    if (!user.loggedIn) {
      setNote("برای بروزرسانی رتبه، ابتدا وارد حساب شوید.");
      return;
    }
    setRechecking(true);
    setNote(null);
    const me = await gatewayFetch<{
      ok?: boolean;
      hasScore?: boolean;
      score?: number;
      ratingLabel?: string;
      improveTips?: string[];
    }>("me/credit");

    if (me.ok && typeof me.data.score === "number") {
      const grade = me.data.ratingLabel || gradeFromScore(me.data.score);
      const next = { ...user, creditScore: me.data.score, creditGrade: grade, loggedIn: true };
      saveSession(next);
      setUser(next);
      setRechecking(false);
      setNote("آخرین رتبه از حساب شما بارگذاری شد.");
      return;
    }

    const start = await gatewayFetch<{
      ok?: boolean;
      score?: number;
      ratingLabel?: string;
      needPayment?: boolean;
      message?: string;
    }>("me/credit/start", {
      method: "POST",
      json: {
        nationalCode: user.nationalCode || "",
        mobile: user.mobile || "",
        fullName: user.name || "",
      },
    });
    setRechecking(false);

    if (start.ok && typeof start.data.score === "number") {
      const grade = start.data.ratingLabel || gradeFromScore(start.data.score);
      const next = { ...user, creditScore: start.data.score, creditGrade: grade, loggedIn: true };
      saveSession(next);
      setUser(next);
      setNote("اعتبارسنجی انجام شد.");
    } else if (start.data.needPayment) {
      setNote(start.message || "موجودی کافی نیست؛ از کیف پول شارژ کنید یا پرداخت مستقیم انجام دهید.");
    } else {
      setNote(start.error || me.error || "اعتبارسنجی الان در دسترس نیست.");
    }
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="اعتبارسنجی بانکی" />
      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <CreditGauge filled={!!user.loggedIn && !!user.creditScore} href="/profile/credit" />

        <Card className="mx-4 mt-4 space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Sparkles size={18} className="text-brand" />
            نکات بهبود اعتبار
          </div>
          <ul className="space-y-2 text-xs leading-6 text-silver">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-brand">•</span>
                {t}
              </li>
            ))}
          </ul>
          {user.creditScore != null && (
            <p className="rounded-xl bg-tile/50 p-3 text-center text-sm">
              آخرین امتیاز:{" "}
              <span className="font-extrabold text-brand">{fa(user.creditScore)}</span>
              {user.creditGrade ? ` (${user.creditGrade})` : ""}
            </p>
          )}
          <VamButton onClick={recheck} loading={rechecking}>
            <RefreshCcw size={18} />
            بررسی مجدد
          </VamButton>
          {note && <p className="text-center text-[11px] text-silver">{note}</p>}
        </Card>
      </main>
    </div>
  );
}
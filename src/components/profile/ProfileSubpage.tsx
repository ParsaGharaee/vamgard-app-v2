"use client";
import { useEffect, useState } from "react";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { NationalCodeInput, isValidNationalCode } from "@/src/components/services/shared/inputs/NationalCodeInput";
import { loadSession, saveSession, type AppUser } from "@/src/lib/session";
import { WalletScreen } from "@/src/components/wallet/WalletScreen";
import { CreditProfileScreen } from "@/src/components/credit/CreditProfileScreen";
import { gatewayFetch } from "@/src/lib/gateway/client";

const TITLES: Record<string, string> = {
  personal: "اطلاعات شخصی",
  wallet: "کیف پول",
  credit: "اعتبارسنجی",
  history: "تاریخچه فعالیت‌ها",
  support: "راهنما و پشتیبانی",
};

const FAQ = [
  { q: "چطور کیف پول را شارژ کنم؟", a: "از منوی کیف پول، مبلغ (حداقل ۱۰۰ هزار تومان) را وارد و پرداخت کنید." },
  { q: "هزینه استعلام‌ها چقدر است؟", a: "قیمت هر سرویس قبل از پرداخت روی صفحه سرویس نمایش داده می‌شود." },
  { q: "کد تأیید نمی‌رسد؟", a: "شماره موبایل را بررسی کنید و دوباره از تب پروفایل درخواست کد دهید." },
];

export function ProfileSubpage({ section }: { section: string }) {
  if (section === "wallet") return <WalletScreen />;
  if (section === "credit") return <CreditProfileScreen />;

  const [user, setUser] = useState<AppUser>({ loggedIn: false });
  const [showErrors, setShowErrors] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ticketBody, setTicketBody] = useState("");
  const [ticketMsg, setTicketMsg] = useState<string | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setUser(s);
    if (s.loggedIn && s.sessionToken) {
      gatewayFetch<{
        name?: string;
        city?: string;
        job?: string;
        nationalCode?: string;
        mobile?: string;
        user?: { name?: string; city?: string; job?: string; nationalCode?: string; mobile?: string };
      }>("me/profile").then((res) => {
        if (res.ok) {
          const u = res.data.user ?? res.data;
          setUser((prev) => ({
            ...prev,
            name: u.name ?? prev.name,
            city: u.city ?? prev.city,
            job: u.job ?? prev.job,
            nationalCode: u.nationalCode ?? prev.nationalCode,
            mobile: u.mobile ?? prev.mobile,
          }));
        }
      });
    }
  }, []);

  const title = TITLES[section] || "پروفایل";

  const savePersonal = async () => {
    setShowErrors(true);
    if (!user.name?.trim()) return;
    if (user.nationalCode && !isValidNationalCode(user.nationalCode)) return;

    const next = { ...user, loggedIn: user.loggedIn };
    saveSession(next);

    const res = await gatewayFetch("me/profile", {
      method: "PUT",
      json: {
        name: next.name,
        city: next.city,
        job: next.job,
        nationalCode: next.nationalCode,
      },
    });

    setSaved(true);
    if (!res.ok) {
      setTicketMsg(res.error || "ذخیره محلی انجام شد؛ همگام‌سازی با سرور بعداً تکرار می‌شود.");
    }
    setTimeout(() => setSaved(false), 2000);
  };

  if (section === "personal") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <Field label="نام و نام خانوادگی" value={user.name || ""} onChange={(v) => setUser({ ...user, name: v })} />
          <Field label="شهر" value={user.city || ""} onChange={(v) => setUser({ ...user, city: v })} />
          <Field label="شغل" value={user.job || ""} onChange={(v) => setUser({ ...user, job: v })} />
          <div>
            <label className="mb-1 block text-[11px] text-silver">موبایل</label>
            <input
              value={user.mobile || ""}
              readOnly
              className="surface w-full cursor-not-allowed rounded-xl px-3 py-2.5 text-sm opacity-70 outline-none"
            />
            <p className="mt-1 text-[10px] text-silver">شماره موبایل پس از ورود OTP قابل تغییر نیست.</p>
          </div>
          <NationalCodeInput
            value={user.nationalCode || ""}
            onChange={(v) => setUser({ ...user, nationalCode: v })}
            showErrors={showErrors}
          />
          <VamButton onClick={savePersonal}>{saved ? "ذخیره شد ✓" : "ذخیره"}</VamButton>
          {ticketMsg && <p className="text-center text-[11px] text-silver">{ticketMsg}</p>}
        </Card>
      </Shell>
    );
  }

  if (section === "support") {
    const submitTicket = async () => {
      if (!ticketBody.trim()) return;
      setTicketLoading(true);
      const res = await gatewayFetch("support/ticket", {
        method: "POST",
        json: { message: ticketBody.trim(), subject: "اپ موبایل" },
      });
      setTicketLoading(false);
      setTicketMsg(
        res.ok ? "تیکت ثبت شد. به‌زودی پاسخ می‌دهیم." : res.error || "ثبت تیکت ممکن نیست؛ بعداً دوباره تلاش کنید.",
      );
      if (res.ok) setTicketBody("");
    };

    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <div className="text-sm font-extrabold">سوالات پرتکرار</div>
          {FAQ.map((item) => (
            <details key={item.q} className="rounded-xl border border-line/10 bg-tile/30 px-3 py-2">
              <summary className="cursor-pointer text-xs font-bold">{item.q}</summary>
              <p className="mt-2 text-[11px] leading-6 text-silver">{item.a}</p>
            </details>
          ))}
        </Card>
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <div className="text-sm font-extrabold">ثبت تیکت</div>
          <textarea
            value={ticketBody}
            onChange={(e) => setTicketBody(e.target.value)}
            rows={4}
            className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            placeholder="مشکل یا سوال خود را بنویسید…"
          />
          <VamButton loading={ticketLoading} onClick={submitTicket}>
            ارسال تیکت
          </VamButton>
          {ticketMsg && <p className="text-center text-[11px] text-silver">{ticketMsg}</p>}
        </Card>
      </Shell>
    );
  }

  if (section === "history") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 p-6 text-center text-sm text-silver">
          تاریخچه استعلام‌ها و پرداخت‌ها به‌زودی از سرور همگام می‌شود.
          <p className="mt-2 text-[11px]">فعلاً پس از هر سرویس، نتیجه را با «خروجی نتیجه» ذخیره کنید.</p>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell title={title}>
      <Card className="mx-4 mt-4 p-8 text-center text-sm text-silver">
        این بخش در دسترس نیست.
      </Card>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title={title} />
      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">{children}</main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] text-silver">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ExternalLink,
  History,
  Lock,
  PhoneCall,
  Send,
  Sparkles,
  Ticket,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "@/src/components/services/shared/inputs/NationalCodeInput";
import { ResultExport } from "@/src/components/pay/ResultExport";
import { loadSession, saveSession, type AppUser } from "@/src/lib/session";
import { WalletScreen } from "@/src/components/wallet/WalletScreen";
import { CreditProfileScreen } from "@/src/components/credit/CreditProfileScreen";
import {
  addTicket,
  loadServiceHistory,
  loadTickets,
  type ServiceHistoryItem,
  type SupportTicket,
} from "@/src/lib/historyStore";
import { fa } from "@/src/lib/format";

const TITLES: Record<string, string> = {
  personal: "اطلاعات شخصی",
  wallet: "کیف پول",
  credit: "اعتبارسنجی بانکی",
  history: "تاریخچه فعالیت‌ها",
  support: "راهنما و پشتیبانی",
};

const FAQ = [
  {
    q: "چطور کیف پول را شارژ کنم؟",
    a: "از تب کیف پول، مبلغ مورد نظر (حداقل ۱۰۰ هزار تومان) را انتخاب یا وارد کنید و با پرداخت آنلاین موجودی خود را افزایش دهید.",
  },
  {
    q: "هزینه استعلام‌ها چگونه پرداخت می‌شود؟",
    a: "قیمت هر سرویس بالای دکمه استعلام نمایش داده می‌شود. اگر موجودی کیف پول کافی باشد مستقیم کسر می‌شود؛ در غیر این صورت می‌توانید بین پرداخت مستقیم یا شارژ کیف پول انتخاب کنید.",
  },
  {
    q: "چرا شماره موبایل در اطلاعات شخصی قابل تغییر نیست؟",
    a: "شماره موبایل به عنوان شناسه احراز هویت OTP و تطبیق شاهکار حساب شما ثبت شده است و برای حفظ امنیت تغییر نمی‌کند.",
  },
  {
    q: "اعتبارسنجی بانکی چه کاربردی دارد؟",
    a: "با اعتبارسنجی بانکی، رتبه اعتباری، سطح مالی و درصد شانس دریافت هر وام در وامگرد به صورت دقیق برای شما محاسبه می‌شود.",
  },
  {
    q: "آیا می‌توانم فایل PDF یا تصویر نتیجه استعلام را دانلود کنم؟",
    a: "بله؛ در پایین صفحه نتیجه تمام استعلام‌ها و همچنین از بخش تاریخچه، امکان دانلود PDF و تصویر وجود دارد.",
  },
];

const SUPPORT_PHONE = "02191004567";

export function ProfileSubpage({ section }: { section: string }) {
  if (section === "wallet") return <WalletScreen />;
  if (section === "credit") return <CreditProfileScreen />;

  const [user, setUser] = useState<AppUser>({ loggedIn: false });
  const [showErrors, setShowErrors] = useState(false);
  const [saved, setSaved] = useState(false);

  // تاریخچه
  const [historyItems, setHistoryItems] = useState<ServiceHistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ServiceHistoryItem | null>(null);

  // پشتیبانی و تیکت
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketMsg, setTicketMsg] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    setUser(loadSession());
    setHistoryItems(loadServiceHistory());
    setTickets(loadTickets());
  }, []);

  const title = TITLES[section] || "پروفایل";

  // ۱. اطلاعات شخصی با ولیدیشن کامل
  if (section === "personal") {
    const nameValid = !user.name?.trim() || user.name.trim().length >= 3;
    const cityValid = !user.city?.trim() || user.city.trim().length >= 2;
    const jobValid = !user.job?.trim() || user.job.trim().length >= 2;
    const nidValid = !user.nationalCode || isValidNationalCode(user.nationalCode);

    const savePersonal = () => {
      setShowErrors(true);
      if (!nameValid || !cityValid || !jobValid || !nidValid) return;

      saveSession({ ...user });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    return (
      <Shell title={title}>
        {/* نکته کاربردی درباره اختیاری بودن و پر کردن خودکار خدمات */}
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/10 p-4 text-right">
          <Sparkles size={20} className="mt-0.5 shrink-0 text-brand" />
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-ink">
              تکمیل اطلاعات اختیاری است، اما کارتان را خیلی سریع‌تر می‌کند!
            </div>
            <p className="text-[11px] leading-6 text-silver">
              به‌جز شماره موبایل، تکمیل سایر فیلدها کاملاً اختیاری است. با ثبت یک‌باره این مشخصات، هنگام استفاده از خدمات و استعلام‌های بانکی دیگر نیازی به تایپ مجدد ندارید و با یک لمس روی دکمه{" "}
              <span className="font-bold text-brand">«پر کردن با اطلاعات خودم»</span>{" "}
              فرم‌ها به‌صورت خودکار پر می‌شوند.
            </p>
          </div>
        </div>

        <Card className="mx-4 mt-3 space-y-4 p-4">
          <ValidatedField
            label="نام و نام خانوادگی (اختیاری)"
            value={user.name || ""}
            placeholder="مثال: علی رضایی"
            onChange={(v) => setUser({ ...user, name: v })}
            error={showErrors && !nameValid ? "در صورت وارد کردن، نام باید حداقل ۳ حرف باشد." : ""}
          />

          <ValidatedField
            label="شهر محل سکونت (اختیاری)"
            value={user.city || ""}
            placeholder="مثال: تهران"
            onChange={(v) => setUser({ ...user, city: v })}
            error={showErrors && !cityValid ? "نام شهر معتبر وارد کنید." : ""}
          />

          <ValidatedField
            label="شغل (اختیاری)"
            value={user.job || ""}
            placeholder="مثال: مهندس نرم‌افزار"
            onChange={(v) => setUser({ ...user, job: v })}
            error={showErrors && !jobValid ? "عنوان شغل معتبر وارد کنید." : ""}
          />

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-silver">
              <span>شماره موبایل</span>
              <Lock size={12} className="text-silver/70" />
            </label>
            <input
              value={user.mobile ? fa(user.mobile) : "ثبت نشده"}
              readOnly
              disabled
              className="surface w-full cursor-not-allowed rounded-2xl border border-line/10 px-3.5 py-3 text-sm font-bold opacity-65 outline-none"
            />
            <p className="mt-1 text-[10px] text-silver">
              شماره موبایل شناسه حساب شماست و پس از ورود با کد تأیید قابل تغییر نیست.
            </p>
          </div>

          <NationalCodeInput
            value={user.nationalCode || ""}
            onChange={(v) => setUser({ ...user, nationalCode: v })}
            showErrors={showErrors && Boolean(user.nationalCode)}
          />

          <VamButton onClick={savePersonal}>
            {saved ? "تغییرات ذخیره شد ✓" : "ذخیره اطلاعات"}
          </VamButton>
        </Card>
      </Shell>
    );
  }

  // ۲. تاریخچه فعالیت‌ها با دسترسی مستقیم به نتیجه
  if (section === "history") {
    return (
      <Shell title={title}>
        {selectedHistory ? (
          <div className="mx-4 mt-4 space-y-4 animate-in fade-in">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-extrabold">{selectedHistory.title}</div>
                <button
                  type="button"
                  onClick={() => setSelectedHistory(null)}
                  className="rounded-xl bg-tile px-3 py-1.5 text-xs font-bold text-ink"
                >
                  بازگشت به لیست
                </button>
              </div>

              <div className="mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-500">
                {selectedHistory.summary}
              </div>

              {selectedHistory.rows.map((r, i) => (
                <InfoRow key={i} label={r.label} value={r.value} />
              ))}
              <InfoRow
                label="مبلغ پرداختی"
                value={`${fa(selectedHistory.amountToman.toLocaleString("en-US"))} تومان`}
              />

              <ResultExport
                title={selectedHistory.title}
                fileName={selectedHistory.serviceId}
                rows={selectedHistory.rows}
              />

              <Link
                href={selectedHistory.href}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-tile py-3 text-xs font-extrabold text-white "
              >
                <span>انجام مجدد این سرویس</span>
                <ExternalLink size={14} />
              </Link>
            </Card>
          </div>
        ) : (
          <div className="mx-4 mt-4 space-y-2.5">
            {historyItems.length === 0 ? (
              <Card className="p-6 text-center text-xs text-silver">
                هنوز سرویسی خریداری نکرده‌اید.
              </Card>
            ) : (
              historyItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedHistory(item)}
                  className="surface flex w-full items-center justify-between gap-3 rounded-2xl border border-line/10 p-4 text-right active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <History size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-extrabold text-ink">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-[11px] font-bold text-emerald-500">
                        {item.summary}
                      </div>
                      <div className="mt-0.5 text-[10px] text-silver">{item.date}</div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-silver" />
                </button>
              ))
            )}
          </div>
        )}
      </Shell>
    );
  }

  // ۳. راهنما و پشتیبانی (FAQ + تیکت + شماره تماس)
  if (section === "support") {
    const submitTicket = () => {
      if (ticketBody.trim().length < 5) {
        setTicketMsg("لطفاً شرح درخواست خود را کامل‌تر (حداقل ۵ حرف) بنویسید.");
        return;
      }
      const updated = addTicket(
        ticketSubject.trim() || "پشتیبانی اپلیکیشن",
        ticketBody.trim(),
      );
      setTickets(updated);
      setTicketSubject("");
      setTicketBody("");
      setTicketMsg("تیکت شما ثبت شد. کارشناسان ما به‌زودی پاسخ می‌دهند.");
    };

    return (
      <Shell title={title}>
        {/* تماس تلفنی */}
        <Card className="mx-4 mt-4 flex items-center justify-between gap-3 p-4">
          <div className="text-right">
            <div className="text-xs font-extrabold text-ink">پشتیبانی تلفنی وامگرد</div>
            <div className="mt-1 text-sm font-black text-brand" dir="ltr">
              {fa("021-91305086")}
            </div>
            <div className="mt-0.5 text-[10px] text-silver">
              همه‌روزه از ساعت ۹ تا ۲۱
            </div>
          </div>
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white active:scale-95 transition-transform"
          >
            <PhoneCall size={15} />
            <span>تماس</span>
          </a>
        </Card>

        {/* سوالات متداول */}
        <Card className="mx-4 mt-4 space-y-2.5 p-4">
          <div className="text-sm font-extrabold">سوالات متداول</div>
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border border-line/10 bg-tile/30 px-3.5 py-2.5"
            >
              <summary className="cursor-pointer text-xs font-extrabold text-ink">
                {item.q}
              </summary>
              <p className="mt-2 text-[11px] leading-6 text-silver">{item.a}</p>
            </details>
          ))}
        </Card>

        {/* ثبت تیکت */}
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Ticket size={17} className="text-brand" />
            <span>ثبت تیکت پشتیبانی</span>
          </div>
          <input
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            placeholder="موضوع تیکت (مثلاً: پیگیری استعلام)"
            className="surface w-full rounded-xl border border-line/10 px-3 py-2.5 text-xs font-bold outline-none focus:border-brand"
          />
          <textarea
            value={ticketBody}
            onChange={(e) => setTicketBody(e.target.value)}
            rows={4}
            className="surface w-full rounded-xl border border-line/10 px-3 py-2.5 text-xs font-bold outline-none focus:border-brand"
            placeholder="سوال یا مشکل خود را بنویسید..."
          />
          <VamButton onClick={submitTicket}>
            <Send size={15} />
            <span>ارسال تیکت</span>
          </VamButton>
          {ticketMsg && (
            <p className="text-center text-[11px] font-bold text-brand">{ticketMsg}</p>
          )}
        </Card>

        {/* تیکت‌های ثبت‌شده */}
        {tickets.length > 0 && (
          <Card className="mx-4 mt-4 space-y-2.5 p-4">
            <div className="text-xs font-extrabold text-silver">تیکت‌های اخیر شما</div>
            {tickets.map((tk) => (
              <div
                key={tk.id}
                className="rounded-2xl border border-line/10 bg-tile/30 p-3 text-right"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-ink">{tk.subject}</span>
                  <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                    {tk.status}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-silver">{tk.message}</p>
                <div className="mt-1 text-[10px] text-silver/70">{tk.date}</div>
              </div>
            ))}
          </Card>
        )}
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

function ValidatedField({
  label,
  value,
  placeholder,
  onChange,
  error,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-extrabold text-silver">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`surface w-full rounded-2xl border px-3.5 py-3 text-sm font-bold outline-none transition-all ${
          error ? "border-red-500/50 bg-red-500/5" : "border-line/10 focus:border-brand"
        }`}
      />
      {error && <p className="mt-1 text-[10px] font-bold text-red-400">{error}</p>}
    </div>
  );
}
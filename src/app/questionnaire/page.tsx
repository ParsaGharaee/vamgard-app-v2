"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { InfoRow, ServiceHeader, Stepper, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { PayOrWalletModal, tryDirectWalletSpend } from "@/src/components/pay/PayOrWalletModal";
import { ServicePriceBar } from "@/src/components/pay/ServicePriceBar";
import { ResultExport } from "@/src/components/pay/ResultExport";
import { MobileInput, isValidMobile } from "@/src/components/services/shared/inputs/MobileInput";
import { OtpInput } from "@/src/components/services/shared/inputs/OtpInput";
import { loadSession, saveSession } from "@/src/lib/session";
import { addServiceHistory } from "@/src/lib/historyStore";
import { fa } from "@/src/lib/format";
import { LoginSheet } from "@/src/components/auth/LoginSheet";

const STEPS = ["هدف", "مبلغ", "مدت", "درآمد", "نتیجه"];
const QUESTIONNAIRE_PRICE = 49_000;

const PURPOSES = ["خرید خودرو", "مسکن", "تعمیرات", "سرمایه در گردش", "سایر"];
const AMOUNTS = ["۵۰ میلیون", "۱۰۰ میلیون", "۳۰۰ میلیون", "۵۰۰ میلیون+", "نامشخص"];
const TERMS = ["۱۲ ماه", "۲۴ ماه", "۳۶ ماه", "۴۸+ ماه"];

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    purpose: "",
    amount: "",
    term: "",
    income: "",
  });

  // ورود سریع اگر کاربر لاگین نباشد
  const [needLogin, setNeedLogin] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  const [payOpen, setPayOpen] = useState(false);
  const [done, setDone] = useState(false);

  const pick = (key: keyof typeof answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const completeQuestionnaire = () => {
    try {
      localStorage.setItem("vamgard_questionnaire_v1", JSON.stringify(answers));
    } catch {
      /* ignore */
    }
    addServiceHistory({
      serviceId: "questionnaire",
      title: "پرسشنامه کشف وام",
      href: "/questionnaire",
      amountToman: QUESTIONNAIRE_PRICE,
      summary: `${answers.purpose} · ${answers.amount}`,
      rows: [
        { label: "هدف وام", value: answers.purpose },
        { label: "مبلغ درخواستی", value: answers.amount },
        { label: "مدت بازپرداخت", value: answers.term },
        { label: "درآمد ماهانه", value: `${fa(Number(answers.income || 0).toLocaleString("en-US"))} تومان` },
      ],
    });
    setDone(true);
  };

  const proceedToPayment = () => {
    if (tryDirectWalletSpend(QUESTIONNAIRE_PRICE, "پرسشنامه کشف وام")) {
      completeQuestionnaire();
    } else {
      setPayOpen(true);
    }
  };

  const finish = () => {
  if (!loadSession().loggedIn) {
    setNeedLogin(true);
    return;
  }
  proceedToPayment();
};

  const sendQuickOtp = () => {
    if (loginName.trim().length < 3 || !isValidMobile(loginMobile)) {
      setLoginErr("نام و شماره موبایل معتبر وارد کنید.");
      return;
    }
    setLoginErr("");
    setOtpSent(true);
  };

  const verifyQuickOtp = (code: string) => {
    if (code.length < 5) return;
    const prev = loadSession();
    saveSession({
      ...prev,
      loggedIn: true,
      name: loginName.trim(),
      mobile: loginMobile,
    });
    setNeedLogin(false);
    setOtpSent(false);
    proceedToPayment();
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="پرسشنامه مالی" />

      <main className="flex-1 overflow-y-auto px-4 pb-12 no-scrollbar">
        <div className="mt-4">
          <Stepper steps={STEPS} currentStep={step} />
        </div>

        {step === 1 && (
          <Card className="mt-8 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">هدف شما از دریافت وام چیست؟</h2>
            <OptionGrid options={PURPOSES} value={answers.purpose} onPick={(v) => pick("purpose", v)} />
            <VamButton disabled={!answers.purpose} onClick={next}>
              ادامه
            </VamButton>
          </Card>
        )}

        {step === 2 && (
          <Card className="mt-8 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">مبلغ تقریبی مورد نیاز</h2>
            <OptionGrid options={AMOUNTS} value={answers.amount} onPick={(v) => pick("amount", v)} />
            <NavRow back={back} next={next} nextDisabled={!answers.amount} />
          </Card>
        )}

        {step === 3 && (
          <Card className="mt-8 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">مدت بازپرداخت مد نظر</h2>
            <OptionGrid options={TERMS} value={answers.term} onPick={(v) => pick("term", v)} />
            <NavRow back={back} next={next} nextDisabled={!answers.term} />
          </Card>
        )}

        {step === 4 && (
          <Card className="mt-8 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">درآمد ماهانه شما چقدر است؟ (تومان)</h2>
            <input
              value={fa(answers.income)}
              onChange={(e) => pick("income", e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="مثال: ۲۵۰۰۰۰۰۰"
              className="surface w-full rounded-2xl border border-line/10 px-3.5 py-3 text-sm font-bold outline-none focus:border-brand"
            />
            <NavRow back={back} next={next} nextDisabled={answers.income.length < 4} />
          </Card>
        )}

        {step === 5 && !done && (
          <Card className="mt-8 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">خلاصه پاسخ‌های شما</h2>
            <InfoRow label="هدف وام" value={answers.purpose} />
            <InfoRow label="مبلغ تقریبی" value={answers.amount} />
            <InfoRow label="مدت بازپرداخت" value={answers.term} />
            <InfoRow
              label="درآمد ماهانه"
              value={`${fa(Number(answers.income || 0).toLocaleString("en-US"))} تومان`}
            />

            {needLogin ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-brand/20 bg-brand/5 p-3.5">
                <div className="text-xs font-extrabold text-brand">
                  برای پرداخت و ذخیره نتیجه، ابتدا وارد حساب خود شوید:
                </div>
                <input
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className="surface w-full rounded-xl px-3 py-2.5 text-sm font-bold outline-none"
                />
                <MobileInput value={loginMobile} onChange={setLoginMobile} showErrors={Boolean(loginErr)} />
                {otpSent ? (
                  <OtpInput length={4} onComplete={verifyQuickOtp} />
                ) : (
                  <VamButton onClick={sendQuickOtp}>ارسال کد تأیید و ادامه</VamButton>
                )}
                {loginErr && <p className="text-center text-[11px] font-bold text-red-400">{loginErr}</p>}
              </div>
            ) : (
              <div className="pt-2">
                <ServicePriceBar
                  priceToman={QUESTIONNAIRE_PRICE}
                  serviceTitle="پرسشنامه کشف وام"
                />
                <VamButton onClick={finish}>پرداخت و مشاهده وام‌های پیشنهادی</VamButton>
              </div>
            )}
          </Card>
        )}

        {step === 5 && done && (
          <Card className="mt-8 space-y-3 p-5 text-center animate-in zoom-in-95">
            <ShieldCheck size={36} className="mx-auto text-emerald-500" />
            <h2 className="text-base font-black text-emerald-500">تحلیل پرسشنامه آماده شد</h2>
            <p className="text-xs leading-6 text-silver">
              بر اساس درآمد و شرایط شما، ۳ طرح تسهیلاتی متناسب با هدف «{answers.purpose}» در بخش وام‌ها پیشنهاد شده است.
            </p>

            <ResultExport
              title="نتیجه پرسشنامه کشف وام"
              fileName="vamgard-questionnaire"
              rows={[
                { label: "هدف وام", value: answers.purpose },
                { label: "مبلغ درخواستی", value: answers.amount },
                { label: "مدت بازپرداخت", value: answers.term },
                { label: "درآمد ماهانه", value: `${fa(Number(answers.income || 0).toLocaleString("en-US"))} تومان` },
              ]}
            />

            <VamButton onClick={() => router.push("/?tab=loans")}>
              مشاهده وام‌های پیشنهادی
            </VamButton>
          </Card>
        )}
      </main>
<LoginSheet
  open={needLogin}
  onClose={() => setNeedLogin(false)}
  title="ورود برای مشاهده نتیجه پرسشنامه"
  subtitle="ابتدا وارد حساب کاربری شوید؛ سپس بلافاصله به مرحله پرداخت هدایت می‌شوید."
  onSuccess={() => proceedToPayment()}
/>
      <PayOrWalletModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amountToman={QUESTIONNAIRE_PRICE}
        serviceTitle="پرسشنامه کشف وام"
        onPaid={completeQuestionnaire}
      />
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onPick,
}: {
  options: string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          className={`rounded-2xl border px-4 py-3 text-right text-sm font-bold transition ${
            value === o ? "border-brand bg-brand/10 text-brand" : "border-line/10 surface"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function NavRow({
  back,
  next,
  nextDisabled,
}: {
  back: () => void;
  next: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <VamButton type="button" className="!bg-tile !text-ink !shadow-none" onClick={back}>
        قبلی
      </VamButton>
      <VamButton type="button" disabled={nextDisabled} onClick={next}>
        بعدی
      </VamButton>
    </div>
  );
}
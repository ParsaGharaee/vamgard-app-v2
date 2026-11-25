"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceHeader, Stepper, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { gatewayFetch } from "@/src/lib/gateway/client";
import { PayOrWalletModal } from "@/src/components/pay/PayOrWalletModal";
import { ServicePriceBar } from "@/src/components/pay/ServicePriceBar";
import { loadSession } from "@/src/lib/session";

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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  const pick = (key: keyof typeof answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const persistAnswers = async () => {
    setSaving(true);
    const res = await gatewayFetch("questionnaire/save", { method: "POST", json: answers });
    setSaving(false);
    setMessage(
      res.message ||
        (res.ok ? "پرسشنامه ذخیره شد. وام‌های پیشنهادی را در تب وام‌ها ببینید." : res.error || "ذخیره محلی انجام شد."),
    );
    if (!res.ok) {
      try {
        localStorage.setItem("vamgard_questionnaire_v1", JSON.stringify(answers));
      } catch {
        /* ignore */
      }
    }
    setStep(STEPS.length);
  };

  const finish = async () => {
    const session = loadSession();
    if (!session.loggedIn) {
      setMessage("برای پرداخت و دریافت نتیجه، ابتدا از پروفایل وارد شوید.");
      router.push("/?tab=profile");
      return;
    }
    setPayOpen(true);
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="پرسشنامه مالی" />
      <main className="flex-1 overflow-y-auto px-4 pb-12 no-scrollbar">
        <div className="mt-4">
          <Stepper steps={STEPS} currentStep={step} />
        </div>

        {step === 1 && (
          <Card className="mt-10 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">هدف وام چیست؟</h2>
            <OptionGrid options={PURPOSES} value={answers.purpose} onPick={(v) => pick("purpose", v)} />
            <VamButton disabled={!answers.purpose} onClick={next}>
              ادامه
            </VamButton>
          </Card>
        )}

        {step === 2 && (
          <Card className="mt-10 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">مبلغ تقریبی</h2>
            <OptionGrid options={AMOUNTS} value={answers.amount} onPick={(v) => pick("amount", v)} />
            <NavRow back={back} next={next} nextDisabled={!answers.amount} />
          </Card>
        )}

        {step === 3 && (
          <Card className="mt-10 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">مدت بازپرداخت</h2>
            <OptionGrid options={TERMS} value={answers.term} onPick={(v) => pick("term", v)} />
            <NavRow back={back} next={next} nextDisabled={!answers.term} />
          </Card>
        )}

        {step === 4 && (
          <Card className="mt-10 space-y-3 p-4">
            <h2 className="text-sm font-extrabold">درآمد ماهانه (تومان)</h2>
            <input
              value={answers.income}
              onChange={(e) => pick("income", e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="مثال: 25000000"
              className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            />
            <NavRow back={back} next={next} nextDisabled={answers.income.length < 4} />
          </Card>
        )}

        {step === 5 && (
          <Card className="mt-10 space-y-3 p-4 text-center">
            <h2 className="text-sm font-extrabold">خلاصه پاسخ‌ها</h2>
            <ul className="space-y-2 text-xs text-silver">
              <li>هدف: {answers.purpose}</li>
              <li>مبلغ: {answers.amount}</li>
              <li>مدت: {answers.term}</li>
              <li>درآمد: {answers.income || "—"}</li>
            </ul>
            {message && <p className="text-[11px] text-brand">{message}</p>}
            <p className="text-[11px] leading-6 text-silver">
              هزینه این درخواست {QUESTIONNAIRE_PRICE.toLocaleString("en-US")} تومان است. اگر موجودی کیف پول کافی باشد مستقیم کسر می‌شود.
            </p>
            <VamButton loading={saving} onClick={finish}>
              پرداخت و مشاهده نتیجه
            </VamButton>
            <VamButton className="!bg-tile !text-ink !shadow-none" onClick={() => router.push("/?tab=loans")}>
              رفتن به فهرست وام‌ها
            </VamButton>
          </Card>
        )}
      </main>
      {step === 5 && (
        <ServicePriceBar
          title="هزینه این درخواست (پرسشنامه کشف وام)"
          priceToman={QUESTIONNAIRE_PRICE}
          onPay={finish}
        />
      )}
      <PayOrWalletModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amountToman={QUESTIONNAIRE_PRICE}
        serviceTitle="پرسشنامه کشف وام"
        onPaid={() => {
          void persistAnswers();
        }}
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
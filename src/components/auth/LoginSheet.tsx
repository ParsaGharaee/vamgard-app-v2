"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldAlert, ShieldCheck, Smartphone, X } from "lucide-react";
import { MobileInput, isValidMobile } from "@/src/components/services/shared/inputs/MobileInput";
import { OtpInput } from "@/src/components/services/shared/inputs/OtpInput";
import { VamButton } from "@/src/components/services/shared";
import { fa } from "@/src/lib/format";
import { loadSession, saveSession, type AppUser } from "@/src/lib/session";

const VALID_DEMO_OTP = "1234";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSuccess?: (user: AppUser) => void;
};

export function LoginSheet({
  open,
  onClose,
  title = "ورود یا ثبت‌نام در وامگرد",
  subtitle = "شماره موبایل خود را وارد کنید تا کد تأیید ۴ رقمی برای شما ارسال شود.",
  onSuccess,
}: Props) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [mobile, setMobile] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpKey, setOtpKey] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setShowErrors(false);
      setError(null);
      setLoading(false);
      setOtpKey(0);
    }
  }, [open]);

  if (!open) return null;

  const handleSendOtp = async () => {
    setShowErrors(true);
    setError(null);
    if (!isValidMobile(mobile)) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length < 4) return;
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 500));

    if (code !== VALID_DEMO_OTP) {
      setLoading(false);
      setError("کد تأیید واردشده اشتباه است. لطفاً دوباره تلاش کنید.");
      setOtpKey((k) => k + 1);
      return;
    }

    const prev = loadSession();
    const nextUser: AppUser = {
      ...prev,
      loggedIn: true,
      mobile,
    };

    saveSession(nextUser);
    setLoading(false);
    setStep("success");

    setTimeout(() => {
      onClose();
      onSuccess?.(nextUser);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-[2px]"
      onClick={step === "success" ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-[30px] border-t border-line/10 bg-card px-5 pb-8 pt-3 shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
      >
        {/* دستگیره باتن‌شیت */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line/20" />

        {/* هدر (در حالت موفقیت مخفی می‌شود) */}
        {step !== "success" && (
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {step === "otp" ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setError(null);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full bg-tile text-ink active:scale-95 transition-transform"
                  aria-label="بازگشت"
                >
                  <ArrowRight size={18} />
                </button>
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Smartphone size={18} />
                </span>
              )}
              <h3 className="text-base font-extrabold text-ink">{title}</h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-tile text-ink active:scale-95 transition-transform"
              aria-label="بستن"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* مرحله ۱: ورود شماره موبایل */}
        {step === "phone" && (
          <div className="space-y-3">
            <p className="text-right text-xs leading-6 text-silver">{subtitle}</p>

            <MobileInput value={mobile} onChange={setMobile} showErrors={showErrors} />

            <VamButton className="mt-2" loading={loading} onClick={handleSendOtp}>
              دریافت کد تأیید
            </VamButton>
          </div>
        )}

        {/* مرحله ۲: ورود کد ۴ رقمی */}
        {step === "otp" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand/15 bg-brand/5 p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-brand">
                <ShieldCheck size={16} />
                <span>کد ۴ رقمی به شماره {fa(mobile)} ارسال شد</span>
              </div>
              <p className="mt-1 text-[11px] text-silver">
                کد تست ورود: <span className="font-black text-ink">{fa(VALID_DEMO_OTP)}</span>
              </p>
            </div>

            <OtpInput
              key={otpKey}
              length={4}
              onComplete={handleVerifyOtp}
              loading={loading}
              error={error || undefined}
            />

            {error && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 animate-in fade-in">
                <ShieldAlert size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError(null);
              }}
              className="w-full py-1 text-center text-xs font-bold text-silver hover:text-brand"
            >
              ویرایش شماره موبایل
            </button>
          </div>
        )}

        {/* مرحله ۳: پیام موفقیت ورود */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 size={38} />
            </span>
            <h3 className="mt-4 text-base font-black text-emerald-500">
              ورود با موفقیت انجام شد
            </h3>
            <p className="mt-1.5 text-xs font-bold text-silver">
              شماره {fa(mobile)} تأیید شد. در حال انتقال...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
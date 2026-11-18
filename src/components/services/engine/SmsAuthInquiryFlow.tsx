"use client";
import { useMemo, useState } from "react";
import { RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { ServiceHeader, Stepper, VamButton } from "../shared";
import { FieldRenderer } from "./FieldRenderer";
import { ResultView } from "./ResultView";
import type { FinnotechService, ServiceField } from "@/src/lib/finnotech/types";
import { isValidMobile, validateAll } from "@/src/lib/finnotech/validate";
import { authorizeSms, inquireService, verifySms } from "@/src/lib/finnotech/api-client";
import { fa } from "@/src/lib/format";

const STEPS = ["اطلاعات", "تایید پیامکی", "نتیجه"];

const AUTH_MOBILE: ServiceField = {
  name: "__authMobile",
  in: "query",
  required: true,
  kind: "mobile",
  label: "شماره موبایل",
  placeholder: "09123456789",
};

export default function SmsAuthInquiryFlow({ service }: { service: FinnotechService }) {
  const fields = useMemo(() => {
    const base = service.fields.filter((f) => f.kind !== "otp");
    const hasMobile = base.some((f) => f.kind === "mobile");
    return hasMobile ? base : [...base, AUTH_MOBILE];
  }, [service.fields]);

  const mobileKey = fields.find((f) => f.kind === "mobile" || f.name === "__authMobile")?.name || "__authMobile";

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [authTrackId, setAuthTrackId] = useState<string>();
  const [result, setResult] = useState<unknown>(null);
  const [trackId, setTrackId] = useState<string>();

  const fieldErrors = validateAll(
    fields.map((f) => (f.name === "__authMobile" ? { ...f, name: "__authMobile" } : f)),
    values
  );
  if (!isValidMobile(values[mobileKey] || "")) {
    fieldErrors[mobileKey] = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
  } else {
    delete fieldErrors[mobileKey];
  }

  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const authMobile = values[mobileKey] || "";

  const apiParams = () => {
    const p = { ...values };
    delete p.__authMobile;
    return p;
  };

  const handleStep1 = async () => {
    setError("");
    setShowErrors(true);
    if (Object.keys(fieldErrors).length) return;

    setLoading(true);
    try {
      const auth = await authorizeSms(service.id, authMobile);
      if (!auth.ok) throw new Error(auth.error || "ارسال پیامک ناموفق بود.");
      setAuthTrackId(auth.result?.trackId || auth.result?.smsTrackId);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در ارسال پیامک.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (otp: string) => {
    setError("");
    setLoading(true);
    setOtpSuccess(false);
    try {
      const verified = await verifySms({
        serviceId: service.id,
        mobile: authMobile,
        otp,
        trackId: authTrackId,
      });
      if (!verified.ok) throw new Error(verified.error || "کد تایید اشتباه است.");

      setOtpSuccess(true);
      const res = await inquireService(service.id, apiParams(), {
        smsAccessToken: verified.accessToken,
      });
      if (!res.ok) throw new Error(res.error || "استعلام ناموفق بود.");
      setResult(res.result);
      setTrackId(res.trackId);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در تایید کد.");
    } finally {
      setLoading(false);
      setOtpSuccess(false);
    }
  };

  const reset = () => {
    setStep(1);
    setValues({});
    setResult(null);
    setShowErrors(false);
    setError("");
    setAuthTrackId(undefined);
  };

  return (
    <div className="app-bg min-h-screen text-ink pb-10">
      <ServiceHeader title={service.title} />
      <div className="px-4 mt-4">
        <Stepper steps={STEPS} currentStep={step} />

        {error && step !== 2 && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 border border-red-500/10">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              این سرویس نیاز به تایید پیامکی دارد. پس از تکمیل اطلاعات، کد تایید برای شما ارسال می‌شود.
            </p>
            {fields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={
                  f.name === "__authMobile"
                    ? { ...f, name: "mobile", kind: "mobile", label: "شماره موبایل" }
                    : f
                }
                value={values[f.name] || ""}
                onChange={(v) => setField(f.name, v)}
                showErrors={showErrors}
                error={fieldErrors[f.name]}
              />
            ))}
            <VamButton loading={loading} onClick={handleStep1}>
              دریافت کد تایید
            </VamButton>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col items-center">
            <p className="text-xs text-silver leading-6 mb-4 text-center px-4 mt-4">
              کد تایید ارسال‌شده به{" "}
              <span className="font-extrabold text-brand text-sm" dir="ltr">
                {fa(authMobile)}
              </span>{" "}
              را وارد کنید.
            </p>
            <FieldRenderer
              field={{
                name: "otp",
                in: "body",
                required: true,
                kind: "otp",
                label: "کد تایید",
              }}
              value=""
              onChange={() => {}}
              onOtpComplete={handleOtp}
              error={error}
              otpLoading={loading}
              otpSuccess={otpSuccess}
            />
            {loading && !otpSuccess && (
              <div className="flex items-center gap-2 text-brand text-xs font-bold mt-2 animate-pulse">
                <RefreshCcw size={14} className="animate-spin" />
                در حال بررسی کد...
              </div>
            )}
            {otpSuccess && (
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mt-2">
                <ShieldCheck size={16} />
                تایید شد! در حال استعلام...
              </div>
            )}
            <button
              disabled={loading}
              onClick={() => {
                setStep(1);
                setError("");
              }}
              className="w-full text-[11px] text-silver font-bold py-2 mt-6"
            >
              بازگشت و اصلاح اطلاعات
            </button>
          </div>
        )}

        {step === 3 && result != null ? (
          <ResultView
            title={`نتیجه ${service.title}`}
            result={result}
            responseFields={service.responseFields}
            trackId={trackId}
            onReset={reset}
          />
        ) : null}
      </div>
    </div>
  );
}

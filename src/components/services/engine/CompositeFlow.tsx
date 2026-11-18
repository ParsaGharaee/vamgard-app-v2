"use client";
import { useMemo, useState } from "react";
import { RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { ServiceHeader, Stepper, VamButton } from "../shared";
import { FieldRenderer } from "./FieldRenderer";
import { ResultView } from "./ResultView";
import { getServiceById as getGenerated } from "@/src/lib/finnotech/catalog.generated";
import type { CompositeDef } from "@/src/lib/finnotech/composites";
import type { ServiceField } from "@/src/lib/finnotech/types";
import { isValidMobile, validateAll } from "@/src/lib/finnotech/validate";
import { authorizeSms, inquireService, verifySms } from "@/src/lib/finnotech/api-client";
import CreditScoreFlow from "../credit-score/CreditScoreFlow";

const AUTH_MOBILE_FIELD: ServiceField = {
  name: "__authMobile",
  in: "query",
  required: true,
  kind: "mobile",
  label: "شماره موبایل",
  placeholder: "09123456789",
};

function pick(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const v = (obj as Record<string, unknown>)[key];
  if (v === undefined || v === null) return undefined;
  return String(v);
}

function applyMap(
  values: Record<string, string>,
  result: unknown,
  map?: Record<string, string>
) {
  if (!map) return { ...values };
  const next = { ...values };
  for (const [target, source] of Object.entries(map)) {
    const v = pick(result, source) || pick(result, target);
    if (v) next[target] = v;
  }
  // common aliases
  for (const k of ["inquiryTrackId", "requestId", "assessmentId", "traceId", "challengeId"]) {
    const v = pick(result, k);
    if (v && !next[k]) next[k] = v;
  }
  return next;
}

export default function CompositeFlow({ def }: { def: CompositeDef }) {
  if (def.id === "transaction-credit-inquiry") {
    return <CreditScoreFlow />;
  }

  const primary = getGenerated(def.steps.primary);
  const secondary = def.steps.secondary ? getGenerated(def.steps.secondary) : undefined;
  const tertiary = def.steps.tertiary ? getGenerated(def.steps.tertiary) : undefined;

  if (!primary) {
    return (
      <div className="app-bg min-h-screen text-ink p-6">
        <ServiceHeader title={def.title} />
        <p className="text-sm text-red-500 mt-6">تعریف سرویس ناقص است.</p>
      </div>
    );
  }

  if (def.kind === "sms_auth") {
    return (
      <SmsAuthComposite
        def={def}
        primary={primary}
        secondary={secondary}
      />
    );
  }

  if (def.kind === "service_otp") {
    return (
      <ServiceOtpComposite
        def={def}
        primary={primary}
        secondary={secondary}
        tertiary={tertiary}
      />
    );
  }

  return (
    <AsyncResultComposite def={def} primary={primary} secondary={secondary} />
  );
}

function SmsAuthComposite({
  def,
  primary,
  secondary,
}: {
  def: CompositeDef;
  primary: NonNullable<ReturnType<typeof getGenerated>>;
  secondary?: ReturnType<typeof getGenerated>;
}) {
  const formFields = useMemo(() => {
    const base = primary.fields.filter((f) => f.kind !== "otp");
    const hasMobile = base.some((f) => f.kind === "mobile");
    return hasMobile ? base : [...base, AUTH_MOBILE_FIELD];
  }, [primary.fields]);

  const steps = secondary
    ? ["اطلاعات", "تایید پیامکی", "نتیجه"]
    : ["اطلاعات", "تایید پیامکی", "نتیجه"];

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [authTrackId, setAuthTrackId] = useState<string>();
  const [smsToken, setSmsToken] = useState<string>();
  const [result, setResult] = useState<unknown>(null);
  const [trackId, setTrackId] = useState<string>();

  const fieldErrors = validateAll(
    formFields.map((f) =>
      f.name === "__authMobile" ? { ...f, name: "__authMobile" } : f
    ),
    values
  );
  // validate auth mobile specially
  if (formFields.some((f) => f.name === "__authMobile")) {
    if (!isValidMobile(values.__authMobile || "")) {
      fieldErrors.__authMobile = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
    } else {
      delete fieldErrors.__authMobile;
    }
  }

  const authMobile =
    values.__authMobile ||
    values.mobile ||
    values.mobileNumber ||
    "";

  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const apiParams = () => {
    const p = { ...values };
    delete p.__authMobile;
    return p;
  };

  const handleStep1 = async () => {
    setError("");
    setShowErrors(true);
    if (Object.keys(fieldErrors).length) return;
    if (!isValidMobile(authMobile)) {
      setError("شماره موبایل برای دریافت کد تایید الزامی است.");
      return;
    }
    setLoading(true);
    try {
      const auth = await authorizeSms(primary.id, authMobile);
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
        serviceId: primary.id,
        mobile: authMobile,
        otp,
        trackId: authTrackId,
      });
      if (!verified.ok) throw new Error(verified.error || "کد تایید اشتباه است.");
      setOtpSuccess(true);
      setSmsToken(verified.accessToken);

      const res = await inquireService(primary.id, apiParams(), {
        smsAccessToken: verified.accessToken,
      });
      if (!res.ok) throw new Error(res.error || "استعلام ناموفق بود.");

      let merged = applyMap(apiParams(), res.result, def.mapFromResult);
      let finalResult = res.result;
      let finalTrack = res.trackId;

      if (secondary) {
        const second = await inquireService(secondary.id, merged, {
          smsAccessToken: verified.accessToken,
        });
        if (!second.ok) throw new Error(second.error || "دریافت نتیجه ناموفق بود.");
        finalResult = second.result;
        finalTrack = second.trackId || finalTrack;
        merged = applyMap(merged, second.result, def.mapFromResult);
      }

      setValues((prev) => ({ ...prev, ...merged }));
      setResult(finalResult);
      setTrackId(finalTrack);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در تایید کد.");
    } finally {
      setLoading(false);
      setOtpSuccess(false);
    }
  };

  return (
    <FlowShell
      title={def.title}
      steps={steps}
      step={step}
      error={error}
      loading={loading}
      otpSuccess={otpSuccess}
      formFields={formFields}
      values={values}
      showErrors={showErrors}
      fieldErrors={fieldErrors}
      setField={setField}
      onSubmitStep1={handleStep1}
      onOtp={handleOtp}
      onBackToForm={() => {
        setStep(1);
        setError("");
      }}
      result={result}
      trackId={trackId}
      responseFields={secondary?.responseFields || primary.responseFields}
      authMobile={authMobile}
      onReset={() => {
        setStep(1);
        setValues({});
        setResult(null);
        setShowErrors(false);
        setError("");
        setAuthTrackId(undefined);
        setSmsToken(undefined);
      }}
    />
  );
}

function ServiceOtpComposite({
  def,
  primary,
  secondary,
  tertiary,
}: {
  def: CompositeDef;
  primary: NonNullable<ReturnType<typeof getGenerated>>;
  secondary?: ReturnType<typeof getGenerated>;
  tertiary?: ReturnType<typeof getGenerated>;
}) {
  const formFields = useMemo(
    () => primary.fields.filter((f) => f.kind !== "otp" && f.name !== "inquiryTrackId" && f.name !== "challengeId" && f.name !== "traceId"),
    [primary.fields]
  );

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [trackId, setTrackId] = useState<string>();

  const fieldErrors = validateAll(formFields, values);
  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const handleStep1 = async () => {
    setError("");
    setShowErrors(true);
    if (Object.keys(fieldErrors).length) return;
    setLoading(true);
    try {
      const res = await inquireService(primary.id, values);
      if (!res.ok) throw new Error(res.error || "ارسال درخواست ناموفق بود.");
      const merged = applyMap(values, res.result, def.mapFromResult);
      setValues(merged);
      setTrackId(res.trackId);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در ارسال درخواست.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (otp: string) => {
    setError("");
    setLoading(true);
    setOtpSuccess(false);
    try {
      if (!secondary) throw new Error("مرحله تایید تعریف نشده است.");
      const params = { ...values, otp };
      const res = await inquireService(secondary.id, params);
      if (!res.ok) throw new Error(res.error || "تایید کد ناموفق بود.");
      setOtpSuccess(true);

      let merged = applyMap(params, res.result, def.mapFromResult);
      let finalResult = res.result;
      let finalTrack = res.trackId;

      if (tertiary) {
        const third = await inquireService(tertiary.id, merged);
        if (!third.ok) throw new Error(third.error || "دریافت گزارش ناموفق بود.");
        finalResult = third.result;
        finalTrack = third.trackId || finalTrack;
        merged = applyMap(merged, third.result, def.mapFromResult);
      }

      setValues(merged);
      setResult(finalResult);
      setTrackId(finalTrack);
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در تایید کد.");
    } finally {
      setLoading(false);
      setOtpSuccess(false);
    }
  };

  return (
    <FlowShell
      title={def.title}
      steps={["اطلاعات", "تایید پیامکی", "نتیجه"]}
      step={step}
      error={error}
      loading={loading}
      otpSuccess={otpSuccess}
      formFields={formFields}
      values={values}
      showErrors={showErrors}
      fieldErrors={fieldErrors}
      setField={setField}
      onSubmitStep1={handleStep1}
      onOtp={handleOtp}
      step1Label="دریافت کد تایید"
      onBackToForm={() => {
        setStep(1);
        setError("");
      }}
      result={result}
      trackId={trackId}
      responseFields={tertiary?.responseFields || secondary?.responseFields || primary.responseFields}
      authMobile={values.mobile || values.mobileNumber}
      onReset={() => {
        setStep(1);
        setValues({});
        setResult(null);
        setShowErrors(false);
        setError("");
      }}
    />
  );
}

function AsyncResultComposite({
  def,
  primary,
  secondary,
}: {
  def: CompositeDef;
  primary: NonNullable<ReturnType<typeof getGenerated>>;
  secondary?: ReturnType<typeof getGenerated>;
}) {
  const formFields = primary.fields;
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [trackId, setTrackId] = useState<string>();

  const fieldErrors = validateAll(formFields, values);
  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const submit = async () => {
    setError("");
    setShowErrors(true);
    if (Object.keys(fieldErrors).length) return;
    setLoading(true);
    try {
      const res = await inquireService(primary.id, values);
      if (!res.ok) throw new Error(res.error || "ثبت درخواست ناموفق بود.");
      let merged = applyMap(values, res.result, def.mapFromResult);
      let finalResult = res.result;
      let finalTrack = res.trackId;

      if (secondary) {
        // poll a few times for async
        for (let i = 0; i < 5; i++) {
          if (i > 0) await new Promise((r) => setTimeout(r, 1500));
          const poll = await inquireService(secondary.id, merged);
          if (!poll.ok) {
            if (i === 4) throw new Error(poll.error || "دریافت نتیجه ناموفق بود.");
            continue;
          }
          finalResult = poll.result;
          finalTrack = poll.trackId || finalTrack;
          merged = applyMap(merged, poll.result, def.mapFromResult);
          const status = pick(poll.result, "status") || pick(poll.result, "state");
          if (!status || /DONE|SUCCESS|COMPLETED|OK/i.test(status) || i === 4) break;
        }
      }

      setValues(merged);
      setResult(finalResult);
      setTrackId(finalTrack);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در استعلام.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg min-h-screen text-ink pb-10">
      <ServiceHeader title={def.title} />
      <div className="px-4 mt-4">
        <Stepper steps={["ثبت درخواست", "نتیجه"]} currentStep={step} />
        {error && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 flex items-center gap-2 border border-red-500/10">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}
        {step === 1 ? (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              اطلاعات را وارد کنید؛ نتیجه پس از ثبت درخواست دریافت می‌شود.
            </p>
            {formFields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={f}
                value={values[f.name] || ""}
                onChange={(v) => setField(f.name, v)}
                showErrors={showErrors}
                error={fieldErrors[f.name]}
              />
            ))}
            <VamButton loading={loading} onClick={submit}>
              ثبت و دریافت نتیجه
            </VamButton>
          </div>
        ) : (
          <ResultView
            title={`نتیجه ${def.title}`}
            result={result}
            responseFields={secondary?.responseFields || primary.responseFields}
            trackId={trackId}
            onReset={() => {
              setStep(1);
              setValues({});
              setResult(null);
              setShowErrors(false);
              setError("");
            }}
          />
        )}
      </div>
    </div>
  );
}

function FlowShell(props: {
  title: string;
  steps: string[];
  step: number;
  error: string;
  loading: boolean;
  otpSuccess: boolean;
  formFields: ServiceField[];
  values: Record<string, string>;
  showErrors: boolean;
  fieldErrors: Record<string, string>;
  setField: (name: string, v: string) => void;
  onSubmitStep1: () => void;
  onOtp: (otp: string) => void;
  onBackToForm: () => void;
  result: unknown;
  trackId?: string;
  responseFields: { key: string; label: string }[];
  authMobile?: string;
  step1Label?: string;
  onReset: () => void;
}) {
  const {
    title,
    steps,
    step,
    error,
    loading,
    otpSuccess,
    formFields,
    values,
    showErrors,
    fieldErrors,
    setField,
    onSubmitStep1,
    onOtp,
    onBackToForm,
    result,
    trackId,
    responseFields,
    authMobile,
    step1Label = "دریافت کد تایید",
    onReset,
  } = props;

  return (
    <div className="app-bg min-h-screen text-ink pb-10">
      <ServiceHeader title={title} />
      <div className="px-4 mt-4">
        <Stepper steps={steps} currentStep={step} />

        {error && step !== 2 && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 flex items-center gap-2 border border-red-500/10">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              پس از ارسال، کد تایید پیامکی برای شما ارسال می‌شود.
            </p>
            {formFields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={f.name === "__authMobile" ? { ...f, name: "mobile", kind: "mobile" } : f}
                value={values[f.name] || ""}
                onChange={(v) => setField(f.name, v)}
                showErrors={showErrors}
                error={fieldErrors[f.name]}
              />
            ))}
            <VamButton loading={loading} onClick={onSubmitStep1}>
              {step1Label}
            </VamButton>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col items-center">
            <p className="text-xs text-silver leading-6 mb-2 text-center px-4 mt-4">
              کد تایید ارسال‌شده
              {authMobile ? (
                <>
                  {" "}
                  به{" "}
                  <span className="font-extrabold text-brand" dir="ltr">
                    {authMobile}
                  </span>
                </>
              ) : null}{" "}
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
              onOtpComplete={onOtp}
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
                تایید شد!
              </div>
            )}
            <button
              disabled={loading}
              onClick={onBackToForm}
              className="w-full text-[11px] text-silver font-bold py-2 mt-6"
            >
              بازگشت و اصلاح اطلاعات
            </button>
          </div>
        )}

        {step === 3 && result != null ? (
          <ResultView
            title={`نتیجه ${title}`}
            result={result}
            responseFields={responseFields}
            trackId={trackId}
            onReset={onReset}
          />
        ) : null}
      </div>
    </div>
  );
}

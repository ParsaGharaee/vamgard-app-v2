"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  ShieldAlert,
  ShieldCheck,
  Clock,
  RefreshCw,
  Download,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Landmark,
  Info,
  Check,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { OtpInput } from "../shared/inputs/OtpInput";
import { FillFromProfileButton } from "../shared/FillFromProfileButton";
import { ServicePriceBar } from "@/src/components/pay/ServicePriceBar";
import { ResultExport } from "@/src/components/pay/ResultExport";
import { useServiceActionGate } from "@/src/components/pay/useServiceActionGate";
import { CreditGauge } from "@/src/components/credit/CreditGauge";
import { fa } from "@/src/lib/format";
import { gradeFromScore, loadSession, saveSession } from "@/src/lib/session";
import { addCreditHistory, addServiceHistory } from "@/src/lib/historyStore";

type Step = 1 | 2 | 3 | 4;
type OutputType = "json" | "pdf";
type AssessmentLevel = "base" | "standard" | "advance";

const PRICE_TOMAN = 50_000;
const VALID_CREDIT_OTP = "12345";

interface CreditReportData {
  user?: {
    fullName?: string;
    nationalCode?: string;
  };
  creditScore?: {
    score?: number;
    riskGrade?: string;
    description?: string;
  };
  positiveSignalList?: Array<{ title?: string; description?: string }>;
  attentionSignalList?: Array<{ title?: string; description?: string }>;
  facilityTotalAmount?: string;
  facilityDebtTotalAmount?: string;
  facilityPastExpiredTotalAmount?: string;
  facilityDeferredTotalAmount?: string;
  facilitySuspiciousTotalAmount?: string;
  guaranteeTotalAmount?: string;
  guaranteeDebtTotalAmount?: string;
  guaranteePastExpiredTotalAmount?: string;
}

interface AssessmentInquiryResponse {
  responseCode: string;
  trackId?: string;
  assessmentId: string;
  status: "IN_PROGRESS" | "DONE" | "FAILED";
  stage?: string;
  progress?: number;
  level?: AssessmentLevel;
  outputType?: OutputType;
  data?: CreditReportData;
  fileName?: string;
  contentBase64?: string;
}

const STEPS = [
  { id: 1 as Step, label: "ثبت اطلاعات" },
  { id: 2 as Step, label: "کد تأیید" },
  { id: 3 as Step, label: "پردازش" },
  { id: 4 as Step, label: "نتیجه" },
];

const STAGE_LABELS: Record<string, string> = {
  CREATED: "ثبت اولیه درخواست",
  ACCESS_INQUIRY: "بررسی سطح دسترسی",
  MAIN_SUBMIT: "ارسال استعلام اصلی",
  MAIN_POLL: "دریافت اطلاعات اصلی",
  BOUNCED_CHEQUE: "بررسی سوابق چک برگشتی",
  SCORE_SUBMIT: "ثبت درخواست امتیاز اعتباری",
  SCORE_POLL: "محاسبه امتیاز اعتباری",
  HISTORY_SUBMIT: "ثبت استعلام سوابق",
  HISTORY_POLL: "دریافت سوابق اعتباری",
  TAX_FETCH: "دریافت اطلاعات مالیاتی",
  CHEQUE_BASE_SUBMIT: "ثبت استعلام پایه چک",
  CHEQUE_BASE_POLL: "دریافت اطلاعات پایه چک",
  DONE: "تکمیل شده",
  FAILED: "ناموفق",
};

const LEVEL_LABELS: Record<AssessmentLevel, string> = {
  base: "پایه",
  standard: "استاندارد",
  advance: "پیشرفته",
};

const formatRial = (raw?: string | number) => {
  if (raw === undefined || raw === null || raw === "") return "—";
  const num = Number(raw);
  if (!Number.isFinite(num)) return fa(String(raw));
  return `${fa(num.toLocaleString("en-US"))} ریال`;
};

export default function CreditAssessmentFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  // مرحله ۱
  const [nationalCode, setNationalCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("json");

  // مرحله ۲ (OTP ۵ رقمی)
  const [otpError, setOtpError] = useState("");
  const [otpKey, setOtpKey] = useState(0);

  // مرحله ۳ و ۴ (Polling و نتیجه)
  const [assessmentId, setAssessmentId] = useState("");
  const [inquiryData, setInquiryData] =
    useState<AssessmentInquiryResponse | null>(null);
  const [pollAttempt, setPollAttempt] = useState(0);

  const { runWithGate, GateSheets } = useServiceActionGate(
    PRICE_TOMAN,
    "اعتبارسنجی بانکی"
  );

  // مرحله ۱: اعتبارسنجی فرم ← گیت لاگین و پرداخت ← رفتن به OTP
  const handleStep1Submit = () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidMobile(mobileNumber)) {
      return;
    }

    runWithGate(() => {
      setShowFormErrors(false);
      setOtpError("");
      setStep(2);
    });
  };

  // مرحله ۲: تأیید کد ۵ رقمی ← ثبت درخواست گزارش و رفتن به مرحله ۳ (پردازش)
  const handleOtpComplete = async (code: string) => {
    if (code.length < 5) return;
    setLoading(true);
    setOtpError("");
    await new Promise((r) => setTimeout(r, 600));

    if (code !== VALID_CREDIT_OTP) {
      setLoading(false);
      setOtpError("کد تأیید ۵ رقمی اشتباه است. لطفاً دوباره وارد کنید.");
      setOtpKey((k) => k + 1);
      return;
    }

    try {
      // POST /credit/v2/clients/{clientId}/assessmentSubmit/${outputType}
      const mockSubmit = {
        responseCode: "FN-CTFH-20003800000",
        assessmentId: "8f3c1a2e-4b90-4d11-9c2a-1a2b3c4d5e6f",
      };

      setAssessmentId(mockSubmit.assessmentId);
      setInquiryData({
        responseCode: "FN-CTFH-20003900000",
        assessmentId: mockSubmit.assessmentId,
        status: "IN_PROGRESS",
        stage: "CREATED",
        progress: 15,
      });
      setPollAttempt(0);
      setStep(3);
    } catch {
      setGeneralError(
        "خطا در ثبت درخواست اعتبارسنجی. از انطباق شماره موبایل و کد ملی (شاهکار) اطمینان حاصل کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  // مرحله ۳: استعلام وضعیت گزارش (Inquiry)
  const fetchAssessmentStatus = async (id: string, attempt: number) => {
    setPolling(true);
    setGeneralError("");
    try {
      // GET /credit/v2/clients/{clientId}/assessmentInquiry?assessmentId=${id}
      await new Promise((r) => setTimeout(r, 1100));

      let mockRes: AssessmentInquiryResponse;
      if (attempt === 0) {
        mockRes = {
          responseCode: "FN-CTFH-20003900000",
          assessmentId: id,
          status: "IN_PROGRESS",
          stage: "SCORE_POLL",
          level: "advance",
          progress: 65,
        };
      } else {
        const session = loadSession();
        const prevScore =
          typeof session.creditScore === "number" ? session.creditScore : 720;
        const score = Math.min(
          870,
          prevScore + (typeof session.creditScore === "number" ? 20 : 25)
        );
        const grade = gradeFromScore(score);

        mockRes =
          outputType === "pdf"
            ? {
                responseCode: "FN-CTFH-20003900000",
                assessmentId: id,
                status: "DONE",
                level: "advance",
                outputType: "pdf",
                fileName: `FinnotechAssessmentReport-${nationalCode}.pdf`,
                contentBase64: "",
              }
            : {
                responseCode: "FN-CTFH-20003900000",
                trackId: "billingInquiry876543",
                assessmentId: id,
                status: "DONE",
                level: "advance",
                outputType: "json",
                data: {
                  user: {
                    fullName: session.name || "کاربر وام‌گرد",
                    nationalCode,
                  },
                  creditScore: {
                    score,
                    riskGrade: grade,
                    description: "رتبه اعتباری بسیار خوب (ریسک پایین)",
                  },
                  positiveSignalList: [
                    { title: "عدم وجود چک برگشتی فعال" },
                    { title: "خوش‌حسابی در بازپرداخت اقساط ۱۲ ماه اخیر" },
                  ],
                  attentionSignalList: [
                    { title: "تعداد استعلام‌های اعتباری اخیر بالاتر از میانگین" },
                  ],
                  facilityTotalAmount: "1500000000",
                  facilityDebtTotalAmount: "420000000",
                  facilityPastExpiredTotalAmount: "0",
                  facilityDeferredTotalAmount: "0",
                  facilitySuspiciousTotalAmount: "0",
                  guaranteeTotalAmount: "500000000",
                  guaranteeDebtTotalAmount: "180000000",
                  guaranteePastExpiredTotalAmount: "0",
                },
              };

        // ذخیره دائمی امتیاز و تاریخچه در پروفایل
        saveSession({
          ...session,
          loggedIn: true,
          nationalCode: session.nationalCode || nationalCode,
          creditScore: score,
          creditGrade: grade,
        });

        addCreditHistory({
          score,
          grade,
          riskLabel: score >= 680 ? "بسیار کم‌ریسک" : "کم‌ریسک",
          facilitiesCount: 1,
          bouncedCheques: 0,
        });

        addServiceHistory({
          serviceId: "credit-assessment",
          title: "اعتبارسنجی بانکی",
          href: "/services/credit-assessment",
          amountToman: PRICE_TOMAN,
          summary: `رتبه ${grade} · امتیاز ${fa(score)}`,
          rows: [
            { label: "کد ملی", value: fa(nationalCode) },
            { label: "شماره موبایل", value: fa(mobileNumber) },
            { label: "امتیاز اعتباری", value: `${fa(score)} از ۹۰۰` },
            { label: "رتبه اعتباری", value: grade },
          ],
        });
      }

      setInquiryData(mockRes);
      if (mockRes.status === "DONE") {
        setStep(4);
      } else if (mockRes.status === "FAILED") {
        setGeneralError(
          "تهیه گزارش اعتباری با خطا مواجه شد. لطفاً مجدداً تلاش کنید."
        );
      }
    } catch {
      setGeneralError("خطا در دریافت وضعیت گزارش اعتباری.");
    } finally {
      setPolling(false);
    }
  };

  // Polling خودکار در مرحله ۳
  useEffect(() => {
    if (step !== 3 || !assessmentId) return;
    const timer = setTimeout(() => {
      const nextAttempt = pollAttempt + 1;
      setPollAttempt(nextAttempt);
      fetchAssessmentStatus(assessmentId, pollAttempt);
    }, 2200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, assessmentId, pollAttempt]);

  const handleDownloadPdf = () => {
    if (!inquiryData?.contentBase64) return;
    const raw = inquiryData.contentBase64.startsWith("data:application/pdf")
      ? inquiryData.contentBase64
      : `data:application/pdf;base64,${inquiryData.contentBase64}`;
    const link = document.createElement("a");
    link.href = raw;
    link.download =
      inquiryData.fileName || `CreditReport-${nationalCode}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setStep(1);
    setNationalCode("");
    setMobileNumber("");
    setAssessmentId("");
    setInquiryData(null);
    setPollAttempt(0);
    setShowFormErrors(false);
    setGeneralError("");
    setOtpError("");
  };

  const progressWidth =
    step === 1
      ? "0%"
      : step === 2
        ? "calc(33.33% - 16px)"
        : step === 3
          ? "calc(66.66% - 32px)"
          : "calc(100% - 48px)";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="اعتبارسنجی بانکی" />

      <div className="px-4 mt-5">
        {/* استپر ۴ مرحله‌ای */}
        <div className="surface rounded-2xl p-4 mb-6 border border-line/5">
          <div className="flex items-center justify-between relative">
            <div className="absolute right-6 left-6 top-4 h-0.5 bg-line/15 -z-0" />
            <div
              className="absolute right-6 top-4 h-0.5 bg-brand transition-all duration-500 -z-0"
              style={{ width: progressWidth }}
            />

            {STEPS.map((s) => {
              const isCompleted = step > s.id;
              const isActive = step === s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center gap-1.5 z-10"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-brand text-white ring-4 ring-brand/15"
                          : "bg-tile text-silver border border-line/15"
                    }`}
                  >
                    {isCompleted ? <Check size={15} /> : fa(s.id)}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold ${
                      isActive
                        ? "text-brand"
                        : isCompleted
                          ? "text-emerald-500"
                          : "text-silver"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {generalError && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* مرحله ۱: ورود کد ملی، موبایل و نوع خروجی */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-4 text-right px-1">
              کد ملی و شماره موبایل متعلق به خود شخص را وارد کنید تا گزارش اعتبارسنجی بانکی با بالاترین سطح مجاز تهیه شود.
            </p>

            <FillFromProfileButton
              onFill={(u) => {
                if (u.nationalCode) setNationalCode(u.nationalCode);
                if (u.mobile) setMobileNumber(u.mobile);
              }}
            />

            <NationalCodeInput
              value={nationalCode}
              onChange={setNationalCode}
              showErrors={showFormErrors}
            />

            <MobileInput
              value={mobileNumber}
              onChange={setMobileNumber}
              showErrors={showFormErrors}
            />

            {/* انتخاب فرمت خروجی */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                نوع خروجی گزارش
              </label>
              <div className="grid grid-cols-2 gap-2 surface p-1.5 rounded-2xl border border-line/5">
                <button
                  type="button"
                  onClick={() => setOutputType("json")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    outputType === "json"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <FileSpreadsheet size={15} />
                  <span>نمایش در برنامه</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOutputType("pdf")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    outputType === "pdf"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <FileText size={15} />
                  <span>فایل PDF</span>
                </button>
              </div>
            </div>

            <div className="surface rounded-2xl p-3.5 mb-4 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Info size={16} className="text-brand shrink-0 mt-0.5" />
              <span>
                پیش از ثبت درخواست، انطباق کد ملی و شماره موبایل (شاهکار) بررسی می‌شود.
              </span>
            </div>

            <ServicePriceBar
              priceToman={PRICE_TOMAN}
              serviceTitle="اعتبارسنجی بانکی"
            />

            <VamButton loading={loading} onClick={handleStep1Submit}>
              ادامه و دریافت کد تأیید
            </VamButton>
          </div>
        )}

        {/* مرحله ۲: ورود کد تأیید ۵ رقمی */}
        {step === 2 && (
          <div className="surface rounded-[28px] border border-line/10 p-5 space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-brand">
                <ShieldCheck size={16} />
                <span>کد تأیید ۵ رقمی به {fa(mobileNumber)} ارسال شد</span>
              </div>
              <p className="mt-1 text-[11px] text-silver">
                کد تست اعتبارسنجی:{" "}
                <span className="font-black text-ink">{fa(VALID_CREDIT_OTP)}</span>
              </p>
            </div>

            <OtpInput
              key={otpKey}
              length={5}
              onComplete={handleOtpComplete}
              loading={loading}
              error={otpError || undefined}
            />

            {otpError && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400">
                <ShieldAlert size={15} />
                <span>{otpError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-1.5 text-center text-xs font-bold text-silver hover:text-brand"
            >
              بازگشت و ویرایش اطلاعات
            </button>
          </div>
        )}

        {/* مرحله ۳: در حال آماده‌سازی گزارش (IN_PROGRESS) */}
        {step === 3 && (
          <div className="animate-in zoom-in-95 fade-in duration-400 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Clock size={18} className="text-amber-500 animate-pulse" />
                  <span>در حال تهیه گزارش اعتباری</span>
                </div>
                {inquiryData?.level && (
                  <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-extrabold text-brand">
                    سطح {LEVEL_LABELS[inquiryData.level]}
                  </span>
                )}
              </div>

              <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-ink">
                    {inquiryData?.stage
                      ? STAGE_LABELS[inquiryData.stage] ?? inquiryData.stage
                      : "در حال پردازش اطلاعات..."}
                  </span>
                  <span className="font-black text-amber-500">
                    {fa(inquiryData?.progress ?? 15)}٪
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-line/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${Math.max(10, Math.min(100, inquiryData?.progress ?? 15))}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-silver mt-3 leading-5">
                  وضعیت گزارش به‌صورت خودکار بررسی می‌شود. لطفاً چند لحظه صبر کنید.
                </p>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalCode)} />
              <InfoRow
                label="شناسه گزارش"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {assessmentId.slice(0, 14)}...
                  </span>
                }
              />
            </div>

            <VamButton
              loading={polling}
              onClick={() => fetchAssessmentStatus(assessmentId, pollAttempt)}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={16} />
                <span>بررسی دستی وضعیت</span>
              </span>
            </VamButton>
          </div>
        )}

        {/* مرحله ۴: نتیجه نهایی گزارش (DONE) */}
        {step === 4 && inquiryData && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {inquiryData.outputType === "pdf" ? (
              <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[15px] font-extrabold">
                    <FileText size={18} className="text-brand" />
                    <span>گزارش اعتباری (PDF)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
                    <ShieldCheck size={13} />
                    آماده دانلود
                  </span>
                </div>

                <div className="rounded-2xl bg-brand/10 border border-brand/20 p-5 text-center mb-4">
                  <FileText size={32} className="text-brand mx-auto mb-2" />
                  <div
                    className="text-xs font-extrabold text-ink font-mono break-all"
                    dir="ltr"
                  >
                    {inquiryData.fileName}
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand text-white px-5 py-2.5 text-xs font-extrabold active:scale-95 transition-transform"
                  >
                    <Download size={15} />
                    <span>دانلود فایل PDF گزارش</span>
                  </button>
                </div>

                {inquiryData.level && (
                  <InfoRow
                    label="سطح گزارش"
                    value={LEVEL_LABELS[inquiryData.level]}
                  />
                )}
                <InfoRow label="کد ملی" value={fa(nationalCode)} />
              </div>
            ) : (
              <>
                {/* کیلومترشمار سینک‌شده با امتیاز واقعی */}
                {inquiryData.data?.creditScore?.score !== undefined && (
                  <div className="-mx-4">
                    <CreditGauge
                      filled
                      score={inquiryData.data.creditScore.score}
                      grade={inquiryData.data.creditScore.riskGrade}
                    />
                  </div>
                )}

                <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[15px] font-extrabold">
                      <FileSpreadsheet size={18} className="text-brand" />
                      <span>نتیجه اعتبارسنجی</span>
                    </div>
                    {inquiryData.level && (
                      <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-extrabold text-brand">
                        سطح {LEVEL_LABELS[inquiryData.level]}
                      </span>
                    )}
                  </div>

                  {inquiryData.data?.user?.fullName && (
                    <InfoRow
                      label="نام و نام خانوادگی"
                      value={inquiryData.data.user.fullName}
                    />
                  )}
                  <InfoRow label="کد ملی" value={fa(nationalCode)} />
                  <InfoRow label="شماره موبایل" value={fa(mobileNumber)} />
                </div>

                {/* خلاصه تسهیلات */}
                {inquiryData.data && (
                  <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
                    <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                      <Landmark size={18} className="text-brand" />
                      <span>خلاصه وضعیت تسهیلات</span>
                    </div>
                    <InfoRow
                      label="مجموع کل تسهیلات"
                      value={formatRial(inquiryData.data.facilityTotalAmount)}
                    />
                    <InfoRow
                      label="مانده بدهی کل"
                      value={formatRial(inquiryData.data.facilityDebtTotalAmount)}
                    />
                    <InfoRow
                      label="مانده سررسید گذشته"
                      value={formatRial(
                        inquiryData.data.facilityPastExpiredTotalAmount
                      )}
                    />
                    <InfoRow
                      label="مانده معوق"
                      value={formatRial(
                        inquiryData.data.facilityDeferredTotalAmount
                      )}
                    />
                    <InfoRow
                      label="مانده مشکوک‌الوصول"
                      value={formatRial(
                        inquiryData.data.facilitySuspiciousTotalAmount
                      )}
                    />
                  </div>
                )}

                {/* خلاصه ضمانت‌ها */}
                {inquiryData.data?.guaranteeTotalAmount !== undefined && (
                  <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
                    <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                      <TrendingUp size={18} className="text-brand" />
                      <span>خلاصه تعهدات و ضمانت‌ها</span>
                    </div>
                    <InfoRow
                      label="مجموع مبلغ ضمانت‌ها"
                      value={formatRial(inquiryData.data.guaranteeTotalAmount)}
                    />
                    <InfoRow
                      label="مانده بدهی ضمانت‌ها"
                      value={formatRial(
                        inquiryData.data.guaranteeDebtTotalAmount
                      )}
                    />
                    <InfoRow
                      label="سررسید گذشته ضمانت‌ها"
                      value={formatRial(
                        inquiryData.data.guaranteePastExpiredTotalAmount
                      )}
                    />
                  </div>
                )}

                {/* سیگنال‌های مثبت و هشدارها */}
                {((inquiryData.data?.positiveSignalList?.length ?? 0) > 0 ||
                  (inquiryData.data?.attentionSignalList?.length ?? 0) > 0) && (
                  <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm space-y-3">
                    {inquiryData.data?.positiveSignalList?.map((sig, idx) => (
                      <div
                        key={`pos-${idx}`}
                        className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-3 flex items-start gap-2.5 text-xs font-bold text-emerald-600"
                      >
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span>{sig.title || sig.description}</span>
                      </div>
                    ))}

                    {inquiryData.data?.attentionSignalList?.map((sig, idx) => (
                      <div
                        key={`att-${idx}`}
                        className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-3 flex items-start gap-2.5 text-xs font-bold text-amber-600"
                      >
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <span>{sig.title || sig.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                <ResultExport
                  title="گزارش اعتبارسنجی بانکی"
                  fileName={`credit-report-${nationalCode}`}
                  rows={[
                    { label: "کد ملی", value: fa(nationalCode) },
                    { label: "شماره موبایل", value: fa(mobileNumber) },
                    {
                      label: "امتیاز اعتباری",
                      value: `${fa(inquiryData.data?.creditScore?.score ?? 0)} از ۹۰۰`,
                    },
                    {
                      label: "رتبه اعتباری",
                      value: inquiryData.data?.creditScore?.riskGrade || "—",
                    },
                  ]}
                />
              </>
            )}

            <VamButton onClick={() => router.push("/profile/credit")}>
              مشاهده در پروفایل اعتباری و نمودار پیشرفت
            </VamButton>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold active:scale-95 transition-transform"
            >
              اعتبارسنجی جدید
            </button>
          </div>
        )}
      </div>

      {GateSheets}
    </div>
  );
}
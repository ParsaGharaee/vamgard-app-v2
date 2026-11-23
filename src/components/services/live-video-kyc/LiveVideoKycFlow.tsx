"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ScanFace,
  Mic,
  Info,
  Clock,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import {
  BirthDateInput,
  isValidBirthDate,
} from "../shared/inputs/BirthDateInput";
import {
  NationalCardSerialInput,
  isValidNationalCardSerial,
} from "../shared/inputs/NationalCardSerialInput";
import {
  LiveVideoInput,
  isValidLiveVideo,
} from "../shared/inputs/LiveVideoInput";
import { fa } from "@/src/lib/format";

interface LiveVideoKycResult {
  faceVerification: number;
  liveness: number;
  speechSimilarity?: number;
  printLiveness: string;
  replayLiveness: string;
  trackingCode: string;
}

const MetricBar = ({
  label,
  value,
  passed,
}: {
  label: string;
  value: number;
  passed: boolean;
}) => {
  const percent = value <= 1 ? Math.round(value * 100) : Math.min(100, value);
  return (
    <div className="rounded-2xl bg-tile/40 p-3.5 border border-line/5">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-extrabold text-ink">{label}</span>
        <span
          className={`font-black ${passed ? "text-emerald-500" : "text-red-500"}`}
        >
          {fa(percent)}٪
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            passed ? "bg-emerald-500" : "bg-red-500"
          }`}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
};

export default function LiveVideoKycFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [video, setVideo] = useState<File | null>(null);
  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [speechText, setSpeechText] = useState("");

  const [result, setResult] = useState<LiveVideoKycResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (
      !isValidLiveVideo(video) ||
      !isValidNationalCode(nationalCode) ||
      !isValidBirthDate(birthDate) ||
      !isValidNationalCardSerial(serialNumber)
    ) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", video!);
      formData.append("nationalCode", nationalCode);
      formData.append("birthDate", birthDate);
      formData.append("serialNumber", serialNumber);
      if (speechText.trim()) {
        formData.append("speechText", speechText.trim());
      }

      // POST /kyc/v2/clients/{clientId}/compareLiveVideoWithNationalCard?trackId=${crypto.randomUUID()}
      await new Promise((r) => setTimeout(r, 1800));

      const mockResponse = {
        responseCode: "FN-BRFH-20000810000",
        trackId: "5ddcd262-2c28-467a-848d-7cef8de85c1c",
        result: {
          faceVerification: 95.7,
          liveness: 80.3,
          ...(speechText.trim() ? { speechSimilarity: 88.3 } : {}),
          printLiveness: "0.4205",
          replayLiveness: "0.0394",
          trackingCode: "123456",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در بررسی انطباق ویدئو زنده با عکس کارت ملی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVideo(null);
    setNationalCode("");
    setBirthDate("");
    setSerialNumber("");
    setSpeechText("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const facePassed = result ? result.faceVerification > 0.9 : false;
  const livenessPassed = result ? result.liveness > 0.001 : false;
  const speechPassed =
    result?.speechSimilarity !== undefined
      ? result.speechSimilarity > 0.5
      : true;
  const overallPassed = facePassed && livenessPassed && speechPassed;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="انطباق ویدئو زنده و کارت ملی" />

      <div className="px-4 mt-6">
        {generalError && !result && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} />
            {generalError}
          </div>
        )}

        {/* فرم ورودی */}
        {!result && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              ویدئوی سلفی زنده، کد ملی، تاریخ تولد و سریال پشت کارت ملی هوشمند را وارد کنید تا تطابق چهره و زنده بودن ویدئو بررسی شود.
            </p>

            <LiveVideoInput
              file={video}
              onChange={setVideo}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nationalCode}
              onChange={setNationalCode}
              showErrors={showFormErrors}
            />

            <BirthDateInput
              value={birthDate}
              onChange={setBirthDate}
              showErrors={showFormErrors}
            />

            <NationalCardSerialInput
              value={serialNumber}
              onChange={setSerialNumber}
              showErrors={showFormErrors}
            />

            {/* فیلد اختیاری متن گفتار */}
            <div className="mb-5 relative">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                متن مورد انتظار برای خوانش در ویدئو (اختیاری)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: سلام، جهت احراز هویت در وام‌گرد"
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  className="w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[14px] font-bold outline-none transition-all duration-300 text-right border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
                />
                <Mic
                  size={20}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver/60 group-focus-within:text-brand transition-colors"
                />
              </div>
            </div>

            {/* نکته محدودیت ساعتی سرویس */}
            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                این سرویس از ساعت <b className="text-ink">۲۳:۰۰ تا ۰۷:۰۰ صبح</b> در دسترس نیست.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              بررسی ویدئو و احراز هویت
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <ScanFace size={18} className="text-brand" />
                  <span>نتیجه احراز هویت ویدئویی</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت نهایی */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  overallPassed
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {overallPassed ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {overallPassed
                    ? "احراز هویت ویدئویی تایید شد"
                    : "احراز هویت ویدئویی رد شد"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {overallPassed
                    ? "چهره و لایو بودن ویدئو با تصویر کارت ملی مطابقت دارد."
                    : "حداقل یکی از شاخص‌های تطابق چهره، لایو بودن یا گفتار پایین‌تر از حد مجاز است."}
                </div>
              </div>

              {/* شاخص‌های عددی */}
              <div className="space-y-2.5 mb-4">
                <MetricBar
                  label="درصد تطبیق چهره با کارت ملی"
                  value={result.faceVerification}
                  passed={facePassed}
                />
                <MetricBar
                  label="میزان لایو بودن ویدئو"
                  value={result.liveness}
                  passed={livenessPassed}
                />
                {result.speechSimilarity !== undefined && (
                  <MetricBar
                    label="درصد تشابه گفتار با متن ورودی"
                    value={result.speechSimilarity}
                    passed={speechPassed}
                  />
                )}
              </div>

              <InfoRow
                label="احتمال ضبط از روی عکس"
                value={fa(result.printLiveness)}
              />
              <InfoRow
                label="احتمال ضبط از روی ویدئو"
                value={fa(result.replayLiveness)}
              />
              <InfoRow
                label="کد پیگیری ثبت احوال"
                value={fa(result.trackingCode)}
              />
            </div>

            <div className="surface rounded-2xl p-3.5 border border-line/5 flex items-start gap-2 text-[11px] text-silver leading-5">
              <Info size={15} className="text-brand shrink-0 mt-0.5" />
              <span>
                حد آستانه تایید: تطبیق چهره بیش از ۰٫۹، لایو بودن بیش از ۰٫۰۰۱ و تشابه گفتار بیش از ۰٫۵.
              </span>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold active:scale-95 transition-transform"
            >
              استعلام جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
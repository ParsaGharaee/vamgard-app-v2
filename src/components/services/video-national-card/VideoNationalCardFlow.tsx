"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ScanFace,
  Clock,
  Info,
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

interface VideoNationalCardResult {
  faceVerification: number;
  trackingCode: string;
}

export default function VideoNationalCardFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [video, setVideo] = useState<File | null>(null);
  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [result, setResult] = useState<VideoNationalCardResult | null>(null);
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

      // POST /kyc/v2/clients/{clientId}/compareVideoWithNationalCardImage?trackId=${crypto.randomUUID()}
      await new Promise((r) => setTimeout(r, 1800));

      const mockResponse = {
        responseCode: "FN-BRFH-20004210000",
        trackId: "5ddcd262-2c28-467a-848d-7cef8de85c1c",
        result: {
          faceVerification: 95.7,
          trackingCode: "123456",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در بررسی انطباق ویدئو با عکس کارت ملی. لطفاً مجدداً تلاش کنید."
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
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const facePassed = result ? result.faceVerification > 0.9 : false;
  const percent = result
    ? result.faceVerification <= 1
      ? Math.round(result.faceVerification * 100)
      : Math.min(100, result.faceVerification)
    : 0;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="انطباق ویدئو و کارت ملی" />

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
              ویدئوی کاربر، کد ملی، تاریخ تولد و سریال پشت کارت ملی هوشمند (یا کد رهگیری رسید) را وارد کنید تا تطابق چهره با تصویر کارت ملی بررسی شود.
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

            {/* نکته محدودیت ساعتی سرویس */}
            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                این سرویس از ساعت <b className="text-ink">۲۳:۰۰ تا ۰۷:۰۰ صبح</b> در دسترس نیست.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              بررسی انطباق ویدئو و کارت ملی
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
                  <span>نتیجه انطباق چهره</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت نهایی */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  facePassed
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {facePassed ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {facePassed
                    ? "چهره ویدئو با کارت ملی مطابقت دارد"
                    : "چهره ویدئو با کارت ملی مطابقت ندارد"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {facePassed
                    ? "درصد تشابه چهره بالاتر از حد آستانه مجاز است."
                    : "درصد تشابه چهره کمتر از حد مجاز بوده است."}
                </div>
              </div>

              {/* نوار درصد تشابه */}
              <div className="rounded-2xl bg-tile/40 p-3.5 border border-line/5 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-ink">
                    درصد تطبیق چهره با کارت ملی
                  </span>
                  <span
                    className={`font-black ${
                      facePassed ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {fa(percent)}٪
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-line/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      facePassed ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                  />
                </div>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalCode)} />
              <InfoRow
                label="کد پیگیری ثبت احوال"
                value={fa(result.trackingCode)}
              />
            </div>

            <div className="surface rounded-2xl p-3.5 border border-line/5 flex items-start gap-2 text-[11px] text-silver leading-5">
              <Info size={15} className="text-brand shrink-0 mt-0.5" />
              <span>
                حد آستانه تایید تطبیق چهره بیش از ۰٫۹ است.
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
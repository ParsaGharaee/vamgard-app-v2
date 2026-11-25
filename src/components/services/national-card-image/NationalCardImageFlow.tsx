"use client";
import { useState } from "react";
import {
  IdCard,
  ShieldAlert,
  ShieldCheck,
  Download,
  Calendar,
  Info,
  Image as ImageIcon,
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
import { fa } from "@/src/lib/format";

interface NationalCardImageResult {
  trackingCode: string;
  image: string;
  message?: string;
}

// افزودن پیشوند data URI در صورتی که پاسخ خام base64 باشد
const toDataImageSrc = (raw?: string) => {
  if (!raw) return "";
  if (raw.startsWith("data:image/")) return raw;
  return `data:image/jpeg;base64,${raw}`;
};

export default function NationalCardImageFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [serial, setSerial] = useState("");

  const [result, setResult] = useState<NationalCardImageResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (
      !isValidNationalCode(nationalCode) ||
      !isValidBirthDate(birthDate) ||
      !isValidNationalCardSerial(serial)
    ) {
      return;
    }

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/nationalCardImage?trackId=${crypto.randomUUID()}&nationalCode=${nationalCode}&birthDate=${encodeURIComponent(birthDate)}&serial=${serial}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "43d70b50-c767-4ef6-b220-202610782b05",
        result: {
          trackingCode: "123456",
          // در حالت واقعی رشته خام base64 JPEG از فینوتک برمی‌گردد
          image:
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"><rect width="320" height="400" rx="16" fill="#e2e8f0"/><circle cx="160" cy="145" r="58" fill="#94a3b8"/><path d="M70 340c10-65 55-95 90-95s80 30 90 95" fill="#94a3b8"/></svg>`
            ),
          message: "",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در دریافت تصویر کارت ملی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.image) return;
    const link = document.createElement("a");
    link.href = toDataImageSrc(result.image);
    link.download = `national-card-${nationalCode}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setNationalCode("");
    setBirthDate("");
    setSerial("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const imageSrc = toDataImageSrc(result?.image);

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="دریافت تصویر کارت ملی" />

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
              کد ملی، تاریخ تولد و سریال پشت کارت ملی هوشمند (یا کد رهگیری رسید کاغذی) را وارد کنید تا تصویر ثبت‌شده در کارت ملی دریافت شود.
            </p>

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
              value={serial}
              onChange={setSerial}
              showErrors={showFormErrors}
            />

            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Info size={16} className="text-brand shrink-0 mt-0.5" />
              <span>
                در صورت عدم دریافت کارت ملی هوشمند، کد رهگیری رسید کاغذی را در فیلد سریال وارد کنید.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              دریافت تصویر کارت ملی
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <IdCard size={18} className="text-brand" />
                  <span>تصویر کارت ملی</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
                  <ShieldCheck size={13} />
                  دریافت شد
                </span>
              </div>

              {/* پیش‌نمایش تصویر دریافت‌شده */}
              {imageSrc ? (
                <div className="flex flex-col items-center mb-5">
                  <div className="w-44 aspect-[4/5] rounded-2xl overflow-hidden border border-line/10 bg-tile/40 shadow-sm">
                    <img
                      src={imageSrc}
                      alt="تصویر کارت ملی"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2 text-xs font-extrabold active:scale-95 transition-transform"
                  >
                    <Download size={14} />
                    <span>دانلود تصویر</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-tile/40 p-6 mb-4 flex flex-col items-center gap-2 text-silver">
                  <ImageIcon size={28} />
                  <span className="text-xs font-bold">
                    تصویری در پاسخ سرویس دریافت نشد
                  </span>
                </div>
              )}

              {result.message && (
                <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-3 mb-4 text-xs font-bold text-amber-500 text-right">
                  {result.message}
                </div>
              )}

              <InfoRow label="کد ملی" value={fa(nationalCode)} />
              <InfoRow
                label="تاریخ تولد"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(birthDate)}
                  </span>
                }
              />
              <InfoRow
                label="سریال / کد رهگیری"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {serial}
                  </span>
                }
              />
              <InfoRow
                label="کد پیگیری ثبت احوال"
                value={fa(result.trackingCode)}
              />
              <InfoRow
                label="کد پیگیری استعلام"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    #{trackId.split("-")[0].toUpperCase()}
                  </span>
                }
              />
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
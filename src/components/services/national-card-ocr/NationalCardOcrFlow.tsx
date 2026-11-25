"use client";
import { useState } from "react";
import {
  ScanText,
  ShieldAlert,
  ShieldCheck,
  IdCard,
  CreditCard,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CardImageInput,
  isValidCardImage,
} from "../shared/inputs/CardImageInput";
import { fa } from "@/src/lib/format";

type OcrRequestType = "uploadCardFront" | "uploadCardBack";

interface NationalCardOcrResult {
  nationalCode?: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  birthDate?: string;
  expirationDate?: string;
  serial?: string;
  docType: "national-card-front" | "national-card-back";
}

export default function NationalCardOcrFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [type, setType] = useState<OcrRequestType>("uploadCardFront");
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [result, setResult] = useState<NationalCardOcrResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleTypeChange = (nextType: OcrRequestType) => {
    if (nextType === type) return;
    setType(nextType);
    setCardImage(null);
    setShowFormErrors(false);
    setGeneralError("");
  };

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCardImage(cardImage)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cardImage", cardImage!);
      formData.append("type", type);

      // POST /kyc/v2/clients/{clientId}/ocr?trackId=${crypto.randomUUID()}
      await new Promise((r) => setTimeout(r, 1700));

      const mockResponse =
        type === "uploadCardFront"
          ? {
              responseCode: "FN-BRFH-20001300000",
              trackId: "3e35adb9-0164-4d5a-9259-70024eff51c9",
              result: {
                nationalCode: "0024143331",
                firstName: "سیمون",
                lastName: "دوبوار",
                fatherName: "عباس",
                birthDate: "1375/11/02",
                expirationDate: "1405/11/04",
                docType: "national-card-front" as const,
              },
              status: "DONE",
            }
          : {
              responseCode: "FN-BRFH-20001300000",
              trackId: "7a12cdb9-0164-4d5a-9259-70024eff51c9",
              result: {
                serial: "1R29366454",
                docType: "national-card-back" as const,
              },
              status: "DONE",
            };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استخراج اطلاعات کارت ملی. لطفاً از واضح بودن تصویر و فرمت JPG اطمینان حاصل کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const resetForm = () => {
    setCardImage(null);
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedField(null);
  };

  const isFront = result?.docType === "national-card-front";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="خواندن کارت ملی (OCR)" />

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
              سمت مورد نظر کارت ملی (رو یا پشت کارت) را انتخاب و تصویر واضح آن را با فرمت JPG بارگذاری کنید تا اطلاعات کارت به‌صورت خودکار استخراج شود.
            </p>

            {/* انتخاب سمت کارت ملی */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                سمت کارت ملی
              </label>
              <div className="grid grid-cols-2 gap-2 surface p-1.5 rounded-2xl border border-line/5">
                <button
                  type="button"
                  onClick={() => handleTypeChange("uploadCardFront")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    type === "uploadCardFront"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <IdCard size={16} />
                  <span>روی کارت ملی</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("uploadCardBack")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    type === "uploadCardBack"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <CreditCard size={16} />
                  <span>پشت کارت ملی</span>
                </button>
              </div>
            </div>

            <CardImageInput
              file={cardImage}
              onChange={setCardImage}
              label={
                type === "uploadCardFront"
                  ? "تصویر روی کارت ملی (فرمت JPG)"
                  : "تصویر پشت کارت ملی (فرمت JPG)"
              }
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استخراج اطلاعات کارت ملی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <ScanText size={18} className="text-brand" />
                  <span>اطلاعات استخراج‌شده</span>
                </div>
                <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-extrabold text-brand">
                  {isFront ? "روی کارت ملی" : "پشت کارت ملی"}
                </span>
              </div>

              <div className="p-4 rounded-2xl mb-4 bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={24} className="shrink-0" />
                <div className="text-xs font-extrabold">
                  اطلاعات تصویر با موفقیت خوانده شد
                </div>
              </div>

              {result.firstName && (
                <InfoRow label="نام" value={result.firstName} />
              )}
              {result.lastName && (
                <InfoRow label="نام خانوادگی" value={result.lastName} />
              )}
              {result.fatherName && (
                <InfoRow label="نام پدر" value={result.fatherName} />
              )}
              {result.nationalCode && (
                <InfoRow
                  label="کد ملی"
                  value={
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(result.nationalCode!, "nationalCode")
                      }
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-ink active:scale-95 transition-transform"
                      dir="ltr"
                    >
                      <span>{fa(result.nationalCode)}</span>
                      {copiedField === "nationalCode" ? (
                        <Check size={13} className="text-emerald-500" />
                      ) : (
                        <Copy size={13} className="text-silver" />
                      )}
                    </button>
                  }
                />
              )}
              {result.birthDate && (
                <InfoRow
                  label="تاریخ تولد"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-silver" />
                      {fa(result.birthDate)}
                    </span>
                  }
                />
              )}
              {result.expirationDate && (
                <InfoRow
                  label="تاریخ انقضا کارت"
                  value={
                    <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                      <Calendar size={13} />
                      {fa(result.expirationDate)}
                    </span>
                  }
                />
              )}
              {result.serial && (
                <InfoRow
                  label="سریال پشت کارت ملی"
                  value={
                    <button
                      type="button"
                      onClick={() => handleCopy(result.serial!, "serial")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-brand active:scale-95 transition-transform"
                      dir="ltr"
                    >
                      <span>{result.serial}</span>
                      {copiedField === "serial" ? (
                        <Check size={13} className="text-emerald-500" />
                      ) : (
                        <Copy size={13} className="text-silver" />
                      )}
                    </button>
                  }
                />
              )}
              <InfoRow
                label="کد پیگیری"
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
              اسکن جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
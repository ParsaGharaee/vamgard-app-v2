"use client";
import { useState } from "react";
import {
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Info,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  PdfFileInput,
  isValidPdfFile,
  fileToRawBase64,
} from "../shared/inputs/PdfFileInput";
import { fa } from "@/src/lib/format";

type SignProvider = "pki" | "emzasan" | "sepidar";

interface DigitalSignVerifyResult {
  valid: boolean;
}

const PROVIDERS: Array<{ id: SignProvider; label: string }> = [
  { id: "pki", label: "PKI (پیش‌فرض)" },
  { id: "emzasan", label: "امضاسان" },
  { id: "sepidar", label: "سپیدار" },
];

export default function DigitalSignVerifyFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [provider, setProvider] = useState<SignProvider>("pki");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [result, setResult] = useState<DigitalSignVerifyResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidPdfFile(pdfFile)) return;

    setLoading(true);
    try {
      const fileData = await fileToRawBase64(pdfFile!);

      // بررسی شروع بایت‌های PDF با %PDF (در Base64 معادل JVBERi0)
      if (!fileData.startsWith("JVBERi0")) {
        setGeneralError(
          "فایل انتخاب‌شده یک سند PDF معتبر نیست (ساختار فایل با %PDF شروع نمی‌شود)."
        );
        setLoading(false);
        return;
      }

      // POST /sign/v2/clients/{clientId}/digitalSign/verify?trackId=${crypto.randomUUID()}
      // Body: { provider, pdf: { fileData } }
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "96483d07-4ca2-4461-b285-11adf3eec335",
        result: {
          valid: true,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در بررسی اعتبار امضای دیجیتال فایل PDF. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPdfFile(null);
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const selectedProviderLabel =
    PROVIDERS.find((p) => p.id === provider)?.label ?? provider;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="اعتبارسنجی PDF امضاشده" />

      <div className="px-4 mt-6">
        {generalError && !result && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* فرم ورودی */}
        {!result && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              ارائه‌دهنده امضای دیجیتال را انتخاب و فایل PDF امضاشده را بارگذاری کنید تا اصالت و اعتبار امضای دیجیتال آن بررسی شود.
            </p>

            {/* انتخاب ارائه‌دهنده امضا */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                ارائه‌دهنده امضای دیجیتال
              </label>
              <div className="grid grid-cols-3 gap-1.5 surface p-1.5 rounded-2xl border border-line/5">
                {PROVIDERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProvider(item.id)}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-extrabold transition-all ${
                      provider === item.id
                        ? "bg-brand text-white shadow-sm"
                        : "text-silver hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <PdfFileInput
              file={pdfFile}
              onChange={setPdfFile}
              showErrors={showFormErrors}
            />

            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Info size={16} className="text-brand shrink-0 mt-0.5" />
              <span>
                فایل انتخاب‌شده به‌صورت امن به Base64 تبدیل شده و صحت امضای دیجیتال آن بررسی می‌شود.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              بررسی اعتبار امضا
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileCheck2 size={18} className="text-brand" />
                  <span>نتیجه اعتبارسنجی امضا</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت اعتبار امضا */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  result.valid
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {result.valid ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {result.valid
                    ? "امضای دیجیتال سند معتبر است"
                    : "امضای دیجیتال سند معتبر نیست"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {result.valid
                    ? "اصالت امضا و عدم تغییر محتوای این فایل PDF تایید شد."
                    : "امضای موجود در این سند نامعتبر بوده یا فایل پس از امضا تغییر کرده است."}
                </div>
              </div>

              {pdfFile && (
                <>
                  <InfoRow
                    label="نام فایل"
                    value={
                      <span
                        className="font-mono text-[11px] truncate max-w-[180px] inline-block align-bottom"
                        dir="ltr"
                      >
                        {pdfFile.name}
                      </span>
                    }
                  />
                  <InfoRow
                    label="حجم فایل"
                    value={`${fa((pdfFile.size / (1024 * 1024)).toFixed(2))} مگابایت`}
                  />
                </>
              )}
              <InfoRow label="ارائه‌دهنده امضا" value={selectedProviderLabel} />
              <InfoRow
                label="وضعیت امضا"
                value={
                  <span
                    className={`font-extrabold ${
                      result.valid ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {result.valid ? "معتبر" : "نامعتبر"}
                  </span>
                }
              />
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold active:scale-95 transition-transform"
            >
              بررسی سند جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
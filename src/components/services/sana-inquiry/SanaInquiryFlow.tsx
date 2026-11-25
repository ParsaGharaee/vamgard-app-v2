"use client";
import { useState } from "react";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  User,
  Building2,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

type IdType = "1" | "2";

interface SanaInquiryResult {
  registered: "true" | "false" | boolean;
  message: string;
}

export default function SanaInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [idType, setIdType] = useState<IdType>("1");
  const [idCode, setIdCode] = useState("");
  const [result, setResult] = useState<SanaInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleTypeChange = (nextType: IdType) => {
    if (nextType === idType) return;
    setIdType(nextType);
    setIdCode("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    const isValid =
      idType === "1" ? isValidNationalCode(idCode) : isValidLegalId(idCode);
    if (!isValid) return;

    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/cc/sanaInquiry?idCode=${idCode}&idType=${idType}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCKZ-20003700000",
        trackId: "cc_sana_inquiry_trackId",
        result: {
          registered: "true" as const,
          message:
            "کد شناسایی وارد شده در قوه قضائیه (سامانه ثنا) احراز شده است.",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام ثبت‌نام سامانه ثنا. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIdCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const isRegistered =
    result?.registered === true || result?.registered === "true";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام ثنا" />

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
              نوع شخص (حقیقی یا حقوقی) و کد شناسایی را وارد کنید تا وضعیت ثبت‌نام و احراز هویت در سامانه ثنا قوه قضائیه بررسی شود.
            </p>

            {/* انتخاب نوع شخص: حقیقی (1) / حقوقی (2) */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                نوع شخص
              </label>
              <div className="grid grid-cols-2 gap-2 surface p-1.5 rounded-2xl border border-line/5">
                <button
                  type="button"
                  onClick={() => handleTypeChange("1")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    idType === "1"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <User size={16} />
                  <span>شخص حقیقی</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("2")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    idType === "2"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <Building2 size={16} />
                  <span>شخص حقوقی</span>
                </button>
              </div>
            </div>

            {idType === "1" ? (
              <NationalCodeInput
                value={idCode}
                onChange={setIdCode}
                showErrors={showFormErrors}
              />
            ) : (
              <LegalIdInput
                value={idCode}
                onChange={setIdCode}
                showErrors={showFormErrors}
              />
            )}

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام وضعیت ثنا
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
                  <Scale size={18} className="text-brand" />
                  <span>نتیجه استعلام سامانه ثنا</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت ثبت‌نام */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  isRegistered
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {isRegistered ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {isRegistered
                    ? "احراز شده در سامانه ثنا"
                    : "ثبت‌نام نشده در سامانه ثنا"}
                </div>
                {result.message && (
                  <div className="text-[11px] font-bold opacity-85 leading-5">
                    {result.message}
                  </div>
                )}
              </div>

              <InfoRow
                label="نوع شخص"
                value={idType === "1" ? "حقیقی" : "حقوقی"}
              />
              <InfoRow
                label={idType === "1" ? "کد ملی" : "شناسه ملی"}
                value={fa(idCode)}
              />
              <InfoRow
                label="وضعیت ثبت‌نام"
                value={
                  <span
                    className={`font-extrabold ${
                      isRegistered ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {isRegistered ? "دارای حساب ثنا" : "فاقد حساب ثنا"}
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
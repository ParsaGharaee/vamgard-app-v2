"use client";
import { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Car } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { NationalCodeInput, isValidNationalCode } from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { LicenseNumberInput, isValidLicenseNumber } from "../shared/inputs/LicenseNumberInput";
import { fa } from "@/src/lib/format";

interface NegativeScoreResult {
  LicenseNumber: string;
  NegativeScore: string;
  OffenseCount: string | null;
  Rule: string;
}

export default function NegativeScoreFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [mobile, setMobile] = useState("");

  const [result, setResult] = useState<NegativeScoreResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (
      !isValidLicenseNumber(licenseNumber) ||
      !isValidNationalCode(nationalID) ||
      !isValidMobile(mobile)
    ) {
      return;
    }

    setLoading(true);
    try {
      // GET /billing/v2/clients/{clientId}/negativeScore?licenseNumber=...&nationalID=...&mobile=...
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-BGFH-20000300000",
        trackId: "266dcf92-753c-47db-b0f9-cbbe57abffdd",
        result: {
          LicenseNumber: licenseNumber,
          NegativeScore: "0",
          OffenseCount: null,
          Rule: "-",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام نمره منفی گواهینامه. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLicenseNumber("");
    setNationalID("");
    setMobile("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const scoreNum = Number(result?.NegativeScore ?? 0);
  const isClean = scoreNum === 0;
  const isDanger = scoreNum >= 20;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="نمره منفی گواهینامه" />

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
            <p className="text-xs text-silver leading-6 mb-6 text-right px-1">
              برای مشاهده نمره منفی و وضعیت تخلفات گواهینامه، شماره گواهینامه ۱۰ رقمی، کد ملی و شماره موبایل مالک را وارد کنید.
            </p>

            <LicenseNumberInput
              value={licenseNumber}
              onChange={setLicenseNumber}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nationalID}
              onChange={setNationalID}
              showErrors={showFormErrors}
            />

            <MobileInput
              value={mobile}
              onChange={setMobile}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام نمره منفی
              </VamButton>
            </div>
          </div>
        )}

        {/* نتیجه استعلام */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Car size={18} className="text-brand" />
                  <span>نتیجه استعلام گواهینامه</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس نمایش وضعیت نمره منفی */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-1.5 border ${
                  isClean
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : isDanger
                      ? "bg-red-500/5 border-red-500/15 text-red-500"
                      : "bg-amber-500/5 border-amber-500/15 text-amber-500"
                }`}
              >
                {isClean ? (
                  <ShieldCheck size={30} />
                ) : isDanger ? (
                  <ShieldAlert size={30} />
                ) : (
                  <AlertTriangle size={30} />
                )}
                <span className="text-xs font-bold opacity-80 mt-1">امتیاز منفی فعلی</span>
                <span className="text-4xl font-black leading-none mt-0.5">
                  {fa(result.NegativeScore)}
                </span>
                <span className="text-[11px] font-bold opacity-80 mt-1">
                  {isClean
                    ? "گواهینامه شما بدون نمره منفی است"
                    : isDanger
                      ? "وضعیت هشدار؛ نزدیک به محدودیت گواهینامه"
                      : "دارای نمره منفی ثبت شده"}
                </span>
              </div>

              <InfoRow label="شماره گواهینامه" value={fa(result.LicenseNumber)} />
              <InfoRow
                label="تعداد خلافی موثر"
                value={result.OffenseCount ? `${fa(result.OffenseCount)} مورد` : "ثبت نشده"}
              />
              <InfoRow
                label="وضعیت / قانون"
                value={result.Rule && result.Rule !== "-" ? result.Rule : "بدون محدودیت"}
              />
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold mt-6 active:scale-95 transition-transform"
            >
              استعلام جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
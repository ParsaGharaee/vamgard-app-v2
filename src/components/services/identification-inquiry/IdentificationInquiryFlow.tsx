"use client";
import { useState } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Calendar,
  BookUser,
  Building,
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
import { fa } from "@/src/lib/format";

interface IdentificationResult {
  firstName: string;
  lastName: string;
  birthDate: string;
  fatherName: string;
  deathStatus: string;
  nationalId: string;
  gender: string;
  identityNo: number;
  identitySeri: string;
  identitySerial: string;
  officeName: string;
  officeCode: string;
  trackingCode: string | null;
  operationStatus: string | null;
}

const formatCompactJalali = (raw?: string) => {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return fa(`${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`);
  }
  return fa(raw);
};

export default function IdentificationInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidBirthDate(birthDate)) {
      return;
    }

    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/identificationInquiry?nationalCode=${nationalCode}&birthDate=${encodeURIComponent(birthDate)}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCST-20003000000",
        trackId: "identification_inquiry_trackId",
        result: {
          firstName: "محمد",
          lastName: "اکبری",
          birthDate: "13730125",
          fatherName: "امید",
          deathStatus: "زنده ",
          nationalId: nationalCode,
          gender: "مرد",
          identityNo: 0,
          identitySeri: "د77",
          identitySerial: "123456",
          officeName: "تهران - تهران",
          officeCode: "333",
          trackingCode: null,
          operationStatus: null,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام اطلاعات هویتی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalCode("");
    setBirthDate("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const cleanDeathStatus = result?.deathStatus?.trim() || "";
  const isAlive = cleanDeathStatus === "زنده";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اطلاعات هویتی" />

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
              کد ملی ۱۰ رقمی و تاریخ تولد فرد را وارد کنید تا مشخصات هویتی و اطلاعات شناسنامه‌ای از سامانه ثبت احوال نمایش داده شود.
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

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام اطلاعات هویتی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت مشخصات فردی */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <UserCheck size={18} className="text-brand" />
                  <span>مشخصات فردی</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    isAlive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {isAlive ? <ShieldCheck size={13} /> : <UserX size={13} />}
                  {cleanDeathStatus || "نامشخص"}
                </span>
              </div>

              <div className="p-4 rounded-2xl mb-4 bg-brand/5 border border-brand/15 text-center">
                <div className="text-base font-black text-ink">
                  {result.firstName} {result.lastName}
                </div>
                <div className="text-[11px] font-bold text-silver mt-1">
                  فرزند {result.fatherName} · {result.gender}
                </div>
              </div>

              <InfoRow label="نام" value={result.firstName} />
              <InfoRow label="نام خانوادگی" value={result.lastName} />
              <InfoRow label="نام پدر" value={result.fatherName} />
              <InfoRow label="کد ملی" value={fa(result.nationalId)} />
              <InfoRow label="جنسیت" value={result.gender} />
              <InfoRow
                label="تاریخ تولد"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {formatCompactJalali(result.birthDate)}
                  </span>
                }
              />
            </div>

            {/* کارت مشخصات شناسنامه‌ای */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <BookUser size={18} className="text-brand" />
                <span>اطلاعات شناسنامه و صدور</span>
              </div>

              <InfoRow
                label="شماره شناسنامه"
                value={fa(result.identityNo)}
              />
              <InfoRow
                label="سری و سریال شناسنامه"
                value={`${fa(result.identitySeri)} / ${fa(result.identitySerial)}`}
              />
              <InfoRow
                label="محل صدور"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Building size={13} className="text-silver" />
                    {result.officeName}
                  </span>
                }
              />
              <InfoRow label="کد اداره ثبت" value={fa(result.officeCode)} />
              {result.trackingCode && (
                <InfoRow
                  label="کد رهگیری ثبت احوال"
                  value={fa(result.trackingCode)}
                />
              )}
              {result.operationStatus && (
                <InfoRow label="وضعیت درخواست" value={result.operationStatus} />
              )}
              <InfoRow
                label="کد پیگیری استعلام"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    #{trackId.slice(0, 12).toUpperCase()}
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
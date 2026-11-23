"use client";
import { useState } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  FileBadge,
  Globe,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  ForeignerIdInput,
  isValidForeignerId,
} from "../shared/inputs/ForeignerIdInput";
import {
  BirthDateInput,
  isValidBirthDate,
} from "../shared/inputs/BirthDateInput";
import { fa } from "@/src/lib/format";

interface ForeignerIdResult {
  firstName: string;
  lastName: string;
  fullName: string;
  fatherName: string;
  ancestorName?: string;
  gender: string;
  nationality: string;
  identificationDocumentTypeTitle: string;
  identificationDocumentNumber: string;
}

export default function ForeignerIdFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [foreignerId, setForeignerId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<ForeignerIdResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidForeignerId(foreignerId) || !isValidBirthDate(birthDate)) {
      return;
    }

    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/foreignerIdInquiry?foreignerId=${foreignerId}&birthDate=${encodeURIComponent(birthDate)}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCVH-20004300000",
        trackId: "foreignerId-inq-trckId",
        result: {
          firstName: "اسدالله",
          lastName: "سامانی",
          fullName: "سیداحمد",
          fatherName: "سیدرجب",
          ancestorName: "حسین",
          gender: "مرد",
          nationality: "Afghanistan",
          identificationDocumentTypeTitle: "کارت آمایش",
          identificationDocumentNumber: "9975248674",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام اطلاعات هویتی اتباع خارجی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForeignerId("");
    setBirthDate("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اتباع خارجی" />

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
              شناسه تبعه (کد فراگیر) و تاریخ تولد فرد را وارد کنید تا مشخصات هویتی و اطلاعات سند شناسایی نمایش داده شود.
            </p>

            <ForeignerIdInput
              value={foreignerId}
              onChange={setForeignerId}
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
            {/* کارت مشخصات هویتی */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <UserCheck size={18} className="text-brand" />
                  <span>مشخصات هویتی تبعه</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="p-4 rounded-2xl mb-4 bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={26} className="shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">
                    {result.firstName} {result.lastName}
                  </div>
                  <div className="text-[11px] font-bold opacity-85 mt-0.5 flex items-center gap-1.5">
                    <Globe size={12} />
                    <span>ملیت: {result.nationality}</span>
                  </div>
                </div>
              </div>

              <InfoRow label="نام" value={result.firstName} />
              <InfoRow label="نام خانوادگی" value={result.lastName} />
              {result.fullName && (
                <InfoRow label="نام کامل" value={result.fullName} />
              )}
              <InfoRow label="نام پدر" value={result.fatherName} />
              {result.ancestorName && (
                <InfoRow label="نام پدربزرگ (جد)" value={result.ancestorName} />
              )}
              <InfoRow label="جنسیت" value={result.gender} />
              <InfoRow
                label="تاریخ تولد"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(birthDate)}
                  </span>
                }
              />
            </div>

            {/* کارت سند شناسایی */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <FileBadge size={18} className="text-brand" />
                <span>اطلاعات سند شناسایی</span>
              </div>

              <InfoRow label="شناسه تبعه" value={fa(foreignerId)} />
              <InfoRow
                label="نوع سند شناسایی"
                value={result.identificationDocumentTypeTitle}
              />
              <InfoRow
                label="شماره سند شناسایی"
                value={fa(result.identificationDocumentNumber)}
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
"use client";
import { useState } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Calendar,
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
import { fa } from "@/src/lib/format";

interface NidInquiryResult {
  birthdate?: string;
  birthDate?: string;
  deathStatus: string;
  nationalCode: string;
  firstName: string;
  lastName: string;
  fatherName: string;
}

export default function NidInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nid, setNid] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NidInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nid) || !isValidBirthDate(birthDate)) return;

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/users/${nid}/cc/nidInquiry?birthDate=${encodeURIComponent(birthDate)}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-FYST-20000500000",
        trackId: "0cf5f12f-35aa-48e2-9dfb-42dc59d62f58",
        result: {
          birthdate: birthDate,
          deathStatus: "زنده",
          nationalCode: nid,
          firstName: "محسن",
          lastName: "اکبری",
          fatherName: "علی",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام کد ملی و اطلاعات ثبت احوال. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNid("");
    setBirthDate("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const cleanDeathStatus = result?.deathStatus?.trim() || "";
  const isAlive = cleanDeathStatus === "زنده";
  const resolvedBirthDate = result?.birthdate || result?.birthDate || birthDate;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام کد ملی" />

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
              کد ملی ۱۰ رقمی و تاریخ تولد را وارد کنید تا صحت کد ملی، نام و نام خانوادگی، نام پدر و وضعیت حیات از ثبت احوال استعلام شود.
            </p>

            <NationalCodeInput
              value={nid}
              onChange={setNid}
              showErrors={showFormErrors}
            />

            <BirthDateInput
              value={birthDate}
              onChange={setBirthDate}
              showErrors={showFormErrors}
            />

            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-center gap-2.5 text-[11px] text-silver">
              <Clock size={16} className="text-emerald-500 shrink-0" />
              <span>این سرویس در تمامی ساعات شبانه‌روز (۲۴ ساعته) فعال است.</span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              استعلام کد ملی
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <UserCheck size={18} className="text-brand" />
                  <span>نتیجه استعلام کد ملی</span>
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

              {/* باکس خلاصه هویتی */}
              <div className="p-4 rounded-2xl mb-4 bg-brand/5 border border-brand/15 text-center">
                <div className="text-base font-black text-ink">
                  {result.firstName} {result.lastName}
                </div>
                <div className="text-[11px] font-bold text-silver mt-1">
                  فرزند {result.fatherName}
                </div>
              </div>

              <InfoRow label="نام" value={result.firstName} />
              <InfoRow label="نام خانوادگی" value={result.lastName} />
              <InfoRow label="نام پدر" value={result.fatherName} />
              <InfoRow label="کد ملی" value={fa(result.nationalCode)} />
              <InfoRow
                label="تاریخ تولد"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(resolvedBirthDate)}
                  </span>
                }
              />
              <InfoRow
                label="وضعیت حیات"
                value={
                  <span
                    className={`font-extrabold ${
                      isAlive ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {cleanDeathStatus || "—"}
                  </span>
                }
              />
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
              استعلام جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
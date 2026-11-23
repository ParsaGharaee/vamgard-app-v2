"use client";
import { useState } from "react";
import {
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Clock,
  Calendar,
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

interface DeathStatusResult {
  deathStatus: string;
  trackingCode: string;
}

export default function DeathStatusFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<DeathStatusResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidBirthDate(birthDate)) {
      return;
    }

    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/deathStatusInquiry?nationalCode=${nationalCode}&birthDate=${encodeURIComponent(birthDate)}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "9602281200",
        responseCode: "FN-KCFH-20002500000",
        result: {
          deathStatus: "زنده",
          trackingCode: "123",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام وضعیت حیات. لطفاً مجدداً تلاش کنید."
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

  const isAlive = result?.deathStatus === "زنده";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام وضعیت حیات" />

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
              کد ملی ۱۰ رقمی و تاریخ تولد فرد را وارد کنید تا وضعیت حیات بر اساس پایگاه داده ثبت احوال استعلام شود.
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

            {/* نکته محدودیت ساعتی سرویس */}
            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                این سرویس از ساعت <b className="text-ink">۲۳:۰۰ تا ۰۷:۰۰ صبح</b> غیرفعال است.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              استعلام وضعیت حیات
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <HeartPulse size={18} className="text-brand" />
                  <span>نتیجه استعلام وضعیت حیات</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت حیات */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  isAlive
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {isAlive ? <ShieldCheck size={34} /> : <UserX size={34} />}
                <div className="text-lg font-black">{result.deathStatus}</div>
                <div className="text-[11px] font-bold opacity-85">
                  {isAlive
                    ? "در سامانه ثبت احوال در قید حیات ثبت شده است."
                    : "در سامانه ثبت احوال فوت‌شده ثبت شده است."}
                </div>
              </div>

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
                label="کد رهگیری ثبت احوال"
                value={fa(result.trackingCode)}
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
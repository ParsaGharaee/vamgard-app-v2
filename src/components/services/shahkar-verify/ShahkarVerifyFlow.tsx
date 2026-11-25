"use client";
import { useState } from "react";
import { Smartphone, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { fa } from "@/src/lib/format";

interface ShahkarVerifyResult {
  isValid: boolean;
}

export default function ShahkarVerifyFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [result, setResult] = useState<ShahkarVerifyResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidMobile(mobile)) return;

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/shahkar/verify?mobile=${mobile}&nationalCode=${nationalCode}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-FYVR-20001000000",
        trackId: "e983dc66-2585-4ee3-90f0-ff2830a0eb83",
        result: {
          isValid: true,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام شاهکار. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalCode("");
    setMobile("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تطبیق شاهکار موبایل و کدملی" />

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
              کد ملی ۱۰ رقمی و شماره موبایل را وارد کنید تا مالکیت سیم‌کارت و انطباق آن با کد ملی از طریق سامانه شاهکار بررسی شود.
            </p>

            <NationalCodeInput
              value={nationalCode}
              onChange={setNationalCode}
              showErrors={showFormErrors}
            />

            <MobileInput
              value={mobile}
              onChange={setMobile}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام تطبیق شاهکار
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
                  <Smartphone size={18} className="text-brand" />
                  <span>نتیجه استعلام شاهکار</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس نتیجه تطبیق */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  result.isValid
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {result.isValid ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {result.isValid
                    ? "شماره موبایل و کد ملی مطابقت دارند"
                    : "شماره موبایل و کد ملی مطابقت ندارند"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {result.isValid
                    ? "این شماره موبایل به نام دارنده کد ملی وارد شده ثبت شده است."
                    : "مالکیت این شماره موبایل با کد ملی وارد شده هم‌خوانی ندارد."}
                </div>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalCode)} />
              <InfoRow label="شماره موبایل" value={fa(mobile)} />
              <InfoRow
                label="وضعیت انطباق"
                value={
                  <span
                    className={`font-extrabold ${
                      result.isValid ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {result.isValid ? "تایید شده" : "عدم تطابق"}
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
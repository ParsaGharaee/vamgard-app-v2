"use client";
import { useState } from "react";
import { Landmark, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { IbanInput, isValidIban } from "../shared/inputs/IbanInput";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface IbanOwnerVerificationResult {
  isValid: "yes" | "no";
}

const formatIbanDisplay = (iban: string) =>
  iban.replace(/(.{4})(?=.)/g, "$1 ");

export default function IbanOwnerVerificationFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [iban, setIban] = useState("");
  const [nid, setNid] = useState("");
  const [result, setResult] = useState<IbanOwnerVerificationResult | null>(
    null
  );
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidIban(iban) || !isValidNationalCode(nid)) return;

    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/ibanOwnerVerification?nid=${nid}&iban=${iban}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCFH-20002800000",
        trackId: "iovTrackId",
        result: {
          isValid: "yes" as const,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام تطبیق شماره شبا و کد ملی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIban("");
    setNid("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const isMatched = result?.isValid === "yes";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تطبیق شبا و کد ملی" />

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
              شماره شبا (۲۴ رقم بدون IR) و کد ملی صاحب حساب را وارد کنید تا انطباق مالکیت حساب بررسی شود.
            </p>

            <IbanInput
              value={iban}
              onChange={setIban}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nid}
              onChange={setNid}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                بررسی تطبیق شبا و کد ملی
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
                  <Landmark size={18} className="text-brand" />
                  <span>نتیجه تطبیق مالکیت شبا</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* باکس نتیجه تطبیق */}
              <div
                className={`p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border ${
                  isMatched
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {isMatched ? (
                  <ShieldCheck size={34} />
                ) : (
                  <ShieldX size={34} />
                )}
                <div className="text-base font-black">
                  {isMatched
                    ? "شماره شبا و کد ملی مطابقت دارند"
                    : "شماره شبا و کد ملی مطابقت ندارند"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {isMatched
                    ? "این شماره شبا متعلق به دارنده کد ملی وارد شده است."
                    : "مالکیت این شماره شبا با کد ملی وارد شده هم‌خوانی ندارد."}
                </div>
              </div>

              <InfoRow
                label="شماره شبا"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {formatIbanDisplay(iban)}
                  </span>
                }
              />
              <InfoRow label="کد ملی" value={fa(nid)} />
              <InfoRow
                label="وضعیت انطباق"
                value={
                  <span
                    className={`font-extrabold ${
                      isMatched ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {isMatched ? "تایید شده" : "عدم تطابق"}
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
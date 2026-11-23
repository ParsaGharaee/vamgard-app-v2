"use client";
import { useState } from "react";
import { CreditCard, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CardNumberInput,
  isValidCardNumber,
} from "../shared/inputs/CardNumberInput";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface CardOwnerVerificationResult {
  isValid: boolean;
}

const formatCard = (card: string) =>
  card.replace(/(\d{4})(?=\d)/g, "$1 - ");

export default function CardOwnerVerificationFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [card, setCard] = useState("");
  const [nid, setNid] = useState("");
  const [result, setResult] = useState<CardOwnerVerificationResult | null>(
    null
  );
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCardNumber(card) || !isValidNationalCode(nid)) return;

    setLoading(true);
    try {
      // POST /kyc/v2/clients/{clientId}/cardOwnerVerification
      // Body: { card, nid }
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCFH-20002800000",
        trackId: "covTrackId",
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
        "خطا در استعلام تطبیق شماره کارت و کد ملی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCard("");
    setNid("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تطبیق کارت و کد ملی" />

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
              شماره کارت ۱۶ رقمی و کد ملی ۱۰ رقمی را وارد کنید تا مالکیت کارت و انطباق آن با کد ملی بررسی شود.
            </p>

            <CardNumberInput
              value={card}
              onChange={setCard}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nid}
              onChange={setNid}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                بررسی تطبیق کارت و کد ملی
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
                  <CreditCard size={18} className="text-brand" />
                  <span>نتیجه تطبیق مالکیت</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
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
                    ? "شماره کارت و کد ملی مطابقت دارند"
                    : "شماره کارت و کد ملی مطابقت ندارند"}
                </div>
                <div className="text-[11px] font-bold opacity-85">
                  {result.isValid
                    ? "این شماره کارت متعلق به دارنده کد ملی وارد شده است."
                    : "مالکیت این شماره کارت با کد ملی وارد شده هم‌خوانی ندارد."}
                </div>
              </div>

              <InfoRow
                label="شماره کارت"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {fa(formatCard(card))}
                  </span>
                }
              />
              <InfoRow label="کد ملی" value={fa(nid)} />
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
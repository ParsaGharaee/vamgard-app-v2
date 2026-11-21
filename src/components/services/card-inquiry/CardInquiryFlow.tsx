"use client";
import { useState } from "react";
import { CreditCard, ShieldAlert, ShieldCheck, Clock, Landmark } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CardNumberInput,
  isValidCardNumber,
} from "../shared/inputs/CardNumberInput";
import { fa } from "@/src/lib/format";

interface CardInquiryResult {
  destCard: string;
  name: string;
  result: string;
  description: string;
  doTime: string;
  bankName: string;
}

export default function CardInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [card, setCard] = useState("");
  const [result, setResult] = useState<CardInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCardNumber(card)) return;

    setLoading(true);
    try {
      // GET /mpg/v2/clients/{clientId}/cards/${card}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        result: {
          destCard: `xxxx-xxxx-xxxx-${card.slice(-4)}`,
          name: "علی آقایی",
          result: "0",
          description: "موفق",
          doTime: "1403/08/15 12:32:04",
          bankName: "بانک تجارت",
        },
        status: "DONE",
        trackId: "get-cardInfo-0232",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام اطلاعات کارت. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCard("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام کارت" />

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
              برای مشاهده نام صاحب کارت و بانک صادرکننده، شماره کارت ۱۶ رقمی عضو شتاب را وارد کنید.
            </p>

            <CardNumberInput
              value={card}
              onChange={setCard}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام اطلاعات کارت
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            {/* پیش‌نمایش کارت بانکی */}
            <div className="relative overflow-hidden rounded-[26px] bg-linear-to-bl from-[#0B3FA8] via-brand to-accent p-5 text-white shadow-lg shadow-brand/25 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-extrabold">
                  <Landmark size={18} />
                  <span>{result.bankName}</span>
                </div>
                <CreditCard size={22} className="opacity-80" />
              </div>

              <div
                dir="ltr"
                className="mt-6 text-center font-mono text-lg font-black tracking-[0.18em]"
              >
                {fa(result.destCard)}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="font-extrabold text-sm">{result.name}</span>
                <span className="rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold">
                  {result.description}
                </span>
              </div>
            </div>

            {/* جزئیات استعلام */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-extrabold">جزئیات استعلام کارت</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <ShieldCheck size={15} />
                  {result.description}
                </span>
              </div>

              <InfoRow label="نام صاحب کارت" value={result.name} />
              <InfoRow label="نام بانک" value={result.bankName} />
              <InfoRow label="شماره کارت" value={fa(result.destCard)} />
              <InfoRow
                label="زمان استعلام"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} className="text-silver" />
                    {fa(result.doTime)}
                  </span>
                }
              />
              <InfoRow label="کد پیگیری" value={trackId} />
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
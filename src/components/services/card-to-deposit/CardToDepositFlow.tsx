"use client";
import { useState } from "react";
import {
  ArrowLeftRight,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Clock,
  Landmark,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CardNumberInput,
  isValidCardNumber,
} from "../shared/inputs/CardNumberInput";
import { fa } from "@/src/lib/format";

interface CardToDepositResult {
  destCard: string;
  name: string;
  result: string;
  doTime: string;
  description: string;
  deposit: string;
}

const formatCard = (card: string) =>
  card.replace(/(\d{4})(?=\d)/g, "$1 - ");

export default function CardToDepositFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copied, setCopied] = useState(false);

  const [card, setCard] = useState("");
  const [result, setResult] = useState<CardToDepositResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCardNumber(card)) return;

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/cardToDeposit?card=${card}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-FYFH-20000200000",
        trackId: "4c3fbcc1-eb919b-05749cd6e118",
        result: {
          destCard: card,
          name: "اکبر اکبری",
          result: "0",
          doTime: "1403/11/23 14:44:06",
          description: "موفق",
          deposit: "19475846",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در تبدیل شماره کارت به شماره حساب. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDeposit = async () => {
    if (!result?.deposit) return;
    await navigator.clipboard.writeText(result.deposit);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetForm = () => {
    setCard("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopied(false);
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تبدیل کارت به حساب" />

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
              شماره کارت ۱۶ رقمی عضو شتاب را وارد کنید تا شماره حساب متصل به آن و نام صاحب حساب نمایش داده شود.
            </p>

            <CardNumberInput
              value={card}
              onChange={setCard}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                تبدیل به شماره حساب
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
                  <ArrowLeftRight size={18} className="text-brand" />
                  <span>نتیجه تبدیل کارت به حساب</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <ShieldCheck size={15} />
                  {result.description}
                </span>
              </div>

              {/* باکس برجسته شماره حساب */}
              <div className="rounded-2xl bg-brand/10 border border-brand/20 p-4 text-center mb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-silver">
                  <Landmark size={14} className="text-brand" />
                  <span>شماره حساب</span>
                </div>
                <div
                  dir="ltr"
                  className="font-mono text-2xl font-black text-brand tracking-widest mt-1.5"
                >
                  {fa(result.deposit)}
                </div>
                <button
                  type="button"
                  onClick={handleCopyDeposit}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2 text-xs font-extrabold active:scale-95 transition-transform"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "شماره حساب کپی شد" : "کپی شماره حساب"}</span>
                </button>
              </div>

              <InfoRow label="نام صاحب حساب" value={result.name} />
              <InfoRow
                label="شماره کارت"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {fa(formatCard(result.destCard))}
                  </span>
                }
              />
              <InfoRow
                label="زمان استعلام"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} className="text-silver" />
                    {fa(result.doTime)}
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
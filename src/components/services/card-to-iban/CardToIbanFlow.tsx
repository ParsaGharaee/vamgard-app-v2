"use client";
import { useState } from "react";
import {
  ArrowLeftRight,
  ShieldAlert,
  Copy,
  Check,
  Landmark,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CardNumberInput,
  isValidCardNumber,
} from "../shared/inputs/CardNumberInput";
import { fa } from "@/src/lib/format";

interface CardToIbanResult {
  IBAN: string;
  bankName: string;
  deposit: string;
  card: string;
  depositStatus: string;
  depositOwners: string;
}

const DEPOSIT_STATUS_MAP: Record<
  string,
  { label: string; badgeClass: string }
> = {
  "02": {
    label: "حساب فعال",
    badgeClass: "bg-emerald-500/10 text-emerald-500",
  },
  "03": {
    label: "مسدود با قابلیت واریز",
    badgeClass: "bg-amber-500/10 text-amber-500",
  },
  "04": {
    label: "مسدود بدون قابلیت واریز",
    badgeClass: "bg-red-500/10 text-red-500",
  },
  "05": {
    label: "حساب راکد",
    badgeClass: "bg-amber-500/10 text-amber-500",
  },
  "06": {
    label: "خطا در پاسخ‌دهی",
    badgeClass: "bg-red-500/10 text-red-500",
  },
  "07": {
    label: "سایر موارد",
    badgeClass: "bg-silver/15 text-silver",
  },
};

const formatCard = (card: string) =>
  card.replace(/(\d{4})(?=\d)/g, "$1 - ");

const formatIbanDisplay = (iban: string) =>
  iban.replace(/(.{4})(?=.)/g, "$1 ");

export default function CardToIbanFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedField, setCopiedField] = useState<"iban" | "deposit" | null>(
    null
  );

  const [card, setCard] = useState("");
  const [result, setResult] = useState<CardToIbanResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCardNumber(card)) return;

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/cardToIban?card=${card}&version=2
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "cardToIban-029",
        result: {
          IBAN: "IR910800005000115426432001",
          bankName: "قرض الحسنه رسالت",
          deposit: "10.6423499.1",
          card,
          depositStatus: "02",
          depositOwners: "شیما کیانی",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در تبدیل شماره کارت به شبا. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: "iban" | "deposit") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const resetForm = () => {
    setCard("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedField(null);
  };

  const statusMeta = result
    ? DEPOSIT_STATUS_MAP[result.depositStatus] ?? {
        label: `کد ${fa(result.depositStatus)}`,
        badgeClass: "bg-silver/15 text-silver",
      }
    : null;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تبدیل کارت به شبا" />

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
              شماره کارت ۱۶ رقمی عضو شتاب را وارد کنید تا شماره شبا (IBAN)، شماره حساب و وضعیت حساب متصل به آن نمایش داده شود.
            </p>

            <CardNumberInput
              value={card}
              onChange={setCard}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                تبدیل به شماره شبا
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
                  <span>نتیجه تبدیل کارت به شبا</span>
                </div>
                {statusMeta && (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                )}
              </div>

              {/* باکس برجسته شماره شبا */}
              <div className="rounded-2xl bg-brand/10 border border-brand/20 p-4 text-center mb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-silver">
                  <Landmark size={14} className="text-brand" />
                  <span>شماره شبا (IBAN)</span>
                </div>
                <div
                  dir="ltr"
                  className="font-mono text-base sm:text-lg font-black text-brand tracking-wider mt-2 break-all"
                >
                  {formatIbanDisplay(result.IBAN)}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.IBAN, "iban")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2 text-xs font-extrabold active:scale-95 transition-transform"
                >
                  {copiedField === "iban" ? <Check size={14} /> : <Copy size={14} />}
                  <span>
                    {copiedField === "iban" ? "شماره شبا کپی شد" : "کپی شماره شبا"}
                  </span>
                </button>
              </div>

              <InfoRow label="صاحب حساب" value={result.depositOwners} />
              <InfoRow label="نام بانک" value={result.bankName} />
              <InfoRow
                label="شماره حساب"
                value={
                  <button
                    type="button"
                    onClick={() => handleCopy(result.deposit, "deposit")}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-ink active:scale-95 transition-transform"
                    dir="ltr"
                  >
                    <span>{fa(result.deposit)}</span>
                    {copiedField === "deposit" ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} className="text-silver" />
                    )}
                  </button>
                }
              />
              <InfoRow
                label="شماره کارت"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {fa(formatCard(result.card))}
                  </span>
                }
              />
              <InfoRow
                label="کد پیگیری"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {trackId}
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
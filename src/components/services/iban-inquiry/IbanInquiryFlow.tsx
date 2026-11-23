"use client";
import { useState } from "react";
import {
  Landmark,
  ShieldAlert,
  Users,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { IbanInput, isValidIban } from "../shared/inputs/IbanInput";
import { fa } from "@/src/lib/format";

interface DepositOwner {
  firstName: string;
  lastName: string;
}

interface IbanInquiryResult {
  IBAN: string;
  bankName: string;
  deposit: string;
  depositStatus: string;
  depositDescription?: string;
  depositComment?: string;
  depositOwners: DepositOwner[];
  bankCode: string;
  errorDescription?: string;
}

const DEPOSIT_STATUS_MAP: Record<
  string,
  { label: string; badgeClass: string }
> = {
  "01": {
    label: "حساب بسته شده است",
    badgeClass: "bg-red-500/10 text-red-500",
  },
  "02": {
    label: "حساب فعال است",
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
    label: "حساب راکد است",
    badgeClass: "bg-amber-500/10 text-amber-500",
  },
  "06": {
    label: "خطا در پاسخ‌دهی",
    badgeClass: "bg-red-500/10 text-red-500",
  },
  "07": {
    label: "خطای نامشخص سامانه شبا",
    badgeClass: "bg-red-500/10 text-red-500",
  },
  "08": {
    label: "فاقد حساب",
    badgeClass: "bg-silver/15 text-silver",
  },
};

const formatIbanDisplay = (iban: string) =>
  iban.replace(/(.{4})(?=.)/g, "$1 ");

export default function IbanInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedField, setCopiedField] = useState<"iban" | "deposit" | null>(
    null
  );

  const [iban, setIban] = useState("");
  const [result, setResult] = useState<IbanInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidIban(iban)) return;

    setLoading(true);
    try {
      // GET /oak/v2/clients/{clientId}/ibanInquiry?iban=${iban}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-OHKZ-20003400000",
        trackId: "34dd9c02-d88d-44c8-8833-9495f4765d17",
        result: {
          IBAN: iban,
          bankName: "بانک آینده",
          deposit: "0300000001007",
          depositDescription: "حساب فعال است",
          depositComment: "معتبر برای واریز",
          depositOwners: [
            {
              firstName: "شیما",
              lastName: "کیایی",
            },
          ],
          depositStatus: "02",
          errorDescription: "بدون خطا",
          bankCode: "062",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام اطلاعات شبا و صاحبان حساب. لطفاً مجدداً تلاش کنید."
      );
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
    setIban("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedField(null);
  };

  const statusMeta = result
    ? DEPOSIT_STATUS_MAP[result.depositStatus] ?? {
        label: result.depositDescription || `کد ${fa(result.depositStatus)}`,
        badgeClass: "bg-silver/15 text-silver",
      }
    : null;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام شبا و صاحبان حساب" />

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
              شماره شبا (۲۴ رقم بدون IR) را وارد کنید تا نام بانک، شماره سپرده، وضعیت حساب و فهرست صاحبان حساب نمایش داده شود.
            </p>

            <IbanInput
              value={iban}
              onChange={setIban}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام اطلاعات شبا
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت مشخصات حساب و بانک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Landmark size={18} className="text-brand" />
                  <span>{result.bankName}</span>
                </div>
                {statusMeta && (
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                )}
              </div>

              {/* باکس برجسته شماره شبا */}
              <div className="rounded-2xl bg-brand/10 border border-brand/20 p-4 text-center mb-4">
                <div className="text-[11px] font-bold text-silver">
                  شماره شبا (IBAN)
                </div>
                <div
                  dir="ltr"
                  className="font-mono text-sm sm:text-base font-black text-brand tracking-wider mt-1.5 break-all"
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
              <InfoRow label="کد بانک" value={fa(result.bankCode)} />
              {result.depositDescription && (
                <InfoRow label="شرح حساب" value={result.depositDescription} />
              )}
              {result.depositComment && (
                <InfoRow label="توضیحات حساب" value={result.depositComment} />
              )}
              <InfoRow
                label="کد پیگیری"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    #{trackId.split("-")[0].toUpperCase()}
                  </span>
                }
              />
            </div>

            {/* کارت صاحبان حساب */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <Users size={18} className="text-brand" />
                <span>
                  صاحبان حساب ({fa(result.depositOwners?.length ?? 0)} نفر)
                </span>
              </div>

              {!result.depositOwners || result.depositOwners.length === 0 ? (
                <p className="text-xs text-silver text-center py-3">
                  اطلاعات صاحب حسابی ثبت نشده است.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {result.depositOwners.map((owner, idx) => (
                    <div
                      key={`${owner.firstName}-${owner.lastName}-${idx}`}
                      className="rounded-2xl bg-tile/40 px-4 py-3 border border-line/5 flex items-center justify-between"
                    >
                      <span className="text-xs font-extrabold text-ink">
                        {owner.firstName} {owner.lastName}
                      </span>
                      <span className="text-[10px] font-bold text-silver">
                        صاحب حساب {fa(idx + 1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* شرح خطا در صورت وجود مقدار غیر از بدون خطا */}
            {result.errorDescription &&
              result.errorDescription !== "بدون خطا" && (
                <div className="surface rounded-2xl p-3.5 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-500 font-bold">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>{result.errorDescription}</span>
                </div>
              )}

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
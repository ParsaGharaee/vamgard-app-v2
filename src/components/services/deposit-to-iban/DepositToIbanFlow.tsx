"use client";
import { useState } from "react";
import {
  ArrowLeftRight,
  ShieldAlert,
  Copy,
  Check,
  Landmark,
  Info,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { VamSelect, type SelectOption } from "../shared/inputs/VamSelect";
import {
  DepositNumberInput,
  isValidDepositNumber,
} from "../shared/inputs/DepositNumberInput";
import { fa } from "@/src/lib/format";

interface DepositToIbanResult {
  deposit: string;
  accountStatus: string;
  bankName: string;
  iban: string;
  depositOwners: string;
}

const BANK_OPTIONS: SelectOption[] = [
  { value: "017", label: "بانک ملی ایران", icon: <Landmark size={18} /> },
  { value: "015", label: "بانک سپه", icon: <Landmark size={18} /> },
  { value: "012", label: "بانک ملت", icon: <Landmark size={18} /> },
  { value: "018", label: "بانک تجارت", icon: <Landmark size={18} /> },
  { value: "019", label: "بانک صادرات ایران", icon: <Landmark size={18} /> },
  { value: "016", label: "بانک کشاورزی", icon: <Landmark size={18} /> },
  { value: "014", label: "بانک مسکن", icon: <Landmark size={18} /> },
  { value: "013", label: "بانک رفاه کارگران", icon: <Landmark size={18} /> },
  { value: "056", label: "بانک سامان", icon: <Landmark size={18} /> },
  { value: "057", label: "بانک پاسارگاد", icon: <Landmark size={18} /> },
  { value: "054", label: "بانک پارسیان", icon: <Landmark size={18} /> },
  { value: "055", label: "بانک اقتصاد نوین", icon: <Landmark size={18} /> },
  { value: "061", label: "بانک شهر", icon: <Landmark size={18} /> },
  { value: "062", label: "بانک آینده", icon: <Landmark size={18} /> },
  { value: "070", label: "بانک قرض‌الحسنه رسالت", icon: <Landmark size={18} /> },
  { value: "060", label: "بانک قرض‌الحسنه مهر ایران", icon: <Landmark size={18} /> },
  { value: "021", label: "پست بانک ایران", icon: <Landmark size={18} /> },
];

const ACCOUNT_STATUS_MAP: Record<
  string,
  { label: string; badgeClass: string }
> = {
  "01": { label: "بسته", badgeClass: "bg-red-500/10 text-red-500" },
  "02": { label: "فعال", badgeClass: "bg-emerald-500/10 text-emerald-500" },
  "03": { label: "مسدود با واریز", badgeClass: "bg-amber-500/10 text-amber-500" },
  "04": { label: "مسدود بدون واریز", badgeClass: "bg-red-500/10 text-red-500" },
  "05": { label: "راکد", badgeClass: "bg-amber-500/10 text-amber-500" },
  "06": { label: "خطا", badgeClass: "bg-red-500/10 text-red-500" },
  "07": { label: "خطای شبا", badgeClass: "bg-red-500/10 text-red-500" },
  "08": { label: "فاقد حساب", badgeClass: "bg-silver/15 text-silver" },
};

const formatIbanDisplay = (iban: string) =>
  iban.replace(/(.{4})(?=.)/g, "$1 ");

export default function DepositToIbanFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copied, setCopied] = useState(false);

  const [bankCode, setBankCode] = useState("015");
  const [deposit, setDeposit] = useState("");
  const [result, setResult] = useState<DepositToIbanResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!bankCode || !isValidDepositNumber(deposit)) return;

    setLoading(true);
    try {
      // GET /facility/v2/clients/{clientId}/depositToIban?bankCode=${bankCode}&deposit=${deposit}
      await new Promise((r) => setTimeout(r, 1500));

      const selectedBank =
        BANK_OPTIONS.find((b) => b.value === bankCode)?.label ?? "بانک سپه";

      const mockResponse = {
        responseCode: "FN-FYFH-20000600000",
        trackId: "f4e0457a-5f55-4d5c-8428-f8474f38b6cf",
        result: {
          deposit,
          accountStatus: "02",
          bankName: selectedBank,
          iban: "IR480150000001071333715508",
          depositOwners: "محمد حسامی",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در تبدیل شماره حساب به شبا. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIban = async () => {
    if (!result?.iban) return;
    await navigator.clipboard.writeText(result.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetForm = () => {
    setDeposit("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopied(false);
  };

  const statusMeta = result
    ? ACCOUNT_STATUS_MAP[result.accountStatus] ?? {
        label: `کد ${fa(result.accountStatus)}`,
        badgeClass: "bg-silver/15 text-silver",
      }
    : null;

  const depositPlaceholder =
    bankCode === "070"
      ? "مثال: 10.6423499.1"
      : bankCode === "057"
        ? "مثال: 201.8100.1234567.1"
        : "مثال: 1071333715508";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تبدیل حساب به شبا" />

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
              بانک صاحب حساب را انتخاب کرده و شماره حساب را وارد کنید تا شماره شبا (IBAN) و وضعیت حساب نمایش داده شود.
            </p>

            <VamSelect
              label="بانک صاحب حساب"
              options={BANK_OPTIONS}
              value={bankCode}
              onChange={(val) => {
                setBankCode(val);
                setShowFormErrors(false);
              }}
            />

            <DepositNumberInput
              value={deposit}
              onChange={setDeposit}
              showErrors={showFormErrors}
              placeholder={depositPlaceholder}
            />

            <div className="surface rounded-2xl p-3.5 mb-6 border border-line/5 flex items-start gap-2.5 text-[11px] text-silver leading-5">
              <Info size={16} className="text-brand shrink-0 mt-0.5" />
              <span>
                در صورت نیاز به جداکننده در شماره حساب از <b className="text-ink">/</b> استفاده کنید. برای بانک رسالت جداکننده <b className="text-ink">.</b> و برای بانک پاسارگاد فرمت اصلی بانک را وارد نمایید.
              </span>
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              تبدیل به شماره شبا
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <ArrowLeftRight size={18} className="text-brand" />
                  <span>نتیجه تبدیل حساب به شبا</span>
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
                  {formatIbanDisplay(result.iban)}
                </div>
                <button
                  type="button"
                  onClick={handleCopyIban}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2 text-xs font-extrabold active:scale-95 transition-transform"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "شماره شبا کپی شد" : "کپی شماره شبا"}</span>
                </button>
              </div>

              <InfoRow label="صاحب حساب" value={result.depositOwners} />
              <InfoRow label="نام بانک" value={result.bankName} />
              <InfoRow
                label="شماره حساب"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {fa(result.deposit)}
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
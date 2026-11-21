"use client";
import { useState } from "react";
import {
  Droplets,
  Zap,
  Flame,
  ShieldAlert,
  Receipt,
  Calendar,
  Building2,
  User,
  MapPin,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { VamSelect, type SelectOption } from "../shared/inputs/VamSelect";
import {
  BillParameterInput,
  isValidBillParameter,
  type BillType,
} from "../shared/inputs/BillParameterInput";
import { fa } from "@/src/lib/format";

interface BillDetailResult {
  Amount: string;
  BillId: string;
  PayId: string;
  Date: string;
  Info?: Record<string, string | undefined>;
}

const BILL_OPTIONS: SelectOption[] = [
  { value: "Water", label: "قبض آب", icon: <Droplets size={18} /> },
  { value: "Electricity", label: "قبض برق", icon: <Zap size={18} /> },
  { value: "Electricity-support", label: "قبض برق (پشتیبان)", icon: <Zap size={18} /> },
  { value: "Gas", label: "قبض گاز", icon: <Flame size={18} /> },
];

const INFO_LABELS: Record<string, string> = {
  CustomerType: "نوع مشترک",
  PostalCode: "کد پستی",
  FileNumber: "شماره پرونده",
  ComputerPassword: "رمز رایانه",
  IdentificationNumber: "شماره شناسایی",
  TariffType: "نوع تعرفه",
  Phase: "فاز",
  Amper: "آمپر",
  VoltageType: "نوع ولتاژ",
  ContractDemand: "قدرت قراردادی",
  ConsumptionDebtAmount: "بدهی مصرف",
  OtherDebtAmount: "سایر بدهی‌ها",
  BranchDebtAmount: "بدهی انشعاب",
};

const AMOUNT_FIELDS = new Set([
  "ConsumptionDebtAmount",
  "OtherDebtAmount",
  "BranchDebtAmount",
]);

const formatRial = (amount?: string) => {
  const num = Number(amount);
  if (!num || num === 0) return "صفر ریال";
  return `${fa(num.toLocaleString("en-US"))} ریال`;
};

export default function BillDetailFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [billType, setBillType] = useState<BillType>("Water");
  const [parameter, setParameter] = useState("");
  const [result, setResult] = useState<BillDetailResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidBillParameter(parameter)) return;

    setLoading(true);
    try {
      // GET /billing/v2/clients/{clientId}/detailBillingInquiry?type=...&parameter=...
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "561e5d7a-af5a-4e99-8a32-ce0d9be94019",
        result: {
          Amount: "590000",
          BillId: "9030635704127",
          PayId: "59010572",
          Date: "1401/07/03",
          Info: {
            CompanyName: "توزیع نیروی برق تهران بزرگ",
            CustomerName: "سیدمحمدرضا گلزار",
            CustomerFamily: "",
            CustomerType: "حقیقی",
            Address: "خواجه عبدالله انصاری ابوذرغفاری شمالی",
            PostalCode: "1236598127",
            FileNumber: "656379",
            ComputerPassword: "23569741",
            IdentificationNumber: "30226984",
            TariffType: "خانگی",
            Phase: "1",
            Amper: "15",
            VoltageType: "ثانویه",
            ContractDemand: "3",
            ConsumptionDebtAmount: "0",
            OtherDebtAmount: "0",
            BranchDebtAmount: "0",
          },
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام قبض. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setParameter("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const fullName = result?.Info
    ? [result.Info.CustomerName, result.Info.CustomerFamily].filter(Boolean).join(" ")
    : "";

  const extraDetails = result?.Info
    ? Object.entries(result.Info).filter(
        ([key, val]) => val !== undefined && val !== "" && INFO_LABELS[key]
      )
    : [];

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام قبوض با جزئیات" />

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
              نوع قبض (آب، برق یا گاز) را انتخاب کرده و شناسه قبض یا شماره اشتراک را وارد کنید.
            </p>

            <VamSelect
              label="نوع قبض"
              options={BILL_OPTIONS}
              value={billType}
              onChange={(val) => {
                setBillType(val as BillType);
                setParameter("");
                setShowFormErrors(false);
              }}
            />

            <BillParameterInput
              billType={billType}
              value={parameter}
              onChange={setParameter}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام قبض
              </VamButton>
            </div>
          </div>
        )}

        {/* نتیجه استعلام */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت اصلی مبلغ و شناسه‌ها */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Receipt size={18} className="text-brand" />
                  <span>خلاصه قبض</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="rounded-2xl bg-brand/10 border border-brand/20 p-4 text-center mb-4">
                <div className="text-xs font-bold text-silver">مبلغ قابل پرداخت</div>
                <div className="text-2xl font-black text-brand mt-1">
                  {formatRial(result.Amount)}
                </div>
              </div>

              <InfoRow label="شناسه قبض" value={fa(result.BillId)} />
              <InfoRow label="شناسه پرداخت" value={fa(result.PayId)} />
              <InfoRow
                label="مهلت پرداخت"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(result.Date)}
                  </span>
                }
              />
            </div>

            {/* کارت مشخصات مشترک و جزئیات فنی */}
            {result.Info && (
              <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
                <div className="text-[15px] font-extrabold mb-3">جزئیات مشترک و انشعاب</div>

                {result.Info.CompanyName && (
                  <div className="flex items-center gap-2 text-xs font-bold text-brand bg-brand/5 rounded-xl px-3 py-2.5 mb-3">
                    <Building2 size={15} className="shrink-0" />
                    <span>{result.Info.CompanyName}</span>
                  </div>
                )}

                {fullName && (
                  <InfoRow
                    label="نام مشترک"
                    value={
                      <span className="inline-flex items-center gap-1">
                        <User size={13} className="text-silver" />
                        {fullName}
                      </span>
                    }
                  />
                )}

                {result.Info.Address && (
                  <div className="border-b border-line/10 py-3.5 text-sm">
                    <div className="flex items-center gap-1 text-silver mb-1">
                      <MapPin size={13} />
                      <span>آدرس</span>
                    </div>
                    <div className="font-bold text-ink text-xs leading-6">
                      {result.Info.Address}
                    </div>
                  </div>
                )}

                {extraDetails.map(([key, val]) => (
                  <InfoRow
                    key={key}
                    label={INFO_LABELS[key]}
                    value={AMOUNT_FIELDS.has(key) ? formatRial(val) : fa(val!)}
                  />
                ))}
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
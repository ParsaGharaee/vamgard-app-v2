"use client";
import { useState } from "react";
import {
  Droplets,
  Zap,
  Flame,
  PhoneCall,
  Smartphone,
  Radio,
  ShieldAlert,
  Receipt,
  Calendar,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { VamSelect, type SelectOption } from "../shared/inputs/VamSelect";
import {
  BillParameterInput,
  isValidBillParameter,
  type BillType as UtilityBillType,
} from "../shared/inputs/BillParameterInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { LandlineInput, isValidLandline } from "../shared/inputs/LandlineInput";
import { fa } from "@/src/lib/format";

type InquiryBillType =
  | "Water"
  | "Electricity"
  | "Electricity-standard"
  | "Gas"
  | "GasByBillId"
  | "Tel"
  | "TelNow"
  | "Mobile"
  | "MobileNow";

type OperatorType = "MCI" | "MTN" | "RIGHTEL";

interface BillInquiryResult {
  Amount: number;
  BillId: number;
  PayId: number;
  Date: string;
}

const BILL_TYPE_OPTIONS: SelectOption[] = [
  { value: "Water", label: "قبض آب", icon: <Droplets size={18} /> },
  { value: "Electricity", label: "قبض برق", icon: <Zap size={18} /> },
  { value: "Electricity-standard", label: "قبض برق (پشتیبان)", icon: <Zap size={18} /> },
  { value: "Gas", label: "قبض گاز (شماره اشتراک)", icon: <Flame size={18} /> },
  { value: "GasByBillId", label: "قبض گاز (شماره قبض)", icon: <Flame size={18} /> },
  { value: "Tel", label: "تلفن ثابت (پایان دوره)", icon: <PhoneCall size={18} /> },
  { value: "TelNow", label: "تلفن ثابت (میان‌دوره / بروز)", icon: <PhoneCall size={18} /> },
  { value: "Mobile", label: "تلفن همراه (پایان دوره)", icon: <Smartphone size={18} /> },
  { value: "MobileNow", label: "تلفن همراه (میان‌دوره / بروز)", icon: <Smartphone size={18} /> },
];

const OPERATOR_OPTIONS: SelectOption[] = [
  { value: "MCI", label: "همراه اول", icon: <Radio size={18} /> },
  { value: "MTN", label: "ایرانسل", icon: <Radio size={18} /> },
  { value: "RIGHTEL", label: "رایتل", icon: <Radio size={18} /> },
];

const formatRial = (amount: number) => {
  if (!amount || amount === 0) return "صفر (تسویه شده)";
  return `${fa(amount.toLocaleString("en-US"))} ریال`;
};

export default function BillInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [billType, setBillType] = useState<InquiryBillType>("Water");
  const [parameter, setParameter] = useState("");
  const [operator, setOperator] = useState<OperatorType>("MCI");

  const [result, setResult] = useState<BillInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const isMobileBill = billType === "Mobile" || billType === "MobileNow";
  const isLandlineBill = billType === "Tel" || billType === "TelNow";

  const isParameterValid = () => {
    if (isMobileBill) return isValidMobile(parameter);
    if (isLandlineBill) return isValidLandline(parameter);
    return isValidBillParameter(parameter);
  };

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isParameterValid()) return;

    setLoading(true);
    try {
      // GET /billing/v2/clients/{clientId}/billingInquiry?type=...&parameter=...(&secondParameter=...)
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "46d3470b-eb14-4a17-8e77-6052031527d6",
        result: {
          Amount: 50000,
          BillId: 931564121146,
          PayId: 5080129,
          Date: "1403/08/15",
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

  const selectedBillLabel =
    BILL_TYPE_OPTIONS.find((o) => o.value === billType)?.label ?? "قبض";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام قبض" />

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
              نوع قبض را انتخاب کرده و شناسه یا شماره مربوطه را برای استعلام مبلغ و شناسه پرداخت وارد کنید.
            </p>

            <VamSelect
              label="نوع قبض"
              options={BILL_TYPE_OPTIONS}
              value={billType}
              onChange={(val) => {
                setBillType(val as InquiryBillType);
                setParameter("");
                setShowFormErrors(false);
              }}
            />

            {isMobileBill ? (
              <>
                <VamSelect
                  label="اپراتور تلفن همراه"
                  options={OPERATOR_OPTIONS}
                  value={operator}
                  onChange={(val) => setOperator(val as OperatorType)}
                />
                <MobileInput
                  value={parameter}
                  onChange={setParameter}
                  showErrors={showFormErrors}
                />
              </>
            ) : isLandlineBill ? (
              <LandlineInput
                value={parameter}
                onChange={setParameter}
                showErrors={showFormErrors}
              />
            ) : (
              <BillParameterInput
                billType={billType as UtilityBillType}
                value={parameter}
                onChange={setParameter}
                showErrors={showFormErrors}
              />
            )}

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام قبض
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Receipt size={18} className="text-brand" />
                  <span>{selectedBillLabel}</span>
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
                  result.Date ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-silver" />
                      {fa(result.Date)}
                    </span>
                  ) : (
                    <span className="text-silver">ثبت نشده</span>
                  )
                }
              />
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
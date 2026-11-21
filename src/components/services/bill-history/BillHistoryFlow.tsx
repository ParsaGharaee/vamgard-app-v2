"use client";
import { useState } from "react";
import { Zap, Flame, ShieldAlert, Receipt, Calendar } from "lucide-react";

import { fa } from "@/src/lib/format";
import { SelectOption } from "../shared/inputs/VamSelect";
import { BillParameterInput, BillType, isValidBillParameter } from "../shared/inputs/BillParameterInput";
import { ServiceHeader } from "../shared/ServiceHeader";
import { VamSelect } from "../shared/VamSelect";
import { VamButton } from "../shared/VamButton";
import { InfoRow } from "../shared/InfoRow";

interface BillItem {
  billId: string;
  payId: string;
  amount: string;
  date: string;
  info?: {
    companyName?: string;
    customerName?: string;
    [key: string]: string | undefined;
  };
}

const BILL_OPTIONS: SelectOption[] = [
  { value: "Electricity", label: "قبض برق", icon: <Zap size={18} /> },
  { value: "Gas", label: "قبض گاز", icon: <Flame size={18} /> },
];

const formatAmount = (amount: string) => {
  const num = Number(amount);
  if (!num || num === 0) return "صفر (تسویه شده)";
  return `${fa(num.toLocaleString("en-US"))} ریال`;
};

export default function BillHistoryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [billType, setBillType] = useState<BillType>("Electricity");
  const [parameter, setParameter] = useState("");
  const [bills, setBills] = useState<BillItem[] | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidBillParameter(parameter)) return;

    setLoading(true);
    try {
      // GET /billing/v2/clients/{clientId}/billHistoryInquiry?type=...&parameter=...
      await new Promise((r) => setTimeout(r, 1500));

      // پاسخ تستی مطابق مستندات فینوتک
      const mockResponse = {
        responseCode: "FN-BGVH-20001500000",
        trackId: "df5bdf96-dc4-088e36f105c8",
        result: {
          bills: [
            {
              billId: "3375845754",
              payId: "0000000002696",
              amount: "0",
              date: "1403/07/25",
              info: {
                companyName: billType === "Electricity" ? "شرکت توزیع نیروی برق" : "شرکت گاز استان تهران",
                customerName: "علی رضایی",
              },
            },
            {
              billId: "3375845754",
              payId: "0000001450219",
              amount: "1450000",
              date: "1403/05/20",
              info: {
                companyName: billType === "Electricity" ? "شرکت توزیع نیروی برق" : "شرکت گاز استان تهران",
                customerName: "علی رضایی",
              },
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setBills(mockResponse.result.bills);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در دریافت تاریخچه قبض. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setParameter("");
    setBills(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام تاریخچه قبض" />

      <div className="px-4 mt-6">
        {generalError && !bills && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} />
            {generalError}
          </div>
        )}

        {/* فرم ورودی */}
        {!bills && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-6 text-right px-1">
              نوع قبض (برق یا گاز) را انتخاب کرده و شناسه مربوطه را برای مشاهده تاریخچه قبوض وارد کنید.
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
                مشاهده تاریخچه قبض
              </VamButton>
            </div>
          </div>
        )}

        {/* لیست کارت‌های قبض */}
        {bills && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                {billType === "Electricity" ? (
                  <Zap size={18} className="text-amber-500" />
                ) : (
                  <Flame size={18} className="text-brand" />
                )}
                <span>
                  تاریخچه {billType === "Electricity" ? "قبض برق" : "قبض گاز"} ({fa(bills.length)} مورد)
                </span>
              </div>
              <span className="text-[11px] font-bold text-silver" dir="ltr">
                #{trackId.split("-")[0].toUpperCase()}
              </span>
            </div>

            {bills.length === 0 ? (
              <div className="surface rounded-3xl p-8 text-center text-sm text-silver">
                سابقه‌ای برای این شناسه یافت نشد.
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill, idx) => {
                  const isPaid = Number(bill.amount) === 0;
                  return (
                    <div
                      key={`${bill.billId}-${bill.payId}-${idx}`}
                      className="surface p-4 rounded-[26px] border border-line/5 shadow-sm"
                    >
                      {/* هدر کارت */}
                      <div className="flex items-center justify-between pb-3 mb-2 border-b border-line/10">
                        <div className="flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
                            <Receipt size={18} />
                          </span>
                          <div>
                            <div className="text-xs font-extrabold">
                              {bill.info?.companyName || "قبض دوره"}
                            </div>
                            {bill.info?.customerName && (
                              <div className="text-[11px] text-silver mt-0.5">
                                مشترک: {bill.info.customerName}
                              </div>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {isPaid ? "تسویه شده" : "بدهکار"}
                        </span>
                      </div>

                      {/* جزئیات قبض */}
                      <InfoRow label="مبلغ قبض" value={formatAmount(bill.amount)} />
                      <InfoRow
                        label="مهلت پرداخت"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={13} className="text-silver" />
                            {fa(bill.date)}
                          </span>
                        }
                      />
                      <InfoRow label="شناسه قبض" value={fa(bill.billId)} />
                      <InfoRow label="شناسه پرداخت" value={fa(bill.payId)} />
                    </div>
                  );
                })}
              </div>
            )}

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
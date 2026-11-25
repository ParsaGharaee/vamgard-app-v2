"use client";
import { useState } from "react";
import {
  Landmark,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Hash,
  Wallet,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface FacilityItem {
  bankCode?: string;
  branchCode?: string;
  branchDescription?: string;
  pastExpiredAmount?: string;
  deferredAmount?: string;
  suspiciousAmount?: string;
  debtorTotalAmount?: string;
  type?: string;
  amountOrginal?: string;
  benefitAmount?: string;
  FacilityBankCode?: string;
  FacilityBranchCode?: string;
  FacilityBranch?: string;
  FacilityRequestNo?: string;
  FacilityRequestType?: string;
  FacilityCurrencyCode?: string;
  FacilityPastExpiredAmount?: string;
  FacilityDeferredAmount?: string;
  FacilitySuspiciousAmount?: string;
  FacilityDebtorTotalAmount?: string;
  FacilityType?: string;
  FacilityStatus?: string;
  FacilityAmountOrginal?: string;
  FacilityBenefitAmount?: string;
  FacilitySetDate?: string;
  FacilityEndDate?: string;
  FacilityAmountObligation?: string;
  FacilityGroup?: string;
  FacilityMoratoriumDate?: string;
}

interface FacilityInquiryResult {
  user: string;
  name: string;
  facilityTotalAmount: string;
  facilityDebtTotalAmount: string;
  facilityPastExpiredTotalAmount: string;
  facilityDeferredTotalAmount: string;
  facilitySuspiciousTotalAmount: string;
  dishonored?: string;
  facilityList: FacilityItem[];
}

const parseAmount = (val?: string | number | null) => {
  if (val === undefined || val === null || val === "") return 0;
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

const formatRial = (val?: string | number | null) =>
  `${fa(parseAmount(val).toLocaleString("en-US"))} ریال`;

const formatCompactJalali = (raw?: string) => {
  if (!raw || raw === "0") return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return fa(`${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`);
  }
  return fa(raw);
};

export default function FacilityInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [userNid, setUserNid] = useState("");
  const [result, setResult] = useState<FacilityInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(userNid)) return;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/users/${userNid}/facilityInquiry
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        result: {
          user: userNid,
          name: "امیر قریشی مقدم",
          facilityTotalAmount: "324921522",
          facilityDebtTotalAmount: "101017180",
          facilityPastExpiredTotalAmount: "0",
          facilityDeferredTotalAmount: "0",
          facilitySuspiciousTotalAmount: "0",
          dishonored: "",
          facilityList: [
            {
              bankCode: "14",
              branchCode: "91182",
              branchDescription: "بانک مسکن - مسکن - تهران - پارک دانشجو تهران",
              pastExpiredAmount: "0",
              deferredAmount: "0",
              suspiciousAmount: "0",
              debtorTotalAmount: "101017180",
              type: "18",
              amountOrginal: "180000000",
              benefitAmount: "101017180",
              FacilityBankCode: "14",
              FacilityBranchCode: "02159",
              FacilityBranch: "بانک مسکن - شهید نامجوی تهران",
              FacilityRequestNo: "0215997049192414",
              FacilityRequestType: "3",
              FacilityCurrencyCode: "IRR",
              FacilityPastExpiredAmount: "0",
              FacilityDeferredAmount: "0",
              FacilitySuspiciousAmount: "0",
              FacilityDebtorTotalAmount: "1151155953",
              FacilityType: "18",
              FacilityStatus: "جاری",
              FacilityAmountOrginal: "600000000",
              FacilityBenefitAmount: "752873056",
              FacilitySetDate: "13970430",
              FacilityEndDate: "14090430",
              FacilityAmountObligation: "0",
              FacilityGroup: "اصلی",
              FacilityMoratoriumDate: "0",
            },
          ],
        },
        status: "DONE",
        trackId: "getfacility213454",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام تسهیلات بانکی. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserNid("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const facilities = result?.facilityList ?? [];
  const hasDishonored = Boolean(result?.dishonored?.trim());
  const hasTotalOverdue = result
    ? parseAmount(result.facilityPastExpiredTotalAmount) > 0 ||
      parseAmount(result.facilityDeferredTotalAmount) > 0 ||
      parseAmount(result.facilitySuspiciousTotalAmount) > 0
    : false;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام تسهیلات" />

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
              کد ملی ۱۰ رقمی را وارد کنید تا فهرست تسهیلات جاری در تمام بانک‌ها، مانده بدهی، معوقات و وضعیت بدحسابی نمایش داده شود.
            </p>

            <NationalCodeInput
              value={userNid}
              onChange={setUserNid}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام تسهیلات بانکی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت تسهیلات */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Wallet size={18} className="text-brand" />
                  <span>خلاصه وضعیت تسهیلات</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت خوش‌حسابی / بدحسابی */}
              <div
                className={`p-4 rounded-2xl mb-4 flex items-center gap-3 border ${
                  hasDishonored || hasTotalOverdue
                    ? "bg-red-500/5 border-red-500/15 text-red-500"
                    : "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                }`}
              >
                {hasDishonored || hasTotalOverdue ? (
                  <AlertCircle size={26} className="shrink-0" />
                ) : (
                  <ShieldCheck size={26} className="shrink-0" />
                )}
                <div>
                  <div className="text-sm font-extrabold">
                    {hasDishonored
                      ? `وضعیت بدحسابی: ${result.dishonored}`
                      : hasTotalOverdue
                        ? "دارای مانده سررسید گذشته یا معوق"
                        : "بدون بدحسابی و معوقه"}
                  </div>
                  <div className="text-[11px] font-bold opacity-85 mt-0.5">
                    تعداد تسهیلات ثبت‌شده: {fa(facilities.length)} فقره
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="rounded-2xl bg-brand/5 border border-brand/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">
                    مجموع تسهیلات
                  </div>
                  <div className="text-xs font-black text-brand mt-1.5">
                    {formatRial(result.facilityTotalAmount)}
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">
                    مجموع مانده بدهی
                  </div>
                  <div className="text-xs font-black text-amber-600 mt-1.5">
                    {formatRial(result.facilityDebtTotalAmount)}
                  </div>
                </div>
              </div>

              <InfoRow label="نام و نام خانوادگی" value={result.name} />
              <InfoRow label="کد ملی" value={fa(result.user)} />
              <InfoRow
                label="مانده سررسید گذشته"
                value={formatRial(result.facilityPastExpiredTotalAmount)}
              />
              <InfoRow
                label="مانده معوق"
                value={formatRial(result.facilityDeferredTotalAmount)}
              />
              <InfoRow
                label="مانده مشکوک‌الوصول"
                value={formatRial(result.facilitySuspiciousTotalAmount)}
              />
            </div>

            {/* لیست تسهیلات */}
            {facilities.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-emerald-500">
                <ShieldCheck size={32} />
                <span className="text-sm font-extrabold">
                  تسهیلات فعالی برای این کد ملی ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {facilities.map((item, idx) => {
                  const branchName =
                    item.FacilityBranch ||
                    item.branchDescription ||
                    `بانک کد ${fa(item.FacilityBankCode || item.bankCode || "—")}`;
                  const branchCode = item.FacilityBranchCode || item.branchCode;
                  const originalAmt =
                    item.FacilityAmountOrginal ?? item.amountOrginal;
                  const debtorAmt =
                    item.FacilityDebtorTotalAmount ?? item.debtorTotalAmount;
                  const benefitAmt =
                    item.FacilityBenefitAmount ?? item.benefitAmount;
                  const pastExpiredAmt =
                    item.FacilityPastExpiredAmount ?? item.pastExpiredAmount;
                  const deferredAmt =
                    item.FacilityDeferredAmount ?? item.deferredAmount;
                  const suspiciousAmt =
                    item.FacilitySuspiciousAmount ?? item.suspiciousAmount;

                  const itemHasOverdue =
                    parseAmount(pastExpiredAmt) > 0 ||
                    parseAmount(deferredAmt) > 0 ||
                    parseAmount(suspiciousAmt) > 0;

                  return (
                    <div
                      key={`${item.FacilityRequestNo || idx}-${idx}`}
                      className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                            <Landmark size={18} />
                          </span>
                          <div>
                            <div className="text-sm font-extrabold text-ink">
                              {branchName}
                            </div>
                            <div className="text-[11px] text-silver mt-0.5">
                              {branchCode ? `کد شعبه: ${fa(branchCode)}` : ""}
                              {item.FacilityGroup
                                ? ` · ${item.FacilityGroup}`
                                : ""}
                            </div>
                          </div>
                        </div>

                        {item.FacilityStatus && (
                          <span
                            className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${
                              itemHasOverdue
                                ? "bg-red-500/10 text-red-500"
                                : "bg-emerald-500/10 text-emerald-500"
                            }`}
                          >
                            {item.FacilityStatus}
                          </span>
                        )}
                      </div>

                      <InfoRow
                        label="اصل مبلغ تسهیلات"
                        value={formatRial(originalAmt)}
                      />
                      <InfoRow
                        label="مانده کل بدهی"
                        value={
                          <span className="font-extrabold text-ink">
                            {formatRial(debtorAmt)}
                          </span>
                        }
                      />
                      <InfoRow
                        label="مبلغ سود"
                        value={formatRial(benefitAmt)}
                      />
                      <InfoRow
                        label="مانده سررسید گذشته"
                        value={formatRial(pastExpiredAmt)}
                      />
                      <InfoRow
                        label="مانده معوقه"
                        value={formatRial(deferredAmt)}
                      />
                      <InfoRow
                        label="مانده مشکوک‌الوصول"
                        value={formatRial(suspiciousAmt)}
                      />
                      {parseAmount(item.FacilityAmountObligation) > 0 && (
                        <InfoRow
                          label="مبلغ وجه التزام"
                          value={formatRial(item.FacilityAmountObligation)}
                        />
                      )}
                      {item.FacilitySetDate && (
                        <InfoRow
                          label="تاریخ تنظیم قرارداد"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={13} className="text-silver" />
                              {formatCompactJalali(item.FacilitySetDate)}
                            </span>
                          }
                        />
                      )}
                      {item.FacilityEndDate && (
                        <InfoRow
                          label="تاریخ سررسید نهایی"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={13} className="text-silver" />
                              {formatCompactJalali(item.FacilityEndDate)}
                            </span>
                          }
                        />
                      )}
                      {item.FacilityRequestNo && (
                        <InfoRow
                          label="شماره درخواست"
                          value={
                            <span
                              className="inline-flex items-center gap-1 font-mono text-[11px]"
                              dir="ltr"
                            >
                              <Hash size={12} className="text-silver" />
                              {fa(item.FacilityRequestNo)}
                            </span>
                          }
                        />
                      )}
                    </div>
                  );
                })}
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
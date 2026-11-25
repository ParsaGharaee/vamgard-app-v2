"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Handshake,
  Landmark,
  Calendar,
  Percent,
  User,
  AlertCircle,
  Hash,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface GuarantyDebtorItem {
  debtorFirstName: string;
  debtorLastName: string;
  totalAmount: string;
  benefitAmount: string;
  obligationAmount: string;
  suspiciousAmount: string;
  deferredAmount: string;
  orginalAmount: string;
  pastExpiredAmount: string;
  bankCode: string;
  setDate: string;
  endDate: string;
  guarantyPercent: string;
  requestNumber: string;
  requestType: string;
  branchCode: string;
  branchDescription: string;
  guarantyIdNumber: string;
  guarantyLegalId: string;
  defunctAmount: string | null;
  commitmentBalanceAmount: string;
  latePenaltyAmount: string;
}

interface GuarantyInquiryResult {
  guarantyFirstName: string;
  guarantyLastName: string;
  guarantyNationalCode: string;
  guarantyLegalId: string | null;
  inquiryResultId: string;
  debtorList: GuarantyDebtorItem[];
}

const parseAmount = (val?: string | number | null) => {
  if (val === undefined || val === null || val === "") return 0;
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

const formatRial = (val?: string | number | null) =>
  `${fa(parseAmount(val).toLocaleString("en-US"))} ریال`;

const formatCompactJalali = (raw?: string) => {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return fa(`${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`);
  }
  return fa(raw);
};

export default function GuarantyInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nid, setNid] = useState("");
  const [result, setResult] = useState<GuarantyInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nid)) return;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/users/${nid}/sms/guarantyInquiry
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-CTKZ-20002300000",
        trackId: "0705ae6c-ac95-4574-moho-0e85d149d9bf",
        result: {
          guarantyFirstName: "امیرمحمد",
          guarantyLastName: "اسد",
          guarantyNationalCode: nid,
          guarantyLegalId: null,
          inquiryResultId: "12345678",
          debtorList: [
            {
              debtorFirstName: "اکبر",
              debtorLastName: "اکبری",
              totalAmount: "97488736",
              benefitAmount: "90445871",
              obligationAmount: "0",
              suspiciousAmount: "0",
              deferredAmount: "0",
              orginalAmount: "300000000",
              pastExpiredAmount: "0",
              bankCode: "13",
              setDate: "13980521",
              endDate: "14010621",
              guarantyPercent: "100",
              requestNumber: "2222222222222222",
              requestType: "3",
              branchCode: "00144",
              branchDescription: "بانک صادرات - شعبه شهید نامجو",
              guarantyIdNumber: "0123456789",
              guarantyLegalId: "0",
              defunctAmount: null,
              commitmentBalanceAmount: "0",
              latePenaltyAmount: "0",
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام ضمانت‌های فرد. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNid("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const debtors = result?.debtorList ?? [];
  const totalRemainingDebt = debtors.reduce(
    (sum, item) => sum + parseAmount(item.totalAmount),
    0
  );
  const totalOriginalAmount = debtors.reduce(
    (sum, item) => sum + parseAmount(item.orginalAmount),
    0
  );

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام ضمانت‌های فرد" />

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
              کد ملی ۱۰ رقمی ضامن را وارد کنید تا فهرست تمام تسهیلاتی که به عنوان ضامن در آن‌ها ثبت شده (شامل مشخصات وام‌گیرنده، مانده بدهی و شعبه بانک) نمایش داده شود.
            </p>

            <NationalCodeInput
              value={nid}
              onChange={setNid}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام ضمانت‌ها
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت ضامن */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Handshake size={18} className="text-brand" />
                  <span>خلاصه ضمانت‌های ثبت‌شده</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="rounded-2xl bg-brand/5 border border-brand/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">
                    تعداد ضمانت‌ها
                  </div>
                  <div className="text-lg font-black text-brand mt-1">
                    {fa(debtors.length)} فقره
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">
                    مجموع مانده بدهی
                  </div>
                  <div className="text-xs font-black text-amber-600 mt-1.5">
                    {formatRial(totalRemainingDebt)}
                  </div>
                </div>
              </div>

              <InfoRow
                label="نام و نام خانوادگی ضامن"
                value={`${result.guarantyFirstName} ${result.guarantyLastName}`}
              />
              <InfoRow
                label="کد ملی ضامن"
                value={fa(result.guarantyNationalCode)}
              />
              <InfoRow
                label="جمع اصل تسهیلات تضمین‌شده"
                value={formatRial(totalOriginalAmount)}
              />
              <InfoRow
                label="شناسه پاسخ استعلام"
                value={fa(result.inquiryResultId)}
              />
            </div>

            {/* لیست وام‌های تضمین‌شده */}
            {debtors.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-emerald-500">
                <ShieldCheck size={32} />
                <span className="text-sm font-extrabold">
                  هیچ ضمانت فعالی ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {debtors.map((item, idx) => {
                  const hasOverdue =
                    parseAmount(item.pastExpiredAmount) > 0 ||
                    parseAmount(item.deferredAmount) > 0 ||
                    parseAmount(item.suspiciousAmount) > 0 ||
                    parseAmount(item.latePenaltyAmount) > 0;

                  return (
                    <div
                      key={`${item.requestNumber}-${idx}`}
                      className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                            <Landmark size={18} />
                          </span>
                          <div>
                            <div className="text-sm font-extrabold text-ink">
                              {item.branchDescription ||
                                `بانک کد ${fa(item.bankCode)}`}
                            </div>
                            <div className="text-[11px] text-silver mt-0.5 flex items-center gap-1">
                              <User size={11} />
                              <span>
                                وام‌گیرنده: {item.debtorFirstName}{" "}
                                {item.debtorLastName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-extrabold text-brand">
                          <Percent size={11} />
                          <span>{fa(item.guarantyPercent)}٪</span>
                        </span>
                      </div>

                      {hasOverdue && (
                        <div className="rounded-xl bg-red-500/5 border border-red-500/15 px-3 py-2 mb-2.5 flex items-center gap-2 text-[11px] font-bold text-red-500">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>این تسهیلات دارای بدهی معوق یا سررسید گذشته است.</span>
                        </div>
                      )}

                      <InfoRow
                        label="اصل مبلغ تسهیلات"
                        value={formatRial(item.orginalAmount)}
                      />
                      <InfoRow
                        label="مانده کلی بدهی"
                        value={
                          <span className="font-extrabold text-ink">
                            {formatRial(item.totalAmount)}
                          </span>
                        }
                      />
                      <InfoRow
                        label="مبلغ سود"
                        value={formatRial(item.benefitAmount)}
                      />
                      <InfoRow
                        label="مانده سررسید گذشته"
                        value={formatRial(item.pastExpiredAmount)}
                      />
                      <InfoRow
                        label="مانده معوقه"
                        value={formatRial(item.deferredAmount)}
                      />
                      <InfoRow
                        label="مانده مشکوک‌الوصول"
                        value={formatRial(item.suspiciousAmount)}
                      />
                      {parseAmount(item.latePenaltyAmount) > 0 && (
                        <InfoRow
                          label="جریمه دیرکرد"
                          value={
                            <span className="text-red-500 font-bold">
                              {formatRial(item.latePenaltyAmount)}
                            </span>
                          }
                        />
                      )}
                      <InfoRow
                        label="کد ملی وام‌گیرنده"
                        value={fa(item.guarantyIdNumber)}
                      />
                      <InfoRow
                        label="تاریخ تنظیم قرارداد"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={13} className="text-silver" />
                            {formatCompactJalali(item.setDate)}
                          </span>
                        }
                      />
                      <InfoRow
                        label="تاریخ سررسید نهایی"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={13} className="text-silver" />
                            {formatCompactJalali(item.endDate)}
                          </span>
                        }
                      />
                      <InfoRow
                        label="شماره درخواست"
                        value={
                          <span
                            className="inline-flex items-center gap-1 font-mono text-[11px]"
                            dir="ltr"
                          >
                            <Hash size={12} className="text-silver" />
                            {fa(item.requestNumber)}
                          </span>
                        }
                      />
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
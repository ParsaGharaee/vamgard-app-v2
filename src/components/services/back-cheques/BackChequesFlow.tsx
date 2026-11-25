"use client";
import { useState } from "react";
import {
  FileWarning,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Landmark,
  AlertCircle,
  Hash,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface BackChequeItem {
  accountNumber: string;
  amount: number;
  bankCode: number;
  backDate: string;
  date: string;
  branchCode: string;
  dishonoringBranchName?: string;
  branchDescription?: string;
  dishonorReason?: string;
  branchBounced?: string;
  id: string;
  number: string;
}

interface BackChequesResult {
  nid: string;
  name: string;
  chequeList: BackChequeItem[];
}

const formatCompactJalali = (raw?: string) => {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return fa(`${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`);
  }
  return fa(raw);
};

const formatRial = (amount: number) =>
  `${fa(amount.toLocaleString("en-US"))} ریال`;

export default function BackChequesFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [userNid, setUserNid] = useState("");
  const [result, setResult] = useState<BackChequesResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(userNid)) return;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/users/${userNid}/backCheques
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        result: {
          nid: userNid,
          name: "سپهر صبور",
          chequeList: [
            {
              accountNumber: "000000000013152586",
              amount: 900000000,
              bankCode: 17,
              backDate: "13960610",
              date: "13960310",
              branchCode: "00151",
              dishonoringBranchName: "بانک تجارت - فخررازی",
              branchDescription: "بانک تجارت - فخررازی",
              dishonorReason: "حساب دارای کسر موجودی است.",
              branchBounced: "00151",
              id: "090922111",
              number: "0000887329",
            },
          ],
        },
        status: "DONE",
        trackId: "getBackCheques12312",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام چک‌های برگشتی. لطفاً مجدداً تلاش کنید."
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

  const cheques = result?.chequeList ?? [];
  const hasBouncedCheques = cheques.length > 0;
  const totalAmount = cheques.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام چک برگشتی" />

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
              کد ملی ۱۰ رقمی را وارد کنید تا فهرست چک‌های برگشتی ثبت‌شده در تمام بانک‌ها، مبلغ و جزئیات هر چک نمایش داده شود.
            </p>

            <NationalCodeInput
              value={userNid}
              onChange={setUserNid}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام چک‌های برگشتی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileWarning size={18} className="text-brand" />
                  <span>خلاصه وضعیت چک برگشتی</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت کلی */}
              <div
                className={`p-4 rounded-2xl mb-4 flex items-center gap-3 border ${
                  hasBouncedCheques
                    ? "bg-red-500/5 border-red-500/15 text-red-500"
                    : "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                }`}
              >
                {hasBouncedCheques ? (
                  <AlertCircle size={26} className="shrink-0" />
                ) : (
                  <ShieldCheck size={26} className="shrink-0" />
                )}
                <div>
                  <div className="text-sm font-extrabold">
                    {hasBouncedCheques
                      ? `${fa(cheques.length)} فقره چک برگشتی ثبت شده است`
                      : "چک برگشتی ثبت نشده است"}
                  </div>
                  <div className="text-[11px] font-bold opacity-85 mt-0.5">
                    {hasBouncedCheques
                      ? `مجموع مبلغ: ${formatRial(totalAmount)}`
                      : "سابقه چک برگشتی فعالی برای این کد ملی یافت نشد."}
                  </div>
                </div>
              </div>

              <InfoRow label="نام و نام خانوادگی" value={result.name} />
              <InfoRow label="کد ملی" value={fa(result.nid)} />
              <InfoRow
                label="تعداد چک‌های برگشتی"
                value={`${fa(cheques.length)} فقره`}
              />
              {hasBouncedCheques && (
                <InfoRow
                  label="جمع کل مبلغ برگشتی"
                  value={
                    <span className="font-extrabold text-red-500">
                      {formatRial(totalAmount)}
                    </span>
                  }
                />
              )}
            </div>

            {/* لیست چک‌های برگشتی */}
            {hasBouncedCheques && (
              <div className="space-y-3">
                {cheques.map((cheque, idx) => (
                  <div
                    key={`${cheque.id}-${idx}`}
                    className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-500">
                          <Landmark size={18} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-ink">
                            {cheque.dishonoringBranchName ||
                              cheque.branchDescription ||
                              `بانک کد ${fa(cheque.bankCode)}`}
                          </div>
                          <div className="text-[11px] text-silver mt-0.5">
                            کد شعبه: {fa(cheque.branchCode)}
                          </div>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-lg bg-red-500/10 px-2.5 py-1 text-[11px] font-extrabold text-red-500">
                        {formatRial(cheque.amount)}
                      </span>
                    </div>

                    {cheque.dishonorReason && (
                      <div className="rounded-xl bg-red-500/5 border border-red-500/10 px-3 py-2 mb-2 text-[11px] font-bold text-red-500">
                        علت برگشت: {cheque.dishonorReason}
                      </div>
                    )}

                    <InfoRow
                      label="شماره چک"
                      value={
                        <span className="font-mono text-xs" dir="ltr">
                          {fa(cheque.number)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="شناسه چک"
                      value={
                        <span
                          className="inline-flex items-center gap-1 font-mono text-xs"
                          dir="ltr"
                        >
                          <Hash size={12} className="text-silver" />
                          {fa(cheque.id)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="شماره حساب"
                      value={
                        <span className="font-mono text-[11px]" dir="ltr">
                          {fa(cheque.accountNumber)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="تاریخ سررسید"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-silver" />
                          {formatCompactJalali(cheque.date)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="تاریخ برگشت"
                      value={
                        <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                          <Calendar size={13} />
                          {formatCompactJalali(cheque.backDate)}
                        </span>
                      }
                    />
                  </div>
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
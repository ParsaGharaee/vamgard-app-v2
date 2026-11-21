"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  SayadIdInput,
  isValidSayadId,
} from "../shared/inputs/SayadIdInput";
import { fa } from "@/src/lib/format";

interface SayadSerialResult {
  iban: string;
  issuedDate: string;
  expirationDate: string | null;
  serialNo: string;
  seriesNo: string;
  mediaType: string;
  branchCode: string;
  name: string;
  returnedCheques: string | null;
}

const formatDate8 = (d?: string | null) => {
  if (!d || d === "null") return "ثبت نشده";
  if (/^\d{8}$/.test(d)) {
    return fa(`${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6, 8)}`);
  }
  return fa(d);
};

export default function SayadSerialFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [sayadId, setSayadId] = useState("");
  const [result, setResult] = useState<SayadSerialResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidSayadId(sayadId)) return;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/sayadSerialInquiry?sayadId=${sayadId}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "7b244-3c01-44f1-moho-e3aeaa",
        result: {
          iban: "IR020620000000100925869001",
          issuedDate: "14000803",
          expirationDate: "null",
          serialNo: "878535",
          seriesNo: "1234",
          mediaType: "BANS",
          branchCode: "6299996",
          name: "کامران تفتی",
          returnedCheques: null,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام شناسه چک صیادی. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSayadId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const hasReturned =
    Boolean(result?.returnedCheques) &&
    result?.returnedCheques !== "0" &&
    result?.returnedCheques !== "null";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام شناسه چک صیادی" />

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
              شناسه ۱۶ رقمی درج شده روی برگه چک صیادی را وارد کنید تا مشخصات دارنده دسته چک و جزئیات برگه چک نمایش داده شود.
            </p>

            <SayadIdInput
              value={sayadId}
              onChange={setSayadId}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام شناسه چک
              </VamButton>
            </div>
          </div>
        )}

        {/* نتیجه استعلام */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileText size={18} className="text-brand" />
                  <span>مشخصات برگه چک صیادی</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس وضعیت دارنده چک */}
              <div
                className={`p-4 rounded-2xl mb-4 flex items-center gap-3 border ${
                  hasReturned
                    ? "bg-red-500/5 border-red-500/15 text-red-500"
                    : "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                }`}
              >
                {hasReturned ? (
                  <ShieldAlert size={24} className="shrink-0" />
                ) : (
                  <ShieldCheck size={24} className="shrink-0" />
                )}
                <div>
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <User size={14} />
                    <span>{result.name}</span>
                  </div>
                  <div className="text-[11px] mt-1 opacity-85 font-bold">
                    {hasReturned
                      ? `تعداد چک برگشتی: ${fa(result.returnedCheques!)}`
                      : "فاقد چک برگشتی ثبت شده"}
                  </div>
                </div>
              </div>

              <InfoRow label="شناسه صیاد" value={fa(sayadId)} />
              <InfoRow
                label="شماره شبا"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {result.iban}
                  </span>
                }
              />
              <InfoRow label="شماره سریال" value={fa(result.serialNo)} />
              <InfoRow label="شماره سری" value={fa(result.seriesNo)} />
              <InfoRow label="کد شعبه" value={fa(result.branchCode)} />
              <InfoRow label="نوع چک" value={result.mediaType} />
              <InfoRow
                label="تاریخ صدور دسته چک"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {formatDate8(result.issuedDate)}
                  </span>
                }
              />
              <InfoRow
                label="تاریخ انقضای دسته چک"
                value={formatDate8(result.expirationDate)}
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
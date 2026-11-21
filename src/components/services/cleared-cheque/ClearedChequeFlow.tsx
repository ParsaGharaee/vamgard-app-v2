"use client";
import { useState } from "react";
import {
  User,
  Building2,
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  Calendar,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { VamSelect, type SelectOption } from "../shared/inputs/VamSelect";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

type PersonType = "1" | "2";

interface ClearedChequeItem {
  clearingBankCode: string;
  clearingBranchCode: string;
  clearingBranchName: string;
  clearedDate: string;
  clearedType: string;
  bouncedAtBranchName: string;
  customerType: string;
  idCheque: string;
  originBranchName: string;
  amount: string;
  bankCode: string;
  bouncedAmount: string;
  bouncedDate: string;
  dishonorReasons: string[];
  bouncedAtBranchCode: string;
  originBranchCode: string;
  channelKind: string;
  currencyCode: string;
  currencyRate: string;
  deadlineDate: string;
  iban: string;
  chequeSerialNumber: string;
}

interface ClearedChequeResult {
  firstName: string;
  lastName: string;
  nid: string;
  personType: number;
  chequeList: ClearedChequeItem[];
}

const PERSON_OPTIONS: SelectOption[] = [
  { value: "1", label: "شخص حقیقی (کد ملی)", icon: <User size={18} /> },
  { value: "2", label: "شخص حقوقی (شناسه ملی)", icon: <Building2 size={18} /> },
];

const CLEARED_TYPES: Record<string, string> = {
  "1": "لاشه چک",
  "2": "رضایتنامه محضری از ذینفع چک",
  "3": "مسدودی یکساله مبلغ چک",
  "4": "بخشنامه‌ای توسط بانک‌ها",
  "5": "دستور مراجع قضایی یا نامه مرجع ثبتی",
  "6": "مشمول مقررات مرورزمان",
  "7": "بخشنامه‌ای توسط بانک مرکزی",
};

const BOUNCED_REASONS: Record<string, string> = {
  "402": "حساب دارای کسر موجودی است",
  "403": "حساب مورد نظر فاقد موجودی است",
  "404": "امضاء مطابقت ندارد",
  "405": "نقص امضاء دارد",
  "406": "مغایرت تاریخ عددی و حروفی",
  "407": "امضاء چک مخدوش است",
  "408": "مندرجات چک مخدوش است",
  "409": "مبلغ حروفی با عددی مغایر است",
  "410": "حساب مورد نظر بسته است",
  "411": "حساب مورد نظر مسدود است",
  "412": "چک با این شماره مسدود است (ماده ۱۴)",
  "451": "مندرجات چک ناخواناست",
  "452": "مغایرت با اطلاعات ثبت شده در سامانه پیچک",
};

const formatDate8 = (d?: string) => {
  if (!d) return "—";
  if (/^\d{8}$/.test(d)) {
    return fa(`${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6, 8)}`);
  }
  return fa(d);
};

const formatAmount = (amount: string, currency = "IRR") => {
  const num = Number(amount);
  if (Number.isNaN(num)) return fa(amount);
  const unit = currency === "IRR" ? "ریال" : currency;
  return `${fa(num.toLocaleString("en-US"))} ${unit}`;
};

export default function ClearedChequeFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [personType, setPersonType] = useState<PersonType>("1");
  const [nationalCode, setNationalCode] = useState("");

  const [result, setResult] = useState<ClearedChequeResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const isCodeValid =
    personType === "1"
      ? isValidNationalCode(nationalCode)
      : isValidLegalId(nationalCode);

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isCodeValid) return;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/clearedCheque?nationalCode=...&personType=...
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-CTFH-20004000000",
        trackId: "clearedCheque12312",
        result: {
          firstName: personType === "1" ? "علی" : "شرکت نمونه",
          lastName: personType === "1" ? "محمدی" : "تجارت نوین",
          nid: nationalCode,
          personType: Number(personType),
          chequeList: [
            {
              clearingBankCode: "15",
              clearingBranchCode: "1234",
              clearingBranchName: "شعبه مرکزی",
              clearedDate: "14030101",
              clearedType: "2",
              bouncedAtBranchName: "شعبه برگشت‌زننده",
              customerType: "1",
              idCheque: "99881234",
              originBranchName: "شعبه افتتاح‌کننده",
              amount: "1000000",
              bankCode: "15",
              bouncedAmount: "500000",
              bouncedDate: "14021201",
              dishonorReasons: ["402"],
              bouncedAtBranchCode: "2211",
              originBranchCode: "1100",
              channelKind: "1",
              currencyCode: "IRR",
              currencyRate: "1",
              deadlineDate: "14021101",
              iban: "IR120170000000100123456001",
              chequeSerialNumber: "0012345678",
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام چک‌های رفع سوء اثر شده. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="چک رفع سوء اثر شده" />

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
              نوع شخص (حقیقی یا حقوقی) را انتخاب کرده و کد ملی یا شناسه ملی را برای مشاهده فهرست چک‌های رفع سوء اثر شده وارد کنید.
            </p>

            <VamSelect
              label="نوع شخص"
              options={PERSON_OPTIONS}
              value={personType}
              onChange={(val) => {
                setPersonType(val as PersonType);
                setNationalCode("");
                setShowFormErrors(false);
              }}
            />

            {personType === "1" ? (
              <NationalCodeInput
                value={nationalCode}
                onChange={setNationalCode}
                showErrors={showFormErrors}
              />
            ) : (
              <LegalIdInput
                value={nationalCode}
                onChange={setNationalCode}
                showErrors={showFormErrors}
              />
            )}

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام چک‌های رفع سوء اثر شده
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه مشخصات صاحب استعلام */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileCheck2 size={18} className="text-brand" />
                  <span>مشخصات استعلام</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              <InfoRow
                label="نام و نام خانوادگی"
                value={`${result.firstName} ${result.lastName}`.trim()}
              />
              <InfoRow
                label={result.personType === 1 ? "کد ملی" : "شناسه ملی"}
                value={fa(result.nid)}
              />
              <InfoRow
                label="نوع شخص"
                value={result.personType === 1 ? "حقیقی" : "حقوقی"}
              />
              <InfoRow
                label="تعداد چک‌های رفع سوء شده"
                value={`${fa(result.chequeList.length)} فقره`}
              />
            </div>

            {/* لیست کارت‌های چک‌های رفع سوء اثر شده */}
            {result.chequeList.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-emerald-500">
                <ShieldCheck size={32} />
                <span className="text-sm font-bold">
                  هیچ چک رفع سوء اثر شده‌ای ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.chequeList.map((chq, idx) => (
                  <div
                    key={`${chq.idCheque}-${idx}`}
                    className="surface p-4 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    {/* هدر کارت چک */}
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-line/10">
                      <div>
                        <div className="text-xs font-extrabold">
                          شماره چک: {fa(chq.chequeSerialNumber)}
                        </div>
                        <div className="text-[11px] text-silver mt-0.5">
                          کد رهگیری: {fa(chq.idCheque)}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        رفع سوء اثر شده
                      </span>
                    </div>

                    {/* نحوه رفع سوء اثر */}
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 px-3 py-2.5 mb-2 text-xs">
                      <span className="text-silver font-bold">نحوه رفع سوء: </span>
                      <span className="font-extrabold text-emerald-500">
                        {CLEARED_TYPES[chq.clearedType] ?? `کد ${fa(chq.clearedType)}`}
                      </span>
                    </div>

                    <InfoRow
                      label="مبلغ کل چک"
                      value={formatAmount(chq.amount, chq.currencyCode)}
                    />
                    <InfoRow
                      label="مبلغ برگشتی"
                      value={formatAmount(chq.bouncedAmount, chq.currencyCode)}
                    />
                    <InfoRow
                      label="تاریخ سررسید"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-silver" />
                          {formatDate8(chq.deadlineDate)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="تاریخ برگشت"
                      value={formatDate8(chq.bouncedDate)}
                    />
                    <InfoRow
                      label="تاریخ رفع سوء"
                      value={
                        <span className="text-emerald-500 font-extrabold">
                          {formatDate8(chq.clearedDate)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="شعبه افتتاح‌کننده"
                      value={`${chq.originBranchName} (${fa(chq.originBranchCode)})`}
                    />
                    <InfoRow
                      label="شعبه برگشت‌زننده"
                      value={`${chq.bouncedAtBranchName} (${fa(chq.bouncedAtBranchCode)})`}
                    />
                    <InfoRow
                      label="شعبه رفع سوء"
                      value={`${chq.clearingBranchName} (${fa(chq.clearingBranchCode)})`}
                    />
                    <InfoRow
                      label="شماره شبا"
                      value={
                        <span className="font-mono text-[11px]" dir="ltr">
                          {chq.iban}
                        </span>
                      }
                    />

                    {/* دلایل برگشت */}
                    {chq.dishonorReasons?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-line/10">
                        <div className="text-[11px] font-bold text-silver mb-2">
                          دلایل برگشت:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {chq.dishonorReasons.map((code) => (
                            <span
                              key={code}
                              className="rounded-lg bg-amber-500/10 text-amber-500 px-2.5 py-1 text-[11px] font-bold"
                            >
                              {BOUNCED_REASONS[code] ?? `کد ${fa(code)}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
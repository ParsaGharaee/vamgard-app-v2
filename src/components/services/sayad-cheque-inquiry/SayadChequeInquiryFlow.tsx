"use client";
import { useState } from "react";
import {
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Landmark,
  Users,
  PenTool,
  Lock,
  Copy,
  Check,
  User,
  Building2,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import {
  SayadIdInput,
  isValidSayadId,
} from "../shared/inputs/SayadIdInput";
import { fa } from "@/src/lib/format";

type ReceiverIdType = "1" | "2";

interface ChequeHolder {
  idCode: string;
  idType: number;
  name: string;
}

interface ChequeSigner {
  name: string;
  legalStamp: number;
}

interface SayadChequeResult {
  message: string;
  referenceId: string;
  sayadId: string;
  branchCode: string;
  bankCode: string;
  amount: number;
  dueDate: string;
  description?: string;
  serialNo: string;
  seriesNo: string;
  fromIban: string;
  toIban?: string | null;
  reason?: string;
  currency: number;
  chequeStatus: number;
  chequeType: number;
  chequeMedia: number;
  blockStatus: number;
  guaranteeStatus: number;
  locked: number;
  holders: ChequeHolder[];
  signers: ChequeSigner[];
  lockerBankCode?: string;
  lockerBranchCode?: string;
  issueDate?: string;
}

const CHEQUE_STATUS_MAP: Record<number, { label: string; cls: string }> = {
  1: { label: "صادر شده", cls: "bg-brand/10 text-brand" },
  2: { label: "نقد شده", cls: "bg-emerald-500/10 text-emerald-500" },
  3: { label: "باطل شده", cls: "bg-silver/15 text-silver" },
  4: { label: "برگشت خورده", cls: "bg-red-500/10 text-red-500" },
  5: { label: "بخشی برگشت خورده", cls: "bg-red-500/10 text-red-500" },
  6: { label: "در انتظار امضای ضامن", cls: "bg-amber-500/10 text-amber-500" },
  7: { label: "در انتظار تایید گیرنده", cls: "bg-amber-500/10 text-amber-500" },
  8: { label: "در انتظار تایید انتقال", cls: "bg-amber-500/10 text-amber-500" },
};

const CHEQUE_TYPE_MAP: Record<number, string> = {
  1: "عادی",
  2: "بانکی (تضمینی)",
  3: "موردی",
};

const CHEQUE_MEDIA_MAP: Record<number, string> = {
  1: "کاغذی",
  2: "دیجیتال (الکترونیکی)",
};

const BLOCK_STATUS_MAP: Record<number, string> = {
  0: "مسدود نشده",
  1: "مسدود موقت",
  2: "مسدود دائم",
  3: "رفع مسدودی شده",
};

const GUARANTEE_STATUS_MAP: Record<number, string> = {
  1: "فاقد ضمانت",
  2: "در انتظار تایید ضامن",
  3: "رد شده توسط ضامن",
  4: "تایید شده توسط ضامن",
  5: "ضمانت‌شده (کامل)",
};

const formatRial = (amount: number) =>
  `${fa(amount.toLocaleString("en-US"))} ریال`;

const formatCompactDate = (raw?: string) => {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 8) {
    const datePart = `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
    if (digits.length >= 14) {
      const timePart = `${digits.slice(8, 10)}:${digits.slice(10, 12)}`;
      return fa(`${datePart} - ${timePart}`);
    }
    return fa(datePart);
  }
  return fa(raw);
};

export default function SayadChequeInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedSayad, setCopiedSayad] = useState(false);

  const [idType, setIdType] = useState<ReceiverIdType>("1");
  const [userNid, setUserNid] = useState("");
  const [legalId, setLegalId] = useState("");
  const [sayadId, setSayadId] = useState("");
  const [shahabId, setShahabId] = useState("");

  const [result, setResult] = useState<SayadChequeResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleReceiverTypeChange = (next: ReceiverIdType) => {
    if (next === idType) return;
    setIdType(next);
    setLegalId("");
    setShowFormErrors(false);
  };

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    const isLegalValid = idType === "1" ? true : isValidLegalId(legalId);

    if (
      !isValidNationalCode(userNid) ||
      !isLegalValid ||
      !isValidSayadId(sayadId)
    ) {
      return;
    }

    const resolvedIdCode = idType === "1" ? userNid : legalId;

    setLoading(true);
    try {
      // GET /credit/v2/clients/{clientId}/users/${userNid}/sms/sayadChequeInquiry?sayadId=${sayadId}&idCode=${resolvedIdCode}&idType=${idType}${shahabId ? `&shahabId=${shahabId}` : ""}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "7113b244-3c01-44f1-b395-e3ab464cfeaa",
        result: {
          message: "استعلام چک با موفقیت انجام شد",
          referenceId: "25161234064321",
          sayadId,
          branchCode: "5502227",
          bankCode: "57",
          amount: 100000000,
          dueDate: "14051027",
          description: "بابت تسویه فاکتور فروش",
          serialNo: "283331",
          seriesNo: "9999",
          fromIban: "IR550770000000104272127001",
          reason: "POSA",
          currency: 1,
          chequeStatus: 1,
          chequeType: 1,
          chequeMedia: 1,
          blockStatus: 0,
          guaranteeStatus: 1,
          locked: 0,
          holders: [
            {
              idCode: resolvedIdCode,
              idType: Number(idType),
              name: idType === "1" ? "چارلز بوکوفسکی" : "شرکت فینوتک پارس",
            },
          ],
          signers: [
            {
              name: "آلبر کامو",
              legalStamp: 0,
            },
          ],
          lockerBankCode: "",
          lockerBranchCode: "",
          issueDate: "14051025143237",
          toIban: null,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام چک صیاد. لطفاً از صحت شناسه صیاد و اطلاعات وارد شده اطمینان حاصل کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopySayad = async () => {
    if (!result?.sayadId) return;
    await navigator.clipboard.writeText(result.sayadId);
    setCopiedSayad(true);
    setTimeout(() => setCopiedSayad(false), 1800);
  };

  const resetForm = () => {
    setUserNid("");
    setLegalId("");
    setSayadId("");
    setShahabId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedSayad(false);
  };

  const statusMeta = result
    ? CHEQUE_STATUS_MAP[result.chequeStatus] ?? {
        label: `وضعیت ${fa(result.chequeStatus)}`,
        cls: "bg-silver/15 text-silver",
      }
    : null;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام چک صیاد" />

      <div className="px-4 mt-6">
        {generalError && !result && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* فرم ورودی */}
        {!result && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              نوع دریافت‌کننده چک و شناسه ۱۶ رقمی صیاد را وارد کنید تا وضعیت، مبلغ، سررسید، دارندگان و امضاکنندگان چک نمایش داده شود.
            </p>

            {/* انتخاب نوع دریافت‌کننده چک */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                نوع شخص دریافت‌کننده چک
              </label>
              <div className="grid grid-cols-2 gap-2 surface p-1.5 rounded-2xl border border-line/5">
                <button
                  type="button"
                  onClick={() => handleReceiverTypeChange("1")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    idType === "1"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <User size={15} />
                  <span>حقیقی</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReceiverTypeChange("2")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    idType === "2"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver hover:text-ink"
                  }`}
                >
                  <Building2 size={15} />
                  <span>حقوقی</span>
                </button>
              </div>
            </div>

            <SayadIdInput
              value={sayadId}
              onChange={setSayadId}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              label={
                idType === "1"
                  ? "کد ملی دریافت‌کننده چک"
                  : "کد ملی استعلام‌گیرنده (نماینده)"
              }
              value={userNid}
              onChange={setUserNid}
              showErrors={showFormErrors}
            />

            {idType === "2" && (
              <LegalIdInput
                label="شناسه ملی شرکت دریافت‌کننده چک"
                value={legalId}
                onChange={setLegalId}
                showErrors={showFormErrors}
              />
            )}

            {/* شناسه شهاب (اختیاری) */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                شناسه شهاب (اختیاری)
              </label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="1000000000000000"
                value={shahabId}
                onChange={(e) =>
                  setShahabId(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                className="w-full surface rounded-2xl py-3.5 px-4 text-sm font-bold outline-none border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 font-mono text-left placeholder:text-silver/40"
              />
            </div>

            <VamButton loading={loading} onClick={handleInquiry}>
              استعلام چک صیاد
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileCheck size={18} className="text-brand" />
                  <span>مشخصات چک صیادی</span>
                </div>
                {statusMeta && (
                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusMeta.cls}`}
                  >
                    {statusMeta.label}
                  </span>
                )}
              </div>

              <div className="rounded-2xl bg-brand/10 border border-brand/20 p-4 text-center mb-4">
                <div className="text-[11px] font-bold text-silver">
                  مبلغ چک
                </div>
                <div className="text-xl font-black text-brand mt-1">
                  {formatRial(result.amount)}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ink mt-2">
                  <Calendar size={13} className="text-brand" />
                  <span>سررسید: {formatCompactDate(result.dueDate)}</span>
                </div>
              </div>

              {result.locked === 1 && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 mb-4 flex items-center gap-2 text-xs font-bold text-amber-600">
                  <Lock size={15} className="shrink-0" />
                  <span>
                    چک جهت نقد شدن به بانک ارائه (قفل) شده است
                    {result.lockerBankCode
                      ? ` · بانک ${fa(result.lockerBankCode)}`
                      : ""}
                  </span>
                </div>
              )}

              <InfoRow
                label="شناسه صیاد"
                value={
                  <button
                    type="button"
                    onClick={handleCopySayad}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink active:scale-95 transition-transform"
                    dir="ltr"
                  >
                    <span>{fa(result.sayadId)}</span>
                    {copiedSayad ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} className="text-silver" />
                    )}
                  </button>
                }
              />
              <InfoRow
                label="سری و سریال چک"
                value={`${fa(result.seriesNo)} / ${fa(result.serialNo)}`}
              />
              <InfoRow
                label="نوع چک"
                value={
                  CHEQUE_TYPE_MAP[result.chequeType] ?? fa(result.chequeType)
                }
              />
              <InfoRow
                label="رسانه چک"
                value={
                  CHEQUE_MEDIA_MAP[result.chequeMedia] ?? fa(result.chequeMedia)
                }
              />
              <InfoRow
                label="وضعیت مسدودی"
                value={
                  <span
                    className={
                      result.blockStatus === 0
                        ? "text-emerald-500 font-bold"
                        : "text-red-500 font-extrabold"
                    }
                  >
                    {BLOCK_STATUS_MAP[result.blockStatus] ??
                      fa(result.blockStatus)}
                  </span>
                }
              />
              <InfoRow
                label="وضعیت ضمانت"
                value={
                  GUARANTEE_STATUS_MAP[result.guaranteeStatus] ??
                  fa(result.guaranteeStatus)
                }
              />
              {result.description && (
                <InfoRow label="بابت / شرح چک" value={result.description} />
              )}
              {result.issueDate && (
                <InfoRow
                  label="تاریخ ثبت اولیه"
                  value={formatCompactDate(result.issueDate)}
                />
              )}
            </div>

            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <Landmark size={18} className="text-brand" />
                <span>اطلاعات حساب و بانک عهده</span>
              </div>

              <InfoRow label="کد بانک عهده" value={fa(result.bankCode)} />
              <InfoRow label="کد شعبه عهده" value={fa(result.branchCode)} />
              <InfoRow
                label="شبای حساب عهده"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {result.fromIban}
                  </span>
                }
              />
              {result.toIban && (
                <InfoRow
                  label="شبای حساب مقصد"
                  value={
                    <span className="font-mono text-[11px]" dir="ltr">
                      {result.toIban}
                    </span>
                  }
                />
              )}
              <InfoRow
                label="کد رهگیری"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    {fa(result.referenceId)}
                  </span>
                }
              />
            </div>

            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-extrabold mb-2.5">
                  <Users size={16} className="text-brand" />
                  <span>
                    دارندگان چک ({fa(result.holders?.length ?? 0)})
                  </span>
                </div>
                <div className="space-y-2">
                  {result.holders?.map((h, idx) => (
                    <div
                      key={`${h.idCode}-${idx}`}
                      className="rounded-2xl bg-tile/40 px-3.5 py-2.5 border border-line/5 flex items-center justify-between"
                    >
                      <span className="text-xs font-extrabold text-ink">
                        {h.name}
                      </span>
                      <span className="text-[11px] font-bold text-silver font-mono">
                        {fa(h.idCode)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-line/10">
                <div className="flex items-center gap-2 text-sm font-extrabold mb-2.5">
                  <PenTool size={16} className="text-brand" />
                  <span>
                    امضاکنندگان ({fa(result.signers?.length ?? 0)})
                  </span>
                </div>
                <div className="space-y-2">
                  {result.signers?.map((s, idx) => (
                    <div
                      key={`${s.name}-${idx}`}
                      className="rounded-2xl bg-tile/40 px-3.5 py-2.5 border border-line/5 flex items-center justify-between"
                    >
                      <span className="text-xs font-extrabold text-ink">
                        {s.name}
                      </span>
                      <span className="text-[10px] font-bold text-silver">
                        {s.legalStamp === 1 ? "با مهر حقوقی" : "امضای حقیقی"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-line/10 flex items-center justify-between text-[11px] text-silver">
                <span className="inline-flex items-center gap-1 text-emerald-500 font-bold">
                  <ShieldCheck size={13} />
                  {result.message}
                </span>
                <span className="font-mono" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold active:scale-95 transition-transform"
            >
              استعلام چک جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
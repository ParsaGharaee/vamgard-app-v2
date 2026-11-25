"use client";
import { useState } from "react";
import {
  FileX2,
  ShieldAlert,
  ShieldCheck,
  User,
  Building2,
  UserCheck,
  MessageSquareText,
  Copy,
  Check,
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
import {
  ShahabIdInput,
  isValidShahabId,
} from "../shared/inputs/ShahabIdInput";
import { fa } from "@/src/lib/format";

type PersonIdType = "1" | "2";

interface SayadCancelResult {
  message: string;
  referenceId: string;
}

// فقط حروف فارسی و فاصله مجاز است
const isValidPersianDescription = (val: string) =>
  /^[\u0600-\u06FF\u200C\s]{2,100}$/.test(val.trim());

export default function SayadCancelChequeFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // اطلاعات پایه چک
  const [sayadId, setSayadId] = useState("");
  const [cancelDescription, setCancelDescription] = useState("لغو چک");

  // اطلاعات لغوکننده (canceller)
  const [cancellerType, setCancellerType] = useState<PersonIdType>("1");
  const [cancellerIdCode, setCancellerIdCode] = useState("");
  const [cancellerShahabId, setCancellerShahabId] = useState("");

  // اطلاعات نماینده / وکیل (در حالت حقوقی اجباری، در حالت حقیقی اختیاری)
  const [hasAgent, setHasAgent] = useState(false);
  const [agentIdCode, setAgentIdCode] = useState("");
  const [agentShahabId, setAgentShahabId] = useState("");

  const [result, setResult] = useState<SayadCancelResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const isLegalCanceller = cancellerType === "2";
  const showAgentSection = isLegalCanceller || hasAgent;

  const handleCancellerTypeChange = (next: PersonIdType) => {
    if (next === cancellerType) return;
    setCancellerType(next);
    setCancellerIdCode("");
    setShowFormErrors(false);
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    const cancellerIdValid =
      cancellerType === "1"
        ? isValidNationalCode(cancellerIdCode)
        : isValidLegalId(cancellerIdCode);

    const agentValid = !showAgentSection
      ? true
      : isValidNationalCode(agentIdCode) && isValidShahabId(agentShahabId);

    if (
      !isValidSayadId(sayadId) ||
      !isValidPersianDescription(cancelDescription) ||
      !cancellerIdValid ||
      !isValidShahabId(cancellerShahabId) ||
      !agentValid
    ) {
      return;
    }

    // کد ملی کاربر احرازشده با پیامک (در مسیر URL)
    const resolvedUserNid = showAgentSection ? agentIdCode : cancellerIdCode;

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        sayadId,
        cancelDescription: cancelDescription.trim(),
        canceller: {
          idCode: cancellerIdCode,
          shahabId: cancellerShahabId,
          idType: cancellerType,
        },
      };

      if (showAgentSection) {
        payload.cancellerAgent = {
          idCode: agentIdCode,
          shahabId: agentShahabId,
          idType: "1",
        };
      }

      // POST /credit/v2/clients/{clientId}/users/${resolvedUserNid}/sms/sayadCancelCheque
      // Body: payload
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "7113b244-3c01-44f1-b395-e3ab464cfeaa",
        result: {
          message: "لغو چک با موفقیت انجام شد",
          referenceId: "11111111111111",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در ثبت لغو چک صیاد. لطفاً از صحت اطلاعات وارد شده اطمینان حاصل کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = async () => {
    if (!result?.referenceId) return;
    await navigator.clipboard.writeText(result.referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 1800);
  };

  const resetForm = () => {
    setSayadId("");
    setCancelDescription("لغو چک");
    setCancellerType("1");
    setCancellerIdCode("");
    setCancellerShahabId("");
    setHasAgent(false);
    setAgentIdCode("");
    setAgentShahabId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedRef(false);
  };

  const descValid = isValidPersianDescription(cancelDescription);
  const descError =
    showFormErrors && !descValid
      ? "شرح لغو الزامی است و فقط می‌تواند شامل حروف فارسی باشد."
      : "";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="لغو چک صیاد" />

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
              شناسه ۱۶ رقمی صیاد و اطلاعات صادرکننده (لغوکننده) چک را وارد کنید تا چک در سامانه صیاد لغو شود.
            </p>

            <SayadIdInput
              value={sayadId}
              onChange={setSayadId}
              showErrors={showFormErrors}
            />

            {/* شرح لغو (فقط فارسی) */}
            <div className="mb-5 relative">
              <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
                شرح لغو چک (فقط حروف فارسی)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="مثال: انصراف از معامله"
                  value={cancelDescription}
                  onChange={(e) => setCancelDescription(e.target.value)}
                  className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold outline-none transition-all duration-300 text-right
                    ${
                      descError
                        ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500"
                        : descValid
                          ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                          : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
                    }
                  `}
                />
                <MessageSquareText
                  size={20}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                    descError
                      ? "text-red-400"
                      : descValid
                        ? "text-emerald-500"
                        : "text-silver/60 group-focus-within:text-brand"
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  descError ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[10px] text-red-500 font-bold pr-1">
                  {descError}
                </p>
              </div>
            </div>

            {/* بخش اطلاعات لغوکننده (canceller) */}
            <div className="surface rounded-3xl p-4 mb-5 border border-line/5">
              <div className="text-xs font-extrabold text-ink mb-3">
                اطلاعات لغوکننده چک (صادرکننده)
              </div>

              <div className="grid grid-cols-2 gap-2 bg-bg/60 p-1 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => handleCancellerTypeChange("1")}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    cancellerType === "1"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver"
                  }`}
                >
                  <User size={14} />
                  <span>حقیقی</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCancellerTypeChange("2")}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    cancellerType === "2"
                      ? "bg-brand text-white shadow-sm"
                      : "text-silver"
                  }`}
                >
                  <Building2 size={14} />
                  <span>حقوقی</span>
                </button>
              </div>

              {cancellerType === "1" ? (
                <NationalCodeInput
                  label="کد ملی لغوکننده چک"
                  value={cancellerIdCode}
                  onChange={setCancellerIdCode}
                  showErrors={showFormErrors}
                />
              ) : (
                <LegalIdInput
                  label="شناسه ملی شرکت لغوکننده چک"
                  value={cancellerIdCode}
                  onChange={setCancellerIdCode}
                  showErrors={showFormErrors}
                />
              )}

              <ShahabIdInput
                label={
                  cancellerType === "1"
                    ? "کد شهاب لغوکننده چک"
                    : "کد شهاب شرکت لغوکننده چک"
                }
                value={cancellerShahabId}
                onChange={setCancellerShahabId}
                showErrors={showFormErrors}
              />
            </div>

            {/* بخش نماینده / وکیل (در حالت حقوقی همیشه باز، در حالت حقیقی با تاگل) */}
            <div className="surface rounded-3xl p-4 mb-6 border border-line/5">
              {isLegalCanceller ? (
                <div className="flex items-center gap-2 text-xs font-extrabold text-ink mb-4">
                  <UserCheck size={16} className="text-brand" />
                  <span>اطلاعات نماینده شرکت (ثبت‌کننده لغو)</span>
                </div>
              ) : (
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-xs font-extrabold text-ink">
                    <UserCheck size={16} className="text-brand" />
                    <span>ثبت لغو توسط وکیل یا نماینده</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={hasAgent}
                    onChange={(e) => setHasAgent(e.target.checked)}
                    className="h-4 w-4 accent-brand rounded"
                  />
                </label>
              )}

              {showAgentSection && (
                <div
                  className={
                    isLegalCanceller
                      ? ""
                      : "mt-4 pt-4 border-t border-line/10 animate-in fade-in"
                  }
                >
                  <NationalCodeInput
                    label={
                      isLegalCanceller
                        ? "کد ملی نماینده شرکت"
                        : "کد ملی وکیل / نماینده"
                    }
                    value={agentIdCode}
                    onChange={setAgentIdCode}
                    showErrors={showFormErrors}
                  />

                  <ShahabIdInput
                    label={
                      isLegalCanceller
                        ? "کد شهاب نماینده شرکت"
                        : "کد شهاب وکیل / نماینده"
                    }
                    value={agentShahabId}
                    onChange={setAgentShahabId}
                    showErrors={showFormErrors}
                  />
                </div>
              )}
            </div>

            <VamButton loading={loading} onClick={handleSubmit}>
              ثبت لغو چک صیاد
            </VamButton>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <FileX2 size={18} className="text-brand" />
                  <span>رسید لغو چک صیاد</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="p-5 rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 text-center border bg-emerald-500/5 border-emerald-500/15 text-emerald-500">
                <ShieldCheck size={34} />
                <div className="text-base font-black">{result.message}</div>
              </div>

              <InfoRow
                label="کد رهگیری سامانه صیاد"
                value={
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand active:scale-95 transition-transform"
                    dir="ltr"
                  >
                    <span>{fa(result.referenceId)}</span>
                    {copiedRef ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} className="text-silver" />
                    )}
                  </button>
                }
              />
              <InfoRow
                label="شناسه صیاد چک"
                value={
                  <span className="font-mono text-xs" dir="ltr">
                    {fa(sayadId)}
                  </span>
                }
              />
              <InfoRow label="شرح لغو" value={cancelDescription} />
              <InfoRow
                label={
                  cancellerType === "1"
                    ? "کد ملی لغوکننده"
                    : "شناسه ملی لغوکننده"
                }
                value={fa(cancellerIdCode)}
              />
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold active:scale-95 transition-transform"
            >
              لغو چک جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
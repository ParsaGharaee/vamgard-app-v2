"use client";
import { useState } from "react";
import {
  User,
  Building2,
  FileText,
  GitCommitVertical,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { VamSelect, type SelectOption } from "../shared/inputs/VamSelect";
import { SayadIdInput, isValidSayadId } from "../shared/inputs/SayadIdInput";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

type PersonType = "1" | "2";
type ChequeType = "1" | "2" | "3";

interface ChainCustomer {
  name: string;
  idCode: string;
  idType: number;
}

interface ChainNode {
  roleType: number;
  customers: ChainCustomer[];
}

interface TransfersChainResult {
  chain: ChainNode[];
}

const CHEQUE_TYPE_OPTIONS: SelectOption[] = [
  { value: "1", label: "چک عادی", icon: <FileText size={18} /> },
  { value: "2", label: "چک بانکی (تضمینی)", icon: <FileText size={18} /> },
  { value: "3", label: "چک رمزدار", icon: <FileText size={18} /> },
];

const PERSON_OPTIONS: SelectOption[] = [
  { value: "1", label: "شخص حقیقی (کد ملی)", icon: <User size={18} /> },
  { value: "2", label: "شخص حقوقی (شناسه ملی)", icon: <Building2 size={18} /> },
];

const ROLE_TYPES: Record<number, string> = {
  1: "صادرکننده چک",
  2: "ذینفع / دریافت‌کننده",
  3: "انتقال‌دهنده",
};

const ID_TYPES: Record<number, string> = {
  1: "حقیقی",
  2: "حقوقی",
  3: "اتباع حقیقی",
  4: "اتباع حقوقی",
};

export default function SayadTransfersChainFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [sayadId, setSayadId] = useState("");
  const [chequeType, setChequeType] = useState<ChequeType>("1");
  const [personType, setPersonType] = useState<PersonType>("1");
  const [idCode, setIdCode] = useState("");

  const [result, setResult] = useState<TransfersChainResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const isIdValid =
    personType === "1"
      ? isValidNationalCode(idCode)
      : isValidLegalId(idCode);

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidSayadId(sayadId) || !isIdValid) return;

    setLoading(true);
    try {
      // POST /credit/v2/clients/{clientId}/sayadTransfersChainInquiry
      // Body: { sayadId, chequeType, idCode }
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-CTKZ-20003200000",
        trackId: "cf1da6d1-8775-406a-moho-48228891bdd0",
        result: {
          chain: [
            {
              roleType: 1,
              customers: [
                {
                  name: "یعقوب یعقوبی",
                  idCode: idCode,
                  idType: Number(personType),
                },
              ],
            },
            {
              roleType: 2,
              customers: [
                {
                  name: "شرکت تجارت گستر پارس",
                  idCode: "10101234567",
                  idType: 2,
                },
              ],
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام زنجیره انتقالات چک. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSayadId("");
    setIdCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="زنجیره انتقالات چک صیاد" />

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
              شناسه ۱۶ رقمی چک صیادی، نوع چک و کد ملی یا شناسه ملی دارنده را برای مشاهده زنجیره انتقالات و ذینفعان وارد کنید.
            </p>

            <SayadIdInput
              value={sayadId}
              onChange={setSayadId}
              showErrors={showFormErrors}
            />

            <VamSelect
              label="نوع چک"
              options={CHEQUE_TYPE_OPTIONS}
              value={chequeType}
              onChange={(val) => setChequeType(val as ChequeType)}
            />

            <VamSelect
              label="نوع شخص"
              options={PERSON_OPTIONS}
              value={personType}
              onChange={(val) => {
                setPersonType(val as PersonType);
                setIdCode("");
                setShowFormErrors(false);
              }}
            />

            {personType === "1" ? (
              <NationalCodeInput
                value={idCode}
                onChange={setIdCode}
                showErrors={showFormErrors}
              />
            ) : (
              <LegalIdInput
                value={idCode}
                onChange={setIdCode}
                showErrors={showFormErrors}
              />
            )}

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام زنجیره انتقالات
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* خلاصه چک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <GitCommitVertical size={18} className="text-brand" />
                  <span>خلاصه استعلام زنجیره</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <InfoRow label="شناسه صیاد" value={fa(sayadId)} />
              <InfoRow
                label="نوع چک"
                value={
                  CHEQUE_TYPE_OPTIONS.find((o) => o.value === chequeType)?.label
                }
              />
              <InfoRow
                label="تعداد مراحل انتقال"
                value={`${fa(result.chain.length)} مرحله`}
              />
            </div>

            {/* تایم‌لاین زنجیره انتقالات */}
            {result.chain.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-silver">
                <ShieldCheck size={30} className="text-brand" />
                <span className="text-sm font-bold">
                  زنجیره انتقالی برای این چک ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="relative pr-5 space-y-4">
                {/* خط عمودی تایم‌لاین */}
                <div className="absolute right-2 top-4 bottom-4 w-0.5 bg-brand/25 rounded-full" />

                {result.chain.map((node, index) => (
                  <div key={index} className="relative">
                    {/* دایره شماره مرحله روی خط */}
                    <span className="absolute -right-[19px] top-4 grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] font-black text-white ring-4 ring-bg">
                      {fa(index + 1)}
                    </span>

                    <div className="surface p-4 rounded-[24px] border border-line/5 shadow-sm">
                      <div className="flex items-center justify-between pb-3 mb-2 border-b border-line/10">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-brand">
                          <Users size={15} />
                          <span>
                            {ROLE_TYPES[node.roleType] ?? `نقش ${fa(node.roleType)}`}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-silver">
                          مرحله {fa(index + 1)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {node.customers.map((c, cIdx) => (
                          <div
                            key={`${c.idCode}-${cIdx}`}
                            className="rounded-2xl bg-tile/40 px-3 py-1"
                          >
                            <InfoRow label="نام" value={c.name} />
                            <InfoRow
                              label={c.idType === 2 ? "شناسه ملی" : "کد ملی"}
                              value={fa(c.idCode)}
                            />
                            <InfoRow
                              label="نوع شخص"
                              value={ID_TYPES[c.idType] ?? `کد ${fa(c.idType)}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
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
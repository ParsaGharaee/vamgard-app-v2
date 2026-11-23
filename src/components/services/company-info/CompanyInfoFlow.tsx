"use client";
import { useState } from "react";
import {
  Building2,
  ShieldAlert,
  MapPin,
  Calendar,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Banknote,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

interface CompanyInfoResult {
  companyId: number;
  registrationNo: string;
  title: string;
  registrationDate?: string;
  capital?: number;
  address?: string;
  postalCode?: string;
  taxNumber?: string;
  lat?: number;
  lng?: number;
  status?: string;
  registrationTypeTitle?: string;
  persianRegistrationDate?: string;
  knowledgeBasedState?: string;
  knowledgeBasedCategory?: string;
}

const formatRial = (amount?: number) => {
  if (amount === undefined || amount === null) return "ثبت نشده";
  return `${fa(amount.toLocaleString("en-US"))} ریال`;
};

export default function CompanyInfoFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [result, setResult] = useState<CompanyInfoResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidLegalId(companyId)) return;

    setLoading(true);
    try {
      // GET /kyb/v2/clients/{clientId}/companyInfo?companyId=${companyId}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KBRO-20000300000",
        trackId: "5ad39615-933c-4326-a0c8-25a3706d7f2f",
        result: {
          companyId: Number(companyId),
          registrationNo: "546789",
          title: "شرکت فناوری اطلاعات نمونه پارس",
          registrationDate: "2018-06-13T00:00:00",
          capital: 200000000000,
          address: "استان تهران - منطقه ۷، سیدخندان، پلاک ۲، طبقه دوم",
          postalCode: "1631845611",
          taxNumber: "411512345678",
          status: "فعال",
          registrationTypeTitle: "سهامی خاص",
          persianRegistrationDate: "1397/03/23",
          knowledgeBasedState: "دانش‌بنیان",
          knowledgeBasedCategory: "فناور",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام اطلاعات شرکت. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!result?.address) return;
    await navigator.clipboard.writeText(result.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 1800);
  };

  const resetForm = () => {
    setCompanyId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedAddress(false);
  };

  const isActive = result?.status === "فعال";

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اطلاعات شرکت" />

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
              شناسه ملی ۱۱ رقمی شرکت را وارد کنید تا مشخصات ثبتی، وضعیت فعالیت، سرمایه و نشانی رسمی کسب‌وکار نمایش داده شود.
            </p>

            <LegalIdInput
              value={companyId}
              onChange={setCompanyId}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام اطلاعات شرکت
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت اصلی مشخصات شرکت */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-start gap-2.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                    <Building2 size={20} />
                  </span>
                  <div>
                    <div className="text-[15px] font-extrabold leading-6">
                      {result.title}
                    </div>
                    {result.registrationTypeTitle && (
                      <div className="text-[11px] font-bold text-silver mt-0.5">
                        {result.registrationTypeTitle}
                      </div>
                    )}
                  </div>
                </div>

                {result.status && (
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {result.status}
                  </span>
                )}
              </div>

              {/* بج دانش‌بنیان در صورت وجود */}
              {result.knowledgeBasedState && (
                <div className="flex items-center gap-2 rounded-2xl bg-brand/5 border border-brand/15 px-3.5 py-2.5 mb-4 text-xs font-extrabold text-brand">
                  <Sparkles size={15} className="shrink-0" />
                  <span>
                    وضعیت دانش‌بنیان: {result.knowledgeBasedState}
                    {result.knowledgeBasedCategory
                      ? ` (${result.knowledgeBasedCategory})`
                      : ""}
                  </span>
                </div>
              )}

              <InfoRow label="شناسه ملی" value={fa(result.companyId)} />
              <InfoRow label="شماره ثبت" value={fa(result.registrationNo)} />
              {result.persianRegistrationDate && (
                <InfoRow
                  label="تاریخ ثبت"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-silver" />
                      {fa(result.persianRegistrationDate)}
                    </span>
                  }
                />
              )}
              {result.capital !== undefined && (
                <InfoRow
                  label="سرمایه ثبتی"
                  value={
                    <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                      <Banknote size={14} />
                      {formatRial(result.capital)}
                    </span>
                  }
                />
              )}
              {result.taxNumber && (
                <InfoRow label="کد اقتصادی / مالیاتی" value={fa(result.taxNumber)} />
              )}
              <InfoRow
                label="کد پیگیری"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    #{trackId.split("-")[0].toUpperCase()}
                  </span>
                }
              />
            </div>

            {/* کارت نشانی و کد پستی */}
            {(result.address || result.postalCode) && (
              <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
                <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                  <MapPin size={18} className="text-brand" />
                  <span>نشانی ثبتی شرکت</span>
                </div>

                {result.address && (
                  <div className="rounded-2xl bg-tile/50 p-4 mb-3">
                    <p className="text-xs font-bold leading-6 text-ink">
                      {result.address}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
                      >
                        {copiedAddress ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedAddress ? "آدرس کپی شد" : "کپی نشانی"}</span>
                      </button>

                      {result.lat && result.lng && (
                        <a
                          href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 text-[11px] font-extrabold text-white active:scale-95 transition-transform"
                        >
                          <ExternalLink size={13} />
                          <span>مشاهده روی نقشه</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {result.postalCode && (
                  <InfoRow label="کد پستی" value={fa(result.postalCode)} />
                )}
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
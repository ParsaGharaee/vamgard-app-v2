"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Award,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CompanyNameInput,
  isValidCompanyName,
} from "../shared/inputs/CompanyNameInput";
import {
  WebsiteInput,
  isValidWebsite,
  normalizeWebsite,
} from "../shared/inputs/WebsiteInput";
import { fa } from "@/src/lib/format";

interface EnamadResult {
  licenseHolder: string;
  registeredDate: string;
  expirationDate: string;
}

export default function EnamadInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [result, setResult] = useState<EnamadResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCompanyName(companyName) || !isValidWebsite(website)) return;

    const cleanWebsite = normalizeWebsite(website);
    setLoading(true);
    try {
      // GET /kyb/v2/clients/{clientId}/enamadInquiry?companyName=${encodeURIComponent(companyName)}&website=${encodeURIComponent(cleanWebsite)}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KBJT-20000600000",
        trackId: "abee0f-6c9e-fe88d-5a0",
        result: {
          licenseHolder: companyName.trim(),
          registeredDate: "1401/04/01",
          expirationDate: "1405/04/01",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام گواهینامه اینماد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setWebsite("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const cleanDomain = normalizeWebsite(website);

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اینماد" />

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
              نام شرکت و آدرس وب‌سایت را وارد کنید تا وضعیت گواهینامه نماد اعتماد الکترونیکی (اینماد)، تاریخ ثبت و تاریخ انقضای آن نمایش داده شود.
            </p>

            <CompanyNameInput
              value={companyName}
              onChange={setCompanyName}
              showErrors={showFormErrors}
            />

            <WebsiteInput
              value={website}
              onChange={setWebsite}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام گواهینامه اینماد
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Award size={18} className="text-brand" />
                  <span>گواهینامه اینماد</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              {/* باکس تاییدیه اینماد */}
              <div className="p-4 rounded-2xl mb-4 bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={28} className="shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">
                    {result.licenseHolder}
                  </div>
                  <div className="text-[11px] font-bold opacity-85 mt-0.5">
                    دارای گواهینامه نماد اعتماد الکترونیکی ثبت‌شده
                  </div>
                </div>
              </div>

              <InfoRow label="دارنده مجوز" value={result.licenseHolder} />
              <InfoRow
                label="وب‌سایت"
                value={
                  <a
                    href={`https://${cleanDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="inline-flex items-center gap-1 font-mono text-xs text-brand font-bold"
                  >
                    <span>{cleanDomain}</span>
                    <ExternalLink size={12} />
                  </a>
                }
              />
              <InfoRow
                label="تاریخ ثبت"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(result.registeredDate)}
                  </span>
                }
              />
              <InfoRow
                label="تاریخ انقضا"
                value={
                  <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                    <Calendar size={13} />
                    {fa(result.expirationDate)}
                  </span>
                }
              />
            </div>

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
"use client";
import { useState } from "react";
import {
  Newspaper,
  ShieldAlert,
  Building2,
  Calendar,
  MapPin,
  FileText,
  Banknote,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

interface CorporateJournalItem {
  newsId: number;
  title: string | number;
  description: string;
  companyId: number;
  capitalTo?: number | null;
  newspaperDate?: string;
  newsletterDate?: string;
  newspaperNumber?: string;
  newspaperCity?: string;
  pageNumber?: number;
  indicatorNumber?: string;
}

const formatJalaliDate = (iso?: string) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fa(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatRial = (amount?: number | null) => {
  if (!amount) return "—";
  return `${fa(amount.toLocaleString("en-US"))} ریال`;
};

export default function CorporateJournalFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [result, setResult] = useState<CorporateJournalItem[] | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidLegalId(companyId)) return;

    setLoading(true);
    try {
      // GET /kyb/v2/clients/{clientId}/corporateJournal?companyId=${companyId}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KBRO-20000400000",
        trackId: "a6fd38c4-253a-461d-a47d-af3ad4200a6a",
        result: [
          {
            newsId: 11111111,
            title: "آگهی تغییرات و افزایش سرمایه",
            description:
              "به استناد صورتجلسه مجمع عمومی فوق‌العاده، سرمایه شرکت از مبلغ ۵۰,۰۰۰,۰۰۰ ریال به مبلغ ۱۰۰,۰۰۰,۰۰۰ ریال افزایش یافت و ماده مربوطه در اساسنامه اصلاح گردید.",
            companyId: Number(companyId),
            capitalTo: 100000000,
            newspaperDate: "2018-12-08T00:00:00",
            newsletterDate: "2018-06-13T00:00:00",
            newspaperNumber: "21477",
            newspaperCity: "تهران",
            pageNumber: 2,
            indicatorNumber: "111111100111111111",
          },
          {
            newsId: 11111098,
            title: "آگهی تاسیس شرکت",
            description:
              "تاسیس شرکت سهامی خاص در تاریخ ۱۳۹۷/۰۳/۲۳ به شماره ثبت ۵۴۶۷۸۹ در اداره ثبت شرکت‌ها و موسسات غیرتجاری تهران ثبت و امضا ذیل دفاتر تکمیل گردید.",
            companyId: Number(companyId),
            capitalTo: 50000000,
            newspaperDate: "2018-06-20T00:00:00",
            newsletterDate: "2018-06-13T00:00:00",
            newspaperNumber: "21390",
            newspaperCity: "تهران",
            pageNumber: 14,
            indicatorNumber: "111111100111110420",
          },
        ],
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام آگهی‌های روزنامه رسمی شرکت. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompanyId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="آگهی‌های روزنامه رسمی" />

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
              شناسه ملی ۱۱ رقمی شرکت را وارد کنید تا فهرست آگهی‌های ثبت‌شده در روزنامه رسمی (تاسیس، تغییرات، افزایش سرمایه و...) نمایش داده شود.
            </p>

            <LegalIdInput
              value={companyId}
              onChange={setCompanyId}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام آگهی‌های روزنامه رسمی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه استعلام */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Building2 size={18} className="text-brand" />
                  <span>خلاصه آگهی‌های شرکت</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <InfoRow label="شناسه ملی شرکت" value={fa(companyId)} />
              <InfoRow
                label="تعداد آگهی‌های یافت‌شده"
                value={`${fa(result.length)} آگهی`}
              />
            </div>

            {/* لیست آگهی‌های روزنامه رسمی */}
            {result.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-silver">
                <Newspaper size={30} className="text-brand" />
                <span className="text-sm font-bold">
                  آگهی روزنامه رسمی برای این شرکت ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.map((item, idx) => (
                  <div
                    key={`${item.newsId}-${idx}`}
                    className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    {/* هدر کارت آگهی */}
                    <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-line/10">
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand mt-0.5">
                          <Newspaper size={18} />
                        </span>
                        <div>
                          <div className="text-xs font-extrabold leading-5 text-ink">
                            {fa(String(item.title))}
                          </div>
                          <div className="text-[11px] text-silver mt-0.5">
                            شناسه آگهی: {fa(item.newsId)}
                          </div>
                        </div>
                      </div>

                      {item.newspaperNumber && (
                        <span className="shrink-0 rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-extrabold text-brand">
                          شماره {fa(item.newspaperNumber)}
                        </span>
                      )}
                    </div>

                    {/* متن آگهی */}
                    {item.description && (
                      <div className="rounded-2xl bg-tile/50 p-3.5 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-silver mb-1.5">
                          <FileText size={13} className="text-brand" />
                          <span>متن آگهی</span>
                        </div>
                        <p className="text-xs leading-6 text-ink font-medium text-justify">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {/* جزئیات روزنامه رسمی */}
                    <InfoRow
                      label="تاریخ روزنامه رسمی"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-silver" />
                          {formatJalaliDate(item.newspaperDate)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="تاریخ آگهی / ثبت"
                      value={formatJalaliDate(item.newsletterDate)}
                    />
                    {item.newspaperCity && (
                      <InfoRow
                        label="شهر روزنامه"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} className="text-silver" />
                            {item.newspaperCity}
                          </span>
                        }
                      />
                    )}
                    {item.pageNumber !== undefined && (
                      <InfoRow
                        label="شماره صفحه"
                        value={`صفحه ${fa(item.pageNumber)}`}
                      />
                    )}
                    {item.capitalTo ? (
                      <InfoRow
                        label="سرمایه ثبت‌شده"
                        value={
                          <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                            <Banknote size={14} />
                            {formatRial(item.capitalTo)}
                          </span>
                        }
                      />
                    ) : null}
                    {item.indicatorNumber && (
                      <InfoRow
                        label="شماره مکانیزه"
                        value={
                          <span className="font-mono text-[11px]" dir="ltr">
                            {fa(item.indicatorNumber)}
                          </span>
                        }
                      />
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
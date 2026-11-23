"use client";
import { useState } from "react";
import {
  Package,
  ShieldAlert,
  MapPin,
  Clock,
  Calendar,
  Truck,
  Scale,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  PostalTrackingCodeInput,
  isValidPostalTrackingCode,
} from "../shared/inputs/PostalTrackingCodeInput";
import { fa } from "@/src/lib/format";

interface PostalEventDetail {
  id: string;
  date: string;
  time: string;
  event: string;
  postalNode: string;
}

interface PostalInquiryResult {
  postType: string;
  sourcePostOffice: string;
  source: string;
  destination: string;
  senderName: string;
  receiverName: string;
  sourcePostalCode?: string;
  destinationPostalCode?: string;
  weight: string;
  totalAmount: string;
  details: PostalEventDetail[];
}

const formatRial = (amount?: string) => {
  const num = Number(amount);
  if (!num || Number.isNaN(num)) return "—";
  return `${fa(num.toLocaleString("en-US"))} ریال`;
};

export default function PostalInquiryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [trackingCode, setTrackingCode] = useState("");
  const [result, setResult] = useState<PostalInquiryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidPostalTrackingCode(trackingCode)) return;

    setLoading(true);
    try {
      // GET /ecity/v2/clients/{clientId}/postalInquiry?trackingCode=${trackingCode}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-EYVH-20001700000",
        trackId: "cf65bc2d-c1b3-4579-90bf-ac5ab6448741",
        result: {
          postType: "پیشتاز",
          sourcePostOffice: "دفتر پیشخوان دولت 72162332",
          source: "استان تهران، شهر منطقه ۱۴ پستی تهران",
          destination: "استان تهران، شهر تهران",
          senderName: "علی محمدی",
          receiverName: "رضا کریمی",
          sourcePostalCode: "1341666958",
          destinationPostalCode: "1451844211",
          weight: "425",
          totalAmount: "291995",
          details: [
            {
              id: "5",
              date: "1403/05/31",
              time: "14:39",
              event: "مرسوله تحویل گیرنده گردیده است.",
              postalNode: "تهران، منطقه ۱۷ پستی تهران، نقطه مبادله پستی منطقه ۱۷",
            },
            {
              id: "4",
              date: "1403/05/31",
              time: "08:15",
              event: "تحویل به نامه‌رسان جهت توزیع",
              postalNode: "تهران، منطقه ۱۷ پستی تهران",
            },
            {
              id: "1",
              date: "1403/05/29",
              time: "11:20",
              event: "قبول مرسوله در دفتر مبدا",
              postalNode: "دفتر پیشخوان دولت 72162332",
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام مرسوله پستی. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTrackingCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const latestEvent = result?.details?.[0];

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام مرسولات پستی" />

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
              کد رهگیری ۲۴ رقمی درج شده روی رسید پستی را وارد کنید تا آخرین وضعیت و تاریخچه جابه‌جایی مرسوله نمایش داده شود.
            </p>

            <PostalTrackingCodeInput
              value={trackingCode}
              onChange={setTrackingCode}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                رهگیری مرسوله پستی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه مرسوله */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Package size={18} className="text-brand" />
                  <span>مشخصات مرسوله</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-brand/10 text-brand">
                  پست {result.postType}
                </span>
              </div>

              {latestEvent && (
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-4 mb-4">
                  <div className="text-[11px] font-bold text-silver mb-1">
                    آخرین وضعیت مرسوله
                  </div>
                  <div className="text-xs font-extrabold text-emerald-500 leading-5">
                    {latestEvent.event}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-silver">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {fa(latestEvent.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {fa(latestEvent.time)}
                    </span>
                  </div>
                </div>
              )}

              <InfoRow label="فرستنده" value={result.senderName} />
              <InfoRow label="گیرنده" value={result.receiverName} />
              <InfoRow label="دفتر مبدا" value={result.sourcePostOffice} />
              <InfoRow label="مبدا" value={result.source} />
              <InfoRow label="مقصد" value={result.destination} />
              {result.sourcePostalCode && (
                <InfoRow label="کد پستی مبدا" value={fa(result.sourcePostalCode)} />
              )}
              {result.destinationPostalCode && (
                <InfoRow
                  label="کد پستی مقصد"
                  value={fa(result.destinationPostalCode)}
                />
              )}
              <InfoRow
                label="وزن مرسوله"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Scale size={13} className="text-silver" />
                    {fa(result.weight)} گرم
                  </span>
                }
              />
              <InfoRow label="هزینه ارسال" value={formatRial(result.totalAmount)} />
              <InfoRow
                label="کد پیگیری استعلام"
                value={
                  <span className="font-mono text-[11px]" dir="ltr">
                    #{trackId.split("-")[0].toUpperCase()}
                  </span>
                }
              />
            </div>

            {/* تایم‌لاین مراحل حرکت مرسوله */}
            {result.details?.length > 0 && (
              <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
                <div className="flex items-center gap-2 text-[15px] font-extrabold mb-4">
                  <Truck size={18} className="text-brand" />
                  <span>تاریخچه رهگیری ({fa(result.details.length)} رویداد)</span>
                </div>

                <div className="relative pr-5 space-y-4">
                  <div className="absolute right-2 top-2 bottom-2 w-0.5 bg-brand/25 rounded-full" />

                  {result.details.map((item, idx) => {
                    const isLatest = idx === 0;
                    return (
                      <div key={`${item.id}-${idx}`} className="relative">
                        <span
                          className={`absolute -right-[17px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-bg ${
                            isLatest ? "bg-emerald-500" : "bg-brand/70"
                          }`}
                        />

                        <div className="rounded-2xl bg-tile/40 p-3.5">
                          <div className="text-xs font-extrabold text-ink leading-5">
                            {item.event}
                          </div>

                          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-silver leading-5">
                            <MapPin size={13} className="shrink-0 mt-0.5 text-brand" />
                            <span>{item.postalNode}</span>
                          </div>

                          <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-silver">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={11} />
                              {fa(item.date)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} />
                              {fa(item.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
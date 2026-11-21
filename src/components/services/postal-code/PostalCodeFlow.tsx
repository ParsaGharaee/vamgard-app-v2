"use client";
import { useState } from "react";
import { MapPin, ShieldAlert, Copy, Check, Building2 } from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  PostalCodeInput,
  isValidPostalCode,
} from "../shared/inputs/PostalCodeInput";
import { fa } from "@/src/lib/format";

interface PostalCodeResult {
  postalCode: string;
  street: string;
  street2?: string;
  localityName: string;
  localityType?: string;
  subLocality?: string;
  province: string;
  townShip?: string;
  zone?: string;
  buildingName?: string | null;
  description?: string | null;
  floor?: string;
  houseNumber?: string;
  plateName?: string;
  buildingId?: string;
  address: string;
}

export default function PostalCodeFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copied, setCopied] = useState(false);

  const [postalCode, setPostalCode] = useState("");
  const [result, setResult] = useState<PostalCodeResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidPostalCode(postalCode)) return;

    setLoading(true);
    try {
      // GET /ecity/v2/clients/{clientId}/postalCode?postalCode=${postalCode}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-EYRO-20001500000",
        trackId: "423068ef-995a-443d-936c-87bbe19f5b5c",
        result: {
          postalCode,
          street: "کوچه امیرانی",
          localityName: "تهران",
          province: "تهران",
          buildingName: null,
          description: null,
          floor: "1",
          houseNumber: "4",
          localityType: "شهر",
          street2: "کوچه دربندی",
          subLocality: "دکترهوشیار",
          townShip: "تهران",
          zone: "مرکزی",
          address: "شهر تهران، محله دکتر معین، کوچه شهید اکبری، خیابان صالحی، پلاک ۴",
          buildingId: "6707727",
          plateName: "4",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام کد پستی. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!result?.address) return;
    await navigator.clipboard.writeText(result.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetForm = () => {
    setPostalCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopied(false);
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام کد پستی" />

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
              کد پستی ۱۰ رقمی مورد نظر را بدون خط تیره وارد کنید تا آدرس دقیق و جزئیات پستی آن نمایش داده شود.
            </p>

            <PostalCodeInput
              value={postalCode}
              onChange={setPostalCode}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام آدرس پستی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت آدرس کامل */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <MapPin size={18} className="text-brand" />
                  <span>نشانی کامل پستی</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="rounded-2xl bg-brand/5 border border-brand/15 p-4 mb-4">
                <p className="text-xs font-bold leading-6 text-ink">
                  {result.address}
                </p>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "آدرس کپی شد" : "کپی نشانی"}</span>
                </button>
              </div>

              <InfoRow label="کد پستی" value={fa(result.postalCode)} />
              <InfoRow label="استان" value={result.province} />
              {result.townShip && (
                <InfoRow label="شهرستان" value={result.townShip} />
              )}
              <InfoRow
                label={result.localityType || "شهر / روستا"}
                value={result.localityName}
              />
              {result.zone && <InfoRow label="بخش / منطقه" value={result.zone} />}
              {result.subLocality && (
                <InfoRow label="محله" value={result.subLocality} />
              )}
            </div>

            {/* جزئیات ساختمان و خیابان */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <Building2 size={18} className="text-brand" />
                <span>جزئیات مکانی</span>
              </div>

              {result.street && <InfoRow label="خیابان / کوچه" value={result.street} />}
              {result.street2 && (
                <InfoRow label="خیابان / کوچه فرعی" value={result.street2} />
              )}
              {result.buildingName && (
                <InfoRow label="نام ساختمان" value={result.buildingName} />
              )}
              {result.houseNumber && (
                <InfoRow label="پلاک" value={fa(result.houseNumber)} />
              )}
              {result.floor && <InfoRow label="طبقه" value={fa(result.floor)} />}
              {result.buildingId && (
                <InfoRow label="شناسه ساختمان" value={fa(result.buildingId)} />
              )}
              {result.description && (
                <InfoRow label="توضیحات" value={result.description} />
              )}
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
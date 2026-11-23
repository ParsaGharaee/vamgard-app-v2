"use client";
import { useState } from "react";
import {
  MapPin,
  ShieldAlert,
  Copy,
  Check,
  Building2,
  Compass,
  ExternalLink,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  PostalCodeInput,
  isValidPostalCode,
} from "../shared/inputs/PostalCodeInput";
import { fa } from "@/src/lib/format";

interface PostalCodeCoordinatesResult {
  postalCode: string;
  localityName: string;
  province: string;
  localityType?: string;
  subLocality?: string;
  townShip?: string;
  address: string;
  street?: string;
  street2?: string;
  houseNumber?: string;
  buildingId?: string;
  floor?: string;
  plateName?: string;
  zone?: string;
  latitude: string;
  longitude: string;
}

export default function PostalCodeCoordinatesFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedField, setCopiedField] = useState<"address" | "coords" | null>(null);

  const [postalCode, setPostalCode] = useState("");
  const [result, setResult] = useState<PostalCodeCoordinatesResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidPostalCode(postalCode)) return;

    setLoading(true);
    try {
      // GET /ecity/v2/clients/{clientId}/postalCodeInquiryCoordinates?postalCode=${postalCode}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-EYRO-20001800000",
        trackId: "90e5e3e6-5171-4915-86ba-4ccd3c49a142",
        result: {
          postalCode,
          localityName: "اصفهان",
          province: "اصفهان",
          localityType: "شهر",
          subLocality: "سیچان",
          townShip: "اصفهان",
          address: "شهر اصفهان، محله سیچان، کوچه شهید آرش پرویزی، بن‌بست اکبری، پلاک ۴۲",
          street: "کوچه شهید آرش پرویزی",
          street2: "بن بست اکبری",
          houseNumber: "42",
          buildingId: "3392706",
          floor: "1",
          plateName: "42",
          zone: "مرکزی",
          latitude: "32.628984725",
          longitude: "51.660951825",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام کد پستی و مختصات. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: "address" | "coords") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const resetForm = () => {
    setPostalCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedField(null);
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="کد پستی و مختصات" />

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
              کد پستی ۱۰ رقمی را وارد کنید تا علاوه بر نشانی دقیق، عرض و طول جغرافیایی (مختصات نقشه) آن نمایش داده شود.
            </p>

            <PostalCodeInput
              value={postalCode}
              onChange={setPostalCode}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام آدرس و مختصات
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت مختصات جغرافیایی */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Compass size={18} className="text-brand" />
                  <span>مختصات جغرافیایی</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4" dir="ltr">
                <div className="rounded-2xl bg-brand/5 border border-brand/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">عرض جغرافیایی (Lat)</div>
                  <div className="font-mono text-sm font-black text-brand mt-1">
                    {result.latitude}
                  </div>
                </div>
                <div className="rounded-2xl bg-brand/5 border border-brand/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">طول جغرافیایی (Lng)</div>
                  <div className="font-mono text-sm font-black text-brand mt-1">
                    {result.longitude}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand text-white py-2.5 text-xs font-extrabold active:scale-95 transition-transform"
                >
                  <ExternalLink size={14} />
                  <span>مشاهده روی نقشه</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`${result.latitude}, ${result.longitude}`, "coords")
                  }
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-tile px-3.5 py-2.5 text-xs font-extrabold text-ink active:scale-95 transition-transform"
                >
                  {copiedField === "coords" ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === "coords" ? "کپی شد" : "کپی مختصات"}</span>
                </button>
              </div>
            </div>

            {/* کارت نشانی کامل */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <MapPin size={18} className="text-brand" />
                <span>نشانی کامل پستی</span>
              </div>

              <div className="rounded-2xl bg-tile/50 p-4 mb-4">
                <p className="text-xs font-bold leading-6 text-ink">
                  {result.address}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(result.address, "address")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
                >
                  {copiedField === "address" ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === "address" ? "آدرس کپی شد" : "کپی نشانی"}</span>
                </button>
              </div>

              <InfoRow label="کد پستی" value={fa(result.postalCode)} />
              <InfoRow label="استان" value={result.province} />
              {result.townShip && <InfoRow label="شهرستان" value={result.townShip} />}
              <InfoRow
                label={result.localityType || "شهر / روستا"}
                value={result.localityName}
              />
              {result.zone && <InfoRow label="بخش / منطقه" value={result.zone} />}
              {result.subLocality && <InfoRow label="محله" value={result.subLocality} />}
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
              {result.houseNumber && (
                <InfoRow label="پلاک" value={fa(result.houseNumber)} />
              )}
              {result.floor && <InfoRow label="طبقه" value={fa(result.floor)} />}
              {result.buildingId && (
                <InfoRow label="شناسه ساختمان" value={fa(result.buildingId)} />
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
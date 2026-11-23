"use client";
import { useState } from "react";
import {
  Car,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Calendar,
  MapPin,
  Hash,
} from "lucide-react";
import { CarPlate, InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { fa } from "@/src/lib/format";

interface PlateRecord {
  nationalId: string;
  plateNumber: string;
  revoked: boolean;
  revokedDateTime?: string;
  revokedDescription?: string;
  serialNumber: string;
}

interface ActivePlatesResult {
  plateNumbers: PlateRecord[];
}

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

// پارس کردن رشته پلاک مثل «ایران ۵۰ - ۱۵۹ ص  ۸۰» برای نمایش در کامپوننت CarPlate
const parsePersianPlate = (raw: string) => {
  const normalized = toEnglishDigits(raw).replace(/\s+/g, " ").trim();
  const match = normalized.match(
    /ایران\s*(\d{2})\s*[-–]\s*(\d{3})\s*([آ-ی])\s*(\d{2})/
  );
  if (!match) return null;
  const [, code, p2, letter, p1] = match;
  return { p1, letter, p2, code };
};

const formatRevokedDate = (raw?: string) => {
  if (!raw) return "—";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return fa(raw);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function ActivePlatesFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalId, setNationalId] = useState("");
  const [mobile, setMobile] = useState("");
  const [result, setResult] = useState<ActivePlatesResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalId) || !isValidMobile(mobile)) return;

    setLoading(true);
    try {
      // GET /vehicle/v2/clients/{clientId}/activePlateNumbers?nationalId=${nationalId}&mobile=${mobile}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-CRGO-20000100000",
        trackId: "410a3431-526e-4a7f-92fd-af9bcdabf70f",
        result: {
          plateNumbers: [
            {
              nationalId: "-",
              plateNumber: "ایران ۵۰ - ۱۵۹ ص  ۸۰",
              revoked: false,
              serialNumber: "10100448779921",
            },
            {
              nationalId: "-",
              plateNumber: "ایران ۹۹ - ۲۸۳ ن  ۸۰",
              revoked: true,
              revokedDateTime: "12/26/2018 13:23:40",
              revokedDescription: "شماره‌گذاری بوکان",
              serialNumber: "1010029296607",
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام لیست پلاک‌های فعال. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalId("");
    setMobile("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  const sortedPlates = result?.plateNumbers
    ? [...result.plateNumbers].sort((a, b) => Number(a.revoked) - Number(b.revoked))
    : [];

  const activeCount = sortedPlates.filter((p) => !p.revoked).length;
  const revokedCount = sortedPlates.filter((p) => p.revoked).length;

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="لیست پلاک‌های فعال" />

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
              کد ملی و شماره موبایل متعلق به فرد را وارد کنید تا فهرست تمام پلاک‌های فعال و فک‌شده ثبت‌شده به نام او نمایش داده شود.
            </p>

            <NationalCodeInput
              value={nationalId}
              onChange={setNationalId}
              showErrors={showFormErrors}
            />

            <MobileInput
              value={mobile}
              onChange={setMobile}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام پلاک‌های فعال
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Car size={18} className="text-brand" />
                  <span>خلاصه پلاک‌های ثبت‌شده</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-3 text-center text-emerald-500">
                  <div className="text-[10px] font-bold opacity-80">
                    پلاک فعال
                  </div>
                  <div className="text-lg font-black mt-1">
                    {fa(activeCount)} عدد
                  </div>
                </div>

                <div className="rounded-2xl bg-silver/10 border border-line/10 p-3 text-center text-silver">
                  <div className="text-[10px] font-bold">پلاک فک‌شده</div>
                  <div className="text-lg font-black text-ink mt-1">
                    {fa(revokedCount)} عدد
                  </div>
                </div>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalId)} />
              <InfoRow label="مجموع پلاک‌ها" value={`${fa(sortedPlates.length)} پلاک`} />
            </div>

            {/* لیست پلاک‌ها */}
            {sortedPlates.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-silver">
                <Car size={30} className="text-brand" />
                <span className="text-sm font-bold">
                  پلاکی برای این کد ملی ثبت نشده است
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPlates.map((item, idx) => {
                  const parsed = parsePersianPlate(item.plateNumber);

                  return (
                    <div
                      key={`${item.serialNumber}-${idx}`}
                      className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-silver">
                          پلاک {fa(idx + 1)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            item.revoked
                              ? "bg-red-500/10 text-red-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {item.revoked ? (
                            <XCircle size={13} />
                          ) : (
                            <ShieldCheck size={13} />
                          )}
                          {item.revoked ? "فک‌شده" : "فعال"}
                        </span>
                      </div>

                      {parsed ? (
                        <div className="mb-3">
                          <CarPlate
                            p1={parsed.p1}
                            letter={parsed.letter}
                            p2={parsed.p2}
                            code={parsed.code}
                          />
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-tile/50 p-3.5 text-center text-sm font-black text-ink mb-3">
                          {fa(item.plateNumber)}
                        </div>
                      )}

                      <InfoRow
                        label="شماره سریال"
                        value={
                          <span
                            className="inline-flex items-center gap-1 font-mono text-xs"
                            dir="ltr"
                          >
                            <Hash size={12} className="text-silver" />
                            {fa(item.serialNumber)}
                          </span>
                        }
                      />

                      {item.revoked && item.revokedDateTime && (
                        <InfoRow
                          label="تاریخ فک پلاک"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={13} className="text-silver" />
                              {formatRevokedDate(item.revokedDateTime)}
                            </span>
                          }
                        />
                      )}

                      {item.revoked && item.revokedDescription && (
                        <InfoRow
                          label="محل / شرح فک"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={13} className="text-silver" />
                              {item.revokedDescription}
                            </span>
                          }
                        />
                      )}
                    </div>
                  );
                })}
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
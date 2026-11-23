"use client";
import { useState } from "react";
import {
  Car,
  ShieldAlert,
  History,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { CarPlate, InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import {
  CarPlateInput,
  isValidCarPlate,
  toFinnotechPlateNumber,
  type CarPlateValue,
} from "../shared/inputs/CarPlateInput";
import { fa } from "@/src/lib/format";

interface PlateHistoryItem {
  vehicleSystem: string;
  vehicleType: string;
  installDate: string;
  detachDate?: string;
  vehicleModel: string;
}

interface PlateHistoryResult {
  plateHistory: PlateHistoryItem[];
  plateStatus: string;
  tracePlate: string;
}

const INITIAL_PLATE: CarPlateValue = { p1: "", letter: "ب", p2: "", code: "" };

export default function PlateHistoryFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalId, setNationalId] = useState("");
  const [mobile, setMobile] = useState("");
  const [plate, setPlate] = useState<CarPlateValue>(INITIAL_PLATE);
  const [result, setResult] = useState<PlateHistoryResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (
      !isValidNationalCode(nationalId) ||
      !isValidMobile(mobile) ||
      !isValidCarPlate(plate)
    ) {
      return;
    }

    const finnotechPlate = toFinnotechPlateNumber(plate);
    setLoading(true);
    try {
      // GET /vehicle/v2/clients/{clientId}/plateNumberHistory?nationalId=${nationalId}&mobile=${mobile}&plateNumber=${finnotechPlate}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-VHPD-20000500000",
        trackId: "dece6d37-297f-429f-moho-f6eb106ff6ee",
        result: {
          plateHistory: [
            {
              vehicleSystem: "پژو",
              vehicleType: "207i",
              installDate: "1400/01/15",
              detachDate: "",
              vehicleModel: "1400",
            },
            {
              vehicleSystem: "پژو",
              vehicleType: "206",
              installDate: "1378/02/05",
              detachDate: "1400/01/11",
              vehicleModel: "1377",
            },
          ],
          plateStatus: "دارای مالک - نصب بر روی وسیله",
          tracePlate: "10100100101001",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام تاریخچه پلاک. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalId("");
    setMobile("");
    setPlate(INITIAL_PLATE);
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تاریخچه پلاک" />

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
              کد ملی، شماره موبایل صاحب پلاک و شماره پلاک خودرو را وارد کنید تا سوابق نصب و فک این پلاک روی خودروهای مختلف نمایش داده شود.
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

            <CarPlateInput
              value={plate}
              onChange={setPlate}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام تاریخچه پلاک
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت پلاک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Car size={18} className="text-brand" />
                  <span>وضعیت فعلی پلاک</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <CarPlate
                  p1={plate.p1}
                  letter={plate.letter}
                  p2={plate.p2}
                  code={plate.code}
                />
              </div>

              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 px-3.5 py-3 mb-4 flex items-center gap-2.5 text-emerald-500">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="text-xs font-extrabold">
                  {result.plateStatus}
                </span>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalId)} />
              <InfoRow
                label="کد رهگیری پلاک"
                value={
                  <span
                    className="inline-flex items-center gap-1 font-mono text-xs"
                    dir="ltr"
                  >
                    <Hash size={12} className="text-silver" />
                    {fa(result.tracePlate)}
                  </span>
                }
              />
              <InfoRow
                label="تعداد سوابق ثبت‌شده"
                value={`${fa(result.plateHistory?.length ?? 0)} خودرو`}
              />
            </div>

            {/* تایم‌لاین تاریخچه نصب پلاک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-4">
                <History size={18} className="text-brand" />
                <span>سوابق نصب بر روی خودروها</span>
              </div>

              {!result.plateHistory || result.plateHistory.length === 0 ? (
                <p className="text-xs text-silver text-center py-4">
                  سابقه‌ای برای این پلاک ثبت نشده است.
                </p>
              ) : (
                <div className="relative pr-5 space-y-4">
                  <div className="absolute right-2 top-2 bottom-2 w-0.5 bg-brand/25 rounded-full" />

                  {result.plateHistory.map((item, idx) => {
                    const isCurrentlyInstalled = !item.detachDate?.trim();
                    return (
                      <div
                        key={`${item.installDate}-${idx}`}
                        className="relative"
                      >
                        <span
                          className={`absolute -right-[17px] top-2 h-3.5 w-3.5 rounded-full ring-4 ring-bg ${
                            isCurrentlyInstalled
                              ? "bg-emerald-500"
                              : "bg-brand/70"
                          }`}
                        />

                        <div className="rounded-2xl bg-tile/40 p-4 border border-line/5">
                          <div className="flex items-start justify-between gap-2 pb-2.5 mb-2 border-b border-line/10">
                            <div>
                              <div className="text-sm font-extrabold text-ink">
                                {item.vehicleSystem} {fa(item.vehicleType)}
                              </div>
                              <div className="text-[11px] text-silver mt-0.5">
                                مدل {fa(item.vehicleModel)}
                              </div>
                            </div>

                            <span
                              className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                                isCurrentlyInstalled
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-silver/15 text-silver"
                              }`}
                            >
                              {isCurrentlyInstalled ? "نصب فعلی" : "فک‌شده"}
                            </span>
                          </div>

                          <InfoRow
                            label="تاریخ نصب"
                            value={
                              <span className="inline-flex items-center gap-1">
                                <Calendar size={12} className="text-silver" />
                                {fa(item.installDate)}
                              </span>
                            }
                          />
                          <InfoRow
                            label="تاریخ فک"
                            value={
                              isCurrentlyInstalled ? (
                                <span className="text-emerald-500 font-bold">
                                  فعال روی خودرو
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar size={12} className="text-silver" />
                                  {fa(item.detachDate!)}
                                </span>
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
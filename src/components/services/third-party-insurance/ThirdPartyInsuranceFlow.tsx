"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Car,
  Calendar,
  FileBadge,
  Percent,
  Copy,
  Check,
} from "lucide-react";
import { CarPlate, InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import {
  CarPlateInput,
  isValidCarPlate,
  toFinnotechPlateNumber,
  type CarPlateValue,
} from "../shared/inputs/CarPlateInput";
import { fa } from "@/src/lib/format";

interface ThirdPartyInsuranceResult {
  carGroupCode: number;
  companyCode: string;
  companyName: string;
  countLossAmount: number;
  cylCnt?: number;
  damageTypes?: string[];
  disFnYrNum?: string;
  disFnYrPrcnt?: string;
  endDate: string;
  issueDate: string;
  mapUsageName: string;
  mapVehicleSystemName: string;
  modelCii: number;
  plk1: number;
  plk2: number;
  plk3: number;
  plkSrl: number;
  thirdPolicyCode: number;
  vin: string;
}

const INITIAL_PLATE: CarPlateValue = { p1: "", letter: "ب", p2: "", code: "" };

export default function ThirdPartyInsuranceFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [plate, setPlate] = useState<CarPlateValue>(INITIAL_PLATE);
  const [result, setResult] = useState<ThirdPartyInsuranceResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidCarPlate(plate)) return;

    const finnotechPlate = toFinnotechPlateNumber(plate);
    setLoading(true);
    try {
      // GET /kyc/v2/clients/{clientId}/thirdPartyInsuranceInquiry?nationalCode=${nationalCode}&plateNumber=${finnotechPlate}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCSY-20003000000",
        trackId: "trackId-98421",
        result: {
          carGroupCode: 2,
          companyCode: "2",
          companyName: "بیمه ایران",
          countLossAmount: 0,
          cylCnt: 4,
          damageTypes: [],
          disFnYrNum: "3",
          disFnYrPrcnt: "15",
          endDate: "1405/12/14",
          issueDate: "1404/12/13",
          mapUsageName: "شخصی",
          mapVehicleSystemName: "رانا",
          modelCii: 1400,
          plk1: Number(plate.p1),
          plk2: 7,
          plk3: Number(plate.p2),
          plkSrl: Number(plate.code),
          thirdPolicyCode: 16026006945,
          vin: "VIN050400N2267007",
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام سوابق بیمه‌نامه شخص ثالث. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPolicyCode = async () => {
    if (!result?.thirdPolicyCode) return;
    await navigator.clipboard.writeText(String(result.thirdPolicyCode));
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 1800);
  };

  const resetForm = () => {
    setNationalCode("");
    setPlate(INITIAL_PLATE);
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
    setCopiedPolicy(false);
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="سوابق بیمه شخص ثالث" />

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
              کد ملی مالک خودرو و شماره پلاک را وارد کنید تا سوابق بیمه‌نامه شخص ثالث، شرکت بیمه‌گر، تخفیف عدم خسارت و تاریخ اعتبار نمایش داده شود.
            </p>

            <NationalCodeInput
              value={nationalCode}
              onChange={setNationalCode}
              showErrors={showFormErrors}
            />

            <CarPlateInput
              value={plate}
              onChange={setPlate}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام بیمه‌نامه شخص ثالث
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت اصلی بیمه‌نامه */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <ShieldCheck size={18} className="text-brand" />
                  <span>{result.companyName}</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.slice(0, 10).toUpperCase()}
                </span>
              </div>

              <CarPlate
                p1={plate.p1}
                letter={plate.letter}
                p2={plate.p2}
                code={plate.code}
              />

              {/* باکس برجسته کد یکتا و تخفیف */}
              <div className="grid grid-cols-2 gap-2.5 mt-4 mb-4">
                <div className="rounded-2xl bg-brand/5 border border-brand/15 p-3 text-center">
                  <div className="text-[10px] font-bold text-silver">
                    تخفیف عدم خسارت
                  </div>
                  <div className="inline-flex items-center gap-1 text-lg font-black text-brand mt-1">
                    <Percent size={15} />
                    <span>{fa(result.disFnYrPrcnt ?? "0")}٪</span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-3 text-center border ${
                    result.countLossAmount === 0
                      ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                      : "bg-amber-500/5 border-amber-500/15 text-amber-500"
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-80">
                    تعداد خسارات
                  </div>
                  <div className="text-lg font-black mt-1">
                    {result.countLossAmount === 0
                      ? "بدون خسارت"
                      : `${fa(result.countLossAmount)} مورد`}
                  </div>
                </div>
              </div>

              <InfoRow
                label="کد یکتای بیمه‌نامه"
                value={
                  <button
                    type="button"
                    onClick={handleCopyPolicyCode}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink active:scale-95 transition-transform"
                    dir="ltr"
                  >
                    <span>{fa(result.thirdPolicyCode)}</span>
                    {copiedPolicy ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} className="text-silver" />
                    )}
                  </button>
                }
              />
              <InfoRow
                label="تاریخ صدور"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} className="text-silver" />
                    {fa(result.issueDate)}
                  </span>
                }
              />
              <InfoRow
                label="تاریخ پایان اعتبار"
                value={
                  <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                    <Calendar size={13} />
                    {fa(result.endDate)}
                  </span>
                }
              />
              {result.disFnYrNum !== undefined && (
                <InfoRow
                  label="سابقه سال‌های تخفیف"
                  value={`${fa(result.disFnYrNum)} سال`}
                />
              )}
            </div>

            {/* کارت مشخصات وسیله نقلیه */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
                <Car size={18} className="text-brand" />
                <span>مشخصات وسیله نقلیه</span>
              </div>

              <InfoRow label="سیستم / مدل خودرو" value={result.mapVehicleSystemName} />
              <InfoRow label="سال ساخت" value={fa(result.modelCii)} />
              <InfoRow label="کاربری وسیله" value={result.mapUsageName} />
              {result.cylCnt !== undefined && (
                <InfoRow label="تعداد سیلندر" value={fa(result.cylCnt)} />
              )}
              <InfoRow label="کد گروه خودرویی" value={fa(result.carGroupCode)} />
              <InfoRow
                label="شناسه VIN"
                value={
                  <span
                    className="inline-flex items-center gap-1 font-mono text-[11px]"
                    dir="ltr"
                  >
                    <FileBadge size={13} className="text-silver" />
                    {result.vin}
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
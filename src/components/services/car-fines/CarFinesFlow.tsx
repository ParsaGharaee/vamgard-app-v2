"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Car,
  MapPin,
  Calendar,
  Camera,
  Receipt,
} from "lucide-react";
import { CarPlate, InfoRow, ServiceHeader, VamButton } from "../shared";
import { NationalCodeInput, isValidNationalCode } from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import {
  CarPlateInput,
  isValidCarPlate,
  toFinnotechPlateNumber,
  type CarPlateValue,
} from "../shared/inputs/CarPlateInput";
import { fa } from "@/src/lib/format";

interface OffenseBill {
  id: string;
  type: string;
  description: string;
  code: string;
  price: number;
  city: string | null;
  location: string;
  date: string;
  serial: string;
  billId: number;
  paymentId: number;
  isPayable: boolean;
  hasImage: boolean;
}

interface DrivingOffenseResult {
  Bills: OffenseBill[];
  TotalAmount: number;
}

const formatRial = (amount: number) => {
  if (!amount || amount === 0) return "صفر ریال";
  return `${fa(amount.toLocaleString("en-US"))} ریال`;
};

const INITIAL_PLATE: CarPlateValue = { p1: "", letter: "ب", p2: "", code: "" };

export default function CarFinesFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [plate, setPlate] = useState<CarPlateValue>(INITIAL_PLATE);
  const [nationalID, setNationalID] = useState("");
  const [mobile, setMobile] = useState("");

  const [result, setResult] = useState<DrivingOffenseResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (
      !isValidCarPlate(plate) ||
      !isValidNationalCode(nationalID) ||
      !isValidMobile(mobile)
    ) {
      return;
    }

    const finnotechPlate = toFinnotechPlateNumber(plate);
    setLoading(true);

    try {
      // GET /billing/v2/clients/{clientId}/drivingOffense?mobile=...&nationalID=...&plateNumber=${finnotechPlate}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "4ce7fa61-1734-4ced-b343-554a9ec5bad9",
        result: {
          Bills: [
            {
              id: "1",
              type: "توقف دوبله در معابر",
              description: "الصاقی",
              code: "2085",
              price: 600000,
              city: "تهران",
              location: "تهران ولیعصر بهرامی",
              date: "1403/06/24 - 11:11",
              serial: `${finnotechPlate}_99`,
              billId: 12345678,
              paymentId: 123456789,
              isPayable: true,
              hasImage: false,
            },
            {
              id: "2",
              type: "تجاوز از سرعت مجاز",
              description: "دوربین ثبت تخلف",
              code: "2002",
              price: 1500000,
              city: "تهران",
              location: "اتوبان همت غرب",
              date: "1403/07/12 - 18:40",
              serial: `${finnotechPlate}_99`,
              billId: 87654321,
              paymentId: 987654321,
              isPayable: true,
              hasImage: true,
            },
          ],
          TotalAmount: 2100000,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام خلافی خودرو. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlate(INITIAL_PLATE);
    setNationalID("");
    setMobile("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام خلافی خودرو" />

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
              برای مشاهده لیست خلافی‌ها، شماره پلاک خودرو، کد ملی و شماره موبایل مالک خودرو را وارد کنید.
            </p>

            <CarPlateInput
              value={plate}
              onChange={setPlate}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nationalID}
              onChange={setNationalID}
              showErrors={showFormErrors}
            />

            <MobileInput
              value={mobile}
              onChange={setMobile}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام خلافی خودرو
              </VamButton>
            </div>
          </div>
        )}

        {/* نتیجه استعلام */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه کل خلافی و نمایش پلاک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Car size={18} className="text-brand" />
                  <span>خلاصه خلافی خودرو</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <CarPlate
                p1={plate.p1}
                letter={plate.letter}
                p2={plate.p2}
                code={plate.code}
              />

              <div
                className={`rounded-2xl p-4 text-center mt-4 border ${
                  result.TotalAmount === 0
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-brand/10 border-brand/20 text-brand"
                }`}
              >
                <div className="text-xs font-bold opacity-80">مبلغ کل جریمه‌ها</div>
                <div className="text-2xl font-black mt-1">
                  {formatRial(result.TotalAmount)}
                </div>
                <div className="text-[11px] font-bold opacity-80 mt-1">
                  {result.Bills.length === 0
                    ? "خودروی شما فاقد خلافی است"
                    : `${fa(result.Bills.length)} مورد تخلف ثبت شده`}
                </div>
              </div>
            </div>

            {/* لیست کارت‌های ریز خلافی */}
            {result.Bills.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-emerald-500">
                <ShieldCheck size={32} />
                <span className="text-sm font-bold">هیچ خلافی ثبت‌شده‌ای وجود ندارد</span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.Bills.map((bill, idx) => (
                  <div
                    key={`${bill.id}-${idx}`}
                    className="surface p-4 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    {/* هدر کارت تخلف */}
                    <div className="flex items-start justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand mt-0.5">
                          <Receipt size={18} />
                        </span>
                        <div>
                          <div className="text-xs font-extrabold leading-5">{bill.type}</div>
                          <div className="text-[11px] text-silver mt-0.5">
                            {bill.description} · کد {fa(bill.code)}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          bill.isPayable
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-silver/10 text-silver"
                        }`}
                      >
                        {bill.isPayable ? "قابل پرداخت" : "غیرقابل پرداخت"}
                      </span>
                    </div>

                    <InfoRow label="مبلغ جریمه" value={formatRial(bill.price)} />
                    <InfoRow
                      label="تاریخ و ساعت"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-silver" />
                          {fa(bill.date)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="محل تخلف"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-silver shrink-0" />
                          <span>
                            {bill.city ? `${bill.city}، ` : ""}
                            {bill.location}
                          </span>
                        </span>
                      }
                    />
                    <InfoRow label="شناسه قبض" value={fa(bill.billId)} />
                    <InfoRow label="شناسه پرداخت" value={fa(bill.paymentId)} />

                    {bill.hasImage && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand/10 py-2 text-xs font-bold text-brand">
                        <Camera size={15} />
                        <span>دارای تصویر ثبت‌شده توسط دوربین</span>
                      </div>
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
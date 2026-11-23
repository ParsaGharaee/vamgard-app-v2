"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Car,
  Route,
  Calendar,
  Receipt,
} from "lucide-react";
import { CarPlate, InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  CarPlateInput,
  isValidCarPlate,
  toFinnotechPlateNumber,
  type CarPlateValue,
} from "../shared/inputs/CarPlateInput";
import { fa } from "@/src/lib/format";

interface FreewayTollBill {
  paymentId: string;
  date: string;
  price: number;
  gateway: string | null;
  freeway: string;
}

interface FreewayTollResult {
  bills: FreewayTollBill[];
  totalAmount: number;
}

const formatRial = (amount: number) => {
  if (!amount || amount === 0) return "صفر ریال";
  return `${fa(amount.toLocaleString("en-US"))} ریال`;
};

const INITIAL_PLATE: CarPlateValue = { p1: "", letter: "ب", p2: "", code: "" };

export default function FreewayTollFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [plate, setPlate] = useState<CarPlateValue>(INITIAL_PLATE);
  const [result, setResult] = useState<FreewayTollResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidCarPlate(plate)) return;

    const finnotechPlate = toFinnotechPlateNumber(plate);
    setLoading(true);

    try {
      // GET /ecity/v2/clients/{clientId}/freewayTollInquiry?plateNumber=${finnotechPlate}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        trackId: "12b52a3de-4ac19f637d08",
        result: {
          bills: [
            {
              paymentId: "9529451",
              date: "2023-07-21 09:46:23",
              price: 12000,
              gateway: null,
              freeway: "21",
            },
            {
              paymentId: "9529884",
              date: "2023-08-04 16:12:09",
              price: 25000,
              gateway: "آزادراه تهران - قم",
              freeway: "14",
            },
          ],
          totalAmount: 37000,
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام عوارض آزادراهی. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlate(INITIAL_PLATE);
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام عوارض آزادراهی" />

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
              شماره پلاک خودرو را وارد کنید تا فهرست قبض‌های عوارض آزادراهی پرداخت‌نشده و مبلغ کل نمایش داده شود.
            </p>

            <CarPlateInput
              value={plate}
              onChange={setPlate}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام عوارض آزادراهی
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه کل عوارض و نمایش پلاک */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Car size={18} className="text-brand" />
                  <span>خلاصه عوارض آزادراهی</span>
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
                  result.totalAmount === 0
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-brand/10 border-brand/20 text-brand"
                }`}
              >
                <div className="text-xs font-bold opacity-80">مبلغ کل عوارض</div>
                <div className="text-2xl font-black mt-1">
                  {formatRial(result.totalAmount)}
                </div>
                <div className="text-[11px] font-bold opacity-80 mt-1">
                  {result.bills.length === 0
                    ? "خودروی شما فاقد عوارض آزادراهی است"
                    : `${fa(result.bills.length)} مورد عوارض ثبت شده`}
                </div>
              </div>
            </div>

            {/* لیست ریز قبض‌های عوارض */}
            {result.bills.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-emerald-500">
                <ShieldCheck size={32} />
                <span className="text-sm font-bold">
                  هیچ عوارض پرداخت‌نشده‌ای وجود ندارد
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.bills.map((bill, idx) => (
                  <div
                    key={`${bill.paymentId}-${idx}`}
                    className="surface p-4 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-line/10">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                          <Route size={18} />
                        </span>
                        <div>
                          <div className="text-xs font-extrabold">
                            {bill.gateway || `آزادراه کد ${fa(bill.freeway)}`}
                          </div>
                          <div className="text-[11px] text-silver mt-0.5">
                            کد آزادراه: {fa(bill.freeway)}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-brand/10 text-brand">
                        {formatRial(bill.price)}
                      </span>
                    </div>

                    <InfoRow
                      label="شناسه پرداخت"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Receipt size={13} className="text-silver" />
                          {fa(bill.paymentId)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="تاریخ تردد"
                      value={
                        <span className="inline-flex items-center gap-1" dir="ltr">
                          <Calendar size={13} className="text-silver" />
                          {fa(bill.date)}
                        </span>
                      }
                    />
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
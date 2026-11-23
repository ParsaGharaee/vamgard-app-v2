"use client";
import { useState } from "react";
import {
  IdCard,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Clock,
  Barcode,
  Car,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { fa } from "@/src/lib/format";

interface LicenseItem {
  barCode: string;
  issueDate: string;
  firstname: string;
  lastname: string;
  nationalCode: string;
  licenseNumber: string;
  licenseStatus: string;
  licenseType: string;
  licenseValidityPeriod: string;
}

interface LicenseCheckResult {
  licenses: LicenseItem[];
  licenseStatus: {
    code: string;
    description: string;
  };
}

const formatIssueDate = (raw?: string) => {
  if (!raw) return "—";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return fa(raw);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function LicenseCheckFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [nationalID, setNationalID] = useState("");
  const [mobile, setMobile] = useState("");
  const [result, setResult] = useState<LicenseCheckResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalID) || !isValidMobile(mobile)) return;

    setLoading(true);
    try {
      // POST /kyc/v2/clients/{clientId}/licenseCheckInquiry?trackId=${crypto.randomUUID()}
      // Body: { nationalID, mobile }
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KCGO-20099900000",
        trackId: "2ed30b25-85fc-4022-bad9-9c9a7beec475",
        result: {
          licenses: [
            {
              barCode: "00692767417000000000",
              issueDate: "06/13/2023 00:00:00",
              firstname: "کریم",
              lastname: "کریمی",
              nationalCode: nationalID,
              licenseNumber: "9607173353",
              licenseStatus: "اسکن شده ناجی پاس",
              licenseType: "پایه سوم",
              licenseValidityPeriod: "10",
            },
          ],
          licenseStatus: {
            code: "G00000",
            description: "درخواست با موفقیت انجام شد.",
          },
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError(
        "خطا در استعلام وضعیت گواهینامه. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNationalID("");
    setMobile("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام گواهینامه و وضعیت" />

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
              کد ملی و شماره موبایل متعلق به متقاضی را وارد کنید تا فهرست گواهینامه‌های رانندگی، وضعیت صدور و مدت اعتبار آن‌ها نمایش داده شود.
            </p>

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
                استعلام گواهینامه
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت خلاصه وضعیت استعلام */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <IdCard size={18} className="text-brand" />
                  <span>نتیجه استعلام گواهینامه</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 px-3.5 py-3 mb-3 flex items-center gap-2.5 text-emerald-500">
                <ShieldCheck size={20} className="shrink-0" />
                <div className="text-xs font-extrabold">
                  {result.licenseStatus?.description || "استعلام با موفقیت انجام شد"}
                </div>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalID)} />
              <InfoRow
                label="تعداد گواهینامه‌ها"
                value={`${fa(result.licenses?.length ?? 0)} مورد`}
              />
            </div>

            {/* لیست کارت‌های گواهینامه */}
            {!result.licenses || result.licenses.length === 0 ? (
              <div className="surface rounded-3xl p-6 flex flex-col items-center gap-2 text-silver">
                <Car size={30} className="text-brand" />
                <span className="text-sm font-bold">
                  گواهینامه‌ای برای این کد ملی یافت نشد
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.licenses.map((lic, idx) => (
                  <div
                    key={`${lic.licenseNumber}-${idx}`}
                    className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                          <Car size={18} />
                        </span>
                        <div>
                          <div className="text-sm font-extrabold text-ink">
                            گواهینامه {lic.licenseType}
                          </div>
                          <div className="text-[11px] text-silver mt-0.5">
                            {lic.firstname} {lic.lastname}
                          </div>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">
                        {lic.licenseStatus}
                      </span>
                    </div>

                    <InfoRow
                      label="شماره گواهینامه"
                      value={fa(lic.licenseNumber)}
                    />
                    <InfoRow
                      label="تاریخ صدور"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-silver" />
                          {formatIssueDate(lic.issueDate)}
                        </span>
                      }
                    />
                    <InfoRow
                      label="مدت اعتبار"
                      value={
                        <span className="inline-flex items-center gap-1 text-brand font-extrabold">
                          <Clock size={13} />
                          {fa(lic.licenseValidityPeriod)} سال
                        </span>
                      }
                    />
                    <InfoRow
                      label="بارکد پستی / رهگیری"
                      value={
                        <span
                          className="inline-flex items-center gap-1 font-mono text-[11px]"
                          dir="ltr"
                        >
                          <Barcode size={13} className="text-silver" />
                          {fa(lic.barCode)}
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
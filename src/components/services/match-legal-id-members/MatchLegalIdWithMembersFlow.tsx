"use client";
import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Calendar,
  Newspaper,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import {
  NationalCodeInput,
  isValidNationalCode,
} from "../shared/inputs/NationalCodeInput";
import { fa } from "@/src/lib/format";

interface MemberPosition {
  positionName: string;
  issueTrackingNo: string;
  rrkNewsPaperDate: string;
  rrkNewsPaperNumber: string;
  rrkPageNumber: string;
}

interface MatchLegalIdResult {
  isMatched: boolean;
  positions: MemberPosition[];
}

const POSITION_LABELS: Record<string, string> = {
  CEO: "مدیرعامل",
  CHAIRMAN: "رئیس هیئت مدیره",
  VICE_CHAIRMAN: "نایب رئیس هیئت مدیره",
  BOARD_MEMBER: "عضو هیئت مدیره",
  INSPECTOR: "بازرس",
};

export default function MatchLegalIdWithMembersFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [legalId, setLegalId] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [result, setResult] = useState<MatchLegalIdResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidLegalId(legalId) || !isValidNationalCode(nationalCode)) return;

    setLoading(true);
    try {
      // GET /kyb/v2/clients/{clientId}/matchLegalIdWithMembers?legalId=${legalId}&nationalCode=${nationalCode}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KBIE-20000000000",
        trackId: "2c122a95-1d3e-4595-moho-62b52e7b87d9",
        result: {
          isMatched: true,
          positions: [
            {
              positionName: "CEO",
              issueTrackingNo: "000921256803000",
              rrkNewsPaperDate: "1400/01/01",
              rrkNewsPaperNumber: "00900",
              rrkPageNumber: "50",
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
        "خطا در استعلام تطبیق شناسه شرکت با اعضا. لطفاً مجدداً تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLegalId("");
    setNationalCode("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="تطبیق شناسه شرکت با اعضا" />

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
              شناسه ملی ۱۱ رقمی شرکت و کد ملی فرد را وارد کنید تا انطباق عضویت، سمت‌های رسمی و مشخصات آگهی روزنامه رسمی بررسی شود.
            </p>

            <LegalIdInput
              value={legalId}
              onChange={setLegalId}
              showErrors={showFormErrors}
            />

            <NationalCodeInput
              value={nationalCode}
              onChange={setNationalCode}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام تطبیق اعضا
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* کارت نتیجه انطباق */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <UserCheck size={18} className="text-brand" />
                  <span>نتیجه تطبیق عضویت</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl mb-4 flex items-center gap-3 border ${
                  result.isMatched
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}
              >
                {result.isMatched ? (
                  <ShieldCheck size={28} className="shrink-0" />
                ) : (
                  <ShieldAlert size={28} className="shrink-0" />
                )}
                <div>
                  <div className="text-sm font-extrabold">
                    {result.isMatched
                      ? "انطباق تایید شد"
                      : "انطباقی یافت نشد"}
                  </div>
                  <div className="text-[11px] font-bold opacity-85 mt-0.5">
                    {result.isMatched
                      ? "کد ملی وارد شده در لیست اعضای رسمی این شرکت ثبت شده است."
                      : "کد ملی وارد شده با اعضای رسمی این شرکت مطابقت ندارد."}
                  </div>
                </div>
              </div>

              <InfoRow label="شناسه ملی شرکت" value={fa(legalId)} />
              <InfoRow label="کد ملی فرد" value={fa(nationalCode)} />
              <InfoRow
                label="تعداد سمت‌های ثبت‌شده"
                value={`${fa(result.positions?.length ?? 0)} سمت`}
              />
            </div>

            {/* لیست سمت‌ها و مشخصات روزنامه رسمی */}
            {result.positions && result.positions.length > 0 && (
              <div className="space-y-3">
                {result.positions.map((pos, idx) => {
                  const positionLabel =
                    POSITION_LABELS[pos.positionName?.toUpperCase()] ??
                    pos.positionName;

                  return (
                    <div
                      key={`${pos.issueTrackingNo}-${idx}`}
                      className="surface p-5 rounded-[26px] border border-line/5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-line/10">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                            <Briefcase size={18} />
                          </span>
                          <div>
                            <div className="text-sm font-extrabold text-ink">
                              {positionLabel}
                            </div>
                            {positionLabel !== pos.positionName && (
                              <div
                                className="text-[11px] font-mono text-silver mt-0.5"
                                dir="ltr"
                              >
                                {pos.positionName}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-extrabold text-brand">
                          <Newspaper size={12} />
                          شماره {fa(pos.rrkNewsPaperNumber)}
                        </span>
                      </div>

                      <InfoRow
                        label="تاریخ روزنامه رسمی"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={13} className="text-silver" />
                            {fa(pos.rrkNewsPaperDate)}
                          </span>
                        }
                      />
                      <InfoRow
                        label="شماره صفحه"
                        value={`صفحه ${fa(pos.rrkPageNumber)}`}
                      />
                      <InfoRow
                        label="شماره پیگیری آگهی"
                        value={
                          <span className="font-mono text-[11px]" dir="ltr">
                            {fa(pos.issueTrackingNo)}
                          </span>
                        }
                      />
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
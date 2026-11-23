"use client";
import { useState } from "react";
import {
  Users,
  PieChart,
  ShieldAlert,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { InfoRow, ServiceHeader, VamButton } from "../shared";
import { LegalIdInput, isValidLegalId } from "../shared/inputs/LegalIdInput";
import { fa } from "@/src/lib/format";

interface BoardMember {
  nationalId: string;
  firstName: string;
  lastName: string;
  roleCode: number;
  roleName: string;
}

interface ShareHolder {
  nationalId: string;
  firstName: string;
  lastName: string;
  percentage: number;
}

interface BoardMembersResult {
  boardMembers: BoardMember[];
  shareHolders: ShareHolder[];
}

export default function BoardMembersFlow() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [result, setResult] = useState<BoardMembersResult | null>(null);
  const [trackId, setTrackId] = useState("");

  const handleInquiry = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidLegalId(companyId)) return;

    setLoading(true);
    try {
      // GET /kyb/v2/clients/{clientId}/boardMembers?companyId=${companyId}
      await new Promise((r) => setTimeout(r, 1500));

      const mockResponse = {
        responseCode: "FN-KBIE-20000100000",
        trackId: "2c122a95-62b52e7b87d9",
        result: {
          boardMembers: [
            {
              nationalId: "0074232995",
              firstName: "سارا",
              lastName: "صالحی",
              roleCode: 1,
              roleName: "عضو اصلی هیئت مدیره",
            },
            {
              nationalId: "0061234567",
              firstName: "امیر",
              lastName: "رضایی",
              roleCode: 2,
              roleName: "مدیرعامل و رئیس هیئت مدیره",
            },
          ],
          shareHolders: [
            {
              nationalId: "0057852199",
              firstName: "کبری",
              lastName: "صالحی",
              percentage: 71.5,
            },
            {
              nationalId: "0074232995",
              firstName: "سارا",
              lastName: "صالحی",
              percentage: 28.5,
            },
          ],
        },
        status: "DONE",
      };

      setTrackId(mockResponse.trackId);
      setResult(mockResponse.result);
      setShowFormErrors(false);
    } catch {
      setGeneralError("خطا در استعلام اعضای هیئت مدیره. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompanyId("");
    setResult(null);
    setTrackId("");
    setShowFormErrors(false);
    setGeneralError("");
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="اعضای هیئت مدیره" />

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
              شناسه ملی ۱۱ رقمی شرکت را وارد کنید تا فهرست اعضای هیئت مدیره، سمت‌ها و سهامداران شرکت نمایش داده شود.
            </p>

            <LegalIdInput
              value={companyId}
              onChange={setCompanyId}
              showErrors={showFormErrors}
            />

            <div className="mt-6">
              <VamButton loading={loading} onClick={handleInquiry}>
                استعلام اعضای هیئت مدیره
              </VamButton>
            </div>
          </div>
        )}

        {/* نمایش نتیجه */}
        {result && (
          <div className="animate-in zoom-in-95 fade-in duration-500 space-y-4">
            {/* خلاصه استعلام */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-lg shadow-brand/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  <Building2 size={18} className="text-brand" />
                  <span>خلاصه استعلام شرکت</span>
                </div>
                <span className="text-[11px] font-bold text-silver" dir="ltr">
                  #{trackId.split("-")[0].toUpperCase()}
                </span>
              </div>

              <InfoRow label="شناسه ملی شرکت" value={fa(companyId)} />
              <InfoRow
                label="تعداد اعضای هیئت مدیره"
                value={`${fa(result.boardMembers.length)} نفر`}
              />
              <InfoRow
                label="تعداد سهامداران"
                value={`${fa(result.shareHolders.length)} نفر`}
              />
            </div>

            {/* لیست اعضای هیئت مدیره */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-4">
                <Users size={18} className="text-brand" />
                <span>اعضای هیئت مدیره</span>
              </div>

              {result.boardMembers.length === 0 ? (
                <p className="text-xs text-silver text-center py-4">
                  عضو هیئت مدیره‌ای برای این شناسه ثبت نشده است.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.boardMembers.map((member, idx) => (
                    <div
                      key={`${member.nationalId}-${idx}`}
                      className="rounded-2xl bg-tile/40 p-3.5 border border-line/5"
                    >
                      <div className="flex items-start justify-between gap-2 pb-2.5 mb-2 border-b border-line/10">
                        <div className="text-sm font-extrabold text-ink">
                          {member.firstName} {member.lastName}
                        </div>
                        <span className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand">
                          <BadgeCheck size={12} />
                          {member.roleName}
                        </span>
                      </div>

                      <InfoRow label="کد ملی" value={fa(member.nationalId)} />
                      <InfoRow label="کد سمت" value={fa(member.roleCode)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* لیست سهامداران */}
            <div className="surface p-5 rounded-[28px] border border-line/5 shadow-sm">
              <div className="flex items-center gap-2 text-[15px] font-extrabold mb-4">
                <PieChart size={18} className="text-brand" />
                <span>سهامداران</span>
              </div>

              {result.shareHolders.length === 0 ? (
                <p className="text-xs text-silver text-center py-4">
                  اطلاعات سهامداری برای این شناسه ثبت نشده است.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.shareHolders.map((holder, idx) => (
                    <div
                      key={`${holder.nationalId}-${idx}`}
                      className="rounded-2xl bg-tile/40 p-3.5 border border-line/5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-sm font-extrabold text-ink">
                          {holder.firstName} {holder.lastName}
                        </div>
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-500">
                          {fa(holder.percentage)}٪
                        </span>
                      </div>

                      {/* نوار درصد سهام */}
                      <div className="h-1.5 w-full rounded-full bg-line/10 overflow-hidden mb-2.5">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, holder.percentage))}%` }}
                        />
                      </div>

                      <InfoRow label="کد ملی" value={fa(holder.nationalId)} />
                    </div>
                  ))}
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
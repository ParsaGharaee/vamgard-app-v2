"use client";
import { useState } from "react";
import { KeyRound, Phone, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { InfoRow, ServiceHeader, Stepper, VamButton, VamInput } from "../shared";
import { fa } from "@/src/lib/format";

const STEPS = ["اطلاعات هویتی", "تایید پیامکی", "نتیجه استعلام"];

export default function CreditScoreFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [inquiryTrackId, setInquiryTrackId] = useState("");
  const [reportResult, setReportResult] = useState<any>(null);

  // 1. درخواست اولیه فینوتک
  const handleStep1 = async () => {
    if (!nationalCode || !mobile) return setError("کد ملی و موبایل الزامی است");
    setLoading(true); setError("");
    try {
      // const res = await fetch('/api/finnotech/kyc/request', { method: 'POST', body: JSON.stringify({ nationalCode, mobile }) });
      await new Promise((r) => setTimeout(r, 1500));
      setInquiryTrackId("INQUIRY_TRACK_123");
      setStep(2);
    } catch { setError("خطا در ارتباط با سرور"); } finally { setLoading(false); }
  };

  // 2. تایید پیامک
  const handleStep2 = async () => {
    if (!otp) return setError("کد تایید الزامی است");
    setLoading(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setInquiryTrackId("REPORT_TRACK_987");
      fetchReport("REPORT_TRACK_987"); // بلافاصله بعد از تایید میریم مرحله 3
    } catch { setError("کد تایید اشتباه است"); } finally { setLoading(false); }
  };

  // 3. گرفتن گزارش
  const fetchReport = async (finalTrackId: string) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setReportResult({
        message: "شخص محکومیت مالی اجرا شده/نشده دارد.",
        hasHistory: true, // تستی
        title: "محکومیت مالی",
      });
      setStep(3);
    } catch { setError("خطا در دریافت گزارش"); } finally { setLoading(false); }
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اعتبارسنجی" />

      <div className="px-4 mt-6">
        <Stepper steps={STEPS} currentStep={step} />
        {error && <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3 rounded-xl mb-4 text-right">{error}</div>}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in">
            <p className="text-xs text-silver leading-6 mb-5 text-right">
              برای استعلام، کد ملی و شماره موبایل ثبت شده به نام همان کد ملی را وارد کنید.
            </p>
            <VamInput label="کد ملی" icon={User} placeholder="0012345678" value={nationalCode} onChange={(e: any) => setNationalCode(e.target.value)} type="number" />
            <VamInput label="شماره موبایل" icon={Phone} placeholder="09123456789" value={mobile} onChange={(e: any) => setMobile(e.target.value)} type="number" />
            <VamButton loading={loading} onClick={handleStep1}>دریافت کد تایید</VamButton>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in">
            <p className="text-xs text-silver leading-6 mb-5 text-right">
              کد تایید ارسال شده به <span className="font-bold text-ink" dir="ltr">{mobile}</span> را وارد کنید.
            </p>
            <VamInput label="کد تایید" icon={KeyRound} placeholder="12345" value={otp} onChange={(e: any) => setOtp(e.target.value)} type="number" maxLength={5} />
            <VamButton loading={loading} onClick={handleStep2}>تایید و دریافت نتیجه</VamButton>
            <button onClick={() => setStep(1)} className="w-full text-xs text-silver font-bold mt-4">اصلاح شماره</button>
          </div>
        )}

        {step === 3 && reportResult && (
          <div className="animate-in zoom-in-95 fade-in">
            <div className="surface p-4 rounded-3xl mt-4 border border-line/5 shadow-sm">
              <div className="text-[15px] font-extrabold mb-3">نتیجه استعلام اعتبار معاملاتی</div>

              <div className={`p-4 rounded-2xl mb-4 flex items-center gap-3 ${reportResult.hasHistory ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                {reportResult.hasHistory ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
                <div>
                  <div className="font-extrabold text-sm">{reportResult.title}</div>
                  <div className="text-xs mt-1 opacity-80">{reportResult.message}</div>
                </div>
              </div>

              <InfoRow label="کد ملی" value={fa(nationalCode)} />
              <InfoRow
                label="وضعیت"
                value={
                  <span className={reportResult.hasHistory ? "text-red-500" : "text-emerald-500"}>
                    {reportResult.hasHistory ? "دارای سوء پیشینه" : "فاقد سوء پیشینه"}
                  </span>
                }
              />
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold mt-4">استعلام جدید</button>
          </div>
        )}
      </div>
    </div>
  );
}

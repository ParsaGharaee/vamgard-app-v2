"use client";
import { useState } from "react";
import { ShieldAlert, ShieldCheck, RefreshCcw } from "lucide-react";
import { InfoRow, ServiceHeader, Stepper, VamButton } from "../shared"; 
import { NationalCodeInput, isValidNationalCode } from "../shared/inputs/NationalCodeInput";
import { MobileInput, isValidMobile } from "../shared/inputs/MobileInput";
import { OtpInput } from "../shared/inputs/OtpInput";
import { fa } from "@/src/lib/format"; 

const STEPS = ["اطلاعات هویتی", "تایید پیامکی", "نتیجه استعلام"];

export default function CreditScoreFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");

  const [inquiryTrackId, setInquiryTrackId] = useState("");
  const [reportResult, setReportResult] = useState<any>(null);

  const handleStep1 = async () => {
    setGeneralError("");
    setShowFormErrors(true);

    if (!isValidNationalCode(nationalCode) || !isValidMobile(mobile)) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setInquiryTrackId("INQUIRY_TRACK_123");
      setShowFormErrors(false);
      setStep(2);
    } catch {
      setGeneralError("خطا در ارتباط با سرور فینوتک.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (enteredOtp: string) => {
    setGeneralError("");
    setLoading(true);
    setOtpSuccess(false);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      
      if (enteredOtp !== "12345") {
        throw new Error("کد تایید اشتباه است.");
      }

      setLoading(false);
      setOtpSuccess(true); 
      
      await new Promise((r) => setTimeout(r, 600));

      setInquiryTrackId("REPORT_TRACK_987");
      fetchReport("REPORT_TRACK_987");
    } catch (err: any) {
      setLoading(false);
      setGeneralError(err.message || "خطا در تایید کد.");
    }
  };

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
    } catch {
      setGeneralError("خطا در دریافت گزارش نهایی.");
    } finally {
      setLoading(false);
      setOtpSuccess(false); // ریست برای درخواست‌های بعدی
    }
  };

  return (
    <div className="bg-bg min-h-screen text-ink pb-10">
      <ServiceHeader title="استعلام اعتبارسنجی" />

      <div className="px-4 mt-6">
        <Stepper steps={STEPS} currentStep={step} />
        
        {generalError && step !== 2 && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in">
            <ShieldAlert size={18} />
            {generalError}
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-6 text-right px-1">
              برای استعلام، کد ملی و شماره موبایل ثبت شده به نام همان شخص را وارد کنید.
            </p>
            
            <NationalCodeInput value={nationalCode} onChange={setNationalCode} showErrors={showFormErrors} />
            <MobileInput value={mobile} onChange={setMobile} showErrors={showFormErrors} />
            
            <div className="mt-6">
              <VamButton loading={loading} onClick={handleStep1}>
                دریافت کد تایید
              </VamButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col items-center">
            <p className="text-xs text-silver leading-6 mb-2 text-center px-4 mt-4">
              کد تایید ۵ رقمی ارسال شده به <br/>
              <span className="font-extrabold text-brand text-sm mt-1 inline-block" dir="ltr">{fa(mobile)}</span> <br/>
              را وارد کنید.
            </p>
            
            <OtpInput 
              length={5}
              onComplete={handleStep2} 
              error={generalError}     
              loading={loading}        
              success={otpSuccess}
            />
            
            {loading && !otpSuccess && (
              <div className="flex items-center gap-2 text-brand text-xs font-bold mt-2 animate-pulse">
                <RefreshCcw size={14} className="animate-spin" />
                در حال بررسی کد...
              </div>
            )}
            {otpSuccess && (
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mt-2 animate-in fade-in">
                <ShieldCheck size={16} />
                تایید شد! در حال دریافت گزارش...
              </div>
            )}
            
            <button 
              disabled={loading || otpSuccess}
              onClick={() => { setStep(1); setGeneralError(""); setShowFormErrors(false); }} 
              className="w-full text-[11px] text-silver font-bold py-2 mt-6 active:scale-95 transition-transform disabled:opacity-50"
            >
              اصلاح شماره موبایل یا کد ملی
            </button>
          </div>
        )}

        {step === 3 && reportResult && (
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="surface p-5 rounded-[28px] mt-4 border border-line/5 shadow-lg shadow-brand/5">
              <div className="text-[15px] font-extrabold mb-4">نتیجه استعلام اعتبار معاملاتی</div>

              <div className={`p-4 rounded-2xl mb-5 flex items-start gap-3 border ${reportResult.hasHistory ? "bg-red-500/5 border-red-500/10 text-red-600" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-600"}`}>
                <div className="mt-0.5">
                  {reportResult.hasHistory ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <div className="font-extrabold text-sm">{reportResult.title}</div>
                  <div className="text-[11px] mt-1.5 opacity-80 leading-5">{reportResult.message}</div>
                </div>
              </div>

              <InfoRow label="کد ملی استعلام شده" value={fa(nationalCode)} />
              <InfoRow label="شماره موبایل" value={fa(mobile)} />
              <InfoRow
                label="وضعیت سابقه"
                value={
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${reportResult.hasHistory ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                    {reportResult.hasHistory ? "دارای سوء پیشینه" : "فاقد سوء پیشینه"}
                  </span>
                }
              />
            </div>
            
            <button 
              onClick={() => {
                setNationalCode("");
                setMobile("");
                setReportResult(null);
                setShowFormErrors(false);
                setStep(1);
              }} 
              className="w-full bg-tile text-ink rounded-xl py-3.5 text-sm font-bold mt-6 active:scale-95 transition-transform"
            >
              استعلام جدید
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
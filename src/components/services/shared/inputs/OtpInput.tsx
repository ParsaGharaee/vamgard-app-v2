"use client";
import React, { useState, useRef, useEffect } from "react";

export const OtpInput = ({ 
  length = 5, 
  onComplete, 
  error, 
  loading,
  success 
}: { 
  length?: number; 
  onComplete: (otp: string) => void; 
  error?: string; 
  loading?: boolean;
  success?: boolean;
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [shake, setShake] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // افکت لرزش هنگام دریافت ارور
  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500); 
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, ""); // فقط عدد
    if (!val) return;
    
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); 
    setOtp(newOtp);

    // رفتن به باکس بعدی
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // چک کردن پایان یافتن پروسه
    const combined = newOtp.join("");
    if (combined.length === length) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) {
         newOtp[index] = "";
         setOtp(newOtp);
      } else if (index > 0) {
         inputsRef.current[index - 1]?.focus();
      }
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < text.length; i++) {
      newOtp[i] = text[i];
    }
    setOtp(newOtp);
    
    if (text.length === length) {
       inputsRef.current[length - 1]?.focus();
       onComplete(newOtp.join(""));
    } else {
       inputsRef.current[text.length]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-4 mb-2">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
      
      <div className={`flex items-center gap-2 sm:gap-3 justify-center w-full ${shake ? 'animate-shake' : ''}`} dir="ltr">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            disabled={loading || success}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className={`
              w-12 h-14 sm:w-[52px] sm:h-16 text-center text-2xl font-black surface rounded-2xl outline-none transition-all duration-300 border-[2.5px]
              ${error 
                  ? "border-red-500/80 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                  : success
                    ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : loading 
                      ? "border-brand/40 bg-brand/5 text-brand animate-pulse"
                      : digit 
                        ? "border-brand bg-brand/10 text-brand shadow-[0_0_15px_rgba(8,123,255,0.15)]"
                        : "border-line/10 focus:border-brand/50 focus:bg-brand/5 text-ink"
              }
            `}
            autoFocus={i === 0} 
          />
        ))}
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 mt-4 text-center ${error ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-xs text-red-500 font-extrabold">{error}</p>
      </div>
    </div>
  );
};
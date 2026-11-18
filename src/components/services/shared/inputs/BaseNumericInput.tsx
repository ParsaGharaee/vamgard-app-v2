"use client";
import React from "react";

export const BaseNumericInput = ({ 
  label, icon: Icon, error, isValid, maxLength, value, onChange, placeholder 
}: any) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // فقط عدد
    if (maxLength && numericValue.length > maxLength) return;
    onChange(numericValue);
  };

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">{label}</label>
      <div className="relative group">
        <input
          type="text"
          inputMode="numeric"
          className={`w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-[15px] font-bold outline-none transition-all duration-300 font-sans text-left tracking-widest
            ${error 
              ? "border border-red-500/40 focus:ring-4 focus:ring-red-500/10 bg-red-500/5 text-red-500" 
              : isValid 
                ? "border border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-emerald-600" 
                : "border border-transparent focus:border-brand/30 focus:ring-4 focus:ring-brand/10 placeholder:text-silver/40"
            }
          `}
          dir="ltr"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        
        {Icon && (
          <Icon 
            size={22} 
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300
              ${error ? "text-red-400" : isValid ? "text-emerald-500" : "text-silver/60 group-focus-within:text-brand"}`} 
          />
        )}
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${error ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"}`}>
        <p className="text-[10px] text-red-500 font-bold pr-1">{error}</p>
      </div>
    </div>
  );
};
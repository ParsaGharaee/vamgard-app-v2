"use client";
import React, { useRef } from "react";
import { FileText, UploadCloud, Trash2 } from "lucide-react";
import { fa } from "@/src/lib/format";

export const MAX_PDF_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const isValidPdfFile = (file: File | null) => {
  if (!file) return false;
  const isPdfMime = file.type === "application/pdf";
  const isPdfExt = /\.pdf$/i.test(file.name);
  return (isPdfMime || isPdfExt) && file.size <= MAX_PDF_FILE_SIZE;
};

export const fileToRawBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("خطا در خواندن فایل PDF"));
    reader.readAsDataURL(file);
  });

export const PdfFileInput = ({
  file,
  onChange,
  label = "فایل PDF امضاشده",
  showErrors,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  showErrors?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isWrongFormat = Boolean(
    file && !(file.type === "application/pdf" || /\.pdf$/i.test(file.name))
  );
  const isTooLarge = Boolean(file && file.size > MAX_PDF_FILE_SIZE);
  const valid = isValidPdfFile(file);

  const errorMsg = isWrongFormat
    ? "فرمت فایل باید حتماً PDF باشد."
    : isTooLarge
      ? "حجم فایل PDF نباید بیشتر از ۱۰ مگابایت باشد."
      : showErrors && !valid
        ? "انتخاب فایل PDF امضاشده الزامی است."
        : "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const sizeInMb = file ? (file.size / (1024 * 1024)).toFixed(2) : "";

  return (
    <div className="mb-5">
      <label className="block text-xs font-extrabold text-silver mb-2 pr-1">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full surface rounded-2xl p-6 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center active:scale-[0.99]
            ${
              errorMsg
                ? "border-red-500/50 bg-red-500/5 text-red-500"
                : "border-line/20 hover:border-brand/40 text-silver"
            }
          `}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <UploadCloud size={22} />
          </span>
          <span className="text-xs font-extrabold text-ink">
            انتخاب فایل PDF امضاشده
          </span>
          <span className="text-[11px] text-silver">
            فقط فرمت PDF · حداکثر حجم {fa(10)} مگابایت
          </span>
        </button>
      ) : (
        <div
          className={`surface rounded-2xl p-3.5 border transition-all duration-300 flex items-center justify-between gap-3
            ${
              errorMsg
                ? "border-red-500/40 bg-red-500/5"
                : "border-emerald-500/50"
            }
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <FileText size={20} />
            </span>
            <div className="min-w-0 text-right">
              <div
                className="text-xs font-extrabold text-ink truncate"
                dir="ltr"
              >
                {file.name}
              </div>
              <div className="text-[11px] text-silver mt-0.5">
                حجم: {fa(sizeInMb)} مگابایت
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-500 active:scale-95 transition-transform"
            aria-label="حذف فایل PDF"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ${
          errorMsg ? "max-h-10 opacity-100 mt-1.5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-[10px] text-red-500 font-bold pr-1">{errorMsg}</p>
      </div>
    </div>
  );
};
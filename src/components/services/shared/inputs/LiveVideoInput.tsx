"use client";
import React, { useRef } from "react";
import { Video, UploadCloud, Trash2 } from "lucide-react";
import { fa } from "@/src/lib/format";

export const MAX_LIVE_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

export const isValidLiveVideo = (file: File | null) =>
  Boolean(file) &&
  file!.type.startsWith("video/") &&
  file!.size <= MAX_LIVE_VIDEO_SIZE;

export const LiveVideoInput = ({
  file,
  onChange,
  showErrors,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  showErrors?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isTooLarge = Boolean(file && file.size > MAX_LIVE_VIDEO_SIZE);
  const valid = isValidLiveVideo(file);

  const errorMsg = isTooLarge
    ? "حجم ویدئو نباید بیشتر از ۵ مگابایت باشد."
    : showErrors && !valid
      ? "انتخاب فایل ویدئوی زنده الزامی است."
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
        ویدئوی زنده کاربر (حداکثر ۵ مگابایت)
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full surface rounded-2xl p-5 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center active:scale-[0.99]
            ${
              errorMsg
                ? "border-red-500/50 bg-red-500/5 text-red-500"
                : "border-line/20 hover:border-brand/40 text-silver"
            }
          `}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-brand">
            <UploadCloud size={22} />
          </span>
          <span className="text-xs font-extrabold text-ink">
            ضبط یا انتخاب ویدئوی سلفی
          </span>
          <span className="text-[11px] text-silver">
            فرمت‌های ویدئویی مجاز · حداکثر حجم {fa(5)} مگابایت
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
              <Video size={20} />
            </span>
            <div className="min-w-0 text-right">
              <div className="text-xs font-extrabold text-ink truncate" dir="ltr">
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
            aria-label="حذف ویدئو"
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
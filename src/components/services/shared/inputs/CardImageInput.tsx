"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, FileImage } from "lucide-react";
import { fa } from "@/src/lib/format";

export const MAX_CARD_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const isValidCardImage = (file: File | null) => {
  if (!file) return false;
  const isJpgMime = file.type === "image/jpeg" || file.type === "image/jpg";
  const isJpgExt = /\.(jpe?g)$/i.test(file.name);
  return (isJpgMime || isJpgExt) && file.size <= MAX_CARD_IMAGE_SIZE;
};

export const CardImageInput = ({
  file,
  onChange,
  label = "تصویر کارت ملی (فرمت JPG)",
  showErrors,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  showErrors?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isTooLarge = Boolean(file && file.size > MAX_CARD_IMAGE_SIZE);
  const isWrongFormat = Boolean(
    file &&
      !(
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        /\.(jpe?g)$/i.test(file.name)
      )
  );
  const valid = isValidCardImage(file);

  const errorMsg = isWrongFormat
    ? "فرمت تصویر باید حتماً JPG / JPEG باشد."
    : isTooLarge
      ? "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
      : showErrors && !valid
        ? "انتخاب تصویر کارت ملی الزامی است."
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
        accept=".jpg,.jpeg,image/jpeg"
        capture="environment"
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
            <ImagePlus size={22} />
          </span>
          <span className="text-xs font-extrabold text-ink">
            عکاسی یا انتخاب تصویر کارت ملی
          </span>
          <span className="text-[11px] text-silver">
            فقط فرمت JPG · حداکثر حجم {fa(5)} مگابایت
          </span>
        </button>
      ) : (
        <div
          className={`surface rounded-2xl p-3 border transition-all duration-300 space-y-3
            ${
              errorMsg
                ? "border-red-500/40 bg-red-500/5"
                : "border-emerald-500/50"
            }
          `}
        >
          {previewUrl && !isWrongFormat && (
            <div className="relative overflow-hidden rounded-xl bg-tile/40 aspect-[1.58/1] w-full">
              <img
                src={previewUrl}
                alt="پیش‌نمایش کارت ملی"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <FileImage size={18} />
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
              aria-label="حذف تصویر"
            >
              <Trash2 size={16} />
            </button>
          </div>
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
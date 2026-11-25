"use client";

import { Download, Image as ImageIcon, Share2 } from "lucide-react";
import { VamButton } from "@/src/components/services/shared";

type Props = {
  title: string;
  fileName?: string;
  /** Plain text or JSON string to export */
  payload: string;
};

export function ResultExport({ title, fileName = "vamgard-result", payload }: Props) {
  const download = (mime: string, ext: string) => {
    const blob = new Blob([payload], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: payload.slice(0, 500) });
        return;
      } catch {
        /* user cancelled */
      }
    }
    download("text/plain;charset=utf-8", "txt");
  };

  return (
    <div className="mx-4 mt-4 space-y-2 rounded-2xl border border-line/10 bg-tile/30 p-4">
      <div className="text-sm font-extrabold">{title}</div>
      <p className="text-[11px] text-silver">ذخیره یا ارسال نتیجه استعلام</p>
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          onClick={() => download("application/json;charset=utf-8", "json")}
          className="surface flex flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-bold"
        >
          <Download size={18} className="text-brand" />
          JSON
        </button>
        <button
          type="button"
          onClick={() => download("text/plain;charset=utf-8", "txt")}
          className="surface flex flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-bold"
        >
          <ImageIcon size={18} className="text-brand" />
          متن
        </button>
        <button
          type="button"
          onClick={share}
          className="surface flex flex-col items-center gap-1 rounded-xl py-3 text-[10px] font-bold"
        >
          <Share2 size={18} className="text-brand" />
          اشتراک
        </button>
      </div>
      <VamButton type="button" className="!mt-1" onClick={() => download("text/plain;charset=utf-8", "txt")}>
        دانلود گزارش
      </VamButton>
    </div>
  );
}
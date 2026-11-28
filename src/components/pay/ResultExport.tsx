"use client";

import { FileDown, Image as ImageIcon, Share2 } from "lucide-react";

type ExportRow = { label: string; value: string };

type Props = {
  title: string;
  fileName?: string;
  rows?: ExportRow[];
  /** Fallback text/JSON when rows are not provided */
  payload?: string;
};

export function ResultExport({ title, fileName = "vamgard-result", rows, payload = "" }: Props) {
  const resolvedRows: ExportRow[] =
    rows && rows.length > 0
      ? rows
      : payload
          .split("\n")
          .filter(Boolean)
          .slice(0, 12)
          .map((line, i) => ({ label: `ردیف ${i + 1}`, value: line }));

  const downloadImage = () => {
    const width = 800;
    const rowHeight = 52;
    const height = Math.max(360, 180 + resolvedRows.length * rowHeight);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // پس‌زمینه کارت
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, width, height);

    // هدر برند
    ctx.fillStyle = "#087bff";
    ctx.fillRect(0, 0, width, 96);

    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Vazirmatn, Tahoma, sans-serif";
    ctx.fillText(title, width - 36, 56);

    ctx.font = "14px Vazirmatn, Tahoma, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("وامگرد · رسید رسمی استعلام", width - 36, 82);

    // ردیف‌ها
    let y = 140;
    resolvedRows.forEach((row, idx) => {
      if (idx % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(28, y - 32, width - 56, rowHeight - 6);
      }
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "right";
      ctx.font = "16px Vazirmatn, Tahoma, sans-serif";
      ctx.fillText(row.label, width - 44, y);

      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "left";
      ctx.font = "bold 16px Vazirmatn, Tahoma, sans-serif";
      ctx.fillText(row.value.slice(0, 48), 44, y);

      y += rowHeight;
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.png`;
    a.click();
  };

  const downloadPdf = () => {
    const win = window.open("", "_blank", "width=760,height=900");
    if (!win) return;
    const rowsHtml = resolvedRows
      .map(
        (r) =>
          `<tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b">${r.label}</td><td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:700;text-align:left">${r.value}</td></tr>`,
      )
      .join("");

    win.document.write(`
      <html dir="rtl" lang="fa">
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Tahoma, sans-serif; padding: 32px; color: #0f172a; }
            .head { background: #087bff; color: #fff; padding: 20px; border-radius: 16px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="head">
            <h2 style="margin:0">${title}</h2>
            <small>وامگرد · گزارش استعلام</small>
          </div>
          <table>${rowsHtml}</table>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const share = async () => {
    const text = resolvedRows.map((r) => `${r.label}: ${r.value}`).join("\n");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard?.writeText(text);
  };

  return (
    <div className="mt-4 rounded-2xl border border-line/10 bg-tile/30 p-4">
      <div className="mb-2 text-right text-xs font-extrabold text-silver">ذخیره و اشتراک‌گذاری نتیجه</div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={downloadPdf}
          className="surface flex flex-col items-center gap-1.5 rounded-xl py-3 text-[11px] font-extrabold text-ink active:scale-95 transition-transform"
        >
          <FileDown size={18} className="text-brand" />
          دانلود PDF
        </button>

        <button
          type="button"
          onClick={downloadImage}
          className="surface flex flex-col items-center gap-1.5 rounded-xl py-3 text-[11px] font-extrabold text-ink active:scale-95 transition-transform"
        >
          <ImageIcon size={18} className="text-brand" />
          دانلود عکس
        </button>

        <button
          type="button"
          onClick={share}
          className="surface flex flex-col items-center gap-1.5 rounded-xl py-3 text-[11px] font-extrabold text-ink active:scale-95 transition-transform"
        >
          <Share2 size={18} className="text-brand" />
          اشتراک
        </button>
      </div>
    </div>
  );
}
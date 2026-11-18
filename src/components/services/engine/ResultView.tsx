"use client";
import { InfoRow, ResultCard } from "../shared";
import { fa } from "@/src/lib/format";
import { faResultKey, faValue } from "@/src/lib/finnotech/fa";
import type { ResponseField } from "@/src/lib/finnotech/types";

function flatten(obj: unknown, prefix = ""): { key: string; value: string }[] {
  if (obj === null || obj === undefined) return [];
  if (typeof obj !== "object") {
    return [{ key: prefix || "value", value: String(obj) }];
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [{ key: prefix || "items", value: "—" }];
    return obj.flatMap((item, i) => flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") return flatten(v, key);
    return [{ key, value: v === null || v === undefined ? "—" : String(v) }];
  });
}

function labelFor(key: string, hints: ResponseField[]) {
  const leaf = key.split(".").pop()?.replace(/\[\d+\]/g, "") || key;
  const hint = hints.find((h) => h.key === key || h.key === leaf || key.endsWith(`.${h.key}`));
  if (hint?.label && /[\u0600-\u06FF]/.test(hint.label)) return hint.label;
  return faResultKey(key);
}

function displayValue(value: string) {
  const translated = faValue(value);
  if (/^\d+(\.\d+)?$/.test(translated)) return fa(translated);
  return translated;
}

export function ResultView({
  title,
  result,
  responseFields = [],
  trackId,
  onReset,
}: {
  title: string;
  result: unknown;
  responseFields?: ResponseField[];
  trackId?: string;
  onReset: () => void;
}) {
  const rows = flatten(result).slice(0, 40);

  return (
    <div className="animate-in zoom-in-95 fade-in duration-500">
      <ResultCard title={title}>
        {trackId && <InfoRow label="کد پیگیری" value={fa(trackId)} />}
        {rows.length === 0 && (
          <p className="text-sm text-silver text-center py-4">نتیجه‌ای برای نمایش نیست.</p>
        )}
        {rows.map((row) => (
          <InfoRow
            key={row.key}
            label={labelFor(row.key, responseFields)}
            value={displayValue(row.value)}
          />
        ))}
      </ResultCard>
      <button
        onClick={onReset}
        className="w-full surface text-ink rounded-2xl py-3.5 text-sm font-extrabold mt-6 active:scale-95 transition-transform border border-line/10"
      >
        استعلام جدید
      </button>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { ServiceHeader, VamButton } from "../shared";
import { FieldRenderer } from "./FieldRenderer";
import { ResultView } from "./ResultView";
import type { FinnotechService } from "@/src/lib/finnotech/types";
import { validateAll } from "@/src/lib/finnotech/validate";
import { inquireService } from "@/src/lib/finnotech/api-client";

export default function GenericInquiryFlow({ service }: { service: FinnotechService }) {
  const fields = useMemo(
    () => service.fields.filter((f) => f.kind !== "otp"),
    [service.fields]
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [trackId, setTrackId] = useState<string>();

  const fieldErrors = validateAll(fields, values);

  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const submit = async () => {
    setError("");
    setShowErrors(true);
    if (Object.keys(fieldErrors).length) return;

    setLoading(true);
    try {
      const res = await inquireService(service.id, values);
      if (!res.ok) {
        setError(res.error || "استعلام ناموفق بود.");
        return;
      }
      setResult(res.result);
      setTrackId(res.trackId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در ارتباط با سرور فینوتک.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues({});
    setResult(null);
    setTrackId(undefined);
    setShowErrors(false);
    setError("");
  };

  return (
    <div className="app-bg min-h-screen text-ink pb-10">
      <ServiceHeader title={service.title} />
      <div className="px-4 mt-4">
        {error && (
          <div className="bg-red-500/10 text-red-500 text-xs font-bold p-3.5 rounded-2xl mb-5 text-right flex items-center gap-2 animate-in fade-in border border-red-500/10">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!result ? (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
            <p className="text-xs text-silver leading-6 mb-5 text-right px-1">
              اطلاعات لازم را وارد کنید و استعلام را بزنید.
            </p>
            {fields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={f}
                value={values[f.name] || ""}
                onChange={(v) => setField(f.name, v)}
                showErrors={showErrors}
                error={fieldErrors[f.name]}
              />
            ))}
            {fields.length === 0 && (
              <p className="text-xs text-silver mb-4">این سرویس پارامتر ورودی ندارد.</p>
            )}
            <div className="mt-2">
              <VamButton loading={loading} onClick={submit}>
                استعلام
              </VamButton>
            </div>
          </div>
        ) : (
          <ResultView
            title={`نتیجه ${service.title}`}
            result={result}
            responseFields={service.responseFields}
            trackId={trackId}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

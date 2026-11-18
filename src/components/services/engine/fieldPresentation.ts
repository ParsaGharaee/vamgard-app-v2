import type { ServiceField } from "@/src/lib/finnotech/types";
import { faEnum, faField } from "@/src/lib/finnotech/fa";

const FIELD_HINTS: Record<string, string> = {
  idCode: "برای شخص حقیقی کد ملی و برای شخص حقوقی شناسه ملی را وارد کنید.",
  idType: "نوع صاحب کد شناسایی را انتخاب کنید.",
  birthDate: "فرمت: yyyy/mm/dd مثل 1370/01/15",
  birthDay: "فرمت: yyyy/mm/dd",
  iban: "۲۴ رقم، با یا بدون IR",
  plateNumber: "کد ۹ رقمی پلاک خودرو",
  type: "نوع قبض یا نوع درخواست را انتخاب کنید.",
  secondParameter: "در صورت نیاز، اپراتور موبایل را انتخاب کنید.",
  parameter: "بسته به نوع قبض، شناسه قبض یا شماره اشتراک را وارد کنید.",
  provider: "ارائه‌دهنده گواهی امضا را انتخاب کنید.",
  purpose: "هدف درخواست را انتخاب کنید.",
  method: "روش ارسال رمز را انتخاب کنید.",
  documentType: "نوع سند را انتخاب کنید.",
  conditions: "شرایط را انتخاب کنید.",
  certType: "نوع گواهی را انتخاب کنید.",
};

function extractHint(raw: string, label: string) {
  if (!raw || raw === label) return undefined;
  const rest = raw
    .replace(label, "")
    .replace(/^[—–\-|:：\s]+/, "")
    .trim();
  if (!rest) return undefined;
  // avoid English-heavy OpenAPI leftovers
  if (/[A-Za-z]{3,}/.test(rest)) return undefined;
  return rest;
}

export function presentField(field: ServiceField): {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
} {
  const label = faField(field.name, field.label);
  const hint = FIELD_HINTS[field.name] || extractHint(field.label, label);

  const options = (field.enum || []).map((value) => ({
    value,
    label: faEnum(value),
  }));

  return { label, hint, options };
}

import type { ServiceField } from "./types";
import { faField } from "./fa";

/** Short label for validation messages (avoid OpenAPI essay text). */
function shortLabel(field: ServiceField) {
  return faField(field.name, field.label);
}

export const isValidNationalCode = (code: string) => {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = parseInt(code[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(code[i], 10) * (10 - i);
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

export const isValidMobile = (mobile: string) => /^09\d{9}$/.test(mobile);

export function validateField(field: ServiceField, value: string): string | null {
  const v = (value || "").trim();
  if (field.required && !v) return `${shortLabel(field)} الزامی است.`;
  if (!v) return null;

  switch (field.kind) {
    case "nationalCode":
      if (!isValidNationalCode(v)) return "کد ملی نامعتبر است.";
      break;
    case "mobile":
      if (!isValidMobile(v)) return "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
      break;
    case "iban": {
      const cleaned = v.replace(/\s/g, "").toUpperCase();
      const digits = cleaned.startsWith("IR") ? cleaned.slice(2) : cleaned;
      if (!/^\d{24}$/.test(digits)) return "شماره شبا باید ۲۴ رقم باشد.";
      break;
    }
    case "card":
      if (!/^\d{16}$/.test(v.replace(/\s/g, ""))) return "شماره کارت باید ۱۶ رقم باشد.";
      break;
    case "birthDate":
      if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(v)) return "تاریخ تولد را به صورت yyyy/mm/dd وارد کنید.";
      break;
    case "plate":
      if (v.replace(/\D/g, "").length < 7) return "شماره پلاک خودرو نامعتبر است.";
      break;
    case "motorPlate":
      if (!/^\d{8}$/.test(v.replace(/\D/g, ""))) return "پلاک موتور باید ۸ رقم باشد.";
      break;
    case "otp":
      if (!/^\d{4,6}$/.test(v)) return "کد تایید نامعتبر است.";
      break;
    case "select":
      if (field.enum?.length && !field.enum.includes(v)) return "گزینه انتخاب‌شده نامعتبر است.";
      break;
    default:
      if (field.maxLength && v.length > field.maxLength) {
        return `حداکثر ${field.maxLength} کاراکتر مجاز است.`;
      }
  }
  return null;
}

export function validateAll(
  fields: ServiceField[],
  values: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const err = validateField(f, values[f.name] || "");
    if (err) errors[f.name] = err;
  }
  return errors;
}

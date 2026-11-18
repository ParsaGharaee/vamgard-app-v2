const fs = require("fs");
const path = require("path");

const spec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "finnotech-openapi.json"), "utf8")
);

function resolveRef(ref) {
  if (!ref || !ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let cur = spec;
  for (const p of parts) cur = cur?.[p];
  return cur;
}

function deref(obj) {
  if (!obj) return obj;
  if (obj.$ref) return deref(resolveRef(obj.$ref));
  return obj;
}

function schemaType(schema) {
  schema = deref(schema);
  if (!schema) return "string";
  if (schema.enum) return "enum";
  if (schema.format === "binary") return "file";
  return schema.type || "string";
}

function extractScope(desc = "") {
  const m = desc.match(/\*\*Scope:\*\*\s*`([^`]+)`/i);
  return m ? m[1].trim() : null;
}

function extractGrant(desc = "") {
  const m = desc.match(/\*\*Grant type:\*\*\s*([^\n<]+)/i);
  if (!m) return "client_credentials";
  const g = m[1].trim().toLowerCase();
  if (g.includes("sms") || g.includes("authorization_code")) return "authorization_sms";
  return "client_credentials";
}

const TAG_TO_CATEGORY = {
  "سرویس های احراز هویت": { id: "kyc", title: "احراز هویت و شناخت مشتری", icon: "shieldCheck" },
  "سرویس های استعلامی و تبدیلی": { id: "inquiry", title: "استعلام و تبدیل بانکی", icon: "refresh" },
  "سرویس های بر پایه حساب": { id: "account", title: "سرویس‌های بر پایه حساب", icon: "wallet" },
  "سرویس های چک صیادی": { id: "sayad", title: "چک صیادی", icon: "search" },
  "استعلام تسهیلات و اعتبارسنجی": { id: "credit", title: "تسهیلات و اعتبارسنجی", icon: "chart" },
  "سرویس های شناخت کسب و کار": { id: "kyb", title: "شناخت کسب‌وکار (KYB)", icon: "folder" },
  "سرویس های خودرویی": { id: "vehicle", title: "استعلام خودرو", icon: "car" },
  "سرویس های قبض": { id: "billing", title: "استعلام قبض", icon: "bolt" },
  "سرویس های پستی و کدپستی": { id: "postal", title: "کد پستی", icon: "pin" },
  "سرویس های ارسال پیام کوتاه": { id: "sms", title: "پیامک و رمز یکبار مصرف", icon: "messages" },
  توکن: null, // excluded
  "سرویس های امضای دیجیتال": { id: "signature", title: "امضای دیجیتال", icon: "shieldNote" },
  "سرویس های سفته الکترونیکی": { id: "promissory", title: "سفته الکترونیکی", icon: "letter" },
  "سرویس های شناخت دستگاه": { id: "device", title: "شناخت دستگاه", icon: "setting" },
};

const EXCLUDE_IDS = new Set([
  "boomrangGetClientCredentialToken",
  "boomrangRefreshToken",
  "boomrangSmsStep1Authorize",
  "boomrangSmsStep2Verify",
  "boomrangSmsStep3Token",
  "facilityWebhookFinnotextStatus",
  "facilityWebhookReceiveSms",
]);

const HIDDEN_PARAMS = new Set(["clientId", "trackId", "Authorization", "authorization"]);

function fieldKind(name, type, description = "") {
  const n = name.toLowerCase();
  if (type === "file" || /video|image|file|pdf|base64/i.test(n + description)) return "file";
  if (/mobile|phone|mobileNumber|mobileNo/.test(n)) return "mobile";
  if (/^(nid|nationalcode|nationalid|national_code)$/i.test(n) || n === "user") return "nationalCode";
  if (/iban|sheba/.test(n)) return "iban";
  if (/card|pan/.test(n) && !/national/.test(n)) return "card";
  if (/plate|platenumber|plateNumber|plate_number/.test(n)) return "plate";
  if (/motorplate|motorcycle/.test(n)) return "motorPlate";
  if (/otp|verifycode|verificationcode|smsCode/.test(n)) return "otp";
  if (/birth|birthdate|birthDate/.test(n)) return "birthDate";
  if (type === "enum") return "select";
  if (type === "integer" || type === "number") return "number";
  if (type === "boolean") return "boolean";
  return "text";
}

function persianLabel(name, description = "") {
  const map = {
    nid: "کد ملی",
    nationalCode: "کد ملی",
    nationalId: "کد ملی",
    user: "کد ملی / شناسه",
    mobile: "شماره موبایل",
    mobileNumber: "شماره موبایل",
    birthDate: "تاریخ تولد",
    birthDay: "تاریخ تولد",
    fullName: "نام کامل",
    firstName: "نام",
    lastName: "نام خانوادگی",
    fatherName: "نام پدر",
    gender: "جنسیت",
    iban: "شماره شبا",
    card: "شماره کارت",
    deposit: "شماره حساب",
    plateNumber: "شماره پلاک",
    plateNo: "شماره پلاک",
    sayadId: "شناسه صیاد",
    serialNo: "سریال",
    otp: "کد تایید",
    amount: "مبلغ",
    postalCode: "کد پستی",
    companyNationalId: "شناسه ملی شرکت",
    legalId: "شناسه حقوقی",
    type: "نوع",
    parameter: "پارامتر استعلام",
    secondParameter: "پارامتر دوم",
    requestId: "شناسه درخواست",
    offenseId: "شناسه تخلف",
    licenseNumber: "شماره گواهینامه",
    message: "متن پیامک",
    destination: "مقصد",
    trackId: "کد پیگیری",
  };
  if (map[name]) return map[name];
  // first line of persian description often useful
  const first = (description || "").split("\n")[0].replace(/[#*|]/g, "").trim();
  if (first && first.length < 60 && /[\u0600-\u06FF]/.test(first)) return first;
  return name;
}

const services = [];
const categoriesMap = new Map();

for (const [apiPath, methods] of Object.entries(spec.paths || {})) {
  for (const [method, rawOp] of Object.entries(methods)) {
    if (!rawOp || typeof rawOp !== "object" || !rawOp.operationId) continue;
    if (EXCLUDE_IDS.has(rawOp.operationId)) continue;

    const tag = (rawOp.tags || [])[0];
    const cat = TAG_TO_CATEGORY[tag];
    if (!cat) continue; // skip token / unknown

    const desc = rawOp.description || "";
    const scope = extractScope(desc);
    const grantType = extractGrant(desc);

    const fields = [];
    for (const rawParam of rawOp.parameters || []) {
      const p = deref(rawParam);
      if (!p?.name || HIDDEN_PARAMS.has(p.name)) continue;
      if (p.in === "header") continue;
      const type = schemaType(p.schema);
      const kind = fieldKind(p.name, type, p.description || "");
      fields.push({
        name: p.name,
        in: p.in,
        required: !!p.required,
        kind,
        label: persianLabel(p.name, p.description || ""),
        maxLength: p.schema?.maxLength,
        enum: Array.isArray(p.schema?.enum)
          ? p.schema.enum.map((x) => String(x))
          : undefined,
        placeholder:
          p.example !== undefined && p.example !== null ? String(p.example) : undefined,
      });
    }

    if (rawOp.requestBody?.content) {
      const content =
        rawOp.requestBody.content["application/json"] ||
        rawOp.requestBody.content["multipart/form-data"] ||
        Object.values(rawOp.requestBody.content)[0];
      let schema = deref(content?.schema);
      if (schema?.properties) {
        for (const [name, sRaw] of Object.entries(schema.properties)) {
          if (HIDDEN_PARAMS.has(name)) continue;
          const s = deref(sRaw);
          const type = schemaType(s);
          const kind = fieldKind(name, type, s.description || "");
          fields.push({
            name,
            in: "body",
            required: (schema.required || []).includes(name),
            kind,
            label: persianLabel(name, s.description || ""),
            maxLength: s.maxLength,
            enum: Array.isArray(s.enum) ? s.enum.map((x) => String(x)) : undefined,
            placeholder:
              s.example !== undefined && s.example !== null
                ? String(s.example)
                : undefined,
          });
        }
      }
    }

    // Infer flow type
    let flow = "generic";
    if (grantType === "authorization_sms") flow = "otp";
    else if (fields.some((f) => f.kind === "file")) flow = "upload";
    else if (fields.some((f) => f.kind === "plate" || f.kind === "motorPlate")) flow = "plate";
    else if (/transaction-credit-inquiry|transactionCredit/i.test(rawOp.operationId + apiPath))
      flow = "custom";

    // response field hints from example
    let responseFields = [];
    const ok = rawOp.responses?.["200"]?.content?.["application/json"];
    const example = ok?.example?.result || ok?.example;
    if (example && typeof example === "object" && !Array.isArray(example)) {
      responseFields = Object.keys(example)
        .filter((k) => typeof example[k] !== "object")
        .slice(0, 12)
        .map((k) => ({ key: k, label: persianLabel(k) }));
    }

    const id = rawOp.operationId
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/_/g, "-")
      .toLowerCase();

    const service = {
      id,
      operationId: rawOp.operationId,
      title: rawOp.summary || rawOp.operationId,
      category: cat.id,
      icon: cat.icon,
      grantType,
      scope: scope || "",
      method: method.toUpperCase(),
      path: apiPath,
      flow,
      fields,
      responseFields,
    };

    services.push(service);
    if (!categoriesMap.has(cat.id)) categoriesMap.set(cat.id, cat);
  }
}

// Deduplicate by id
const seen = new Set();
const unique = [];
for (const s of services) {
  if (seen.has(s.id)) continue;
  seen.add(s.id);
  unique.push(s);
}

const categories = [...categoriesMap.values()];

const outTs = `/* eslint-disable */
/** Auto-generated from Finnotech OpenAPI — do not edit by hand. Re-run scripts/generate-catalog.js */
import type { FinnotechService, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = ${JSON.stringify(categories, null, 2)};

export const finnotechServices: FinnotechService[] = ${JSON.stringify(unique, null, 2)};

export function getServiceById(id: string): FinnotechService | undefined {
  return finnotechServices.find((s) => s.id === id || s.operationId === id);
}

export function getServicesByCategory(categoryId: string): FinnotechService[] {
  return finnotechServices.filter((s) => s.category === categoryId);
}
`;

const outDir = path.join(__dirname, "..", "src", "lib", "finnotech");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "catalog.generated.ts"), outTs);
fs.writeFileSync(
  path.join(__dirname, "..", "finnotech-catalog-meta.json"),
  JSON.stringify(
    {
      count: unique.length,
      byCategory: Object.fromEntries(
        categories.map((c) => [c.id, unique.filter((s) => s.category === c.id).length])
      ),
    },
    null,
    2
  )
);

console.log("generated", unique.length, "services");
console.log(
  Object.fromEntries(
    categories.map((c) => [c.id, unique.filter((s) => s.category === c.id).length])
  )
);

import type { IconKey } from "@/src/lib/constants/icons";
import type { FinnotechService, ServiceField } from "./types";

export type CompositeKind =
  /** OAuth SMS authorize → verify → call final service with SMS token */
  | "sms_auth"
  /** Call requestService → user enters OTP → call verifyService (maps challenge/track ids) */
  | "service_otp"
  /** Call submitService → extract id → poll/inquiryService until done or once */
  | "async_result";

export type CompositeDef = {
  id: string;
  title: string;
  category: string;
  icon: IconKey;
  kind: CompositeKind;
  /** Service ids from generated catalog */
  steps: {
    /** primary / submit / otp-request */
    primary: string;
    /** verify / poll / report */
    secondary?: string;
    /** optional third (e.g. credit report) */
    tertiary?: string;
  };
  /** Extra UI-only fields (e.g. mobile for SMS auth when API has no mobile) */
  extraFields?: ServiceField[];
  /** Where to read continuation ids from primary result */
  mapFromResult?: Record<string, string>; // targetParam <- resultKey
  listable?: boolean;
};

export const COMPOSITE_DEFS: CompositeDef[] = [
  {
    id: "transaction-credit-inquiry",
    title: "استعلام اعتبار معاملاتی",
    category: "credit",
    icon: "shieldCheck",
    kind: "service_otp",
    steps: {
      primary: "kyc-transaction-credit-inquiry-request-get",
      secondary: "kyc-transaction-credit-inquiry-verify-post",
      tertiary: "kyc-transaction-credit-inquiry-report-get",
    },
    mapFromResult: { inquiryTrackId: "inquiryTrackId" },
  },
  {
    id: "billing-async-inquiry",
    title: "استعلام قبض (ناهمگام)",
    category: "billing",
    icon: "bolt",
    kind: "async_result",
    steps: {
      primary: "billing-inquiry-request-submit",
      secondary: "billing-inquiry-status-poll",
    },
    mapFromResult: { requestId: "requestId" },
  },
  {
    id: "credit-assessment-report",
    title: "گزارش اعتباری",
    category: "credit",
    icon: "chart",
    kind: "sms_auth",
    steps: {
      primary: "credit-v2-clients-client-id-assessment-submit-json-post-submit-post",
      secondary: "credit-v2-clients-client-id-assessment-inquiry-get-inquiry-get",
    },
    mapFromResult: { assessmentId: "assessmentId" },
  },
  {
    id: "credit-assessment-report-cc",
    title: "گزارش اعتباری (بدون پیامک)",
    category: "credit",
    icon: "chart",
    kind: "async_result",
    steps: {
      primary: "credit-v2-clients-client-id-cc-assessment-submit-json-post-submit-post",
      secondary: "credit-v2-clients-client-id-assessment-inquiry-get-inquiry-get",
    },
    mapFromResult: { assessmentId: "assessmentId" },
  },
  {
    id: "kyb-corporate-journal",
    title: "احراز امضای روزنامه رسمی",
    category: "kyb",
    icon: "folder",
    kind: "async_result",
    steps: {
      primary: "kyb-corporate-journal-submit",
      secondary: "kyb-corporate-journal-inquiry",
    },
    mapFromResult: { requestId: "requestId" },
  },
  {
    id: "messaging-otp",
    title: "رمز یکبار مصرف (ارسال و تایید)",
    category: "sms",
    icon: "messages",
    kind: "service_otp",
    steps: {
      primary: "messaging-otp-initiate-post",
      secondary: "messaging-otp-verify-post",
    },
    mapFromResult: { traceId: "traceId" },
  },
  {
    id: "digital-sign-enroll",
    title: "ثبت‌نام گواهی امضای دیجیتال",
    category: "signature",
    icon: "shieldNote",
    kind: "service_otp",
    steps: {
      primary: "sign-digital-sign-otp-request-post",
      secondary: "sign-digital-sign-enroll-post",
    },
    mapFromResult: { challengeId: "challengeId", otp: "otp" },
  },
  {
    id: "promissory-sign",
    title: "امضای سفته الکترونیکی",
    category: "promissory",
    icon: "letter",
    kind: "service_otp",
    steps: {
      primary: "promissory-sign-otp-request-post",
      secondary: "promissory-sign-post",
    },
    mapFromResult: { challengeId: "challengeId" },
  },
];

/** Step service ids that should not appear as separate tiles when covered by a composite. */
export const COMPOSITE_HIDDEN_STEPS = new Set(
  COMPOSITE_DEFS.flatMap((c) =>
    [c.steps.primary, c.steps.secondary, c.steps.tertiary].filter(Boolean) as string[]
  )
);

export function getCompositeById(id: string): CompositeDef | undefined {
  return COMPOSITE_DEFS.find((c) => c.id === id);
}

export function compositeAsListItem(def: CompositeDef): FinnotechService {
  return {
    id: def.id,
    operationId: `composite:${def.id}`,
    title: def.title,
    category: def.category,
    icon: def.icon,
    grantType: def.kind === "sms_auth" ? "authorization_sms" : "client_credentials",
    scope: "",
    method: "POST",
    path: "",
    flow: "custom",
    fields: [],
    responseFields: [],
    listable: def.listable !== false,
  };
}

import type { IconKey } from "@/src/lib/constants/icons";

export type GrantType = "client_credentials" | "authorization_sms";

export type FieldKind =
  | "text"
  | "number"
  | "nationalCode"
  | "mobile"
  | "iban"
  | "card"
  | "plate"
  | "motorPlate"
  | "birthDate"
  | "otp"
  | "select"
  | "boolean"
  | "file";

export type FieldIn = "path" | "query" | "body";

export type ServiceField = {
  name: string;
  in: FieldIn;
  required: boolean;
  kind: FieldKind;
  label: string;
  maxLength?: number;
  enum?: string[];
  placeholder?: string;
};

export type ResponseField = { key: string; label: string };

export type ServiceFlow = "generic" | "otp" | "plate" | "upload" | "custom";

export type FinnotechService = {
  id: string;
  operationId: string;
  title: string;
  category: string;
  icon: IconKey;
  grantType: GrantType;
  scope: string;
  method: string;
  path: string;
  flow: ServiceFlow;
  fields: ServiceField[];
  responseFields: ResponseField[];
  /** If false, hide from Services grid (sub-steps of multi-step flows). */
  listable?: boolean;
};

export type ServiceCategory = {
  id: string;
  title: string;
  icon: IconKey;
};

export type FinnotechResult = {
  ok: boolean;
  trackId?: string;
  result?: unknown;
  responseCode?: string;
  error?: string;
  status?: number;
};

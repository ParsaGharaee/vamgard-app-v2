"use client";
import { ReceiptText } from "lucide-react";
import { BaseNumericInput } from "./BaseNumericInput";

export type BillType =
  | "Water"
  | "Electricity"
  | "Electricity-support"
  | "Electricity-standard"
  | "Gas"
  | "GasByBillId";

export const isValidBillParameter = (val: string) => /^\d{6,13}$/.test(val);

const DEFAULT_META = { label: "شناسه قبض", placeholder: "مثال: 9030635704127" };

const BILL_LABELS: Record<BillType, { label: string; placeholder: string }> = {
  Water: { label: "شناسه قبض آب", placeholder: "مثال: 9030635704127" },
  Electricity: { label: "شناسه قبض برق", placeholder: "مثال: 3375845754" },
  "Electricity-support": { label: "شناسه قبض برق (پشتیبان)", placeholder: "مثال: 3375845754" },
  "Electricity-standard": { label: "شناسه قبض برق (پشتیبان)", placeholder: "مثال: 3375845754" },
  Gas: { label: "شماره اشتراک گاز", placeholder: "مثال: 02177689361" },
  GasByBillId: { label: "شماره قبض گاز", placeholder: "مثال: 931564121146" },
};

export const BillParameterInput = ({
  billType = "Water",
  value,
  onChange,
  showErrors,
}: {
  billType?: BillType;
  value: string;
  onChange: (v: string) => void;
  showErrors?: boolean;
}) => {
  const { label, placeholder } = BILL_LABELS[billType] ?? DEFAULT_META;
  const valid = isValidBillParameter(value);
  const errorMsg =
    showErrors && !valid ? `${label} باید بین ۶ تا ۱۳ رقم باشد.` : "";

  return (
    <BaseNumericInput
      label={label}
      icon={ReceiptText}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={13}
      isValid={valid}
      error={errorMsg}
    />
  );
};
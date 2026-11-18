import type { ReactNode } from "react";

export const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-center justify-between border-b border-line/10 py-3.5 text-sm last:border-0">
    <span className="text-silver">{label}</span>
    <span className="font-bold text-ink text-left" dir="auto">{value}</span>
  </div>
);

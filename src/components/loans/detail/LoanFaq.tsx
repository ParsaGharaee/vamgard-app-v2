"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/src/components/ui/Card";

export function LoanFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Card className="mx-4 divide-y divide-line/10 px-4">
      {items.map((f, i) => (
        <div key={f.q}>
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 py-3.5 text-right">
            <span className="text-sm font-bold">{f.q}</span>
            <ChevronDown size={18} className={`shrink-0 text-silver transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <p className="pb-4 text-xs leading-7 text-silver">{f.a}</p>}
        </div>
      ))}
    </Card>
  );
}
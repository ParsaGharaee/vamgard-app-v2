"use client";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type SectionProps = { title: string; link?: string; onLink?: () => void; icon?: ReactNode };

export const Section = ({ title, link, onLink, icon }: SectionProps) => (
  <div className="mb-3 mt-6 flex items-center justify-between px-5">
    <h2 className="flex items-center gap-2 text-[17px] font-extrabold">{icon ?? <span className="h-2 w-2 rounded-full bg-brand" />}{title}</h2>
    {link && <button onClick={onLink} className="flex items-center gap-1 text-sm font-bold text-brand"><ArrowLeft size={16} />{link}</button>}
  </div>
);

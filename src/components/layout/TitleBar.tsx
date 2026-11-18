"use client";
import { ScreenProps } from "@/src/types/navigation";
import { ChevronLeft } from "lucide-react";

export const TitleBar = ({ title, go }: { title: string; go: ScreenProps["go"] }) => (
  <div className="mx-5 mt-4 flex items-center justify-between">
    <h1 className="text-xl font-extrabold">{title}</h1>
    <button onClick={() => go("home")} aria-label="بازگشت" className="surface grid h-10 w-10 place-items-center rounded-full text-silver">
      <ChevronLeft size={22} />
    </button>
  </div>
);

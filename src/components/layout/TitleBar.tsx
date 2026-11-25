"use client";
import { ScreenProps } from "@/src/types/navigation";
import { ChevronLeft } from "lucide-react";

export const TitleBar = ({ title, go }: { title: string; go: ScreenProps["go"] }) => (
  <div className="mx-5 mt-4 flex items-center justify-between">
    <h1 className="text-xl font-extrabold">{title}</h1>
  </div>
);

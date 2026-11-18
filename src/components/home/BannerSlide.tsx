"use client";
import { ArrowLeft } from "lucide-react";

import { banners } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { Ic, LottieSlot } from "../ui";

type BannerSlideProps = { k: number; go: ScreenProps["go"]; onDot?: (k: number) => void };

export function BannerSlide({ k, go, onDot }: BannerSlideProps) {
  const b = banners[k];
  return (
    <div className="banner select-none overflow-hidden rounded-[28px] p-5 h-[175px] flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="flex-1 text-right">
          <div className="text-[17px] font-extrabold leading-7 line-clamp-2">{b.t}</div>
          <div className="mt-1 text-xs text-ink/80 line-clamp-1">{b.s}</div>
          <button onClick={() => go(b.to)} className="banner-btn mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold">{b.b}<ArrowLeft size={14} /></button>
        </div>
        <div className="grid h-28 w-28 shrink-0 place-items-center drop-shadow-[0_10px_16px_rgba(0,0,0,.35)]">
          {b.lottie
            ? <LottieSlot name={b.lottie} size={112} fallback={<Ic n={b.ic} size={96} />} />
            : <Ic n={b.ic} size={96} />}
        </div>
      </div>
      <div className="mx-auto mt-1 flex w-fit gap-1.5 rounded-full bg-ink/10 px-2 py-1.5">
        {banners.map((_, j) => (
          <button
            key={j}
            onClick={() => onDot?.(j)}
            aria-label={`بنر ${j + 1}`}
            className={`h-2 w-2 rounded-full ${j === k ? "bg-brand" : "bg-ink/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

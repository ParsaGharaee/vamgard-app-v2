"use client";
import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const lottieCache = new Map<string, object | null>();

type LottieSlotProps = { name: string; size: number; fallback?: ReactNode; loop?: boolean };

/** لوتی از public/lottie/{name}.json لود می‌شود؛ اگر نبود fallback نمایش داده می‌شود */
export function LottieSlot({ name, size, fallback = null, loop = true }: LottieSlotProps) {
  const [data, setData] = useState<object | null>(lottieCache.get(name) ?? null);
  useEffect(() => {
    if (lottieCache.has(name)) { setData(lottieCache.get(name) ?? null); return; }
    let on = true;
    fetch(`/lottie/${name}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => { lottieCache.set(name, d); if (on) setData(d); });
    return () => { on = false; };
  }, [name]);
  if (!data) return <>{fallback}</>;
  return <Lottie animationData={data} loop={loop} style={{ width: size, height: size }} />;
}

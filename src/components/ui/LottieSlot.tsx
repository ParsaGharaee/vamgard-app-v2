"use client";
import type { ComponentType, ReactNode } from "react";
import dynamic from "next/dynamic";

type LottieProps = {
  src: string | object;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

const Lottie = dynamic(
  () => import("lottie-react").then((m) => m.Lottie as ComponentType<LottieProps>),
  { ssr: false },
);

type LottieSlotProps = {
  name: string;
  size: number;
  fallback?: ReactNode;
  loop?: boolean;
  /** When false, show fallback (used while tab is hidden) */
  play?: boolean;
};

/** لوتی از public/lottie/{name}.json با autoplay — برای WebView ضروری است */
export function LottieSlot({
  name,
  size,
  fallback = null,
  loop = true,
  play = true,
}: LottieSlotProps) {
  if (!play) return <>{fallback}</>;

  return (
    <Lottie
      key={`${name}-on`}
      src={`/lottie/${name}.json`}
      loop={loop}
      autoplay
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

"use client";
import { useLayoutEffect, useRef, useState } from "react";

/** متن تک‌خطی؛ اگر از کادر بیرون بزند تا انتها اسکرول می‌شود و دوباره از اول شروع می‌کند */
export function MarqueeText({ children, className = "" }: { children: string; className?: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current || !txt.current) return;
      const over = txt.current.scrollWidth - box.current.clientWidth;
      const rtl = getComputedStyle(box.current).direction === "rtl";
      setShift(over > 1 ? (rtl ? over : -over) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [children]);

  const moving = shift !== 0;
  return (
    <span ref={box} className={`block w-full overflow-hidden whitespace-nowrap ${moving ? "text-start" : "text-center"} ${className}`}>
      <span
        ref={txt}
        className={`inline-block ${moving ? "svc-marquee" : ""}`}
        style={moving ? ({ "--shift": `${shift}px`, animationDuration: `${3 + Math.abs(shift) / 18}s` } as React.CSSProperties) : undefined}
      >
        {children}
      </span>
    </span>
  );
}
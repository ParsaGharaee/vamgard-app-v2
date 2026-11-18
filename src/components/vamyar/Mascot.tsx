"use client";
import { useEffect, useRef } from "react";

export function Mascot({ size = 72 }: { size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const pg = useRef<SVGGElement>(null);

  useEffect(() => {
    let last = 0, px = 0, py = 0, raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const set = (x: number, y: number) => {
      x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10;
      if (x === px && y === py) return;
      px = x; py = y;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { if (pg.current) pg.current.style.transform = `translate(${x * 4}px, ${y * 4}px)`; });
    };
    const aim = (cx: number, cy: number) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 120);
      set((dx / d) * k, (dy / d) * k);
    };
    const onMouse = (e: MouseEvent) => aim(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) aim(t.clientX, t.clientY); };
    const onScroll = (e: Event) => {
      const t = e.target as HTMLElement | Document;
      const y = t instanceof HTMLElement ? t.scrollTop : window.scrollY;
      if (y === last) return;
      set(0, y > last ? 1 : -1);
      last = y;
      clearTimeout(timer);
      timer = setTimeout(() => set(0, 0), 700);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      clearTimeout(timer); cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="mb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#087BFF" /><stop offset="1" stopColor="#00CFFF" /></linearGradient>
      </defs>
      <rect x="11" y="18" width="78" height="68" rx="30" fill="url(#mb)" />
      <ellipse cx="32" cy="27" rx="14" ry="5" fill="#fff" opacity=".25" />
      <rect x="21" y="30" width="58" height="42" rx="21" fill="#060C1B" />
      {[38, 62].map((cx) => <ellipse key={cx} cx={cx} cy="49" rx="9" ry="10" fill="#fff" className="eye-blink" />)}
      <g ref={pg} style={{ transition: "transform .15s ease-out" }}>
        {[38, 62].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="49" r="5" fill="#060C1B" />
            <circle cx={cx - 1.8} cy="46.8" r="1.6" fill="#fff" />
          </g>
        ))}
      </g>
    </svg>
  );
}

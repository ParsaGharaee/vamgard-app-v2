"use client";
import { useEffect, useRef, useState } from "react";
import { BannerSlide } from "./BannerSlide";
import { banners } from "./data";
import { ScreenProps } from "@/src/types/navigation";

export function BannerDeck({ go }: ScreenProps) {
  const [i, setI] = useState(3);
  const [dx, setDx] = useState(0);
  const [fly, setFly] = useState<0 | 1 | -1>(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const captured = useRef(false);
  const dragRef = useRef(false);
  const busy = useRef(false);
  const n = banners.length;

  const fling = (d: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setFly(d);
    setTimeout(() => { setI((x) => (x + 1) % n); setFly(0); setDx(0); busy.current = false; }, 280);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (!dragRef.current) fling(-1);
    }, 4000);
    return () => clearTimeout(t);
  }, [i]);

  const down = (e: React.PointerEvent) => { startX.current = e.clientX; captured.current = false; dragRef.current = true; setDragging(true); };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current == null || busy.current) return;
    const d = e.clientX - startX.current;
    if (!captured.current && Math.abs(d) > 6) { e.currentTarget.setPointerCapture(e.pointerId); captured.current = true; }
    if (captured.current) setDx(d);
  };
  const up = () => {
    if (startX.current == null) return;
    const d = dx;
    startX.current = null; dragRef.current = false; setDragging(false);
    if (Math.abs(d) > 70) fling(d > 0 ? 1 : -1); else setDx(0);
  };

  const prog = Math.min(1, (fly ? 1 : Math.abs(dx) / 160));
  const front: React.CSSProperties = {
    transform: fly ? `translateX(${fly * 110}%) rotate(${fly * 14}deg)` : `translateX(${dx}px) rotate(${dx / 18}deg)`,
    opacity: fly ? 0 : 1,
    transition: dragging ? "none" : "transform .28s ease-out, opacity .28s ease-out",
    touchAction: "pan-y",
  };

  return (
    <div className="mt-4 overflow-x-clip py-6 -my-6">
      <div className="relative mx-4 grid">
        <div
          className="pointer-events-none col-start-1 row-start-1"
          style={{
            transform: `translateY(${10 - prog * 10}px) scale(${0.92 + prog * 0.08})`,
            opacity: 0.6 + prog * 0.4,
            transition: dragging ? "none" : "all .28s ease-out",
          }}
        >
          <BannerSlide k={(i + 1) % n} go={go} />
        </div>

        <div
          key={i}
          className="col-start-1 row-start-1 z-10"
          style={front}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <BannerSlide k={i} go={go} onDot={setI} />
        </div>
      </div>
    </div>
  );
}

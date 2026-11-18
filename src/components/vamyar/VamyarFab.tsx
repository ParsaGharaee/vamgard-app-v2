
"use client";
import { useEffect, useState } from "react";
import { Mascot } from "./Mascot";

/** دکمه شناور ماسکوت وام‌یار + حباب سلام */
export function VamyarFab({ onOpen }: { onOpen: () => void }) {
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-[85px] left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-4 pointer-events-none">
      <div className="absolute bottom-0 right-4 flex items-end gap-2 pointer-events-auto">
        <button
          onClick={() => {
            onOpen();
            setHint(false);
          }}
          aria-label="وام‌یار"
          className="mascot-float shrink-0 drop-shadow-[0_8px_16px_rgba(8,123,255,.45)]"
        >
          <Mascot size={62} />
        </button>

        {hint && (
          <div className="pop mb-6 whitespace-nowrap rounded-2xl rounded-br-none bg-ink px-3 py-1.5 text-xs font-bold text-bg">
            سلام! من وام‌یارم 👋
          </div>
        )}
      </div>
    </div>
  );
}

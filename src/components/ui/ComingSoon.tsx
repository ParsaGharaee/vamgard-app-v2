"use client";

/** Soft blur overlay with «به‌زودی» pill — wrap a section or place as absolute child. */
export function ComingSoonOverlay({ label = "به‌زودی", className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] bg-bg/40 backdrop-blur-[6px] ${className}`}
      aria-label={label}
    >
      <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-brand/40">
        {label}
      </span>
    </div>
  );
}

export function ComingSoonBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-black text-white ${className}`}>
      به‌زودی
    </span>
  );
}

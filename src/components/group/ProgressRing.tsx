import { fa } from "@/src/lib/format";

export const ProgressRing = ({ p, size = 68 }: { p: number; size?: number }) => {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-tile" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(c * p) / 100} ${c}`} className="stroke-brand" />
      </svg>
      <span className="absolute text-sm font-extrabold">٪{fa(p)}</span>
    </div>
  );
};

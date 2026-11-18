export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-a absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/35 blur-3xl" />
      <div className="aurora-b absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="aurora-a absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#7C3AED]/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgb(var(--line)/0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
    </div>
  );
}
export default function VamGardLogo({ className = "" }: { className?: string }) {
  return (
    <div dir="rtl" aria-label="وام‌گرد" className={`inline-flex items-center font-vazirmatn text-[24px] font-black leading-none ${className}`}>
      <span className="bg-gradient-to-l from-[#21C6B5] via-[#16AFAF] to-[#1688D8] bg-clip-text text-transparent">وام</span>
      <span className="dark:text-white text-ink">‌گرد</span>
    </div>
  );
}

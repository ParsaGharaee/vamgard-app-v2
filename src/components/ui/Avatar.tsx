export const Avatar = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className="rounded-full bg-[#cfe0f5]">
    <circle cx="20" cy="17" r="8" fill="#e0a982" /><path d="M12 15c0-8 16-8 16 0-3-3-13-3-16 0z" fill="#2b2118" />
    <path d="M13 21c2 9 12 9 14 0-1 6-13 6-14 0z" fill="#2b2118" /><path d="M5 40c2-10 28-10 30 0z" fill="#27415f" />
  </svg>
);

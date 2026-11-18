export const BrandMark = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#087BFF" /><stop offset="1" stopColor="#00CFFF" /></linearGradient></defs>
    <circle cx="24" cy="24" r="18" fill="none" stroke="url(#lg)" strokeWidth="6" strokeDasharray="95 20" strokeLinecap="round" />
    <circle cx="24" cy="24" r="6" fill="#087BFF" />
  </svg>
);

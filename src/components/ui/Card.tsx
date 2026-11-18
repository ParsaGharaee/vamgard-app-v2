import type { ReactNode } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`surface rounded-3xl ${className}`}>{children}</div>
);

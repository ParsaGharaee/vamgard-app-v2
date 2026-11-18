import type { ReactNode } from "react";
import { Card } from "../../ui";

export const ResultCard = ({ children, title }: { children: ReactNode; title?: string }) => (
  <Card className="p-4 mt-4 border border-line/5 shadow-sm">
    {title && <div className="text-[15px] font-extrabold mb-3">{title}</div>}
    {children}
  </Card>
);

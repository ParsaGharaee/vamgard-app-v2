import { IconKey, ICONS } from "@/src/lib/constants/icons";
import Image from "next/image";

export const Ic = ({ n, size = 32, className = "" }: { n: IconKey; size?: number; className?: string }) => (
  <Image src={`/icons/${ICONS[n]}`} alt="" width={size * 2} height={size * 2} style={{ width: size, height: size }} className={`shrink-0 object-contain ${className}`} />
);

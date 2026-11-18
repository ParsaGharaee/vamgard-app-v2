import { BankKey, BANKS } from "@/src/lib/constants/banks";
import Image from "next/image";

export const Bank = ({ k, size = 44 }: { k: BankKey; size?: number }) => (
  <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
    <Image src={`/banks/${BANKS[k].f}`} alt={BANKS[k].n} width={size * 2} height={size * 2} className="h-full w-full object-contain" />
  </span>
);

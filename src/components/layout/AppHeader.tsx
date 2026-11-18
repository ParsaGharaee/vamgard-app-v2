import Image from "next/image";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import VamGardLogo from "../brand/VamGardLogo";

export function AppHeader() {
  return (
    <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-line/10 bg-bg/80 px-5 pb-3 pt-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image src="/icons/vamgard.png" width={35} height={35} alt="vamgard" />
        <VamGardLogo />
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="جستجو"><Search size={26} /></button>
        <ThemeToggle />
      </div>
    </header>
  );
}

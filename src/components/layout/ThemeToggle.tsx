"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => { setT(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const v = t === "dark" ? "light" : "dark";
    setT(v);
    document.documentElement.dataset.theme = v;
    try { localStorage.setItem("theme", v); } catch {}
  };
  return (
    <button dir="ltr" onClick={flip} role="switch" aria-checked={t === "dark"} aria-label="تغییر تم"
      className="surface relative h-8 w-[58px] shrink-0 rounded-full">
      <Sun size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-500" />
      <Moon size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-silver" />
      <span className={`absolute left-0.5 top-0.5 grid h-7 w-7 place-items-center rounded-full shadow transition-transform duration-300 ease-out ${t === "dark" ? "translate-x-[26px] bg-brand text-white" : "translate-x-0 bg-white text-amber-500"}`}>
        {t === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}

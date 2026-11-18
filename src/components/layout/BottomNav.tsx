"use client";
import { Tab } from "@/src/types/navigation";
import { Home, LayoutGrid, Landmark, Users, User } from "lucide-react";

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "خانه", Icon: Home },
  { id: "services", label: "خدمات", Icon: LayoutGrid },
  { id: "loans", label: "وام‌ها", Icon: Landmark },
  { id: "group", label: "خرید گروهی", Icon: Users },
  { id: "profile", label: "پروفایل", Icon: User },
];

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const idx = tabs.findIndex((x) => x.id === tab);
  return (
    <nav dir="ltr" className="navglass fixed inset-x-3 bottom-4 z-40 mx-auto grid max-w-[410px] grid-cols-5 rounded-[30px] p-1.5">
      <span aria-hidden className="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/5)] rounded-[22px] bg-brand/15 transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.5,1)]"
        style={{ transform: `translateX(${idx * 100}%)` }} />
      {tabs.map(({ id, label, Icon }) => {
        const on = tab === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={`relative z-10 flex flex-col items-center gap-0.5 py-2 text-[10.5px] transition-colors duration-200 ${on ? "font-bold text-brand" : "text-silver"}`}>
            <Icon size={22} strokeWidth={on ? 2.4 : 1.8} className={`transition-transform duration-300 ${on ? "-translate-y-0.5 scale-110" : ""}`} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

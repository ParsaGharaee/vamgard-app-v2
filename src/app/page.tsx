"use client";
import { useEffect, useState } from "react";
import { Home, LayoutGrid, Landmark, Users, User } from "lucide-react";
import { AppHeader, GroupScreen, HomeScreen, LoansScreen, Mascot, ProfileScreen, ServicesScreen, Tab, VamyarSheet } from "../components/Screens";

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "خانه", Icon: Home },
  { id: "services", label: "خدمات", Icon: LayoutGrid },
  { id: "loans", label: "وام‌ها", Icon: Landmark },
  { id: "group", label: "خرید گروهی", Icon: Users },
  { id: "profile", label: "پروفایل", Icon: User },
];

export default function Page() {
  const [tab, setTab] = useState<Tab>("home");
  const [chat, setChat] = useState(false);
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 6000); return () => clearTimeout(t); }, []);
  const idx = tabs.findIndex((x) => x.id === tab);


  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <AppHeader />
      <main key={tab} className="flex-1 overflow-y-auto pb-36 no-scrollbar">
        {tab === "home" && <HomeScreen go={setTab} />}
        {tab === "services" && <ServicesScreen go={setTab} />}
        {tab === "loans" && <LoansScreen go={setTab} />}
        {tab === "group" && <GroupScreen go={setTab} />}
        {tab === "profile" && <ProfileScreen go={setTab} />}
      </main>

    {!chat && (
  <div className="absolute bottom-[85px] right-4 z-30 flex items-end gap-2">
    <button
      onClick={() => {
        setChat(true);
        setHint(false);
      }}
      aria-label="وام‌یار"
      className="mascot-float shrink-0 drop-shadow-[0_8px_16px_rgba(8,123,255,.45)]"
    >
      <Mascot size={62} />
    </button>

    {hint && (
      <div className="pop mb-6 whitespace-nowrap rounded-2xl rounded-br-none bg-ink px-3 py-1.5 text-xs font-bold text-bg">
        سلام! من وام‌یارم 👋
      </div>
    )}
  </div>
)}

      {/* نویگیشن شناور شیشه‌ای */}
      <nav dir="ltr" className="navglass fixed inset-x-3 bottom-4 z-40 mx-auto grid max-w-[410px] grid-cols-5 rounded-[30px] p-1.5">
  <span aria-hidden className="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/5)] rounded-[22px] bg-brand/15 transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.5,1)]"
    style={{ transform: `translateX(${idx * 100}%)` }} />
  {tabs.map(({ id, label, Icon }) => {
    const on = tab === id;
    return (
      <button key={id} onClick={() => setTab(id)}
        className={`relative z-10 flex flex-col items-center gap-0.5 py-2 text-[10.5px] transition-colors duration-200 ${on ? "font-bold text-brand" : "text-silver"}`}>
        <Icon size={22} strokeWidth={on ? 2.4 : 1.8} className={`transition-transform duration-300 ${on ? "-translate-y-0.5 scale-110" : ""}`} />
        {label}
      </button>
    );
  })}
</nav>

      {chat && <VamyarSheet onClose={() => setChat(false)} />}
    </div>
  );
}
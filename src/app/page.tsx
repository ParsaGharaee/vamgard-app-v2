"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tab } from "../types/navigation";
import { AppHeader } from "../components/layout/AppHeader";
import { HomeScreen } from "../components/home/HomeScreen";
import { ServicesScreen } from "../components/services/ServicesScreen";
import { LoansScreen } from "../components/loans/LoansScreen";
// import { GroupScreen } from "../components/group/GroupScreen";
import { ProfileScreen } from "../components/profile/ProfileScreen";
import { VamyarFab } from "../components/vamyar/VamyarFab";
import { BottomNav } from "../components/layout/BottomNav";

const VALID_TABS: Tab[] = ["home", "services", "loans", "group", "profile"];

function AppShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chat] = useState(false);

  const paramTab = searchParams.get("tab") as Tab | null;
  const tab: Tab = paramTab && VALID_TABS.includes(paramTab) ? paramTab : "home";

  const handleTabChange = (nextTab: Tab) => {
    if (nextTab !== tab) {
      try {
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          navigator.vibrate(18);
        }
      } catch {}
    }
    const url = nextTab === "home" ? "/" : `/?tab=${nextTab}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="app-bg fixed inset-0 mx-auto flex h-[100dvh] max-w-[430px] flex-col overflow-hidden sm:border-x sm:border-line/10">
      <AppHeader tab={tab} go={handleTabChange} />
      <main
        key={tab}
        className="mt-16 flex-1 overflow-y-auto overscroll-y-contain pb-36 no-scrollbar"
      >
        {tab === "home" && <HomeScreen go={handleTabChange} />}
        {tab === "services" && <ServicesScreen go={handleTabChange} />}
        {tab === "loans" && <LoansScreen go={handleTabChange} />}
        {/* {tab === "group" && <GroupScreen go={handleTabChange} />} */}
        {tab === "profile" && <ProfileScreen go={handleTabChange} />}
      </main>

      {!chat && <VamyarFab onOpen={() => router.push("/vamyar")} />}

      <BottomNav tab={tab} onChange={handleTabChange} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="app-bg h-[100dvh]" />}>
      <AppShell />
    </Suspense>
  );
}
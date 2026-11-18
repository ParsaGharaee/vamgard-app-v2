"use client";
import { useState } from "react";
import { Tab } from "../types/navigation";
import { AppHeader } from "../components/layout/AppHeader";
import { HomeScreen } from "../components/home/HomeScreen";
import { ServicesScreen } from "../components/services/ServicesScreen";
import { LoansScreen } from "../components/loans/LoansScreen";
import { GroupScreen } from "../components/group/GroupScreen";
import { ProfileScreen } from "../components/profile/ProfileScreen";
import { VamyarFab } from "../components/vamyar/VamyarFab";
import { BottomNav } from "../components/layout/BottomNav";
import { useRouter } from "next/navigation";


export default function Page() {
  const [tab, setTab] = useState<Tab>("home");
  const [chat, setChat] = useState(false);
  const router = useRouter();

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

      {!chat && <VamyarFab onOpen={() => router.push("/vamyar")} />}

      <BottomNav tab={tab} onChange={setTab} />

    </div>
  );
}

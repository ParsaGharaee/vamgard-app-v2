"use client";
import { useEffect, useState } from "react";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { loadSession, saveSession, type AppUser } from "@/src/lib/session";
import { ComingSoonBadge } from "@/src/components/ui/ComingSoon";

const TITLES: Record<string, string> = {
  personal: "اطلاعات شخصی",
  financial: "اطلاعات مالی",
  obligations: "تعهدات مالی",
  history: "تاریخچه فعالیت‌ها",
  settings: "تنظیمات",
  support: "راهنما و پشتیبانی",
};

export function ProfileSubpage({ section }: { section: string }) {
  const [user, setUser] = useState<AppUser>({ loggedIn: false });
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setUser(s);
  }, []);

  const title = TITLES[section] || "پروفایل";

  if (section === "settings") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 flex items-center justify-center gap-2 p-10 text-sm text-silver">
          <ComingSoonBadge /> این بخش به‌زودی فعال می‌شود
        </Card>
      </Shell>
    );
  }

  if (section === "personal") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <Field label="نام و نام خانوادگی" value={user.name || ""} onChange={(v) => setUser({ ...user, name: v })} />
          <Field label="شهر" value={user.city || ""} onChange={(v) => setUser({ ...user, city: v })} />
          <Field label="شغل" value={user.job || ""} onChange={(v) => setUser({ ...user, job: v })} />
          <Field label="موبایل" value={user.mobile || ""} onChange={(v) => setUser({ ...user, mobile: v })} />
          <Field label="کد ملی" value={user.nationalCode || ""} onChange={(v) => setUser({ ...user, nationalCode: v })} />
          <VamButton onClick={() => { saveSession({ ...user, loggedIn: true }); setSaved(true); }}>
            {saved ? "ذخیره شد ✓" : "ذخیره"}
          </VamButton>
        </Card>
      </Shell>
    );
  }

  if (section === "financial") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 space-y-3 p-4">
          <Field label="درآمد ماهانه (تومان)" value={income} onChange={setIncome} />
          <Field label="هزینه ماهانه (تومان)" value={expense} onChange={setExpense} />
          <div className="rounded-2xl bg-tile/50 p-3 text-center text-sm">
            توان پرداخت تقریبی:{" "}
            <span className="font-extrabold text-brand">
              {Math.max(0, (Number(income.replace(/,/g, "")) || 0) - (Number(expense.replace(/,/g, "")) || 0)).toLocaleString("en-US")}
            </span>{" "}
            تومان
          </div>
          <VamButton onClick={() => setSaved(true)}>{saved ? "ذخیره شد ✓" : "ذخیره"}</VamButton>
        </Card>
      </Shell>
    );
  }

  if (section === "support") {
    return (
      <Shell title={title}>
        <Card className="mx-4 mt-4 space-y-3 p-4 text-sm leading-7 text-silver">
          <p>برای پشتیبانی با تیم وام‌گرد در ارتباط باشید.</p>
          <a href="https://vamgard.org" className="font-bold text-brand">vamgard.org</a>
          <p>یا از طریق چت وام‌یار داخل اپ سوال بپرسید.</p>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell title={title}>
      <Card className="mx-4 mt-4 p-8 text-center text-sm text-silver">
        هنوز فعالیتی ثبت نشده است.
      </Card>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title={title} />
      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">{children}</main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] text-silver">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpLeft,
  Headphones,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import VamGardLogo from "../brand/VamGardLogo";
import { Tab } from "@/src/types/navigation";
import { serviceTopics } from "../services/data";
import { loans } from "../loans/data";
import { BANKS, type BankKey } from "@/src/lib/constants/banks";
import { Bank } from "../ui";
import { fa } from "@/src/lib/format";

type SearchScope = "services" | "loans" | "profile";

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  keywords?: string;
  scope: SearchScope;
  scopeLabel: string;
  href?: string;
  targetTab?: Tab;
  imgIcon?: string;
  bankKey?: BankKey;
  lucideIcon?: LucideIcon;
}

const ICON_ALIASES: Record<string, string> = {
  circlechart: "cieclechart",
  cieclechart: "cieclechart",
};

function getServiceIcon(ic: string): string {
  const normalized = ic
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1$2")
    .toLowerCase();
  const fileName = ICON_ALIASES[normalized] ?? normalized;
  return `/icons/icon-${fileName}.png`;
}

const RECOMMENDATIONS = [
  "اعتبارسنجی",
  "وام ازدواج",
  "چک صیادی",
  "بانک ملت",
  "وام خودرو",
];

const PROFILE_ITEMS: SearchItem[] = [
  { id: "prof-1", title: "سطح مالی من", subtitle: "مشاهده امتیاز و رتبه اعتباری", scope: "profile", scopeLabel: "پروفایل", targetTab: "profile", lucideIcon: ShieldCheck },
  { id: "prof-2", title: "اطلاعات هویتی و حساب", subtitle: "تنظیمات کاربری", scope: "profile", scopeLabel: "پروفایل", targetTab: "profile", lucideIcon: UserCircle2 },
  { id: "prof-3", title: "سوابق استعلام و تراکنش‌ها", subtitle: "گزارش فعالیت‌ها", scope: "profile", scopeLabel: "پروفایل", targetTab: "profile", lucideIcon: ReceiptText },
  { id: "prof-4", title: "پشتیبانی و راهنما", subtitle: "ارتباط با تیم وام‌گرد", scope: "profile", scopeLabel: "پروفایل", targetTab: "profile", lucideIcon: Headphones },
];

export function AppHeader({
  tab,
  go,
}: {
  tab: Tab;
  go: (nextTab: Tab) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [tab]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 140);
      return () => clearTimeout(t);
    }
  }, [open]);

  const allItems = useMemo<SearchItem[]>(() => {
    const services: SearchItem[] = serviceTopics.flatMap((topic) =>
      topic.services.map((s) => ({
        id: `srv-${s.id}`,
        title: s.t,
        subtitle: topic.title,
        scope: "services" as const,
        scopeLabel: "خدمات",
        href: s.href,
        imgIcon: getServiceIcon(s.ic),
      }))
    );

    const loanItems: SearchItem[] = loans.map((l) => ({
      id: `loan-${l.id}`,
      title: l.t,
      subtitle: `بانک ${BANKS[l.bank].n} • تا ${fa(l.a)} میلیون • سود ${fa(l.r)}٪`,
      keywords: `${l.cat} ${BANKS[l.bank].n} ${l.a}`,
      scope: "loans" as const,
      scopeLabel: "وام",
      href: `/loans/${l.id}`,
      bankKey: l.bank,
    }));

    return [...loanItems, ...services, ...PROFILE_ITEMS];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.keywords?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query, allItems]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setQuery(""), 200);
  };

  const handleSelect = (item: SearchItem) => {
    handleClose();
    if (item.href) {
      router.push(item.href);
    } else if (item.targetTab) {
      go(item.targetTab);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[430px]">
      <header className="relative z-40 flex h-16 items-center justify-between border-b border-line/10 bg-bg/90 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Image src="/icons/vamgard.png" width={35} height={35} alt="vamgard" />
          <VamGardLogo />
        </div>

        <div className="flex items-center gap-3">
          {/* دکمه سرچ با کراس‌فید و چرخش کاملاً نرم (GPU) */}
          <button
            onClick={() => (open ? handleClose() : setOpen(true))}
            aria-label={open ? "بستن جستجو" : "جستجو"}
            className={`relative grid h-9 w-9 place-items-center rounded-xl transition-colors duration-200 ${
              open ? "bg-brand/15 text-brand" : "text-ink hover:bg-line/5"
            }`}
          >
            <Search
              size={22}
              className={`absolute transition-all duration-200 ease-out will-change-transform ${
                open
                  ? "rotate-90 scale-50 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              size={22}
              className={`absolute transition-all duration-200 ease-out will-change-transform ${
                open
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0"
              }`}
            />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* بک‌دراپ */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 top-16 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200 ease-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* پنل سرچ */}
      <div
        className={`absolute left-0 right-0 top-full z-40 origin-top border-b border-line/10 bg-bg px-4 py-3 shadow-lg transition-all duration-200 ease-out will-change-transform ${
          open
            ? "translate-y-0 scale-y-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-y-95 opacity-0"
        }`}
      >
        <div className="relative flex items-center">
          <Search
            size={18}
            className="pointer-events-none absolute right-3.5 text-silver"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در وام‌ها، بانک‌ها، خدمات و پروفایل..."
            className="surface w-full rounded-xl py-2.5 pl-10 pr-10 text-sm outline-none placeholder:text-silver/70 focus:border-brand/50"
          />
          <button
            onClick={() => (query ? setQuery("") : handleClose())}
            aria-label="بستن"
            className="absolute left-2.5 rounded-lg p-1 text-silver hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {!query.trim() && (
          <div className="mt-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-silver">
              <Sparkles size={13} className="text-brand" />
              <span>پیشنهادهای جستجو</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDATIONS.map((rec) => (
                <button
                  key={rec}
                  onClick={() => setQuery(rec)}
                  className="surface flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand/40"
                >
                  <Search size={12} className="text-silver" />
                  <span>{rec}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && (
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto no-scrollbar">
            {results.length === 0 ? (
              <p className="py-5 text-center text-xs text-silver">
                موردی با «{query}» پیدا نشد.
              </p>
            ) : (
              results.map((item) => {
                const IconComp = item.lucideIcon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="surface flex w-full items-center gap-3 rounded-2xl p-2.5 text-right transition hover:border-brand/40 active:scale-[0.99]"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      {item.bankKey ? (
                        <Bank k={item.bankKey} size={28} />
                      ) : item.imgIcon ? (
                        <Image
                          src={item.imgIcon}
                          alt={item.title}
                          width={26}
                          height={26}
                          className="h-6 w-6 object-contain"
                        />
                      ) : IconComp ? (
                        <IconComp size={20} />
                      ) : (
                        <Search size={18} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-ink">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="mt-0.5 truncate text-[10.5px] text-silver">
                          {item.subtitle}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-lg bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                        {item.scopeLabel}
                      </span>
                      <ArrowUpLeft size={14} className="text-silver" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
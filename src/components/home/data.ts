import { BankKey } from "@/src/lib/constants/banks";
import { IconKey } from "@/src/lib/constants/icons";
import { Tab } from "@/src/types/navigation";

export type HomeBanner = {
  t: string;
  s: string;
  b: string;
  ic: IconKey;
  lottie?: string;
  to: Tab;
};

export const banners: HomeBanner[] = [
  {
    t: "وام بگیر، آسوده بخر!",
    s: "تا ۳۰۰ میلیون تومان با اقساط بلندمدت",
    b: "بررسی شرایط",
    ic: "coins",
    to: "loans",
  },
  {
    t: "با هم بخر، ارزان‌تر بخر",
    s: "خرید گروهی لپ‌تاپ و لوازم دیجیتال",
    b: "شرکت در خرید",
    ic: "tag",
    to: "group",
  },
  {
    t: "سطح مالی‌ات را بالا ببر",
    s: "با تکمیل پرسشنامه امتیاز بگیر",
    b: "شروع کن",
    ic: "shieldCheck",
    to: "services",
  },
  {
    t: "با وام‌گرد پس‌انداز کن، جایزه ببر!",
    s: "قرعه‌کشی ماهانه بین ۱۰ نفر از کاربران",
    b: "شرکت در قرعه‌کشی",
    ic: "gift",
    lottie: "gift",
    to: "home",
  },
];

export type SuggestedLoan = {
  a: number;
  r: string;
  q: string;
  bank: BankKey;
};

export const suggestedLoans: SuggestedLoan[] = [
  {
    a: 300,
    r: "۳.۷",
    q: "۸,۰۰۰,۰۰۰",
    bank: "melli",
  },
  {
    a: 150,
    r: "۴.۲",
    q: "۴,۵۰۰,۰۰۰",
    bank: "mellat",
  },
  {
    a: 500,
    r: "۳.۱",
    q: "۱۳,۲۰۰,۰۰۰",
    bank: "tejarat",
  },
];

// Quick Actions
// ic در این قسمت نام فایل تصویر بدون پسوند PNG است.

export type QuickAction = {
  t: string;
  ic: string;
  badge?: number;
  to: Tab;
};

export const quickActions: QuickAction[] = [
  {
    t: "استعلام اعتبار",
    ic: "credit-inquiry",
    to: "services",
  },
  {
    t: "پرسشنامه مالی",
    ic: "financial-form",
    to: "services",
  },
  {
    t: "استعلام چک",
    ic: "cheque-inquiry",
    to: "services",
  },
  {
    t: "وام‌ها",
    ic: "loans",
    to: "loans",
  },
  {
    t: "بیمه",
    ic: "insurance",
    to: "services",
  },
  {
    t: "سرمایه گذاری",
    ic: "investment",
    to: "services",
  },
  {
    t: "خدمات خودرو",
    ic: "car-services",
    to: "services",
  },
  {
    t: "نیکوکاری",
    ic: "charity",
    to: "services",
  },
  {
    t: "تبدیل اقساط",
    ic: "installment-convert",
    to: "services",
  },
  {
    t: "خرید گروهی",
    ic: "group-buy",
    to: "group",
  },
  {
    t: "یادآور اقساط",
    ic: "installment-reminder",
    badge: 2,
    to: "services",
  },
];

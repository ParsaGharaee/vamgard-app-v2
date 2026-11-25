import { IconKey } from "@/src/lib/constants/icons";

export type ProfileMenuItem = {
  id: string;
  t: string;
  s: string;
  ic: IconKey;
  image?: string;
  href: string;
  soon?: boolean;
};

export const accountMenu: ProfileMenuItem[] = [
  {
    id: "personal",
    t: "اطلاعات شخصی",
    s: "نام، کد ملی، محل سکونت",
    ic: "folder",
    image: "/icons-new/profile/identify-info.png",
    href: "/profile/personal",
  },
  {
    id: "financial",
    t: "اطلاعات مالی",
    s: "درآمد، هزینه و توان پرداخت",
    ic: "wallet2",
    image: "/icons-new/profile/job-income.png",
    href: "/profile/financial",
  },
  {
    id: "credit",
    t: "اعتبارسنجی بانکی",
    s: "گزارش رتبه اعتباری از فینوتک",
    ic: "shieldCheck",
    href: "/services/credit-assessment-report",
  },
  {
    id: "questionnaire",
    t: "پرسشنامه مالی",
    s: "کشف وام متناسب با شما",
    ic: "shieldNote",
    href: "/questionnaire",
  },
  {
    id: "reminders",
    t: "یادآور اقساط",
    s: "تقویم شمسی و اعلان پرداخت",
    ic: "bell",
    image: "/icons-new/profile/notifications.png",
    href: "/reminders",
  },
  {
    id: "obligations",
    t: "وضعیت تعهدات مالی",
    s: "اقساط و بدهی‌های جاری",
    ic: "calendar",
    image: "/icons-new/profile/liabilities.png",
    href: "/profile/obligations",
  },
  {
    id: "history",
    t: "تاریخچه فعالیت‌ها",
    s: "استعلام‌ها و درخواست‌ها",
    ic: "chart2",
    image: "/icons-new/profile/activity-history.png",
    href: "/profile/history",
  },
  {
    id: "settings",
    t: "تنظیمات و اعلان‌ها",
    s: "ظاهر، امنیت و زبان",
    ic: "setting",
    image: "/icons-new/profile/settings.png",
    href: "/profile/settings",
    soon: true,
  },
  {
    id: "support",
    t: "راهنما و پشتیبانی",
    s: "سوالات پرتکرار و تماس",
    ic: "headset",
    image: "/icons-new/profile/support.png",
    href: "/profile/support",
  },
];

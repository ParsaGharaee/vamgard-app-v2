import { IconKey } from "@/src/lib/constants/icons";

export type ServiceItem = { id: string; t: string; ic: IconKey; href: string };
export type ServiceTopic = { id: string; title: string; services: ServiceItem[] };

export const serviceTopics: ServiceTopic[] = [
  {
    id: "financial",
    title: "خدمات بانکی و مالی",
    services: [
      { id: "credit-score", t: "اعتبارسنجی", ic: "shieldCheck", href: "/services/credit-score" },
      { id: "financial-form", t: "پرسشنامه", ic: "shieldNote", href: "/services/financial-form" },
      { id: "cheque-status", t: "استعلام چک", ic: "search", href: "/services/cheque-status" },
      { id: "iban-convert", t: "تبدیل شبا", ic: "refresh", href: "/services/iban-convert" },
      { id: "installments", t: "یادآور اقساط", ic: "bell", href: "/services/installments" },
      { id: "investment", t: "سرمایه‌گذاری", ic: "chart", href: "/services/investment" },
    ],
  },
  {
    id: "vehicle",
    title: "خودرو و موتور",
    services: [
      { id: "car-fines", t: "خلافی خودرو", ic: "car", href: "/services/car-fines" },
      { id: "insurance", t: "بیمه ثالث", ic: "shieldCar", href: "/services/insurance" },
      { id: "car-services", t: "عوارض", ic: "setting", href: "/services/car-services" },
    ],
  },
  {
    id: "other",
    title: "سایر استعلام‌ها",
    services: [
      { id: "charity", t: "نیکوکاری", ic: "heart", href: "/services/charity" },
      { id: "group-buy", t: "خرید گروهی", ic: "users", href: "/services/group-buy" },
      { id: "other-inquiry", t: "سایر", ic: "folder", href: "/services/other-inquiry" },
    ],
  },
];

export const serviceFilters = [
  { id: "همه", label: "همه خدمات" },
  { id: "financial", label: "مالی و بانکی" },
  { id: "vehicle", label: "خودرو" },
  { id: "other", label: "سایر" },
];

import type { IconKey } from "@/src/lib/constants/icons";

export interface ServiceItem {
  id: string;
  t: string;
  ic: IconKey;
  href: string;
}

export interface ServiceTopic {
  id: string;
  title: string;
  services: ServiceItem[];
}

export const serviceFilters: { id: string; label: string }[] = [
  { id: "همه", label: "همه خدمات" },
  { id: "credit", label: "تسهیلات و اعتبار" },
  { id: "bills", label: "سرویس های قبض" },
  { id: "banking", label: "بانکی و هویتی" },
  { id: "vehicle", label: "خودرو و موتور" },
];

export const serviceTopics: ServiceTopic[] = [
  // {
  //   id: "credit",
  //   title: "تسهیلات و اعتبارسنجی",
  //   services: [
  //     {
  //       id: "credit-score",
  //       t: "اعتبار معاملاتی",
  //       ic: "shieldCheck",
  //       href: "/services/credit-score",
  //     },
  //     {
  //       id: "cheque-status",
  //       t: "رنگ چک حقوقی",
  //       ic: "search",
  //       href: "/services/cheque-status",
  //     },
  //   ],
  // },
  {
    id: "information",
    title: "سرويس هاى احراز هويت",
    services: [
      {
        id: "card-owner-verification",
        t: "تطبیق کارت و کدملی",
        ic: "shieldCheck",
        href: "/services/card-owner-verification",
      },
      {
        id: "live-video-kyc",
        t: "احراز هویت ویدئویی",
        ic: "shieldCheck",
        href: "/services/live-video-kyc",
      },
      {
        id: "video-national-card",
        t: "تطبیق ویدئو و کارت ملی",
        ic: "shieldCheck",
        href: "/services/video-national-card",
      },
      {
        id: "death-status",
        t: "استعلام وضعیت حیات",
        ic: "shieldCheck",
        href: "/services/death-status",
      },
      {
        id: "foreigner-id",
        t: "استعلام اتباع خارجی",
        ic: "shieldCheck",
        href: "/services/foreigner-id",
      },
      {
        id: "iban-owner-verification",
        t: "تطبیق شبا و کدملی",
        ic: "shieldCheck",
        href: "/services/iban-owner-verification",
      },
      {
        id: "identification-inquiry",
        t: "اطلاعات هویتی",
        ic: "shieldCheck",
        href: "/services/identification-inquiry",
      },
    ],
  },
  {
    id: "bills",
    title: "سرویس های قبض",
    services: [
      {
        id: "bill-history",
        t: "استعلام تاریخچه قبض",
        ic: "shieldNote",
        href: "/services/bill-history",
      },
      {
        id: "bill-detail",
        t: "استعلام قبوض با جزئیات",
        ic: "shieldNote",
        href: "/services/bill-detail",
      },
      {
        id: "bill-inquiry",
        t: "استعلام قبض",
        ic: "wallet2",
        href: "/services/bill-inquiry",
      },
    ],
  },
  {
    id: "banking",
    title: "سرویس های استعلامی و تبدیلی",
    services: [
      {
        id: "card-inquiry",
        t: "استعلام کارت",
        ic: "wallet2",
        href: "/services/card-inquiry",
      },
      {
        id: "card-to-deposit",
        t: "کارت به حساب",
        ic: "refresh",
        href: "/services/card-to-deposit",
      },
      {
        id: "card-to-iban",
        t: "کارت به شبا",
        ic: "refresh",
        href: "/services/card-to-iban",
      },
      {
        id: "deposit-to-iban",
        t: "حساب به شبا",
        ic: "refresh",
        href: "/services/deposit-to-iban",
      },
      {
        id: "iban-inquiry",
        t: "دریافت اطلاعات شبا",
        ic: "search",
        href: "/services/iban-inquiry",
      },
    ],
  },
  {
    id: "postal",
    title: "سرویس های پستی و کدپستی",
    services: [
      {
        id: "postal-code",
        t: "استعلام کد پستی",
        ic: "search",
        href: "/services/postal-code",
      },
      {
        id: "postal-code-coordinates",
        t: "مختصات کد پستی",
        ic: "search",
        href: "/services/postal-code-coordinates",
      },
      {
        id: "postal-inquiry",
        t: "رهگیری مرسوله",
        ic: "search",
        href: "/services/postal-inquiry",
      },
    ],
  },
  {
    id: "vehicle",
    title: "سرویس های خودرویی",
    services: [
      {
        id: "negative-score",
        t: "نمره منفی",
        ic: "car",
        href: "/services/negative-score",
      },
      {
        id: "car-fines",
        t: "استعلام خلافی خودرو",
        ic: "car",
        href: "/services/car-fines",
      },
      {
        id: "freeway-toll",
        t: "عوارض آزادراهی",
        ic: "car",
        href: "/services/freeway-toll",
      },
      {
        id: "license-check",
        t: "وضعیت گواهینامه",
        ic: "shieldCar",
        href: "/services/license-check",
      },
      {
        id: "third-party-insurance",
        t: "بیمه شخص ثالث",
        ic: "shieldCar",
        href: "/services/third-party-insurance",
      },
      {
        id: "active-plates",
        t: "پلاک‌های فعال",
        ic: "shieldCar",
        href: "/services/active-plates",
      },
      {
        id: "plate-history",
        t: "تاریخچه پلاک",
        ic: "shieldCar",
        href: "/services/plate-history",
      },
    ],
  },
  {
    id: "cheque",
    title: "سرویس های چک صیادی",
    services: [
      {
        id: "cleared-cheque",
        t: "چک رفع سوء اثر",
        ic: "shieldCheck",
        href: "/services/cleared-cheque",
      },
      {
        id: "sayad-serial",
        t: "شناسه چک صیادی",
        ic: "search",
        href: "/services/sayad-serial",
      },
      {
        id: "sayad-transfers-chain",
        t: "زنجیره چک صیاد",
        ic: "refresh",
        href: "/services/sayad-transfers-chain",
      },
    ],
  },
  {
    id: "work",
    title: "سرويس هاى شناخت كسب وكار",
    services: [
      {
        id: "board-members",
        t: "اعضای هیئت مدیره",
        ic: "folder",
        href: "/services/board-members",
      },
      {
        id: "company-info",
        t: "اطلاعات شرکت",
        ic: "folder",
        href: "/services/company-info",
      },
      {
        id: "corporate-journal",
        t: "استعلام آگهی‌های روزنامه رسمی شرکت",
        ic: "folder",
        href: "/services/corporate-journal",
      },
      {
        id: "enamad-inquiry",
        t: "استعلام اینماد",
        ic: "shieldCheck",
        href: "/services/enamad-inquiry",
      },
      {
        id: "match-legal-id-members",
        t: "تطبیق اعضای شرکت",
        ic: "shieldCheck",
        href: "/services/match-legal-id-members",
      },
    ],
  },
];

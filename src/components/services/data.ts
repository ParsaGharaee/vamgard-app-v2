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
];

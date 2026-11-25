export interface ServiceItem {
  id: string;
  t: string;
  ic: string;
  href: string;
}

export interface ServiceTopic {
  id: string;
  title: string;
  services: ServiceItem[];
}

export const serviceFilters: { id: string; label: string }[] = [
  { id: "همه", label: "همه خدمات" },
  { id: "information", label: "سرویس‌های احراز هویت" },
  { id: "verification", label: "استعلام تسهیلات و اعتبارسنجی" },
  { id: "bills", label: "سرویس‌های قبض" },
  { id: "banking", label: "سرویس‌های استعلامی و تبدیلی" },
  { id: "postal", label: "سرویس‌های پستی و کدپستی" },
  { id: "vehicle", label: "خودرو و موتور" },
  { id: "cheque", label: "سرویس‌های چک صیادی" },
  { id: "work", label: "سرویس‌های شناخت کسب‌وکار" },
];

export const serviceTopics: ServiceTopic[] = [
  // احراز هویت
  {
    id: "information",
    title: "سرویس‌های احراز هویت",
    services: [
      {
        id: "card-owner-verification",
        t: "تطبیق کارت و کدملی",
        ic: "sheildcheck",
        href: "/services/card-owner-verification",
      },
      {
        id: "live-video-kyc",
        t: "احراز هویت ویدئویی",
        ic: "users",
        href: "/services/live-video-kyc",
      },
      {
        id: "video-national-card",
        t: "تطبیق ویدئو و کارت ملی",
        ic: "letter",
        href: "/services/video-national-card",
      },
      {
        id: "death-status",
        t: "استعلام وضعیت حیات",
        ic: "heart",
        href: "/services/death-status",
      },
      {
        id: "foreigner-id",
        t: "استعلام اتباع خارجی",
        ic: "users",
        href: "/services/foreigner-id",
      },
      {
        id: "iban-owner-verification",
        t: "تطبیق شبا و کدملی",
        ic: "bank",
        href: "/services/iban-owner-verification",
      },
      {
        id: "identification-inquiry",
        t: "اطلاعات هویتی",
        ic: "folder",
        href: "/services/identification-inquiry",
      },
      {
        id: "sana-inquiry",
        t: "استعلام ثنا",
        ic: "letter",
        href: "/services/sana-inquiry",
      },
      {
        id: "nid-inquiry",
        t: "استعلام کد ملی",
        ic: "search",
        href: "/services/nid-inquiry",
      },
      {
        id: "mobile-card-verification",
        t: "تطبیق کارت و موبایل",
        ic: "wallet2",
        href: "/services/mobile-card-verification",
      },
      {
        id: "shahkar-verify",
        t: "تطبیق شاهکار",
        ic: "sheildcheck",
        href: "/services/shahkar-verify",
      },
      {
        id: "national-card-ocr",
        t: "اسکن کارت ملی (OCR)",
        ic: "letter",
        href: "/services/national-card-ocr",
      },
      {
        id: "digital-sign-verify",
        t: "تشخیص و تطبیق امضا",
        ic: "sheildnote",
        href: "/services/digital-sign-verify",
      },
    ],
  },

  // تسهیلات و اعتبارسنجی
  {
    id: "verification",
    title: "استعلام تسهیلات و اعتبارسنجی",
    services: [
      {
        id: "back-cheques",
        t: "استعلام چک برگشتی",
        ic: "sheildnote",
        href: "/services/back-cheques",
      },
      {
        id: "back-cheques-legal",
        t: "چک برگشتی حقوقی",
        ic: "folder",
        href: "/services/back-cheques-legal",
      },
      {
        id: "credit-assessment",
        t: "اعتبارسنجی بانکی",
        ic: "chart2",
        href: "/services/credit-assessment",
      },
      {
        id: "guaranty-inquiry",
        t: "استعلام ضمانت‌ها",
        ic: "sheildcheck",
        href: "/services/guaranty-inquiry",
      },
      {
        id: "facility-inquiry",
        t: "استعلام تسهیلات",
        ic: "coins",
        href: "/services/facility-inquiry",
      },
    ],
  },

  // قبوض
  {
    id: "bills",
    title: "سرویس‌های قبض",
    services: [
      {
        id: "bill-history",
        t: "استعلام تاریخچه قبض",
        ic: "calendar",
        href: "/services/bill-history",
      },
      {
        id: "bill-detail",
        t: "استعلام قبوض با جزئیات",
        ic: "letter",
        href: "/services/bill-detail",
      },
      {
        id: "bill-inquiry",
        t: "استعلام قبض",
        ic: "wallet",
        href: "/services/bill-inquiry",
      },
    ],
  },

  // خدمات بانکی
  {
    id: "banking",
    title: "سرویس‌های استعلامی و تبدیلی",
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
        ic: "bank",
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
      {
        id: "national-card-image",
        t: "تصویر کارت ملی",
        ic: "letter",
        href: "/services/national-card-image",
      },
    ],
  },

  // پست و کدپستی
  {
    id: "postal",
    title: "سرویس‌های پستی و کدپستی",
    services: [
      {
        id: "postal-code",
        t: "استعلام کد پستی",
        ic: "pin",
        href: "/services/postal-code",
      },
      {
        id: "postal-code-coordinates",
        t: "مختصات کد پستی",
        ic: "piechart",
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

  // خودرو و موتور
  {
    id: "vehicle",
    title: "سرویس‌های خودرویی",
    services: [
      {
        id: "negative-score",
        t: "نمره منفی",
        ic: "chart",
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
        ic: "coins",
        href: "/services/freeway-toll",
      },
      {
        id: "license-check",
        t: "وضعیت گواهینامه",
        ic: "sheildcar",
        href: "/services/license-check",
      },
      {
        id: "third-party-insurance",
        t: "بیمه شخص ثالث",
        ic: "sheildcheck",
        href: "/services/third-party-insurance",
      },
      {
        id: "active-plates",
        t: "پلاک‌های فعال",
        ic: "car",
        href: "/services/active-plates",
      },
      {
        id: "plate-history",
        t: "تاریخچه پلاک",
        ic: "calendar",
        href: "/services/plate-history",
      },
    ],
  },

  // چک صیادی
  {
    id: "cheque",
    title: "سرویس‌های چک صیادی",
    services: [
      {
        id: "cleared-cheque",
        t: "چک رفع سوء اثر",
        ic: "sheildcheck",
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
      {
        id: "sayad-cheque-inquiry",
        t: "استعلام چک صیاد",
        ic: "sheildnote",
        href: "/services/sayad-cheque-inquiry",
      },
      {
        id: "sayad-accept-cheque",
        t: "تایید و رد چک صیاد",
        ic: "sheildcheck",
        href: "/services/sayad-accept-cheque",
      },
      {
        id: "sayad-cancel-cheque",
        t: "لغو چک صیاد",
        ic: "tag",
        href: "/services/sayad-cancel-cheque",
      },
    ],
  },

  // شناخت کسب‌وکار
  {
    id: "work",
    title: "سرویس‌های شناخت کسب‌وکار",
    services: [
      {
        id: "board-members",
        t: "اعضای هیئت مدیره",
        ic: "users",
        href: "/services/board-members",
      },
      {
        id: "company-info",
        t: "اطلاعات شرکت",
        ic: "folder",
        href: "/services/company-info",
      },
      {
        id: "enamad-inquiry",
        t: "استعلام اینماد",
        ic: "sheildcheck",
        href: "/services/enamad-inquiry",
      },
      {
        id: "match-legal-id-members",
        t: "تطبیق اعضای شرکت",
        ic: "users",
        href: "/services/match-legal-id-members",
      },
    ],
  },
];

export type Mode = "buy" | "sell";

export type Offer = {
  id: number;
  name: string;
  category: string;
  image: string;
  quantity: number;
  joined: number;
  singlePrice: number;
  groupPrice: number;
  time: number;
  seller: string;
  verified: boolean;
};

export const offers: Offer[] = [
  {
    id: 1,
    name: "آیفون ۱۶ پرو ۲۵۶ گیگ",
    category: "موبایل",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    quantity: 10,
    joined: 7,
    singlePrice: 500,
    groupPrice: 480,
    time: 18,
    seller: "فروشگاه موبایل مرکزی",
    verified: true,
  },
  {
    id: 2,
    name: "لپ‌تاپ لنوو LOQ",
    category: "لپ‌تاپ",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    quantity: 8,
    joined: 5,
    singlePrice: 320,
    groupPrice: 304,
    time: 32,
    seller: "تک شاپ",
    verified: true,
  },
  {
    id: 3,
    name: "ایرپاد پرو ۲",
    category: "لوازم دیجیتال",
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800",
    quantity: 20,
    joined: 11,
    singlePrice: 11,
    groupPrice: 9.8,
    time: 45,
    seller: "دیجی‌گجت",
    verified: false,
  },
];

export const categories = ["همه کالاها", "موبایل", "لپ‌تاپ", "لوازم دیجیتال"];

export const money = (n: number) =>
  n.toLocaleString("fa-IR", { maximumFractionDigits: 1 });

export const discountPct = (single: number, group: number) =>
  single > 0 ? Math.max(0, Math.round(((single - group) / single) * 100)) : 0;

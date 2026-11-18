import { BankKey } from "@/src/lib/constants/banks";

export type Loan = { t: string; bank: BankKey; cat: string; a: number; r: number; n: number; q: string; ok: number };

export const loans: Loan[] = [
  { t: "وام ضروری", bank: "melli", cat: "شخصی", a: 300, r: 23, n: 36, q: "11,800,000", ok: 82 },
  { t: "وام خرید خودرو", bank: "saman", cat: "خودرو", a: 500, r: 18, n: 48, q: "14,900,000", ok: 64 },
  { t: "وام مسکن", bank: "maskan", cat: "مسکن", a: 800, r: 14, n: 60, q: "18,400,000", ok: 48 },
  { t: "وام خرید کالا", bank: "mellat", cat: "کالا", a: 150, r: 20, n: 18, q: "9,600,000", ok: 91 },
  { t: "وام قرض‌الحسنه", bank: "mehr", cat: "شخصی", a: 100, r: 4, n: 24, q: "4,200,000", ok: 75 },
  { t: "وام ازدواج", bank: "saderat", cat: "شخصی", a: 200, r: 4, n: 48, q: "4,600,000", ok: 70 },
  { t: "وام لوازم خانگی", bank: "pasargad", cat: "کالا", a: 100, r: 20, n: 12, q: "9,300,000", ok: 88 },
];

export const loanCategories = ["همه", "شخصی", "خودرو", "مسکن", "کالا"];

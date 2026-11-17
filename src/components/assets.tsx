import Image from "next/image";

/* کلید درست (انگلیسی صحیح) → نام واقعی فایل در public/icons
   غلط‌های املایی فایل‌ها (sheild، cieclechart) فقط همین‌جا هستند؛ اگر فایل را اصلاح کردی فقط همین‌جا عوض کن */
export const ICONS = {
  bank: "icon-bank.png",
  bell: "icon-bell.png",
  bolt: "icon-bolt.png",
  calendar: "icon-calendar.png",
  car: "icon-car.png",
  chart: "icon-chart.png",
  chart2: "icon-chart2.png",
  circleChart: "icon-cieclechart.png",
  coins: "icon-coins.png",
  folder: "icon-folder.png",
  gift: "icon-gift.png",
  headset: "icon-headset.png",
  heart: "icon-heart.png",
  letter: "icon-letter.png",
  messages: "icon-messages.png",
  percent: "icon-percent.png",
  pin: "icon-pin.png",
  poz: "icon-poz.png",
  refresh: "icon-refresh.png",
  search: "icon-search.png",
  setting: "icon-setting.png",
  shieldCar: "icon-sheildcar.png",
  shieldCheck: "icon-sheildcheck.png",
  shieldNote: "icon-sheildnote.png",
  tag: "icon-tag.png",
  users: "icon-users.png",
  wallet: "icon-wallet.png",
  wallet2: "icon-wallet2.png",
} as const;
export type IconKey = keyof typeof ICONS;

export const Ic = ({ n, size = 32, className = "" }: { n: IconKey; size?: number; className?: string }) => (
  <Image src={`/icons/${ICONS[n]}`} alt="" width={size * 2} height={size * 2} style={{ width: size, height: size }} className={`shrink-0 object-contain ${className}`} />
);

/* بانک‌ها: نام فارسی + فایل در public/banks */
export const BANKS = {
  ayande: { n: "آینده", f: "bank-ayande.png" },
  day: { n: "دی", f: "bank-day.jpg" },
  eghtesadNovin: { n: "اقتصاد نوین", f: "bank-eghtesad-novin.png" },
  gardeshgari: { n: "گردشگری", f: "bank-gardeshgari.png" },
  karafarin: { n: "کارآفرین", f: "bank-karafarin.png" },
  keshavarzi: { n: "کشاورزی", f: "bank-keshavarzi.png" },
  khavarmianeh: { n: "خاورمیانه", f: "bank-khavarmianeh.png" },
  markazi: { n: "مرکزی", f: "bank-markazi.png" },
  maskan: { n: "مسکن", f: "bank-maskan.png" },
  mehr: { n: "قرض‌الحسنه مهر ایران", f: "bank-mehr.png" },
  melal: { n: "ملل", f: "bank-melal.png" },
  mellat: { n: "ملت", f: "bank-mellat.png" },
  melli: { n: "ملی", f: "bank-melli.png" },
  parsian: { n: "پارسیان", f: "bank-parsian.png" },
  pasargad: { n: "پاسارگاد", f: "bank-pasargad.png" },
  refah: { n: "رفاه کارگران", f: "bank-refah.png" },
  resalat: { n: "قرض‌الحسنه رسالت", f: "bank-resalat.png" },
  saderat: { n: "صادرات", f: "bank-saderat.png" },
  saman: { n: "سامان", f: "bank-saman.png" },
  sanatMadan: { n: "صنعت و معدن", f: "bank-sanat-va-madan.png" },
  sarmayeh: { n: "سرمایه", f: "bank-sarmayeh.png" },
  sepah: { n: "سپه", f: "bank-sepah.png" },
  shahr: { n: "شهر", f: "bank-shahr.png" },
  sina: { n: "سینا", f: "bank-sina.png" },
  tejarat: { n: "تجارت", f: "bank-tejarat.png" },
  toseeTaavon: { n: "توسعه تعاون", f: "bank-tosee-taavon.png" },
  iranZamin: { n: "ایران زمین", f: "iran-zamin-bank.png" },
  post: { n: "پست بانک", f: "post-bank.png" },
} as const;
export type BankKey = keyof typeof BANKS;

export const Bank = ({ k, size = 44 }: { k: BankKey; size?: number }) => (
  <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
    <Image src={`/banks/${BANKS[k].f}`} alt={BANKS[k].n} width={size * 2} height={size * 2} className="h-full w-full object-contain" />
  </span>
);
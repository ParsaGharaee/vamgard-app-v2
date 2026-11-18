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

/** Persian display labels for API enum values and response keys. Values sent to API stay English/raw. */

export const FA_ENUM: Record<string, string> = {
  // قبض
  Water: "آب",
  Electricity: "برق",
  "Electricity-standard": "برق (استاندارد)",
  "Electricity-support": "برق (پشتیبان)",
  Gas: "گاز",
  GasByBillId: "گاز با شماره قبض",
  Tel: "تلفن ثابت (پایان دوره)",
  TelNow: "تلفن ثابت (بروز)",
  Mobile: "موبایل (پایان دوره)",
  MobileNow: "موبایل (بروز)",
  // اپراتور
  MCI: "همراه اول",
  MTN: "ایرانسل",
  RIGHTEL: "رایتل",
  // OCR / کارت
  uploadCardFront: "روی کارت ملی",
  uploadCardBack: "پشت کارت ملی",
  // روزنامه رسمی
  administrative: "اداری",
  financial: "مالی",
  normal: "عادی",
  "absence of CEO": "غیبت مدیرعامل",
  // OTP / پیامک
  sms: "پیامک",
  ussd: "USSD",
  bot: "ربات",
  // امضا / سفته
  enroll: "ثبت‌نام گواهی",
  sign: "امضا",
  revoke: "ابطال",
  emzasan: "امضاصان",
  sepidar: "سپیدار",
  pki: "PKI",
  UNAFFILIATED: "بدون وابستگی",
  male: "مرد",
  female: "زن",
  // عمومی
  "1": "حقیقی",
  "2": "حقوقی",
  "زن": "زن",
  "مرد": "مرد",
};

export const FA_FIELD: Record<string, string> = {
  idCode: "کد شناسایی",
  idType: "نوع شخص",
  nid: "کد ملی",
  nationalCode: "کد ملی",
  nationalId: "کد ملی",
  user: "کد ملی",
  mobile: "شماره موبایل",
  mobileNumber: "شماره موبایل",
  birthDate: "تاریخ تولد",
  birthDay: "تاریخ تولد",
  fullName: "نام کامل",
  firstName: "نام",
  lastName: "نام خانوادگی",
  fatherName: "نام پدر",
  gender: "جنسیت",
  iban: "شماره شبا",
  card: "شماره کارت",
  deposit: "شماره حساب",
  plateNumber: "شماره پلاک",
  plateNo: "شماره پلاک",
  sayadId: "شناسه صیاد",
  postalCode: "کد پستی",
  companyNationalId: "شناسه ملی شرکت",
  companyId: "شناسه شرکت",
  legalId: "شناسه حقوقی",
  type: "نوع",
  parameter: "شناسه استعلام",
  secondParameter: "اپراتور / پارامتر دوم",
  requestId: "شناسه درخواست",
  offenseId: "شناسه تخلف",
  licenseNumber: "شماره گواهینامه",
  amount: "مبلغ",
  message: "متن پیام",
  destination: "مقصد",
  otp: "کد تایید",
  trackId: "کد پیگیری",
  inquiryTrackId: "شناسه پیگیری استعلام",
  assessmentId: "شناسه گزارش اعتباری",
  traceId: "شناسه رهگیری",
  challengeId: "شناسه چالش",
  documentType: "نوع سند",
  conditions: "شرایط",
  method: "روش ارسال",
  purpose: "هدف",
  provider: "ارائه‌دهنده",
  certType: "نوع گواهی",
  version: "نسخه",
  from: "فرستنده",
  to: "گیرنده",
  templateId: "شناسه قالب",
  identifier: "شناسه",
  ttl: "مدت اعتبار (ثانیه)",
  description: "توضیحات",
  serialNo: "سریال",
  seriesNo: "سری",
  accountOwners: "صاحبان حساب",
  receivers: "گیرنده‌ها",
  signers: "امضاکنندگان",
  fromIban: "شبا مبدأ",
  toIban: "شبا مقصد",
  bankCode: "کد بانک",
  branchCode: "کد شعبه",
  chequeType: "نوع چک",
  chequeMedia: "رسانه چک",
  reason: "دلیل",
  dueDate: "تاریخ سررسید",
  holder: "دارنده",
  acceptTransfer: "پذیرش انتقال",
  transferDate: "تاریخ انتقال",
  giveBack: "عودت",
  personType: "نوع شخص",
  accept: "تایید",
  acceptDescription: "توضیح تایید",
  acceptor: "پذیرنده",
  acceptorAgent: "نماینده پذیرنده",
  cancelDescription: "توضیح لغو",
  canceller: "لغوکننده",
  cancellerAgent: "نماینده لغوکننده",
  shahabId: "شناسه شهاب",
  callerBranchCode: "کد شعبه فراخوان",
  customerAuthStatus: "وضعیت احراز مشتری",
  registrationId: "شناسه ثبت",
  signerNationalId: "کد ملی امضاکننده",
  pin: "رمز",
  signature: "امضا",
  pdf: "فایل PDF",
  persianFirstName: "نام فارسی",
  persianLastName: "نام خانوادگی فارسی",
  englishFirstName: "نام انگلیسی",
  englishLastName: "نام خانوادگی انگلیسی",
  province: "استان",
  city: "شهر",
  address: "آدرس",
  email: "ایمیل",
  otpAutofillHost: "میزبان تکمیل خودکار OTP",
  documentHashes: "هش اسناد",
  destinationNumber: "شماره مقصد",
  startDateTime: "از تاریخ",
  endDateTime: "تا تاریخ",
  fromDate: "از تاریخ",
  toDate: "تا تاریخ",
  fromTime: "از ساعت",
  toTime: "تا ساعت",
  lastRecordNumber: "شماره آخرین رکورد",
  destinationFirstname: "نام مقصد",
  destinationLastname: "نام خانوادگی مقصد",
  paymentNumber: "شماره پرداخت",
  reasonDescription: "شرح دلیل",
  sourceFirstName: "نام مبدأ",
  sourceLastName: "نام خانوادگی مبدأ",
  secondPassword: "رمز دوم",
  merchantName: "نام پذیرنده",
  merchantIban: "شبا پذیرنده",
};

export const FA_RESULT_KEY: Record<string, string> = {
  ...FA_FIELD,
  isValid: "اعتبار",
  status: "وضعیت",
  message: "پیام",
  registered: "ثبت‌شده",
  score: "امتیاز",
  title: "عنوان",
  hasHistory: "دارای سابقه",
  trackId: "کد پیگیری",
  inquiryTrackId: "شناسه پیگیری",
  requestId: "شناسه درخواست",
  assessmentId: "شناسه گزارش",
  IBAN: "شبا",
  bankName: "نام بانک",
  deposit: "شماره حساب",
  firstName: "نام",
  lastName: "نام خانوادگی",
  fatherName: "نام پدر",
  birthDate: "تاریخ تولد",
  deathStatus: "وضعیت حیات",
  gender: "جنسیت",
  nationalCode: "کد ملی",
  fullName: "نام کامل",
  fullNameSimilarity: "شباهت نام کامل",
  firstNameSimilarity: "شباهت نام",
  lastNameSimilarity: "شباهت نام خانوادگی",
  fatherNameSimilarity: "شباهت نام پدر",
  genderSimilarity: "شباهت جنسیت",
  description: "توضیحات",
  amount: "مبلغ",
  totalAmount: "مبلغ کل",
  billId: "شناسه قبض",
  paymentId: "شناسه پرداخت",
  color: "رنگ",
  chequeColor: "رنگ چک",
  result: "نتیجه",
  data: "داده",
  value: "مقدار",
  code: "کد",
  name: "نام",
  address: "آدرس",
  postalCode: "کد پستی",
  latitude: "عرض جغرافیایی",
  longitude: "طول جغرافیایی",
  plateNumber: "شماره پلاک",
  mobile: "موبایل",
  alive: "زنده",
  dead: "فوت‌شده",
  DONE: "انجام‌شده",
  SUCCESS: "موفق",
  FAILED: "ناموفق",
  PENDING: "در انتظار",
  true: "بله",
  false: "خیر",
};

export function faEnum(value: string): string {
  return FA_ENUM[value] || FA_ENUM[value.trim()] || value;
}

export function faField(name: string, fallback?: string): string {
  if (FA_FIELD[name]) return FA_FIELD[name];
  if (fallback && /[\u0600-\u06FF]/.test(fallback)) {
    const cut = fallback.split(/[—–\-|:：]/)[0]?.trim();
    if (cut) return cut.length > 28 ? cut.slice(0, 26) + "…" : cut;
  }
  return fallback || name;
}

export function faResultKey(key: string): string {
  const leaf = key.split(".").pop()?.replace(/\[\d+\]/g, "") || key;
  return FA_RESULT_KEY[leaf] || FA_RESULT_KEY[key] || leaf;
}

export function faValue(value: string): string {
  if (FA_ENUM[value]) return FA_ENUM[value];
  if (FA_RESULT_KEY[value]) return FA_RESULT_KEY[value];
  if (value === "true") return "بله";
  if (value === "false") return "خیر";
  return value;
}

/** Clean service titles that still contain English step markers. */
export function faServiceTitle(title: string): string {
  return title
    .replace(/\s*\(Authorization SMS\)/gi, " (پیامکی)")
    .replace(/\s*\(Client Credential\)/gi, "")
    .replace(/\s*\(SMS\/OTP\)/gi, " (پیامکی)")
    .replace(/\bJSON\b/g, "جیسون")
    .replace(/\bPDF\b/g, "پی‌دی‌اف")
    .replace(/\bOCR\b/g, "تشخیص متن")
    .replace(/\bOTP\b/g, "رمز یکبارمصرف")
    .replace(/\bInitiate\b/gi, "شروع")
    .replace(/\bVerify\b/gi, "تایید")
    .replace(/—\s*ثبت درخواست.*/g, "")
    .replace(/—\s*دریافت نتیجه.*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

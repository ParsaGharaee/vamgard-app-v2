const CODE_MESSAGES: Record<string, string> = {
  "401": "احراز هویت ناموفق بود. توکن یا اطلاعات کلاینت را بررسی کنید.",
  "403": "دسترسی به این سرویس مجاز نیست (Scope).",
  "404": "منبع یا سرویس یافت نشد.",
  "422": "پارامترهای ارسالی نامعتبر است.",
  "429": "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.",
  "500": "خطای داخلی سرور فینوتک.",
  "503": "سرویس موقتاً در دسترس نیست.",
};

export function mapFinnotechError(input: {
  status?: number;
  responseCode?: string;
  message?: string;
  raw?: unknown;
}): string {
  if (input.message && /[\u0600-\u06FF]/.test(input.message)) return input.message;

  const statusKey = input.status ? String(input.status) : "";
  if (statusKey && CODE_MESSAGES[statusKey]) return CODE_MESSAGES[statusKey];

  if (typeof input.raw === "object" && input.raw && "error" in input.raw) {
    const err = (input.raw as { error?: { message?: string } }).error;
    if (err?.message) return err.message;
  }

  return input.message || "خطا در ارتباط با سرور فینوتک.";
}

/** تبدیل ارقام انگلیسی به فارسی */
export const fa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

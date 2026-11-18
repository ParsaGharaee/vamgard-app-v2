import { loans } from "@/src/components/loans/data";
import { fa } from "@/src/lib/format";
import type { IconKey } from "@/src/lib/constants/icons";

export type Msg = {
  id: number;
  me: boolean;
  text: string;
  loanIds?: string[];
  done?: boolean;
};

export const PROMPTS: { t: string; s: string; ic: IconKey }[] = [
  { t: "وام مناسب من کدومه؟", s: "پیشنهاد بر اساس شرایطت", ic: "bank" },
  { t: "برنامه تأمین ۳۰۰ میلیون", s: "تا ۶ ماه آینده", ic: "chart" },
  { t: "قسط وام رو حساب کن", s: "مبلغ و مدت بده", ic: "calendar" },
  { t: "پس‌انداز یا وام؟", s: "مقایسه‌ی هوشمند", ic: "coins" },
];

export function mockReply(q: string): { text: string; loanIds?: string[] } {
  if (q.includes("قسط")) {
    return {
      text: `برای محاسبه‌ی دقیق قسط، مبلغ و مدت وام رو بگو.\n\nمثلاً برای ${fa(300)} میلیون تومان در ${fa(36)} ماه با سود ${fa(23)}٪، قسط ماهانه حدود ${fa("11,800,000")} تومان می‌شه.`,
    };
  }
  if (q.includes("مناسب") || q.includes("وام")) {
    const top = [...loans].sort((a, b) => b.ok - a.ok).slice(0, 2);
    return {
      text: "با توجه به رتبه‌ی اعتباری تخمینی‌ات، این دو وام بیشترین شانس تأیید رو دارن. برای نتیجه‌ی دقیق‌تر، قبل از درخواست اعتبارسنجی رو هم انجام بده.",
      loanIds: top.map((l) => l.id),
    };
  }
  if (q.includes("انداز")) {
    return {
      text: "اگه هدفت کوتاه‌مدته و مبلغ کمیه، پس‌انداز ریسک کمتری داره.\nولی برای هزینه‌های بزرگ مثل خودرو یا مسکن، وام با اقساط بلندمدت فشار نقدی رو کم می‌کنه.\n\nاگه بگی هدفت چیه و تا کی می‌خوای بهش برسی، مقایسه‌ی دقیق‌تری می‌کنم.",
    };
  }
  if (q.includes("۳۰۰") || q.includes("300")) {
    return {
      text: `برای تأمین ${fa(300)} میلیون تا ۶ ماه:\n• ماهانه حدود ${fa(50)} میلیون پس‌انداز لازمه\n• یا یه وام ${fa(300)} میلیونی با اقساط بلندمدت بگیری\n• یا ترکیب هر دو\n\nمی‌خوای وام‌های مناسب این مبلغ رو نشونت بدم؟`,
    };
  }
  return {
    text: "سوالت رو متوجه شدم. می‌تونم درباره‌ی وام، اقساط، اعتبارسنجی و برنامه‌ی مالی کمکت کنم. یه کم بیشتر توضیح بده تا دقیق‌تر جواب بدم.",
  };
}

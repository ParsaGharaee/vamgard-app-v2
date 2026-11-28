export type HistoryExportRow = {
  label: string;
  value: string;
};

export type ServiceHistoryItem = {
  id: string;
  serviceId: string;
  title: string;
  href: string;
  date: string;
  amountToman: number;
  summary: string;
  rows: HistoryExportRow[];
};

export type CreditHistoryPoint = {
  id: string;
  date: string;
  score: number;
  grade: string;
  riskLabel: string;
  facilitiesCount: number;
  bouncedCheques: number;
};

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  date: string;
  status: "در حال بررسی" | "پاسخ داده شده";
};

const SERVICE_HISTORY_KEY = "vamgard_service_history_v1";
const CREDIT_HISTORY_KEY = "vamgard_credit_history_v1";
const TICKETS_KEY = "vamgard_support_tickets_v1";

function nowJalali() {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(new Date())
      .replace("،", " ·");
  } catch {
    return "امروز";
  }
}

const DEFAULT_SERVICE_HISTORY: ServiceHistoryItem[] = [
  {
    id: "hist-sample-1",
    serviceId: "shahkar-verify",
    title: "تطبیق شاهکار موبایل و کدملی",
    href: "/services/shahkar-verify",
    date: "۱۴۰۵/۰۸/۲۱ · ۱۲:۱۵",
    amountToman: 15_000,
    summary: "انطباق تایید شد",
    rows: [
      { label: "سرویس", value: "تطبیق شاهکار موبایل و کدملی" },
      { label: "وضعیت انطباق", value: "تایید شده" },
      { label: "تاریخ استعلام", value: "۱۴۰۵/۰۸/۲۱ · ۱۲:۱۵" },
    ],
  },
  {
    id: "hist-sample-2",
    serviceId: "back-cheques",
    title: "استعلام چک برگشتی",
    href: "/services/back-cheques",
    date: "۱۴۰۵/۰۸/۱۹ · ۰۹:۴۰",
    amountToman: 25_000,
    summary: "بدون چک برگشتی",
    rows: [
      { label: "سرویس", value: "استعلام چک برگشتی" },
      { label: "تعداد چک برگشتی", value: "۰ فقره" },
      { label: "تاریخ استعلام", value: "۱۴۰۵/۰۸/۱۹ · ۰۹:۴۰" },
    ],
  },
];

export function loadServiceHistory(): ServiceHistoryItem[] {
  if (typeof window === "undefined") return DEFAULT_SERVICE_HISTORY;
  try {
    const raw = localStorage.getItem(SERVICE_HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(
        SERVICE_HISTORY_KEY,
        JSON.stringify(DEFAULT_SERVICE_HISTORY),
      );
      return DEFAULT_SERVICE_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SERVICE_HISTORY;
  }
}

export function addServiceHistory(
  item: Omit<ServiceHistoryItem, "id" | "date">,
) {
  if (typeof window === "undefined") return;
  const list = loadServiceHistory();
  const next: ServiceHistoryItem = {
    ...item,
    id: `hist-${Date.now()}`,
    date: nowJalali(),
  };
  localStorage.setItem(SERVICE_HISTORY_KEY, JSON.stringify([next, ...list]));
  window.dispatchEvent(new Event("vamgard-history"));
}

export function loadCreditHistory(): CreditHistoryPoint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CREDIT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCreditHistory(
  point: Omit<CreditHistoryPoint, "id" | "date">,
) {
  if (typeof window === "undefined") return [];
  const list = loadCreditHistory();
  const next: CreditHistoryPoint = {
    ...point,
    id: `cr-${Date.now()}`,
    date: nowJalali(),
  };
  const updated = [...list, next];
  localStorage.setItem(CREDIT_HISTORY_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("vamgard-history"));
  return updated;
}

export function loadTickets(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTicket(subject: string, message: string): SupportTicket[] {
  const list = loadTickets();
  const next: SupportTicket = {
    id: `tk-${Date.now()}`,
    subject,
    message,
    date: nowJalali(),
    status: "در حال بررسی",
  };
  const updated = [next, ...list];
  if (typeof window !== "undefined") {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
  }
  return updated;
}

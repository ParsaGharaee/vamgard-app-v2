export const MIN_WALLET_CHARGE = 100_000;

export type WalletTx = {
  id: string;
  title: string;
  amount: number;
  at: string;
  kind: "credit" | "debit";
  icon?: "charge" | "service" | "reward";
};

export type TrendPoint = {
  label: string;
  balance: number;
};

export type WalletState = {
  balance: number;
  monthlyChangePct: number;
  txs: WalletTx[];
  trend: TrendPoint[];
};

const WALLET_KEY = "vamgard_wallet_mvp_v1";

const DEFAULT_WALLET: WalletState = {
  balance: 150_000,
  monthlyChangePct: 2.5,
  txs: [
    {
      id: "tx-1",
      title: "شارژ کیف پول",
      amount: 200_000,
      at: "۱۴۰۵/۰۸/۲۳ · ۱۴:۳۰",
      kind: "credit",
      icon: "charge",
    },
    {
      id: "tx-2",
      title: "استعلام اعتبارسنجی بانکی",
      amount: 50_000,
      at: "۱۴۰۵/۰۸/۲۰ · ۱۷:۲۰",
      kind: "debit",
      icon: "service",
    },
    {
      id: "tx-3",
      title: "پاداش خوش‌آمدگویی وامگرد",
      amount: 50_000,
      at: "۱۴۰۵/۰۸/۱۸ · ۱۰:۱۵",
      kind: "credit",
      icon: "reward",
    },
  ],
  trend: [
    { label: "۱ آبان", balance: 50_000 },
    { label: "۸ آبان", balance: 120_000 },
    { label: "۱۵ آبان", balance: 95_000 },
    { label: "۲۲ آبان", balance: 200_000 },
    { label: "امروز", balance: 150_000 },
  ],
};

function nowJalaliLabel() {
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
    return "هم‌اکنون";
  }
}

export function loadWallet(): WalletState {
  if (typeof window === "undefined") return DEFAULT_WALLET;
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) {
      localStorage.setItem(WALLET_KEY, JSON.stringify(DEFAULT_WALLET));
      return DEFAULT_WALLET;
    }
    return { ...DEFAULT_WALLET, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_WALLET;
  }
}

export function saveWallet(state: WalletState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLET_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("vamgard-wallet"));
}

export function chargeWallet(
  amount: number,
  title = "شارژ کیف پول",
): { ok: boolean; error?: string; state: WalletState } {
  const current = loadWallet();
  if (amount < MIN_WALLET_CHARGE) {
    return {
      ok: false,
      error: `حداقل مبلغ شارژ ${MIN_WALLET_CHARGE.toLocaleString("en-US")} تومان است.`,
      state: current,
    };
  }
  const nextBalance = current.balance + amount;
  const tx: WalletTx = {
    id: `tx-${Date.now()}`,
    title,
    amount,
    at: nowJalaliLabel(),
    kind: "credit",
    icon: "charge",
  };
  const nextTrend = [
    ...current.trend.slice(-4),
    { label: "امروز", balance: nextBalance },
  ];
  const nextState: WalletState = {
    ...current,
    balance: nextBalance,
    txs: [tx, ...current.txs],
    trend: nextTrend,
  };
  saveWallet(nextState);
  return { ok: true, state: nextState };
}

export function spendWallet(
  amount: number,
  title: string,
): { ok: boolean; error?: string; state: WalletState } {
  const current = loadWallet();
  if (current.balance < amount) {
    return { ok: false, error: "موجودی کیف پول کافی نیست.", state: current };
  }
  const nextBalance = current.balance - amount;
  const tx: WalletTx = {
    id: `tx-${Date.now()}`,
    title,
    amount,
    at: nowJalaliLabel(),
    kind: "debit",
    icon: "service",
  };
  const nextTrend = [
    ...current.trend.slice(-4),
    { label: "امروز", balance: nextBalance },
  ];
  const nextState: WalletState = {
    ...current,
    balance: nextBalance,
    txs: [tx, ...current.txs],
    trend: nextTrend,
  };
  saveWallet(nextState);
  return { ok: true, state: nextState };
}

export function useWalletListener(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const h = () => cb();
  window.addEventListener("vamgard-wallet", h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener("vamgard-wallet", h);
    window.removeEventListener("storage", h);
  };
}

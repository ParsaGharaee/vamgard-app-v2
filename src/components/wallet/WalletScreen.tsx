"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Plus, TrendingUp, Wallet } from "lucide-react";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { fa } from "@/src/lib/format";
import { gatewayFetch } from "@/src/lib/gateway/client";
import { loadSession } from "@/src/lib/session";

const MIN_CHARGE = 100_000;

type WalletTx = {
  id: string;
  title: string;
  amount: number;
  at: string;
  kind: "credit" | "debit";
};

type TrendPoint = { day: string; balance: number };

function formatToman(n: number) {
  return fa(Math.abs(n).toLocaleString("en-US"));
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  const w = 300;
  const h = 72;
  const vals = points.map((p) => p.balance);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const pad = 4;
  const path = points
    .map((p, i) => {
      const x = pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2);
      const y = h - pad - ((p.balance - min) / Math.max(1, max - min)) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full text-brand" aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d={`${path} L ${w - pad} ${h} L ${pad} ${h} Z`}
        fill="currentColor"
        fillOpacity={0.12}
      />
    </svg>
  );
}

export function WalletScreen() {
  const [hidden, setHidden] = useState(false);
  const [balance, setBalance] = useState(0);
  const [chargeAmount, setChargeAmount] = useState(String(MIN_CHARGE));
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [charging, setCharging] = useState(false);
  const [apiNote, setApiNote] = useState<string | null>(null);

  const loggedIn = loadSession().loggedIn;

  const loadWallet = useCallback(async () => {
    setLoading(true);
    setApiNote(null);
    if (!loggedIn) {
      setBalance(0);
      setTxs([]);
      setTrend([]);
      setLoading(false);
      return;
    }

    const [balRes, txRes, trendRes] = await Promise.all([
      gatewayFetch<{ ok?: boolean; balance?: number }>("me/wallet"),
      gatewayFetch<{ ok?: boolean; transactions?: WalletTx[]; items?: WalletTx[] }>("me/wallet/transactions"),
      gatewayFetch<{ ok?: boolean; points?: TrendPoint[]; trend?: TrendPoint[] }>("me/wallet/trend"),
    ]);

    if (balRes.ok && typeof balRes.data.balance === "number") {
      setBalance(balRes.data.balance);
    } else {
      setApiNote("موجودی از سرور دریافت نشد؛ پس از ورود دوباره تلاش کنید.");
    }

    const txList = txRes.data.transactions ?? txRes.data.items;
    if (txRes.ok && Array.isArray(txList)) setTxs(txList);

    const trendList = trendRes.data.points ?? trendRes.data.trend;
    if (trendRes.ok && Array.isArray(trendList) && trendList.length > 0) {
      setTrend(trendList);
    } else {
      const seed = balance || 0;
      setTrend(
        Array.from({ length: 7 }, (_, i) => ({
          day: `d${i}`,
          balance: Math.max(0, seed - (6 - i) * 15_000 + i * 8_000),
        })),
      );
    }
    setLoading(false);
  }, [loggedIn]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const chargeNum = useMemo(() => Number(chargeAmount.replace(/\D/g, "")) || 0, [chargeAmount]);
  const chargeValid = chargeNum >= MIN_CHARGE;

  const onCharge = async () => {
    if (!chargeValid || charging) return;
    setCharging(true);
    const res = await gatewayFetch<{ ok?: boolean; paymentUrl?: string; redirectUrl?: string }>("me/wallet/charge", {
      method: "POST",
      json: { amount: chargeNum },
    });
    setCharging(false);
    if (!res.ok) {
      setApiNote(res.error || "شارژ کیف پول الان ممکن نیست.");
      return;
    }
    const url = res.data.paymentUrl ?? res.data.redirectUrl;
    if (typeof url === "string" && url.startsWith("http")) {
      window.location.href = url;
      return;
    }
    setApiNote("درخواست شارژ ثبت شد. درگاه پرداخت به‌زودی متصل می‌شود.");
    loadWallet();
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="کیف پول" />
      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <Card className="mx-4 mt-4 overflow-hidden p-0">
          <div className="bg-gradient-to-br from-brand to-[#0a3fb8] p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <div className="text-xs text-white/80">موجودی کیف پول</div>
                <div className="mt-2 text-3xl font-black tracking-tight" dir="ltr">
                  {hidden ? "••••••" : `${formatToman(balance)}`}
                  <span className="mr-2 text-sm font-bold text-white/80">تومان</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHidden((h) => !h)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/15"
                aria-label={hidden ? "نمایش موجودی" : "مخفی کردن موجودی"}
              >
                {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/75">
              <Wallet size={14} />
              حداقل شارژ {fa(MIN_CHARGE.toLocaleString("en-US"))} تومان
            </div>
          </div>
        </Card>

        {apiNote && (
          <p className="mx-4 mt-3 rounded-xl border border-line/10 bg-tile/40 px-3 py-2 text-center text-[11px] text-silver">
            {apiNote}
          </p>
        )}

        <Card className="mx-4 mt-4 space-y-3 p-4">
          <div className="text-sm font-extrabold">افزایش موجودی</div>
          <input
            value={fa(chargeAmount.replace(/\D/g, ""))}
            onChange={(e) => setChargeAmount(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="surface w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            placeholder={fa(String(MIN_CHARGE))}
          />
          {!chargeValid && chargeAmount.length > 0 && (
            <p className="text-[11px] text-red-400">حداقل مبلغ شارژ {fa(MIN_CHARGE.toLocaleString("en-US"))} تومان است.</p>
          )}
          <VamButton onClick={onCharge} loading={charging} disabled={!loggedIn || !chargeValid}>
            <Plus size={18} /> شارژ کیف پول
          </VamButton>
          {!loggedIn && (
            <p className="text-center text-[11px] text-silver">برای شارژ، ابتدا از تب پروفایل وارد شوید.</p>
          )}
        </Card>

        <Card className="mx-4 mt-4 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-extrabold">روند ۷ روز</span>
            <TrendingUp size={18} className="text-brand" />
          </div>
          {loading ? (
            <p className="text-center text-xs text-silver">در حال بارگذاری…</p>
          ) : (
            <TrendChart points={trend} />
          )}
        </Card>

        <Card className="mx-4 mt-4 divide-y divide-line/10 p-0">
          <div className="px-4 py-3 text-sm font-extrabold">تراکنش‌ها</div>
          {txs.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-silver">تراکنشی ثبت نشده است.</p>
          ) : (
            txs.slice(0, 20).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div className="text-right">
                  <div className="font-bold">{tx.title}</div>
                  <div className="text-[10px] text-silver">{tx.at}</div>
                </div>
                <span className={`font-extrabold ${tx.kind === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.kind === "credit" ? "+" : "−"}
                  {formatToman(tx.amount)}
                </span>
              </div>
            ))
          )}
        </Card>

        <p className="mx-4 mt-4 rounded-2xl border border-brand/15 bg-brand/5 p-3 text-[11px] leading-6 text-silver">
          <span className="font-bold text-brand">نکته:</span> هزینه استعلام‌ها از کیف پول کسر می‌شود. با شارژ یک‌جا،
          درخواست سرویس‌ها سریع‌تر انجام می‌شود.
        </p>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  History,
  Lightbulb,
  Plus,
  ReceiptText,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { ServiceHeader, VamButton } from "@/src/components/services/shared";
import { Card } from "@/src/components/ui/Card";
import { fa } from "@/src/lib/format";
import {
  MIN_WALLET_CHARGE,
  TrendPoint,
  WalletState,
  chargeWallet,
  loadWallet,
  useWalletListener,
} from "@/src/lib/walletStore";

const PRESET_AMOUNTS = [100_000, 200_000, 500_000, 1_000_000];

function formatToman(n: number) {
  return fa(Math.abs(n).toLocaleString("en-US"));
}

function BalanceTrendChart({ points, currentBalance }: { points: TrendPoint[]; currentBalance: number }) {
  const w = 310;
  const h = 110;
  const padX = 14;
  const padTop = 26;
  const padBottom = 16;

  const vals = points.map((p) => p.balance);
  const min = 0;
  const max = Math.max(...vals, 100_000);

  const coords = points.map((p, i) => {
    const x = padX + (i / Math.max(1, points.length - 1)) * (w - padX * 2);
    const y = h - padBottom - ((p.balance - min) / Math.max(1, max - min)) * (h - padTop - padBottom);
    return { x, y, ...p };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${h - padBottom} L ${coords[0].x.toFixed(1)} ${h - padBottom} Z`
      : "";

  const last = coords[coords.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible text-brand" aria-hidden>
        <defs>
          <linearGradient id="walletAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* خطوط افقی راهنما */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padTop + (1 - ratio) * (h - padTop - padBottom);
          return (
            <line
              key={ratio}
              x1={padX}
              x2={w - padX}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
          );
        })}

        {areaPath && <path d={areaPath} fill="url(#walletAreaGrad)" />}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {coords.map((c, idx) => (
          <circle
            key={idx}
            cx={c.x}
            cy={c.y}
            r={idx === coords.length - 1 ? 4.5 : 3}
            fill={idx === coords.length - 1 ? "#ffffff" : "currentColor"}
            stroke="currentColor"
            strokeWidth={idx === coords.length - 1 ? 2.5 : 1.5}
          />
        ))}
      </svg>

      {last && (
        <div className="absolute left-2 top-0 rounded-lg bg-ink/90 px-2 py-0.5 text-[10px] font-black text-bg shadow">
          {formatToman(currentBalance)}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between px-2 text-[10px] text-silver">
        {points.map((p, idx) => (
          <span key={idx}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}

export function WalletScreen() {
  const [wallet, setWallet] = useState<WalletState>(() => loadWallet());
  const [hidden, setHidden] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(String(MIN_WALLET_CHARGE));
  const [charging, setCharging] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const txSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWallet(loadWallet());
    return useWalletListener(() => setWallet(loadWallet()));
  }, []);

  const chargeNum = useMemo(() => Number(chargeAmount.replace(/\D/g, "")) || 0, [chargeAmount]);
  const chargeValid = chargeNum >= MIN_WALLET_CHARGE;

  const handleCharge = async () => {
    if (!chargeValid || charging) return;
    setCharging(true);
    setNote(null);
    await new Promise((r) => setTimeout(r, 700));
    const res = chargeWallet(chargeNum);
    setCharging(false);
    if (!res.ok) {
      setNote(res.error || "خطا در شارژ کیف پول");
      return;
    }
    setWallet(res.state);
    setChargeOpen(false);
    setNote(`کیف پول به مبلغ ${formatToman(chargeNum)} تومان شارژ شد.`);
  };

  return (
    <div className="app-bg relative mx-auto flex h-screen max-w-[430px] flex-col overflow-hidden text-ink sm:shadow-[0_0_60px_rgba(8,123,255,.25)]">
      <ServiceHeader title="کیف پول" />

      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        {/* کارت موجودی اصلی */}
        <Card className="mx-4 mt-4 overflow-hidden border-0 p-0 shadow-lg shadow-brand/20">
          <div className="relative bg-gradient-to-br from-brand via-[#0a54d6] to-[#082c7d] p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right">
                <div className="text-xs font-medium text-white/80">موجودی کیف پول شما</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-3xl font-black tracking-tight" dir="ltr">
                    {hidden ? "•••••••" : formatToman(wallet.balance)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHidden((h) => !h)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/15 active:scale-95 transition-transform"
                    aria-label={hidden ? "نمایش موجودی" : "مخفی کردن موجودی"}
                  >
                    {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-xs font-bold text-white/80">تومان</div>
              </div>

              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Wallet size={30} className="text-white" />
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold">
              <TrendingUp size={13} className="text-emerald-300" />
              <span className="text-white/80">تغییرات این ماه:</span>
              <span className="text-emerald-300" dir="ltr">
                +{fa(String(wallet.monthlyChangePct))}٪
              </span>
            </div>
          </div>
        </Card>

        {note && (
          <div className="mx-4 mt-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-center text-xs font-bold text-emerald-500">
            {note}
          </div>
        )}

        {/* دو دکمه اکشن اصلی مطابق طرح */}
        <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setChargeOpen(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-white shadow-md shadow-brand/25 active:scale-[0.98] transition-transform"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
              <Plus size={20} />
            </span>
            <span className="text-xs font-extrabold">شارژ کیف پول</span>
          </button>

          <button
            type="button"
            onClick={() => txSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="surface flex flex-col items-center justify-center gap-2 rounded-2xl border border-line/10 py-4 text-ink active:scale-[0.98] transition-transform"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
              <ReceiptText size={20} />
            </span>
            <span className="text-xs font-extrabold">تراکنش‌ها</span>
          </button>
        </div>

        {/* نمودار روند موجودی */}
        <Card className="mx-4 mt-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-extrabold">روند موجودی</span>
            <TrendingUp size={18} className="text-brand" />
          </div>
          <BalanceTrendChart points={wallet.trend} currentBalance={wallet.balance} />
        </Card>

        {/* آخرین تراکنش‌ها */}
        <Card ref={txSectionRef} className="mx-4 mt-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-extrabold">آخرین تراکنش‌ها</span>
            <History size={18} className="text-brand" />
          </div>

          {wallet.txs.length === 0 ? (
            <p className="py-6 text-center text-xs text-silver">تراکنشی ثبت نشده است.</p>
          ) : (
            <div className="space-y-2.5">
              {wallet.txs.slice(0, 20).map((tx) => {
                const isCredit = tx.kind === "credit";
                const iconBg =
                  tx.icon === "reward"
                    ? "bg-purple-500/15 text-purple-400"
                    : isCredit
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-400";

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-line/10 bg-tile/30 px-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${iconBg}`}>
                        {tx.icon === "reward" ? (
                          <Gift size={18} />
                        ) : isCredit ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <CreditCard size={18} />
                        )}
                      </span>
                      <div className="min-w-0 text-right">
                        <div className="truncate text-xs font-extrabold text-ink">{tx.title}</div>
                        <div className="mt-0.5 text-[10px] text-silver">{tx.at}</div>
                      </div>
                    </div>

                    <span
                      dir="ltr"
                      className={`shrink-0 text-xs font-black ${
                        isCredit ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatToman(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* بنر راهنما پایین صفحه */}
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/10 p-3.5 text-xs leading-6 text-ink">
          <Lightbulb size={22} className="shrink-0 text-brand" />
          <span>با شارژ کیف پول، پرداخت اقساط و سایر خدمات را سریع‌تر انجام دهید.</span>
        </div>
      </main>

      {/* مودال شارژ کیف پول (حداقل ۱۰۰ هزار تومان) */}
      {chargeOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center">
          <div className="w-full max-w-[400px] rounded-[28px] border border-line/10 bg-card p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-extrabold">شارژ کیف پول</h3>
              <button
                type="button"
                onClick={() => setChargeOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-tile"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setChargeAmount(String(amt))}
                  className={`rounded-xl border py-2.5 text-xs font-extrabold transition-all ${
                    chargeNum === amt
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-line/10 surface text-ink"
                  }`}
                >
                  {formatToman(amt)} تومان
                </button>
              ))}
            </div>

            <label className="mb-1.5 block text-xs font-bold text-silver">مبلغ دلخواه (تومان)</label>
            <input
              value={fa(chargeAmount.replace(/\D/g, ""))}
              onChange={(e) => setChargeAmount(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              className="surface w-full rounded-xl border border-line/15 px-3.5 py-3 text-sm font-bold outline-none focus:border-brand"
              placeholder={formatToman(MIN_WALLET_CHARGE)}
            />

            {!chargeValid && (
              <p className="mt-2 text-[11px] font-bold text-red-400">
                حداقل مبلغ شارژ کیف پول {formatToman(MIN_WALLET_CHARGE)} تومان است.
              </p>
            )}

            <VamButton className="mt-4" onClick={handleCharge} loading={charging} disabled={!chargeValid}>
              پرداخت و افزایش موجودی
            </VamButton>
          </div>
        </div>
      )}
    </div>
  );
}
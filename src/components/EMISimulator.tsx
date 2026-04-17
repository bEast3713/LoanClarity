"use client";

import { useEffect, useMemo, useState } from "react";

import { formatINR } from "@/components/ui";

type Bank = {
  id: string;
  bank_name: string;
  min_rate: number;
  max_rate: number;
  processing_fee: number;
  moratorium_months: number;
};

type EmiRes = {
  monthly_emi: number;
  total_interest: number;
  total_payable: number;
  moratorium_interest: number;
};

export function EMISimulator({ totalCost }: { totalCost: number }) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankId, setBankId] = useState<string>("");
  const [amount, setAmount] = useState<number>(Math.min(totalCost, 1200000));
  const [tenureYears, setTenureYears] = useState<number>(7);
  const [rate, setRate] = useState<number>(10.5);
  const [includeMoratorium, setIncludeMoratorium] = useState<boolean>(true);
  const [emi, setEmi] = useState<EmiRes | null>(null);

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === bankId) ?? null,
    [banks, bankId],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/banks", { cache: "no-store" });
      const json = (await res.json()) as { banks: Bank[] };
      if (!cancelled) {
        const list = json.banks ?? [];
        setBanks(list);
        if (list.length > 0 && !bankId) {
          setBankId(list[0].id);
          const mid = (list[0].min_rate + list[0].max_rate) / 2;
          setRate(Math.round(mid * 100) / 100);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function calc() {
      const mor = includeMoratorium ? selectedBank?.moratorium_months ?? 0 : 0;
      const res = await fetch(
        `/api/emi?amount=${amount}&rate=${rate}&tenure=${tenureYears}&moratorium=${mor}`,
        { cache: "no-store" },
      );
      const json = (await res.json()) as EmiRes;
      if (!cancelled) setEmi(json);
    }
    void calc();
    return () => {
      cancelled = true;
    };
  }, [amount, rate, tenureYears, includeMoratorium, selectedBank?.moratorium_months]);

  function onPickBank(nextId: string) {
    setBankId(nextId);
    const b = banks.find((x) => x.id === nextId);
    if (b) {
      const mid = (b.min_rate + b.max_rate) / 2;
      setRate(Math.round(mid * 100) / 100);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">EMI simulator</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Live EMI based on loan amount, tenure, and interest rate
          </div>
        </div>
        <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
          Suggested loan: {formatINR(amount)}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Bank
          </label>
          <select
            value={bankId}
            onChange={(e) => onPickBank(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          >
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bank_name}
              </option>
            ))}
          </select>
          {selectedBank ? (
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Rate range: {selectedBank.min_rate}%–{selectedBank.max_rate}% •
              Moratorium: {selectedBank.moratorium_months} months
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Loan amount (₹)
            </label>
            <input
              type="range"
              min={100000}
              max={Math.max(200000, Math.ceil(totalCost / 50000) * 50000)}
              step={50000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-sm font-semibold">{formatINR(amount)}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Tenure (years)
            </label>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-sm font-semibold">{tenureYears} years</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Interest rate (% p.a.)
            </label>
            <input
              type="range"
              min={5}
              max={20}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-sm font-semibold">{rate.toFixed(2)}%</div>
          </div>

          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeMoratorium}
                onChange={(e) => setIncludeMoratorium(e.target.checked)}
              />
              Include moratorium interest
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Monthly EMI
          </div>
          <div className="mt-1 text-lg font-semibold">
            {emi ? formatINR(emi.monthly_emi) : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Total interest
          </div>
          <div className="mt-1 text-lg font-semibold">
            {emi ? formatINR(emi.total_interest) : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Total payable
          </div>
          <div className="mt-1 text-lg font-semibold">
            {emi ? formatINR(emi.total_payable) : "—"}
          </div>
        </div>
      </div>

      {includeMoratorium && emi ? (
        <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Moratorium simple interest estimate:{" "}
          <span className="font-medium">{formatINR(emi.moratorium_interest)}</span>
        </div>
      ) : null}
    </section>
  );
}


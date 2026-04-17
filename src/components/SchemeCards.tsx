"use client";

import { useEffect, useState } from "react";

import { formatINR } from "@/components/ui";

type Scheme = {
  id: string;
  name: string;
  provider: string | null;
  max_amount: number | null;
  income_limit: number | null;
  category: string[] | null;
  states: string[] | null;
  deadline: string | null;
  apply_url: string | null;
};

export function SchemeCards({ state }: { state: string }) {
  const [income, setIncome] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (state) params.set("state", state);
      if (category) params.set("category", category);
      if (income.trim()) params.set("income", income.trim());

      const res = await fetch(`/api/schemes?${params.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as { schemes: Scheme[] };
      if (!cancelled) setSchemes(json.schemes ?? []);
      if (!cancelled) setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [state, category, income]);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold">Scholarship & scheme matcher</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Filters: income, category, and state
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Income (₹/yr)
            </label>
            <input
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g., 450000"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            >
              {["General", "OBC", "SC", "ST"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Loading…</div>
      ) : schemes.length === 0 ? (
        <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No matches (try removing income/category filters).
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {schemes.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Provider: {s.provider ?? "—"}
                  </div>
                </div>
                {s.max_amount != null ? (
                  <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium dark:border-zinc-800 dark:bg-zinc-900">
                    Up to {formatINR(s.max_amount)}
                  </div>
                ) : null}
              </div>

              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {s.income_limit != null ? (
                  <div>Income limit: ≤ {formatINR(s.income_limit)}</div>
                ) : (
                  <div>Income limit: —</div>
                )}
                <div className="mt-1">
                  Categories: {s.category?.join(", ") ?? "—"}
                </div>
              </div>

              {s.apply_url ? (
                <a
                  className="mt-4 inline-flex text-sm font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                  href={s.apply_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Apply link
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


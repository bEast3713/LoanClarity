"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AIChatWidget } from "@/components/AIChatWidget";
import { AlertModal } from "@/components/AlertModal";
import { CostSummaryCard } from "@/components/CostSummaryCard";
import { EMISimulator } from "@/components/EMISimulator";
import { SchemeCards } from "@/components/SchemeCards";
import { YearBreakdownTable } from "@/components/YearBreakdownTable";

type CostRow = {
  year: number;
  tuition_fee: number | null;
  hostel_fee: number | null;
  exam_fee: number | null;
  misc_fee: number | null;
  updated_at: string | null;
};

type CostResponse = {
  college_id?: string;
  college?: string;
  course: string;
  updated_at: string | null;
  rows: CostRow[];
  totals: Record<string, number>;
  total_cost: number;
  error?: string;
};

export function DashboardClient({
  initial,
}: {
  initial: { college: string; course: string; state: string };
}) {
  const [loading, setLoading] = useState(true);
  const [cost, setCost] = useState<CostResponse | null>(null);
  const [inflation, setInflation] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/cost?college=${encodeURIComponent(initial.college)}&course=${encodeURIComponent(initial.course)}`,
          { cache: "no-store" },
        );
        const json = (await res.json()) as CostResponse;
        if (!res.ok) throw new Error(json.error ?? "Failed to load cost");
        if (!cancelled) setCost(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [initial.college, initial.course]);

  const displayRows = useMemo(() => {
    if (!cost) return [];
    if (!inflation) return cost.rows;
    return cost.rows.map((r) => {
      const factor = Math.pow(1.05, Math.max(0, r.year - 1));
      return {
        ...r,
        tuition_fee: r.tuition_fee == null ? null : Math.round(r.tuition_fee * factor),
        hostel_fee: r.hostel_fee == null ? null : Math.round(r.hostel_fee * factor),
        exam_fee: r.exam_fee == null ? null : Math.round(r.exam_fee * factor),
        misc_fee: r.misc_fee == null ? null : Math.round(r.misc_fee * factor),
      };
    });
  }, [cost, inflation]);

  const collegeId =
    cost?.college_id ??
    (initial.college.startsWith("id:") ? initial.college.slice(3) : null);

  const title = initial.college.startsWith("name:")
    ? initial.college.slice(5)
    : initial.college.startsWith("id:")
      ? "Selected college"
      : initial.college;

  return (
    <main className="mt-10 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {initial.course || "Course"} • {initial.state || "India"}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAlertOpen(true)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Set alert
          </button>
          <Link
            href="/"
            className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
          >
            New search
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Loading cost dashboard…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-zinc-900 dark:text-red-300">
          {error}
        </div>
      ) : cost ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CostSummaryCard
              totalCost={cost.total_cost}
              totals={cost.totals}
              updatedAt={cost.updated_at}
            />

            <YearBreakdownTable
              rows={displayRows}
              inflation={inflation}
              onToggleInflation={() => setInflation((v) => !v)}
            />

            <EMISimulator totalCost={cost.total_cost} />

            <SchemeCards state={initial.state} />
          </div>

          <div className="lg:col-span-1">
            <AIChatWidget
              context={{
                college_name: title,
                course: initial.course,
                state: initial.state,
                total_cost: cost.total_cost,
              }}
            />
          </div>
        </div>
      ) : null}

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        collegeId={collegeId}
        course={initial.course}
      />
    </main>
  );
}


import { formatDate, formatINR } from "@/components/ui";

export function CostSummaryCard({
  totalCost,
  totals,
  updatedAt,
}: {
  totalCost: number;
  totals: Record<string, number>;
  updatedAt: string | null;
}) {
  const items: Array<{ label: string; value: number }> = [
    { label: "Tuition", value: totals.tuition ?? 0 },
    { label: "Hostel", value: totals.hostel ?? 0 },
    { label: "Books & Supplies", value: totals.books ?? 0 },
    { label: "Exam Fees", value: totals.exam ?? 0 },
    { label: "Miscellaneous", value: totals.misc ?? 0 },
  ].filter((i) => i.value > 0);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Total cost estimate (4 years)
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">
            {formatINR(totalCost)}
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Data last updated: {formatDate(updatedAt)}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Confidence: seed/demo data
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.label}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {i.label}
            </div>
            <div className="mt-1 text-sm font-semibold">{formatINR(i.value)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


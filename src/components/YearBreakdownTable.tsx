import { formatINR } from "@/components/ui";

type Row = {
  year: number;
  tuition_fee: number | null;
  hostel_fee: number | null;
  exam_fee: number | null;
  misc_fee: number | null;
};

function rowTotal(r: Row) {
  return (
    (r.tuition_fee ?? 0) +
    (r.hostel_fee ?? 0) +
    (r.exam_fee ?? 0) +
    (r.misc_fee ?? 0)
  );
}

export function YearBreakdownTable({
  rows,
  inflation,
  onToggleInflation,
}: {
  rows: Row[];
  inflation: boolean;
  onToggleInflation: () => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Year-wise breakdown</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Tuition + hostel + exam + misc
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleInflation}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          {inflation ? "Inflation: ON (5%/yr)" : "Show with inflation (5%/yr)"}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-zinc-500 dark:text-zinc-400">
            <tr>
              <th className="py-2 pr-3">Year</th>
              <th className="py-2 pr-3">Tuition</th>
              <th className="py-2 pr-3">Hostel</th>
              <th className="py-2 pr-3">Exam</th>
              <th className="py-2 pr-3">Misc</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-t border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-3 font-medium">Year {r.year}</td>
                <td className="py-2 pr-3">{formatINR(r.tuition_fee ?? 0)}</td>
                <td className="py-2 pr-3">{formatINR(r.hostel_fee ?? 0)}</td>
                <td className="py-2 pr-3">{formatINR(r.exam_fee ?? 0)}</td>
                <td className="py-2 pr-3">{formatINR(r.misc_fee ?? 0)}</td>
                <td className="py-2 font-semibold">{formatINR(rowTotal(r))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


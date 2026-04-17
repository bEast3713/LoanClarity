"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type College = {
  id: string;
  name: string;
  state: string | null;
  type: string | null;
};

const COURSE_OPTIONS = [
  "B.Tech CSE",
  "B.Tech ECE",
  "B.Tech Mechanical",
  "B.Tech Civil",
] as const;

export function CollegeSearch() {
  const router = useRouter();
  const [collegeQuery, setCollegeQuery] = useState("");
  const [course, setCourse] = useState<(typeof COURSE_OPTIONS)[number]>(
    COURSE_OPTIONS[0],
  );
  const [state, setState] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [selected, setSelected] = useState<College | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean((selected?.id && course) || (collegeQuery.trim() && course));
  }, [selected?.id, course, collegeQuery]);

  async function onSearch(q: string) {
    setCollegeQuery(q);
    setSelected(null);
    setError(null);

    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?q=${encodeURIComponent(trimmed)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to search colleges");
      const data = (await res.json()) as { colleges: College[] };
      setResults(data.colleges ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function go() {
    const collegeId = selected?.id;
    const collegeName = selected?.name ?? collegeQuery.trim();
    const collegeParam = collegeId ? `id:${collegeId}` : `name:${collegeName}`;

    const params = new URLSearchParams();
    params.set("college", collegeParam);
    params.set("course", course);
    if (state.trim()) params.set("state", state.trim());
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
            College
          </label>
          <input
            value={selected?.name ?? collegeQuery}
            onChange={(e) => void onSearch(e.target.value)}
            placeholder="e.g., NIT Trichy"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          />
          <div className="mt-2">
            {loading ? (
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Searching…
              </div>
            ) : null}
            {error ? (
              <div className="text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : null}
            {!selected && results.length > 0 ? (
              <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
                {results.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelected(c);
                      setCollegeQuery(c.name);
                      setResults([]);
                      if (!state && c.state) setState(c.state);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {(c.type ?? "College") + (c.state ? ` • ${c.state}` : "")}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Course
          </label>
          <select
            value={course}
            onChange={(e) =>
              setCourse(e.target.value as (typeof COURSE_OPTIONS)[number])
            }
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          >
            {COURSE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
            State (optional)
          </label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g., Tamil Nadu"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={go}
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
      >
        Calculate My Loan
      </button>
    </div>
  );
}


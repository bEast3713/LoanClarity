import Link from "next/link";

import { DashboardClient } from "@/components/DashboardClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const college = typeof sp.college === "string" ? sp.college : "";
  const course = typeof sp.course === "string" ? sp.course : "";
  const state = typeof sp.state === "string" ? sp.state : "";

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="h-9 w-9 rounded-xl bg-zinc-950 text-zinc-50 grid place-items-center font-semibold dark:bg-zinc-50 dark:text-zinc-950"
            >
              LC
            </Link>
            <div className="leading-tight">
              <div className="font-semibold">LoanClarity</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Cost dashboard
              </div>
            </div>
          </div>
          <nav className="text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="hover:underline" href="/alerts">
              Alerts
            </Link>
          </nav>
        </header>

        <DashboardClient initial={{ college, course, state }} />
      </div>
    </div>
  );
}


import Link from "next/link";

import { CollegeSearch } from "@/components/CollegeSearch";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-950 text-zinc-50 grid place-items-center font-semibold dark:bg-zinc-50 dark:text-zinc-950">
              LC
            </div>
            <div className="leading-tight">
              <div className="font-semibold">LoanClarity</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                STEM education loan transparency (India)
              </div>
            </div>
          </div>
          <nav className="text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="hover:underline" href="/alerts">
              Alerts
            </Link>
          </nav>
        </header>

        <main className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight">
              Know exactly what your STEM degree will cost you.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300">
              Enter your college + course to get an instant total cost breakdown, an EMI
              simulator, and a plain-language loan advisor.
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CollegeSearch />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-800">
                Sources: NIRF • RBI • UGC (demo seed)
              </span>
              <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-800">
                No login required to view
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">What you get</div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              <li>
                <span className="font-medium">Total cost breakdown</span> (tuition, hostel,
                books, exam fees)
              </li>
              <li>
                <span className="font-medium">EMI simulator</span> with bank rates and optional
                moratorium interest
              </li>
              <li>
                <span className="font-medium">Scheme matcher</span> (income/category/state)
              </li>
              <li>
                <span className="font-medium">AI loan advisor</span> that explains jargon in
                plain language
              </li>
            </ul>
          </div>
        </main>

        <footer className="mt-14 text-xs text-zinc-500 dark:text-zinc-400">
          Prototype for hackathon demo. Not financial advice.
        </footer>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="h-9 w-9 rounded-xl bg-zinc-950 text-zinc-50 grid place-items-center font-semibold dark:bg-zinc-50 dark:text-zinc-950"
          >
            LC
          </Link>
          <nav className="text-sm text-zinc-600 dark:text-zinc-300">
            <Link className="hover:underline" href="/dashboard">
              Dashboard
            </Link>
          </nav>
        </header>

        <main className="mt-10 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Profile (optional)</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            This hackathon prototype doesn’t implement Supabase Auth yet. If you want, we can
            add Google OAuth + saved comparisons here.
          </p>
        </main>
      </div>
    </div>
  );
}


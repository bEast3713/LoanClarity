import Link from "next/link";

export default function AlertsPage() {
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

        <main className="mt-10 space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            For the hackathon prototype, alerts are set from the dashboard (click{" "}
            <span className="font-medium">Set alert</span>). That flow stores a subscription
            in Supabase and triggers an n8n webhook (if configured).
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">n8n wiring</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Set <code className="font-mono">N8N_WEBHOOK_URL</code> in{" "}
              <code className="font-mono">.env.local</code> to receive alert subscription
              payloads and send email/WhatsApp confirmations.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
          >
            Back to search
          </Link>
        </main>
      </div>
    </div>
  );
}


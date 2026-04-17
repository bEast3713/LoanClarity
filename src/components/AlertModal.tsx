"use client";

import { useEffect, useState } from "react";

export function AlertModal({
  open,
  onClose,
  collegeId,
  course,
}: {
  open: boolean;
  onClose: () => void;
  collegeId: string | null;
  course: string;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [viaEmail, setViaEmail] = useState(true);
  const [viaWhatsapp, setViaWhatsapp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStatus(null);
      setLoading(false);
    }
  }, [open]);

  async function submit() {
    if (!collegeId) {
      setStatus("Pick a college from search first (so we have a college_id).");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const notify_via = [
        ...(viaEmail ? (["email"] as const) : []),
        ...(viaWhatsapp ? (["whatsapp"] as const) : []),
      ];
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phone.trim() ? phone.trim() : null,
          college_id: collegeId,
          course,
          notify_via,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; id?: string; demo?: boolean };
      if (!res.ok) throw new Error(json.error ?? "Failed to subscribe");
      setStatus(json.demo ? "Subscribed (demo mode). n8n webhook triggered if configured." : `Subscribed! id=${json.id}`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Set alerts</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Get notified when fees or interest rates change (email/WhatsApp)
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Phone (optional, for WhatsApp)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91..."
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            />
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={viaEmail}
                onChange={(e) => setViaEmail(e.target.checked)}
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={viaWhatsapp}
                onChange={(e) => setViaWhatsapp(e.target.checked)}
              />
              WhatsApp
            </label>
          </div>
        </div>

        {status ? (
          <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            {status}
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={loading || !email || (!viaEmail && !viaWhatsapp)}
            className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
          >
            {loading ? "Saving…" : "Subscribe"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


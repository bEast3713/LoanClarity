import { env } from "@/lib/env";

export async function triggerN8nWebhook(payload: unknown) {
  const url = env("N8N_WEBHOOK_URL");
  if (!url) return { ok: false as const, skipped: true as const };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env("N8N_API_KEY") ? { Authorization: `Bearer ${env("N8N_API_KEY")}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false as const, skipped: false as const, status: res.status };
  }
  return { ok: true as const, skipped: false as const };
}


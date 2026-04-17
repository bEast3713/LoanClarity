import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const expected = env("N8N_CRON_SECRET");
  if (!expected) {
    return NextResponse.json(
      { error: "Missing N8N_CRON_SECRET on server" },
      { status: 500 },
    );
  }

  const provided = req.headers.get("x-n8n-secret");
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Allow a safe no-op if Supabase isn't configured (demo/dev).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createSupabaseAdmin();

  // Minimal "linked" action: read subscriptions so you can confirm the cron call works.
  const { count, error } = await supabase
    .from("alert_subscriptions")
    .select("id", { count: "exact", head: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    alert_subscriptions: count ?? 0,
    ran_at: new Date().toISOString(),
  });
}


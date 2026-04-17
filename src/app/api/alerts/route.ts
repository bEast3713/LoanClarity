import { NextResponse } from "next/server";
import { z } from "zod";

import { triggerN8nWebhook } from "@/lib/n8n";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  college_id: z.string().min(1),
  course: z.string().min(1),
  notify_via: z.array(z.enum(["email", "whatsapp"])).min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, phone, college_id, course, notify_via } = parsed.data;

  // Allow hackathon demo even before Supabase is configured.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const webhook = await triggerN8nWebhook({
      kind: "alert_subscription",
      email,
      phone,
      college_id,
      course,
      notify_via,
    });
    return NextResponse.json({ ok: true, demo: true, webhook });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("alert_subscriptions")
    .insert({
      email,
      phone: phone ?? null,
      college_id,
      course,
      notify_via,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const webhook = await triggerN8nWebhook({
    kind: "alert_subscription",
    subscription_id: data.id,
    email,
    phone,
    college_id,
    course,
    notify_via,
  });

  return NextResponse.json({ ok: true, id: data.id, webhook });
}


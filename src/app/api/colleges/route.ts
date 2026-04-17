import { NextResponse } from "next/server";

import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  // Allow UI to still work with seed-like results even before env is set.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const colleges = [
      {
        id: "seed-iitb",
        name: "IIT Bombay",
        state: "Maharashtra",
        type: "IIT",
      },
      {
        id: "seed-nitt",
        name: "NIT Trichy",
        state: "Tamil Nadu",
        type: "NIT",
      },
      {
        id: "seed-bits",
        name: "BITS Pilani",
        state: "Rajasthan",
        type: "Private",
      },
      {
        id: "seed-vit",
        name: "VIT Vellore",
        state: "Tamil Nadu",
        type: "Private",
      },
      {
        id: "seed-dce",
        name: "Delhi College of Engineering",
        state: "Delhi",
        type: "Govt",
      },
    ].filter((c) => (q.length < 1 ? true : c.name.toLowerCase().includes(q.toLowerCase())));

    return NextResponse.json({ colleges });
  }

  const supabase = createSupabaseAdmin();

  const query = supabase
    .from("colleges")
    .select("id,name,state,type")
    .order("nirf_rank", { ascending: true, nullsFirst: false })
    .limit(15);

  const { data, error } =
    q.length > 0 ? await query.ilike("name", `%${q}%`) : await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ colleges: data ?? [] });
}


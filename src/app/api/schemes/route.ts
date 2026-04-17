import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const QuerySchema = z.object({
  state: z.string().optional(),
  category: z.string().optional(),
  income: z.coerce.number().finite().nonnegative().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    state: searchParams.get("state") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    income: searchParams.get("income") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { state, category, income } = parsed.data;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const schemes = [
      {
        id: "seed-vidyalakshmi",
        name: "PM Vidyalakshmi",
        provider: "Central",
        max_amount: 1000000,
        income_limit: null,
        category: ["SC", "ST", "OBC", "General"] as string[],
        states: [] as string[],
        deadline: null,
        apply_url: "https://www.vidyalakshmi.co.in/",
      },
      {
        id: "seed-central-sector",
        name: "Central Sector Scholarship",
        provider: "Central",
        max_amount: 50000,
        income_limit: 450000,
        category: ["SC", "ST", "OBC", "General"] as string[],
        states: [] as string[],
        deadline: null,
        apply_url: "https://scholarships.gov.in/",
      },
      {
        id: "seed-post-matric",
        name: "SC/ST/OBC Post-Matric Scholarship (State)",
        provider: "State",
        max_amount: 100000,
        income_limit: null,
        category: ["SC", "ST", "OBC"] as string[],
        states: [] as string[],
        deadline: null,
        apply_url: "https://scholarships.gov.in/",
      },
    ].filter((s) => {
      if (income != null && s.income_limit != null && income > s.income_limit)
        return false;
      if (category && Array.isArray(s.category) && !s.category.includes(category))
        return false;
      if (state && Array.isArray(s.states) && s.states.length > 0 && !s.states.includes(state))
        return false;
      return true;
    });
    return NextResponse.json({ schemes });
  }

  const supabase = createSupabaseAdmin();
  let query = supabase.from("schemes").select("*").order("deadline", { ascending: true });

  if (income != null) {
    query = query.or(`income_limit.is.null,income_limit.gte.${income}`);
  }
  if (category) {
    query = query.contains("category", [category]);
  }
  if (state) {
    query = query.or(`states.eq.{} ,states.cs.{${state}}`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ schemes: data ?? [] });
}


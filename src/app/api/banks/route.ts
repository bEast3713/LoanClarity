import { NextResponse } from "next/server";

import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      banks: [
        {
          id: "seed-sbi",
          bank_name: "SBI Scholar Loan",
          min_rate: 8.15,
          max_rate: 10.5,
          processing_fee: 0,
          moratorium_months: 12,
          max_amount: 2000000,
          updated_at: new Date().toISOString(),
        },
        {
          id: "seed-axis",
          bank_name: "Axis Bank Education Loan",
          min_rate: 13.7,
          max_rate: 15.2,
          processing_fee: 15000,
          moratorium_months: 12,
          max_amount: 4000000,
          updated_at: new Date().toISOString(),
        },
        {
          id: "seed-hdfc",
          bank_name: "HDFC Credila",
          min_rate: 11.0,
          max_rate: 13.5,
          processing_fee: 10000,
          moratorium_months: 12,
          max_amount: 5000000,
          updated_at: new Date().toISOString(),
        },
        {
          id: "seed-canara",
          bank_name: "Canara Bank Vidya Turant",
          min_rate: 9.5,
          max_rate: 11.0,
          processing_fee: 0,
          moratorium_months: 12,
          max_amount: 2000000,
          updated_at: new Date().toISOString(),
        },
        {
          id: "seed-pnb",
          bank_name: "Punjab National Bank",
          min_rate: 8.65,
          max_rate: 10.75,
          processing_fee: 0,
          moratorium_months: 12,
          max_amount: 2000000,
          updated_at: new Date().toISOString(),
        },
      ],
      cached_for_seconds: 0,
    });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("bank_loan_rates")
    .select("*")
    .order("bank_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const res = NextResponse.json({ banks: data ?? [], cached_for_seconds: 3600 });
  res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60");
  return res;
}


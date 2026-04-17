import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateEmi } from "@/lib/emi";

export const runtime = "nodejs";

const QuerySchema = z.object({
  amount: z.coerce.number().finite().nonnegative(),
  rate: z.coerce.number().finite().nonnegative(),
  tenure: z.coerce.number().finite().positive(),
  moratorium: z.coerce.number().finite().nonnegative().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    amount: searchParams.get("amount"),
    rate: searchParams.get("rate"),
    tenure: searchParams.get("tenure"),
    moratorium: searchParams.get("moratorium") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { amount, rate, tenure, moratorium } = parsed.data;
  const result = calculateEmi({
    principal: amount,
    annualRatePercent: rate,
    tenureMonths: Math.round(tenure * 12),
    moratoriumMonths: moratorium ? Math.round(moratorium) : 0,
  });

  return NextResponse.json(result);
}


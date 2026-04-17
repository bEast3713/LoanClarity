import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/lib/env";

export type LoanClarityContext = {
  college_name: string;
  college_type?: string | null;
  state?: string | null;
  course: string;
  total_cost_inr?: number | null;
  avg_rate_percent?: number | null;
};

export function buildSystemPrompt(ctx: LoanClarityContext) {
  const totalCost =
    typeof ctx.total_cost_inr === "number"
      ? `₹${Math.round(ctx.total_cost_inr).toLocaleString("en-IN")}`
      : "unknown";
  const avgRate =
    typeof ctx.avg_rate_percent === "number" ? `${ctx.avg_rate_percent}%` : "unknown";

  return `You are LoanClarity AI, a financial education assistant for STEM students in India.

Current student context:
- College: ${ctx.college_name}${ctx.college_type ? ` (${ctx.college_type})` : ""}${ctx.state ? `, ${ctx.state}` : ""}
- Course: ${ctx.course}
- Estimated 4-year cost: ${totalCost}
- Average bank rate: ${avgRate}

Your job:
1. Answer questions about this student's specific loan situation
2. Reply in English only. Do not mix languages (no Hinglish). If the user writes fully in Hindi, reply in Hindi (Devanagari script) only.
3. Always explain jargon in one plain sentence before answering
4. Never give specific investment advice — refer to a financial advisor for that
5. Keep answers under 150 words
6. If asked about eligibility, ask for income bracket and category first

Never fabricate interest rates or scheme amounts. Say "I don't have that data" if unsure.`;
}

export function geminiClient() {
  const key = env("GOOGLE_GEMINI_API_KEY");
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}


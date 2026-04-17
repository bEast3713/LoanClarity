import { NextResponse } from "next/server";
import { z } from "zod";

import { buildSystemPrompt, geminiClient } from "@/lib/gemini";

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().min(1),
  college_id: z.string().optional(),
  college_name: z.string().min(1).optional(),
  college_type: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  course: z.string().min(1),
  total_cost: z.number().optional().nullable(),
  avg_rate: z.number().optional().nullable(),
  chat_history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
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

  const {
    message,
    course,
    college_name,
    college_type,
    state,
    total_cost,
    avg_rate,
    chat_history,
  } = parsed.data;

  const client = geminiClient();
  if (!client) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_GEMINI_API_KEY not set. Add it to .env.local to enable chat.",
      },
      { status: 503 },
    );
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: buildSystemPrompt({
      college_name: college_name ?? "Unknown college",
      college_type,
      state,
      course,
      total_cost_inr: total_cost ?? null,
      avg_rate_percent: avg_rate ?? null,
    }),
  });

  const historyText = (chat_history ?? [])
    .slice(-8)
    .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
    .join("\n");

  const prompt =
    historyText.length > 0
      ? `${historyText}\nUser: ${message}\nAssistant:`
      : `User: ${message}\nAssistant:`;

  const result = await model.generateContentStream(prompt);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (e) {
        controller.enqueue(
          encoder.encode(
            `\n\n[Error] ${e instanceof Error ? e.message : "Chat failed"}`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}


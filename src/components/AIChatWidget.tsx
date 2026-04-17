"use client";

import { useMemo, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function AIChatWidget({
  context,
}: {
  context: { college_name: string; course: string; state?: string; total_cost?: number };
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about your loan terms. I’ll explain jargon in one simple line first.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chips = useMemo(
    () => [
      "What does moratorium mean for me?",
      "Can I prepay without penalty?",
      "Which bank should I choose?",
      "What happens if I miss an EMI?",
      "Am I eligible for PM Vidyalakshmi?",
    ],
    [],
  );

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          course: context.course,
          college_name: context.college_name,
          state: context.state ?? null,
          total_cost: context.total_cost ?? null,
          chat_history: messages.filter((m) => m.role !== "assistant" || m.content.length > 0),
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Chat request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Streaming not supported");
      const decoder = new TextDecoder();

      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") last.content = acc;
          return next;
        });
        bottomRef.current?.scrollIntoView({ block: "end" });
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          last.content = e instanceof Error ? e.message : "Chat failed";
        } else {
          next.push({
            role: "assistant",
            content: e instanceof Error ? e.message : "Chat failed",
          });
        }
        return next;
      });
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }

  return (
    <section className="sticky top-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
        <div className="text-sm font-semibold">AI Advisor</div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Plain-language answers for your {context.course}
        </div>
      </div>

      <div className="max-h-[52vh] overflow-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === "user"
                ? "ml-auto w-[92%] rounded-2xl bg-zinc-950 px-3 py-2 text-sm text-white dark:bg-zinc-50 dark:text-zinc-950"
                : "mr-auto w-[92%] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            }
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
        <div className="flex flex-wrap gap-2">
          {chips.slice(0, 3).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => void send(c)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              disabled={loading}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask: what is moratorium?"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            onKeyDown={(e) => {
              if (e.key === "Enter") void send(input);
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => void send(input)}
            disabled={loading}
            className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          If Gemini key isn’t set, you’ll see an error message here.
        </div>
      </div>
    </section>
  );
}


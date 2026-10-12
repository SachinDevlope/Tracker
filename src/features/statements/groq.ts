import "server-only";
import { env } from "@/lib/env";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// One JSON-mode chat completion; waits and retries on free-tier rate limits
export async function groqJson(system: string, user: string): Promise<unknown> {
  if (!env.GROQ_API_KEY) throw new Error("Statement import isn't set up: add GROQ_API_KEY");

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        ...(env.GROQ_MODEL.includes("gpt-oss") && { reasoning_effort: "low" }),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (res.status === 429) {
      const wait = Math.min(Number(res.headers.get("retry-after")) || 15, 60);
      await sleep(wait * 1000);
      continue;
    }
    if (res.status === 401) throw new Error("GROQ_API_KEY is invalid");
    if (res.status === 404) throw new Error(`Groq model "${env.GROQ_MODEL}" not found — check GROQ_MODEL`);
    if (!res.ok) throw new Error(`AI request failed (${res.status})`);

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    try {
      return JSON.parse(data.choices?.[0]?.message?.content ?? "");
    } catch {
      throw new Error("AI returned unreadable output — try again");
    }
  }
  throw new Error("AI rate limit hit — wait a minute and try again");
}

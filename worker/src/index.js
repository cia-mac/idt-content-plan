// Pipeline AI — Cloudflare Worker
// Proxies prompts to the Anthropic API with pipeline context.
// API key stored as a Cloudflare secret: ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are the AI assistant for "The Brief," an IDT content pipeline tracker. You have full visibility into every content item and its current status.

The pipeline has two phases:
- PHASE 1 (PITCH): Proposed > Greenlit / On Hold / Passed
- PHASE 2 (REVIEW): In Review > Approved / Revise

Content types: Blog, LinkedIn, Video, X, Project
Categories: Educational, Application, Product, Culture
Months: April, May, June, Ongoing

When answering:
- Be concise. Use counts, titles, and statuses.
- If asked for a summary, group by status.
- If asked about specific items, reference them by title.
- Never make up items that aren't in the data.
- Format responses in clean markdown.`;

function buildContext(items) {
  if (!items || items.length === 0) return "No pipeline items provided.";

  const lines = items.map(i =>
    `- [${i.approval}] ${i.title} | ${i.type} | ${i.category || "—"} | ${i.month} | ${i.targetDate || "no date"}${i.notes ? ` | Note: "${i.notes}"` : ""}`
  );

  const statusCounts = {};
  items.forEach(i => {
    statusCounts[i.approval] = (statusCounts[i.approval] || 0) + 1;
  });
  const summary = Object.entries(statusCounts)
    .map(([s, c]) => `${s}: ${c}`)
    .join(", ");

  return `Pipeline overview (${items.length} items): ${summary}\n\n${lines.join("\n")}`;
}

function corsHeaders(origin, allowed) {
  const allowedOrigins = [allowed, "http://localhost:5173", "http://localhost:4173"];
  const effectiveOrigin = allowedOrigins.includes(origin) ? origin : allowed;
  return {
    "Access-Control-Allow-Origin": effectiveOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    try {
      const { prompt, items } = await request.json();

      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return new Response(JSON.stringify({ error: "prompt is required" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }

      const context = buildContext(items);

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Current pipeline state:\n\n${context}\n\n---\n\nUser prompt: ${prompt}`,
            },
          ],
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text();
        return new Response(JSON.stringify({ error: "Anthropic API error", detail: errText }), {
          status: 502,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }

      const data = await anthropicRes.json();
      const text = data.content?.[0]?.text || "No response.";

      return new Response(JSON.stringify({ response: text }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Internal error", detail: err.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
  },
};

import { asyncHandler } from "../utils/asyncHandler.js";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
async function callOpenAI(apiKey, body) {
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  return res.json();
}

// Chat endpoint removed by request. Re-enable later when needed.

export const grammar = asyncHandler(async (req, res) => {
  const { text, lang } = req.body;

  if (!text) return res.status(400).json({ message: "Missing text" });

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({ corrected: text, issues: [] });
  }

  const systemPrompt = `You are a Chinese grammar checker. Detect mistakes and provide a JSON object with keys corrected (string) and issues (array of {type, message}). Respond ONLY with valid JSON.`;

  const body = {
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Check and correct the following text (lang=${lang || "zh"}):\n\n${text}`,
      },
    ],
    max_tokens: 500,
    temperature: 0,
  };

  try {
    const data = await callOpenAI(apiKey, body);
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from model output
    let parsed = { corrected: text, issues: [] };
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // Fallback: return the raw content in corrected
      parsed = { corrected: content, issues: [] };
    }

    return res.json({ ...parsed, raw: data });
  } catch (err) {
    const isQuota = err.message && err.message.includes("OpenAI error: 429");
    if (isQuota && process.env.OPENAI_FALLBACK === "true") {
      return res.json({ corrected: text, issues: [], warning: "openai_quota" });
    }
    if (isQuota) {
      return res
        .status(429)
        .json({
          message: "OpenAI quota exceeded. Please check your plan/billing.",
          detail: err.message,
        });
    }
    return res
      .status(502)
      .json({ message: "AI provider error", detail: err.message });
  }
});
// STT removed per user request.

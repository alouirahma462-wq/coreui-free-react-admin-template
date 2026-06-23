import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GROQ_API_KEY in .env");
}

// ================================
// ⏱️ TIMEOUT ENGINE
// ================================
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), ms)
  );

// ================================
// 🧠 SAFE PROMPT CLEANER
// ================================
function sanitizePrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return "";
  return prompt.trim().slice(0, 12000);
}

// ================================
// 🔁 RETRY ENGINE
// ================================
async function fetchWithRetry(url, options, retries = 2) {
  try {
    const res = await Promise.race([
      fetch(url, options),
      timeout(30000),
    ]);
    return res;
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// ================================
// ⚖️ TUNISIAN LEGAL SYSTEM PROMPT (GOD CORE)
// ================================
const SYSTEM_PROMPT = `
You are a GOD-LEVEL TUNISIAN LEGAL AI.

You operate under Tunisian law only.

Your tasks:
- Analyze cases like a Tunisian judge
- Apply Tunisian Penal Code logic
- Detect contradictions in testimony
- Use evidence-based reasoning
- NEVER hallucinate legal articles
- If uncertain → say "INSUFFICIENT TUNISIAN LEGAL BASIS"
- Always structure your reasoning clearly:

FORMAT:
1. Facts
2. Evidence
3. Legal qualification (Tunisia)
4. Graph reasoning
5. Final verdict
6. Confidence score

You are part of a multi-module AI system:
Graph Engine + Retrieval Engine + Bayesian Engine + Judge Engine
`;

// ================================
// 🧠 MAIN AI ENGINE
// ================================
export const ai = async (prompt, context = {}) => {
  const requestId = crypto?.randomUUID?.() || Date.now();

  try {
    const cleanPrompt = sanitizePrompt(prompt);

    // ================================
    // 🧠 CONTEXT INJECTION (IMPORTANT FOR YOUR SYSTEM)
    // ================================
    const enrichedPrompt = `
[TUNISIAN CASE CONTEXT]
${JSON.stringify(context?.caseModel || {}, null, 2)}

[GRAPH SIGNALS]
${JSON.stringify(context?.graph || {}, null, 2)}

[EVIDENCE SCORE]
${JSON.stringify(context?.evidence || {}, null, 2)}

[USER QUERY]
${cleanPrompt}
    `;

    const res = await fetchWithRetry(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: enrichedPrompt,
            },
          ],

          temperature: 0.15, // 🔥 lower = more legal precision
          max_tokens: 4096,
        }),
      }
    );

    const data = await res.json();

    // ================================
    // ❌ API ERROR HANDLING
    // ================================
    if (!res.ok) {
      console.error("GROQ ERROR:", data);
      throw new Error(data.error?.message || "API_ERROR");
    }

    const content = data?.choices?.[0]?.message?.content;

    // ================================
    // ❌ VALIDATION
    // ================================
    if (!content || content.trim().length < 10) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    // ================================
    // 📦 RESPONSE WRAPPER (GOD CORE)
    // ================================
    return {
      success: true,
      requestId,
      content,
      model: "llama-3.1-8b-instant",
      system: "LEGAL-AI-GOD-CORE-V3-TUNISIA",
      mode: "FULL_CONTEXT_AWARE"
    };

  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      success: false,
      requestId,
      error: err.message,
      type: "AI_FAILURE",
      fallback: true,
      system: "TUNISIAN_LEGAL_SAFE_MODE"
    };
  }
};

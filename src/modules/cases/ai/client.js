import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GROQ_API_KEY in .env");
}

// ⏱️ timeout helper
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), ms)
  );

export const ai = async (prompt) => {
  try {
    const res = await Promise.race([
      fetch("https://api.groq.com/openai/v1/chat/completions", {
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
              content:
                "You are a precise legal reasoning AI. Always respond in structured, complete analysis.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 4096,
        }),
      }),
      timeout(30000),
    ]);

    const data = await res.json();

    // ❌ HTTP error handling
    if (!res.ok) {
      console.error("GROQ ERROR RESPONSE:", data);
      throw new Error(data.error?.message || "API ERROR");
    }

    const content = data?.choices?.[0]?.message?.content;

    // ❌ empty response guard
    if (!content || content.trim().length < 10) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    return content;
  } catch (err) {
    console.error("AI ERROR:", err.message);

    return JSON.stringify({
      success: false,
      error: err.message,
      type: "AI_FAILURE",
    });
  }
};

const API_KEY = "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";
export const ai = async (prompt) => {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "API ERROR");
    }

    return data.choices?.[0]?.message?.content;

  } catch (err) {
    console.error("AI ERROR:", err.message);
    return "AI_FAILED";
  }
};

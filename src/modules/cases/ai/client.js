const API_KEY = process.env.GROQ_API_KEY;
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

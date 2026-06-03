export const ai = async (prompt) => {
  try {
    console.log("📡 AI REQUEST START");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const data = await res.json();

    console.log("📡 AI RESPONSE OK");

    return data?.choices?.[0]?.message?.content?.trim();

  } catch (err) {
    console.error("❌ AI ERROR:", err.message);
    return "AI_FAILED";
  }
};

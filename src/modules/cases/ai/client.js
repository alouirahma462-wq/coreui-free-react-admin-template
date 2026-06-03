export const ai = async (prompt) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 90000);

  try {
    console.log("📡 AI REQUEST START");

    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama3", // 👈 أهم تعديل (بدل llama3.2:1b)
        prompt: prompt,
        stream: false
      })
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ERROR: ${res.status}`);
    }

    const data = await res.json();

    console.log("📡 AI RESPONSE OK");

    return data?.response ?? "EMPTY_RESPONSE";

  } catch (err) {
    console.error("❌ AI ERROR:", err.message);

    if (err.name === "AbortError") {
      return "TIMEOUT";
    }

    return "AI_FAILED";
  }
};

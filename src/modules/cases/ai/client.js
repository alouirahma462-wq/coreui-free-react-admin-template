export const ai = async (prompt) => {
  try {
    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false,
        temperature: 0.2
      })
    })

    // ❌ تحقق من HTTP errors
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ${res.status} - ${errorText}`)
    }

    const data = await res.json()

    // ❌ تحقق من الرد
    if (!data?.response) {
      throw new Error("Empty response from Ollama")
    }

    return data.response

  } catch (err) {
    console.error("❌ Ollama AI Error:", err.message)

    // 🛡️ fallback آمن بدل كسر النظام
    return "⚠️ AI service unavailable (Ollama not responding or model error)"
  }
}

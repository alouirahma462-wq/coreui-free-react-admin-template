export const ai = async (prompt) => {
  try {
    const controller = new AbortController()

    // ⛔ timeout protection
    const timeout = setTimeout(() => controller.abort(), 60000)

    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false
      })
    })

    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()

    return data?.response || "EMPTY_RESPONSE"

  } catch (err) {
    console.error("❌ AI ERROR:", err.message)
    return "AI_FAILED"
  }
}

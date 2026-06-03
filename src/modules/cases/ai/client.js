export const ai = async (prompt) => {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 90000) // 90 ثانية حماية

  try {
    console.log("📡 AI REQUEST START")

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

    console.log("📡 AI RESPONSE STATUS:", res.status)

    const text = await res.text()

    console.log("📡 RAW RESPONSE (first 200):", text.slice(0, 200))

    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error("Invalid JSON from Ollama")
    }

    return data?.response || "EMPTY_RESPONSE"

  } catch (err) {
    console.error("❌ AI ERROR:", err.message)

    if (err.name === "AbortError") {
      return "TIMEOUT"
    }

    return "AI_FAILED"
  }
}

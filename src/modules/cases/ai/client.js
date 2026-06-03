export const ai = async (prompt) => {
  const controller = new AbortController()

  // ⏱️ timeout حماية (60 ثانية)
  const timeout = setTimeout(() => {
    controller.abort()
  }, 60000)

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

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP ERROR ${res.status}: ${errorText}`)
    }

    const text = await res.text()

    console.log("📡 RAW RESPONSE (cut):", text.slice(0, 200))

    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error("Invalid JSON from Ollama")
    }

    if (!data?.response) {
      return "EMPTY_RESPONSE"
    }

    return data.response

  } catch (err) {
    console.error("❌ AI ERROR:", err.message)

    if (err.name === "AbortError") {
      return "AI_TIMEOUT"
    }

    return "AI_FAILED"
  }
}

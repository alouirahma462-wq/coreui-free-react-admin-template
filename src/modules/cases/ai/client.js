export const ai = async (prompt) => {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false
      })
    })

    // إذا السيرفر رجع خطأ HTTP
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`HTTP Error ${res.status}: ${errorText}`)
    }

    const data = await res.json()

    // حماية إضافية لو الرد ناقص
    if (!data || !data.response) {
      throw new Error("Invalid response from Ollama")
    }

    return data.response

  } catch (err) {
    console.error("❌ Ollama AI Error:", err.message)

    // لا تكسر النظام، رجّع نص مفهوم
    return "⚠️ AI service unavailable (Ollama not responding)"
  }
}

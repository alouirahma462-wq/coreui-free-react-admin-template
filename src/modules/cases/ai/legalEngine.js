import { ai } from "./client.js"

export const legalEngine = async (caseText, articles) => {
  try {

    // 🧠 تنظيف وتجهيز السياق القانوني (RAG SAFE)
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => a.text.trim())
      .join("\n\n---\n\n")

    // 🛑 حماية من سياق فارغ
    const safeContext = context.length > 0
      ? context
      : "لا توجد نصوص قانونية متوفرة."

    const prompt = `
أنت قاضٍ تونسي خبير في القانون الجزائي.

⚠️ قواعد صارمة:
- لا تخرج عن التحليل القانوني.
- لا تخترع مواد قانونية.
- إذا لم تجد نص قانوني مناسب، قل "غير كافٍ قانونياً".

──────────────────────

🧾 القضية:
${caseText}

📚 النصوص القانونية:
${safeContext}

──────────────────────

أصدر تقرير قضائي رسمي وفق الهيكل التالي:

# 1. الوقائع
# 2. الأطراف
# 3. التحليل الواقعي
# 4. الأركان القانونية
# 5. التكييف القانوني
# 6. التعليل القضائي
# 7. الأدلة
# 8. الشكوك
# 9. نسبة الإدانة (%)
# 10. القرار النهائي
`

    // 🤖 استدعاء Ollama مع حماية
    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false,
        temperature: 0.2   // 🔥 يقلل الهلوسة
      })
    })

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.status}`)
    }

    const data = await res.json()

    if (!data?.response) {
      return "No response from Ollama"
    }

    return data.response

  } catch (err) {
    console.error("❌ legalEngine error:", err)
    return "ERROR_LEGAL_ENGINE"
  }
}

import { ai } from "./client.js"

export const legalEngine = async (caseText, articles) => {
  try {

    console.log("📌 legalEngine START")

    // 🧠 تجهيز السياق القانوني
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => a.text.trim())
      .join("\n\n---\n\n")

    const safeContext =
      context && context.length > 0
        ? context
        : "لا توجد نصوص قانونية متوفرة."

    const prompt = `
أنت قاضٍ تونسي خبير في القانون الجزائي.

⚠️ قواعد صارمة:
- لا تخترع مواد قانونية
- التزم بالنصوص المقدمة فقط
- إذا المعلومات غير كافية قل: غير كافٍ قانونياً

──────────────────────

🧾 القضية:
${caseText}

📚 النصوص القانونية:
${safeContext}

──────────────────────

أصدر تقرير قضائي رسمي مفصل:

1. الوقائع
2. الأطراف
3. التحليل الواقعي
4. الأركان القانونية
5. التكييف القانوني
6. التعليل القضائي
7. تقييم الأدلة
8. الشكوك
9. نسبة الإدانة (%)
10. القرار النهائي
`

    console.log("📡 CALLING AI...")

    // 🤖 AI CALL
    const response = await ai(prompt)

    console.log("📡 AI RESPONSE RECEIVED")

    if (!response || response.length < 5) {
      console.warn("⚠️ Empty AI response")
      return "NO_AI_RESPONSE"
    }

    return response

  } catch (err) {
    console.error("❌ legalEngine error:", err.message)
    return "ERROR_LEGAL_ENGINE"
  }
}

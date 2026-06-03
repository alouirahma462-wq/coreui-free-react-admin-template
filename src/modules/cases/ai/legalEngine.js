import { ai } from "./client.js"

export const legalEngine = async (caseText, articles) => {
  try {

    // 🧠 تجهيز السياق القانوني
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => a.text.trim())
      .join("\n\n---\n\n")

    const safeContext =
      context.length > 0
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

# 1. الوقائع
# 2. الأطراف
# 3. التحليل الواقعي
# 4. الأركان القانونية
# 5. التكييف القانوني
# 6. التعليل القضائي
# 7. تقييم الأدلة
# 8. الشكوك
# 9. نسبة الإدانة (%)
# 10. القرار النهائي
`

    // 🤖 استخدم AI wrapper (مش fetch مباشر)
    const response = await ai(prompt)

    return response

  } catch (err) {
    console.error("❌ legalEngine error:", err)
    return "ERROR_LEGAL_ENGINE"
  }
}

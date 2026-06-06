import { ai } from "./client.js"

export const legalEngine = async (caseText, articles) => {
  try {

    console.log("📌 LEGAL ENGINE START (LEXIS STYLE)")

    // 🧠 بناء السياق القانوني
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => `📜 ${a.text.trim()}`)
      .join("\n\n----------------\n\n")

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ لا توجد نصوص قانونية كافية من قاعدة البيانات."

    // ⚖️ Prompt احترافي (LexisNexis Style)
    const prompt = `
أنت قاضٍ تونسي خبير جداً في القانون الجزائي والإجرائي.
تعمل مثل نظام LexisNexis + قاضي تحقيق + محلل أدلة جنائية.

مهمتك:
تحليل المحضر بشكل قانوني دقيق جداً وربطه بالنصوص القانونية التونسية فقط.

────────────────────────────
🧾 المحضر (القضية):
${caseText}

📚 النصوص القانونية المتاحة:
${safeContext}

────────────────────────────

🚨 قواعد صارمة جداً:
- لا تخترع أي مادة قانونية
- لا تخرج عن النصوص المقدمة
- إذا المعلومات ناقصة قل: "غير كافٍ قانونياً"
- يجب أن يكون التحليل منطقي وقضائي وليس سرد فقط

────────────────────────────

✳️ أريد تقرير قضائي احترافي جداً (مثل قاضي تحقيق تونسي):

1️⃣ الوقائع (Facts)
- سرد دقيق للأحداث

2️⃣ الأطراف (Actors)
- الضحية / المتهم / الشهود

3️⃣ تكييف الوقائع (Legal Classification)
- هل هي سرقة؟ اعتداء؟ تهديد؟ إلخ

4️⃣ تحليل الأدلة (Evidence Analysis)
- ماذا يدعم الإدانة؟
- ماذا يضعفها؟

5️⃣ تحليل الإفادات (Statements Analysis)
- تناقضات؟
- مصداقية؟

6️⃣ ربط بالقانون (Legal Basis)
- اربط كل واقعة بالنص القانوني المناسب من النصوص المعطاة

7️⃣ الأركان القانونية (Legal Elements)
- الركن المادي
- الركن المعنوي
- الركن القانوني

8️⃣ الشكوك والتناقضات (Doubts & Contradictions)
- أي نقطة ضعف في القضية

9️⃣ تقييم شامل (Assessment)
- قوة القضية من 0 إلى 100

🔟 القرار النهائي (Verdict)
- guilty / not_guilty / insufficient_evidence

1️⃣1️⃣ نسبة الإدانة (Probability)
- رقم من 0 إلى 1

1️⃣2️⃣ تعليل قضائي (Judicial Reasoning)
- شرح طويل بأسلوب قاضي تونسي رسمي

────────────────────────────

🚨 IMPORTANT OUTPUT FORMAT:
أعد الجواب بشكل منظم جداً ومفصل وكأنك حكم قضائي رسمي في تونس.
`

    console.log("📡 CALLING AI...")

    const response = await ai(prompt)

    console.log("📡 AI RESPONSE RECEIVED")

    if (!response || response.length < 20) {
      return {
        error: "EMPTY_AI_RESPONSE"
      }
    }

    return {
      success: true,
      analysis: response
    }

  } catch (err) {
    console.error("❌ legalEngine error:", err.message)

    return {
      success: false,
      error: err.message
    }
  }
}

import { ai } from "./client.js"

export const legalEngine = async (caseText, articles = []) => {
  try {

    console.log("📌 LEGAL ENGINE START (LEXISNEXIS PRO)")

    // 🧠 Build legal context safely
    const context = (articles || [])
      .filter(a => a?.text)
      .map((a) => `📜 ${a.text.trim()}`)
      .join("\n\n--------------------\n\n")

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ لا توجد نصوص قانونية كافية من قاعدة البيانات."

    // ⚖️ Advanced LexisNexis-style prompt
    const prompt = `
أنت قاضٍ تونسي خبير جداً في القانون الجزائي والإجرائي والتحقيق الجنائي.
تعمل كنظام LexisNexis + قاضي تحقيق + محلل أدلة جنائية احترافي.

مهمتك:
تحليل المحضر بدقة قانونية عالية وربطه فقط بالنصوص القانونية المقدمة.

════════════════════════════════════

🧾 القضية:
${caseText}

📚 النصوص القانونية:
${safeContext}

════════════════════════════════════

🚨 قواعد صارمة:
- لا تخترع أي مادة قانونية
- لا تضف معلومات خارج النصوص
- إذا المعطيات ناقصة اكتب: "غير كافٍ قانونياً"
- التحليل يجب أن يكون قضائي منطقي وليس سرد فقط

════════════════════════════════════

📊 أعد تقرير قضائي احترافي مفصل جداً:

1️⃣ الوقائع (Facts)
- سرد دقيق وموضوعي للأحداث

2️⃣ الأطراف (Actors)
- الضحية / المتهم / الشهود (إن وجدوا)

3️⃣ تكييف الوقائع (Legal Qualification)
- تصنيف الجريمة حسب القانون التونسي

4️⃣ تحليل الأدلة (Evidence Analysis)
- الأدلة التي تدعم الإدانة
- الأدلة التي تضعف القضية

5️⃣ تحليل الإفادات (Statements Analysis)
- تناقضات الشهود
- مصداقية الأقوال

6️⃣ الأساس القانوني (Legal Basis)
- ربط كل واقعة بالنصوص القانونية المقدمة فقط

7️⃣ الأركان القانونية (Legal Elements)
- الركن المادي
- الركن المعنوي
- الركن القانوني

8️⃣ الشكوك والتناقضات (Doubts & Contradictions)
- نقاط الضعف في الملف

9️⃣ تقييم الملف (Case Strength Score)
- رقم من 0 إلى 100

🔟 الحكم الأولي (Pre-Verdict)
- guilty / not_guilty / insufficient_evidence / pending

1️⃣1️⃣ نسبة الإدانة (Probability)
- رقم من 0.00 إلى 1.00

1️⃣2️⃣ التعليل القضائي (Judicial Reasoning)
- تحليل طويل بأسلوب قاضي تونسي رسمي محترف جداً

════════════════════════════════════

🚨 OUTPUT FORMAT:
يجب أن يكون الرد منظم جداً وكأنه حكم صادر من محكمة تونسية رسمية.
`

    console.log("📡 CALLING AI...")

    const response = await ai(prompt)

    console.log("📡 AI RESPONSE RECEIVED")

    if (!response || response.length < 20) {
      return {
        success: false,
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

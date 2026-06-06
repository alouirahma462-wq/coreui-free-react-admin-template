import { ai } from "./client.js"

export const legalEngine = async (caseText, articles = [], forensics = null) => {
  try {

    console.log("📌 LEGAL ENGINE v4 START (LEXIS + FORENSICS)")

    // 🧠 Build legal context
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => `📜 ${a.text.trim()}`)
      .join("\n\n--------------------\n\n")

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ لا توجد نصوص قانونية كافية من قاعدة البيانات."

    // 🧠 Forensics safe injection
    const forensicBlock = forensics
      ? `
════════ FORENSIC ANALYSIS ════════

👥 الأطراف:
${forensics.actors?.join(", ") || "غير محدد"}

⏱️ الأحداث:
${(forensics.events || []).join("\n")}

🔎 الأدلة:
${(forensics.evidence || []).join("\n")}

⚠️ التناقضات:
${JSON.stringify(forensics.contradictions || [], null, 2)}

📊 مصداقية الملف:
${forensics.credibilityScore ?? "غير محسوب"}

══════════════════════════════
`
      : "لا يوجد تحليل جنائي متقدم"

    // ⚖️ Advanced LexisNexis + Forensics prompt
    const prompt = `
أنت قاضٍ تونسي خبير جداً في القانون الجزائي والإجرائي والتحقيق الجنائي.
تعمل كنظام LexisNexis + Forensic AI + قاضي تحقيق صارم.

مهمتك:
تحليل الملف بشكل قضائي دقيق جداً وربطه بالنصوص القانونية + الأدلة + التناقضات.

════════════════════════════════════

🧾 القضية:
${caseText}

📚 النصوص القانونية:
${safeContext}

${forensicBlock}

════════════════════════════════════

🚨 قواعد صارمة:
- لا تخترع أي مادة قانونية
- لا تعتمد على التخمين
- إذا المعلومات غير كافية: "غير كافٍ قانونياً"
- ركز على الأدلة + التناقضات + المصداقية

════════════════════════════════════

📊 التقرير القضائي المطلوب:

1️⃣ الوقائع (Facts)
2️⃣ الأطراف (Actors)
3️⃣ التسلسل الزمني (Timeline)
4️⃣ تحليل الأدلة (Evidence Strength)
5️⃣ تحليل الشهود (Witness Reliability)
6️⃣ التناقضات (Contradictions Impact)
7️⃣ التكييف القانوني (Legal Classification)
8️⃣ الأركان القانونية (Legal Elements)
9️⃣ تقييم القوة الجنائية (Case Strength 0-100)
🔟 نسبة الإدانة (0.00 - 1.00)
1️⃣1️⃣ القرار الأولي (Verdict)
- guilty / not_guilty / insufficient_evidence / pending
1️⃣2️⃣ التعليل القضائي (Judicial Reasoning)
- تحليل طويل جداً بأسلوب قاضي تحقيق تونسي رسمي

════════════════════════════════════

🚨 OUTPUT FORMAT:
تقرير قضائي منظم جداً + تحليلي + صارم + غير متحيز
`

    console.log("📡 CALLING AI v4...")

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
      analysis: response,
      meta: {
        engine: "LEXISNEXIS-V4",
        mode: "FORENSIC+LEGAL+JUDICIAL"
      }
    }

  } catch (err) {
    console.error("❌ legalEngine v4 error:", err.message)

    return {
      success: false,
      error: err.message
    }
  }
}

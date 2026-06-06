import { ai } from "../client.js"

export const judgeEngine = async (caseText, analysis) => {
  try {

    console.log("⚖️ JUDGE ENGINE START (LEXIS STYLE)")

    const prompt = `
أنت قاضٍ تونسي أعلى درجة (محكمة نهائية).
تقوم بإصدار حكم قضائي رسمي مبني فقط على التحليل القانوني المعطى.

────────────────────────────
🧾 القضية:
${caseText}

📊 التحليل القانوني:
${analysis}

────────────────────────────

🚨 قواعد صارمة:
- لا تعتمد على التخمين
- لا تضف معلومات غير موجودة
- التزم بالتحليل المعطى فقط
- إذا التحليل ضعيف قل: insufficient_information

────────────────────────────

أصدر حكم قضائي رسمي بصيغة منظمة جداً:

1️⃣ Verdict (الحكم)
- guilty / not_guilty / insufficient_evidence

2️⃣ Confidence (الثقة)
- رقم بين 0 و 1

3️⃣ Sentence Summary (ملخص الحكم)
- جملة أو جملتين بأسلوب قضائي

4️⃣ Legal Reasoning (التعليل القانوني)
- شرح قانوني واضح ومفصل

5️⃣ Key Evidence Weight (وزن الأدلة)
- ما الذي رجّح الحكم؟

6️⃣ Doubts (الشكوك)
- نقاط الضعف في القضية

7️⃣ Final Decision Justification (تبرير نهائي)
- لماذا تم اتخاذ هذا القرار؟

────────────────────────────

🚨 OUTPUT FORMAT:
اكتب بصيغة قانونية رسمية مثل حكم محكمة تونسية.
`

    console.log("📡 CALLING AI...")

    const res = await ai(prompt)

    console.log("📡 AI RESPONSE RECEIVED")

    if (!res || res.length < 20) {
      return {
        success: false,
        error: "EMPTY_JUDGMENT"
      }
    }

    return {
      success: true,
      verdict_raw: res
    }

  } catch (err) {
    console.error("❌ judgeEngine error:", err.message)

    return {
      success: false,
      error: err.message
    }
  }
}

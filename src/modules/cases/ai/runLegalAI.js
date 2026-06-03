import { parseCase } from "./nlp/caseParser.js"
import { searchRelevantArticles } from "./rag/lawSearch.js"
import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"
import { loadAllLaws } from "./rag/lawLoader.js"
import { extractArticles } from "./rag/articleExtractor.js"

// ⚖️ النظام الكامل: من محضر إلى حكم AI
export const runLegalAI = async (caseText) => {
  try {

    console.log("🚀 START runLegalAI")

    // 🧠 1. تحليل المحضر (NLP)
    console.log("1️⃣ parseCase")
    const parsedCase = parseCase(caseText)

    // 📚 2. تحميل القوانين + استخراج المواد
    console.log("2️⃣ loadAllLaws")
    const lawText = loadAllLaws()

    console.log("3️⃣ extractArticles")
    const articles = extractArticles(lawText)

    // 🔎 3. البحث عن المواد ذات الصلة
    console.log("4️⃣ searchRelevantArticles")
    const relevantArticles = searchRelevantArticles(articles, caseText)

    // ⚖️ 4. التحليل القانوني العميق (GPT / Ollama)
    console.log("5️⃣ legalEngine CALL (AI)")
    const legalAnalysis = await legalEngine(caseText, relevantArticles)

    if (!legalAnalysis) {
      console.warn("⚠️ legalAnalysis is EMPTY")
    }

    // 📊 5. استخراج الحكم ونسبة الإدانة
    console.log("6️⃣ judgeEngine CALL")
    const judgment = await judgeEngine(caseText, legalAnalysis)

    console.log("✅ DONE runLegalAI")

    // 🧾 6. النتيجة النهائية
    return {
      input: caseText,
      parsedCase,
      articlesUsed: relevantArticles,
      legalAnalysis,
      judgment,
      meta: {
        status: "SUCCESS",
        engine: "TUNISIAN-LEGAL-AI-v1"
      }
    }

  } catch (err) {
    console.error("❌ runLegalAI ERROR:", err)

    return {
      status: "ERROR",
      message: err.message
    }
  }
}

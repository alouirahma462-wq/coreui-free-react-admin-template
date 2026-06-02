import { parseCase } from "./nlp/caseParser.js"
import { searchLaw } from "./rag/lawSearch.js"
import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"

// ⚖️ النظام الكامل: من محضر إلى حكم AI
export const runLegalAI = async (caseText) => {
  try {

    // 🧠 1. تحليل المحضر (NLP)
   const parsedCase = parseCase(caseText)

    // 📚 2. البحث في القانون (RAG)
    const articles = await searchLaw(caseText)

    // ⚖️ 3. التحليل القانوني العميق (GPT)
    const legalAnalysis = await legalEngine(caseText, articles)

    // 📊 4. استخراج الحكم ونسبة الإدانة
    const judgment = await judgeEngine(caseText, legalAnalysis)

    // 🧾 5. النتيجة النهائية (JSON موحد)
    return {
      input: caseText,

      parsedCase,

      articlesUsed: articles,

      legalAnalysis,

      judgment,

      meta: {
        status: "SUCCESS",
        engine: "TUNISIAN-LEGAL-AI-v1"
      }
    }

  } catch (err) {
    return {
      status: "ERROR",
      message: err.message
    }
  }
}

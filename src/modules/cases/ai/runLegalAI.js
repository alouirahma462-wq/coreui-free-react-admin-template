import { parseCase } from "./nlp/caseParser.js"
import { searchRelevantArticles } from "./rag/lawSearch.js"
import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"
import { loadAllLaws } from "./rag/lawLoader.js"
import { extractArticles } from "./rag/articleExtractor.js"

// ⚖️ النظام الكامل: من محضر إلى حكم AI
export const runLegalAI = async (caseText) => {
  try {

    // 🧠 1. تحليل المحضر (NLP)
    const parsedCase = parseCase(caseText)

    // 📚 2. تحميل القوانين + استخراج المواد
    const lawText = loadAllLaws()
    const articles = extractArticles(lawText)

    // 🔎 3. البحث عن المواد ذات الصلة
    const relevantArticles = searchRelevantArticles(articles, caseText)

    // ⚖️ 4. التحليل القانوني العميق (GPT)
    const legalAnalysis = await legalEngine(caseText, relevantArticles)

    // 📊 5. استخراج الحكم ونسبة الإدانة
    const judgment = await judgeEngine(caseText, legalAnalysis)

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
    return {
      status: "ERROR",
      message: err.message
    }
  }
}

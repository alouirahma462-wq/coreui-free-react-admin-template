import { parseCase } from "./nlp/caseParser.js"
import { advancedCaseAnalyzer } from "./nlp/advancedCaseAnalyzer.js"

import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"

import { loadAllLaws } from "./rag/lawLoader.js"
import { loadLawsIntoVectorDB, lawDB } from "./rag/lawDB.js"
import { embedText } from "./rag/embeddings.js"

export const runLegalAI = async (caseText) => {
  try {

    if (!caseText?.trim()) {
      throw new Error("caseText empty")
    }

    // 🧠 NLP الأساسي
    const parsedCase = parseCase(caseText)

    // 🧠 NLP متقدم (v2)
    const analysisV2 = advancedCaseAnalyzer(caseText)

    // 📚 القوانين
    const lawText = await loadAllLaws()

    const lawChunks = lawText
      .split(/(?=الفصل|المادة)/g)
      .map((t, i) => ({ id: i, text: t.trim() }))
      .filter(t => t.text.length > 10)

    if (lawDB.data.length === 0) {
      await loadLawsIntoVectorDB(lawChunks)
    }

    // 🔎 RAG
    const queryVector = await embedText(caseText)
    const relevantArticles = lawDB.search(queryVector, 5)

    // ⚖️ Legal AI v2
    const legalAnalysis = await legalEngine(
      caseText,
      relevantArticles,
      analysisV2
    )

    // ⚖️ Judgment
    const judgment = await judgeEngine(caseText, legalAnalysis)

    return {
      input: caseText,
      parsedCase,
      analysisV2,
      articlesUsed: relevantArticles,
      legalAnalysis,
      judgment,
      meta: {
        version: "LEXISNEXIS-AI-v2",
        status: "SUCCESS"
      }
    }

  } catch (err) {
    return {
      status: "ERROR",
      message: err.message
    }
  }
}

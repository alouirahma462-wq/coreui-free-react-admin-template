import { parseCase } from "./nlp/caseParser.js"
import { advancedCaseAnalyzer } from "./nlp/advancedCaseAnalyzer.js"

import { advancedForensics } from "./forensics/advancedForensics.js"

import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"

import { loadAllLaws } from "./rag/lawLoader.js"
import { loadLawsIntoVectorDB, lawDB } from "./rag/lawDB.js"
import { embedText } from "./rag/embeddings.js"

export const runLegalAI = async (caseText) => {
  try {

    console.log("🚀 START LEGAL AI v4")

    // ❗ validation
    if (!caseText?.trim()) {
      throw new Error("caseText empty")
    }

    // 🧠 1. BASIC NLP
    const parsedCase = parseCase(caseText)

    // 🧠 2. ADVANCED NLP (v2)
    const analysisV2 = advancedCaseAnalyzer(caseText)

    // 🧠 3. FORENSIC ENGINE (NEW v4 CORE)
    const forensics = advancedForensics(caseText)

    // 📚 4. LOAD LAWS
    const lawText = await loadAllLaws()

    const lawChunks = lawText
      .split(/(?=الفصل|المادة)/g)
      .map((t, i) => ({
        id: i,
        text: t.trim()
      }))
      .filter(t => t.text && t.text.length > 10)

    // ⚠️ index only once (performance fix)
    if (lawDB.data.length === 0) {
      console.log("📚 indexing law DB...")
      await loadLawsIntoVectorDB(lawChunks)
    }

    // 🔎 5. SEMANTIC SEARCH (RAG)
    const queryVector = await embedText(caseText)
    const relevantArticles = lawDB.search(queryVector, 5)

    // ⚖️ 6. LEGAL ENGINE v4 (with forensics)
    const legalAnalysis = await legalEngine(
      caseText,
      relevantArticles,
      forensics
    )

    if (!legalAnalysis?.success && !legalAnalysis?.analysis) {
      throw new Error("legal analysis failed")
    }

    // ⚖️ 7. JUDGE ENGINE v4
    const judgment = await judgeEngine(
      caseText,
      legalAnalysis.analysis || legalAnalysis
    )

    console.log("✅ DONE LEGAL AI v4")

    return {
      input: caseText,

      // NLP layers
      parsedCase,
      analysisV2,

      // forensic layer
      forensics,

      // legal layer
      articlesUsed: relevantArticles,
      legalAnalysis,

      // final judgment
      judgment,

      meta: {
        version: "LEXISNEXIS-AI-v4",
        status: "SUCCESS",
        stack: [
          "NLP",
          "ADVANCED_NLP",
          "FORENSICS",
          "RAG",
          "LEGAL_ENGINE",
          "JUDGE_ENGINE"
        ]
      }
    }

  } catch (err) {
    console.error("❌ runLegalAI v4 ERROR:", err)

    return {
      status: "ERROR",
      message: err.message,
      meta: {
        version: "LEXISNEXIS-AI-v4",
        failed: true
      }
    }
  }
}

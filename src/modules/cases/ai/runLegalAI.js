import { parseCase } from "./nlp/caseParser.js"
import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"

import { loadAllLaws } from "./rag/lawLoader.js"
import { loadLawsIntoVectorDB, lawDB } from "./rag/lawDB.js"

import { embedText } from "./rag/embeddings.js"

console.log("⚖️ LEGAL AI MODULE LOADED")

export const runLegalAI = async (caseText) => {
  try {

    console.log("🚀 START runLegalAI")

    if (!caseText?.trim()) {
      throw new Error("caseText is empty")
    }

    // 1️⃣ NLP
    const parsedCase = parseCase(caseText)

    // 2️⃣ Load laws (RAW TEXT)
    console.log("2️⃣ loadAllLaws")
    const lawText = await loadAllLaws()

    if (!lawText) {
      throw new Error("No law text found")
    }

    // 3️⃣ extract chunks (IMPORTANT FIX)
    const lawChunks = lawText
      .split(/(?=الفصل|المادة)/g)
      .map((t, i) => ({
        id: i,
        text: t.trim()
      }))

    // 4️⃣ IMPORTANT: only index ONCE (prevent duplication)
    if (lawDB.data.length === 0) {
      console.log("3️⃣ indexing laws into vector DB")
      await loadLawsIntoVectorDB(lawChunks)
    }

    // 5️⃣ semantic search
    console.log("4️⃣ semantic search")
    const queryVector = await embedText(caseText)
    const relevantArticles = lawDB.search(queryVector, 5)

    // 6️⃣ legal engine
    console.log("5️⃣ legalEngine CALL")
    const legalAnalysis = await legalEngine(caseText, relevantArticles)

    if (!legalAnalysis) {
      throw new Error("Legal analysis failed")
    }

    // 7️⃣ judge engine (FIXED PARAMETERS)
    console.log("6️⃣ judgeEngine CALL")
    const judgment = await judgeEngine(caseText, legalAnalysis)

    console.log("✅ DONE runLegalAI")

    return {
      input: caseText,
      parsedCase,
      articlesUsed: relevantArticles,
      legalAnalysis,
      judgment,
      meta: {
        status: "SUCCESS",
        engine: "LEXISNEXIS-STYLE-AI-v1"
      }
    }

  } catch (err) {
    console.error("❌ runLegalAI ERROR:", err)

    return {
      status: "ERROR",
      message: err.message,
      meta: {
        engine: "LEXISNEXIS-STYLE-AI-v1",
        failed: true
      }
    }
  }
}

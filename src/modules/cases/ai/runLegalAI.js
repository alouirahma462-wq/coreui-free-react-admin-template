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

    // ❗ validation
    if (!caseText || !caseText.trim()) {
      throw new Error("caseText is empty")
    }

    // 🧠 1. NLP parsing
    const parsedCase = parseCase(caseText)

    // 📚 2. Load laws
    console.log("2️⃣ loadAllLaws")
    const lawText = await loadAllLaws()

    if (!lawText || lawText.length === 0) {
      throw new Error("No law text found")
    }

    // ✂️ 3. chunking laws
    const lawChunks = lawText
      .split(/(?=الفصل|المادة)/g)
      .map((t, i) => ({
        id: i,
        text: t.trim()
      }))
      .filter(c => c.text.length > 10)

    // 🧠 4. Index laws ONLY ONCE
    if (lawDB.data.length === 0) {
      console.log("3️⃣ indexing laws into vector DB")
      await loadLawsIntoVectorDB(lawChunks)
    }

    // 🔎 5. semantic search
    console.log("4️⃣ semantic search")
    const queryVector = await embedText(caseText)
    const relevantArticles = lawDB.search(queryVector, 5)

    // ⚖️ 6. legal reasoning AI
    console.log("5️⃣ legalEngine CALL")
    const legalAnalysis = await legalEngine(caseText, relevantArticles)

    if (!legalAnalysis || legalAnalysis === "AI_FAILED") {
      throw new Error("Legal analysis failed")
    }

    // ⚖️ 7. final judgment
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

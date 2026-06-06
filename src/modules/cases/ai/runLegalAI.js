import { parseCase } from "./nlp/caseParser.js"
import { legalEngine } from "./legalEngine.js"
import { judgeEngine } from "./engine/judgeEngine.js"

import { loadAllLaws } from "./rag/lawLoader.js"
import { loadLawsIntoVectorDB } from "./rag/lawDB.js"

import { embedText } from "./rag/embeddings.js"
import { lawDB } from "./rag/lawDB.js"

console.log("⚖️ LEGAL AI MODULE LOADED")

// ⚖️ LexisNexis Style AI Pipeline
export const runLegalAI = async (caseText) => {
  try {

    console.log("🚀 START runLegalAI")

    // ❗ validation
    if (!caseText || caseText.trim().length === 0) {
      throw new Error("caseText is empty")
    }

    // 🧠 1. NLP: فهم المحضر
    console.log("1️⃣ parseCase")
    const parsedCase = parseCase(caseText)

    // 📚 2. تحميل القانون (chunks من PDF)
    console.log("2️⃣ loadAllLaws")
    const lawChunks = await loadAllLaws()

    if (!lawChunks || lawChunks.length === 0) {
      throw new Error("No law chunks found (PDF issue)")
    }

    // 🧠 3. تحويل القوانين إلى Vector DB (مرة واحدة في كل تشغيل)
    console.log("3️⃣ indexing laws into vector DB")
    await loadLawsIntoVectorDB(lawChunks)

    // 🔎 4. البحث الذكي (RAG)
    console.log("4️⃣ semantic search")
    const queryVector = await embedText(caseText)
    const relevantArticles = lawDB.search(queryVector, 5)

    // ⚖️ 5. التحليل القانوني (AI reasoning)
    console.log("5️⃣ legalEngine CALL")
    const legalAnalysis = await legalEngine(caseText, relevantArticles)

    if (!legalAnalysis) {
      throw new Error("Legal analysis failed")
    }

    // ⚖️ 6. الحكم النهائي (structured)
    console.log("6️⃣ judgeEngine CALL")
    const judgment = await judgeEngine(legalAnalysis)

    console.log("✅ DONE runLegalAI")

    // 🧾 7. OUTPUT النهائي (LexisNexis style)
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

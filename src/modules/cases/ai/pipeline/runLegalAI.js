import dotenv from "dotenv";
dotenv.config();

console.log("🔥 ENTRY FILE REACHED");

import { parseCase } from "./nlp/caseParser.js";
import { advancedCaseAnalyzer } from "./nlp/advancedCaseAnalyzer.js";
import { advancedForensics } from "./forensics/advancedForensics.js";

import { legalEngine } from "./legalEngine.js";
import { judgeEngine } from "./engine/judgeEngine.js";

import { loadAllLaws } from "./rag/lawLoader.js";
import { loadLawsIntoVectorDB, lawDB } from "./rag/lawDB.js";
import { embedText } from "./rag/embeddings.js";

/* ================================
   ⚖️ MAIN ENGINE
================================ */
export const runLegalAI = async (caseText) => {
  try {
    console.log("🚀 START LEGAL AI v4");

    if (!caseText?.trim()) {
      throw new Error("caseText empty");
    }

    /* ========================
       🧠 NLP PROCESSING
    ======================== */
    const parsedCase = parseCase(caseText);
    const analysisV2 = advancedCaseAnalyzer?.(caseText) || {};
    const forensics = advancedForensics?.(caseText) || {};

    console.log("🧠 NLP + FORENSICS DONE");

    /* ========================
       📚 LOAD LAWS (RAG)
    ======================== */
    const lawChunksRaw = await loadAllLaws();

    if (!Array.isArray(lawChunksRaw) || lawChunksRaw.length === 0) {
      throw new Error("No law chunks loaded");
    }

    const lawChunks = lawChunksRaw.filter(
      (t) => t?.text && t.text.length > 10
    );

    if (!lawDB?.data || lawDB.data.length === 0) {
      console.log("📚 indexing law DB...");
      await loadLawsIntoVectorDB(lawChunks);
    }

    const queryVector = await embedText(caseText);
    const relevantArticles = lawDB.search(queryVector, 5);

    console.log("🔎 RAG DONE");

    /* ========================
       ⚖️ LEGAL ENGINE
    ======================== */
    const legalAnalysis = await legalEngine(
      caseText,
      relevantArticles,
      forensics
    );

    console.log("⚖️ LEGAL ENGINE DONE");

    if (!legalAnalysis?.success) {
      throw new Error(legalAnalysis?.error || "Legal engine failed");
    }

    /* ========================
       ⚖️ JUDGE ENGINE
    ======================== */
    const judgment = await judgeEngine(
      caseText,
      legalAnalysis.analysis
    );

    console.log("⚖️ JUDGE DONE");

    return {
      input: caseText,
      parsedCase,
      analysisV2,
      forensics,
      articlesUsed: relevantArticles,
      legalAnalysis,
      judgment,
      meta: {
        version: "LEXISNEXIS-AI-v4-FIXED",
        status: "SUCCESS"
      }
    };

  } catch (err) {
    console.error("❌ runLegalAI ERROR:", err);

    return {
      status: "ERROR",
      message: err.message,
      meta: {
        version: "LEXISNEXIS-AI-v4-FIXED",
        failed: true
      }
    };
  }
};

/* ================================
   🚀 AUTO TEST
================================ */
(async () => {
  console.log("\n🧪 RUN TEST START\n");

  const result = await runLegalAI(
    "تم سرقة هاتف محمول من شخص في الطريق العام مع وجود شاهد"
  );

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST DONE\n");
})();

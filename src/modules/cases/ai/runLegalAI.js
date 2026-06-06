console.log("🔥 ENTRY FILE REACHED");

import { parseCase } from "./nlp/caseParser.js";
import { advancedCaseAnalyzer } from "./nlp/advancedCaseAnalyzer.js";

import { advancedForensics } from "./forensics/advancedForensics.js";

import { legalEngine } from "./legalEngine.js";
import { judgeEngine } from "./engine/judgeEngine.js";

import { loadAllLaws } from "./rag/lawLoader.js";
import { loadLawsIntoVectorDB, lawDB } from "./rag/lawDB.js";
import { embedText } from "./rag/embeddings.js";

export const runLegalAI = async (caseText) => {
  try {

    console.log("🚀 START LEGAL AI v4");

    if (!caseText || typeof caseText !== "string" || !caseText.trim()) {
      throw new Error("caseText empty");
    }

    // 🧠 1. BASIC NLP
    const parsedCase = parseCase(caseText);

    // 🧠 2. ADVANCED NLP
    const analysisV2 = advancedCaseAnalyzer?.(caseText) || {
      warning: "advancedCaseAnalyzer missing"
    };

    // 🧠 3. FORENSICS
    const forensics = advancedForensics?.(caseText) || {
      warning: "advancedForensics missing"
    };

    console.log("🧠 NLP + FORENSICS DONE");

    // 📚 4. LOAD LAWS
    const lawText = await loadAllLaws();

    if (!lawText) {
      throw new Error("No law text loaded");
    }

    const lawChunks = lawText
      .split(/(?=الفصل|المادة)/g)
      .map((t, i) => ({
        id: i,
        text: t.trim()
      }))
      .filter(t => t.text && t.text.length > 10);

    // ⚠️ INDEX ONLY ONCE
    if (!lawDB?.data || lawDB.data.length === 0) {
      console.log("📚 indexing law DB...");
      await loadLawsIntoVectorDB(lawChunks);
    }

    // 🔎 RAG SEARCH
    const queryVector = await embedText(caseText);
    const relevantArticles = lawDB.search(queryVector, 5);

    console.log("🔎 RAG DONE:", relevantArticles.length);

    // ⚖️ LEGAL ENGINE
    const legalAnalysis = await legalEngine(
      caseText,
      relevantArticles,
      forensics
    );

    if (!legalAnalysis) {
      throw new Error("legal analysis failed");
    }

    console.log("⚖️ LEGAL ENGINE DONE");

    // ⚖️ JUDGE ENGINE (FIXED CALL)
    const judgment = await judgeEngine(
      caseText,
      legalAnalysis.analysis || legalAnalysis
    );

    console.log("⚖️ JUDGE DONE");
    console.log("✅ DONE LEGAL AI v4");

    return {
      input: caseText,
      parsedCase,
      analysisV2,
      forensics,
      articlesUsed: relevantArticles,
      legalAnalysis,
      judgment,
      meta: {
        version: "LEXISNEXIS-AI-v4",
        status: "SUCCESS"
      }
    };

  } catch (err) {
    console.error("❌ runLegalAI ERROR:", err);

    return {
      status: "ERROR",
      message: err.message,
      meta: {
        version: "LEXISNEXIS-AI-v4",
        failed: true
      }
    };
  }
};

/* =========================================================
   🚀 RUN DIRECTLY (IMPORTANT FIX - ADDITIONAL PART)
========================================================= */

runLegalAI("تم سرقة هاتف في الشارع واعتراف أحد الشهود")
  .then(res => {
    console.log("\n================ RESULT ================\n");
    console.dir(res, { depth: null });
  })
  .catch(err => {
    console.error("🔥 FATAL ERROR:", err);
  });

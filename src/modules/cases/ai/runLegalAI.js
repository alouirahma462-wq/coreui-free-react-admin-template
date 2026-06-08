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
       ⚖️ 🧠 LEXISNEXIS PROMPT
    ======================== */

    const fullCase = `
${caseText}

--- NLP PARSED DATA ---
${JSON.stringify(parsedCase, null, 2)}

--- ADVANCED ANALYSIS ---
${JSON.stringify(analysisV2, null, 2)}

--- FORENSICS ---
${JSON.stringify(forensics, null, 2)}

--- RELEVANT ARTICLES ---
${JSON.stringify(relevantArticles, null, 2)}
`;

    const prompt = `
You are a senior criminal court judge and forensic legal AI system (LexisNexis-level engine).

Your role:
Analyze the FULL case file with extreme precision, as if preparing an official court judgment.

────────────────────────────
RULES (STRICT)
────────────────────────────
- Read the entire case carefully
- Do NOT ignore any detail (even small ones)
- Infer missing facts logically when possible (mark inferred)
- Separate facts vs assumptions clearly
- Identify all legal actors (victim, suspect, witnesses)
- Reconstruct full timeline logically
- Classify the crime under criminal law principles
- Match relevant legal articles ONLY if applicable
- Evaluate evidence strength objectively
- Provide professional court-level reasoning
- Be structured, formal, and precise

────────────────────────────
OUTPUT FORMAT (MANDATORY)
────────────────────────────

1. CASE SUMMARY
2. FACTS
3. ACTORS
4. TIMELINE
5. EVIDENCE ANALYSIS
6. FORENSIC INTERPRETATION
7. LEGAL CLASSIFICATION
8. APPLICABLE LEGAL FRAMEWORK
9. COURT REASONING
10. FINAL VERDICT
11. CONFIDENCE SCORE (0-100)

────────────────────────────
CASE FILE
────────────────────────────

"""
${fullCase}
"""
`;

    /* ========================
       ⚖️ LEGAL ENGINE
    ======================== */
    const legalAnalysis = await legalEngine(
      caseText,
      relevantArticles,
      forensics,
      prompt
    );

    console.log("⚖️ LEGAL ENGINE DONE");

    /* ========================
       ⚖️ JUDGE ENGINE
    ======================== */
    const judgment = await judgeEngine(
      caseText,
      legalAnalysis?.analysis || legalAnalysis,
      prompt
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

import dotenv from "dotenv";
dotenv.config();

console.log("🔥 LEGAL AI SYSTEM BOOTING (v1 - Intelligent Core)");

import { parseCase } from "../nlp/caseParser.js";
import { advancedCaseAnalyzer } from "../nlp/advancedCaseAnalyzer.js";
import { advancedForensics } from "../forensics/advancedForensics.js";

import { legalEngine } from "../legalEngine.js";
import { judgeEngine } from "../engine/judgeEngine.js";

import { loadAllLaws } from "../rag/lawLoader.js";
import { lawDB } from "../rag/lawDB.js";
import { embedText } from "../rag/embeddings.js";

/* ================================
   🧠 STAGE 1: CASE UNDERSTANDING ENGINE
================================ */
function buildCaseModel(parsed, analysisV2, forensics) {
  return {
    facts: parsed?.facts || [],
    actors: parsed?.actors || [],
    events: parsed?.events || [],
    timeline: parsed?.timeline || [],
    location: parsed?.location || null,
    crime_type: analysisV2?.crime_type || "unknown",

    metadata: {
      confidence: analysisV2?.confidence || 0.5,
      language: "ar",
      source: "court_record"
    }
  };
}

/* ================================
   🧠 STAGE 2: EVIDENCE ENGINE (BASIC VERSION)
   (Preparation for Bayesian upgrade later)
================================ */
function evidenceScoring(caseModel, forensics) {
  const witnessScore = forensics?.witnessReliability || 0.6;
  const documentScore = forensics?.documentIntegrity || 0.7;
  const contradictionPenalty = forensics?.contradictions?.length || 0;

  const finalScore =
    (witnessScore * 0.4 +
     documentScore * 0.4 -
     contradictionPenalty * 0.05);

  return {
    witness_score: witnessScore,
    document_score: documentScore,
    contradiction_penalty: contradictionPenalty,
    final_score: Math.max(0, Math.min(1, finalScore))
  };
}

/* ================================
   🧠 STAGE 3: GRAPH RELATION BUILDER
================================ */
function buildEvidenceGraph(parsedCase) {
  const graph = [];

  const actors = parsedCase?.actors || [];
  const events = parsedCase?.events || [];

  for (const actor of actors) {
    for (const event of events) {
      graph.push({
        from: actor,
        relation: "involved_in",
        to: event
      });
    }
  }

  return {
    nodes: [...actors, ...events],
    edges: graph
  };
}

/* ================================
   ⚖️ MAIN ENGINE (ORCHESTRATOR)
================================ */
export const runLegalAI = async (caseText) => {
  try {
    console.log("🚀 START CASE INTELLIGENCE PIPELINE");

    if (!caseText?.trim()) {
      throw new Error("Empty case text");
    }

    /* ========================
       🧠 1. NLP UNDERSTANDING
    ======================== */
    const parsedCase = parseCase(caseText);
    const analysisV2 = advancedCaseAnalyzer?.(caseText) || {};
    const forensics = advancedForensics?.(caseText) || {};

    console.log("🧠 CASE UNDERSTANDING COMPLETE");

    const caseModel = buildCaseModel(parsedCase, analysisV2, forensics);

    /* ========================
       🧠 2. EVIDENCE ENGINE
    ======================== */
    const evidence = evidenceScoring(caseModel, forensics);

    console.log("📊 EVIDENCE SCORING DONE");

    /* ========================
       🕸 3. GRAPH ENGINE
    ======================== */
    const graph = buildEvidenceGraph(parsedCase);

    console.log("🕸 GRAPH BUILT");

    /* ========================
       📚 LAW RETRIEVAL (HYBRID READY)
    ======================== */
    const lawChunksRaw = await loadAllLaws();

    const queryVector = await embedText(caseText);
    const relevantArticles = lawDB.search(queryVector, 5);

    console.log("📚 LEGAL RETRIEVAL DONE");

    /* ========================
       ⚖️ LEGAL REASONING ENGINE
    ======================== */
    const legalAnalysis = await legalEngine(
      caseModel,
      relevantArticles,
      evidence
    );

    console.log("⚖️ LEGAL REASONING DONE");

    /* ========================
       ⚖️ JUDGMENT ENGINE
    ======================== */
    const judgment = await judgeEngine(
      caseModel,
      legalAnalysis
    );

    console.log("🏁 JUDGMENT COMPLETE");

    /* ========================
       📦 FINAL OUTPUT (SYSTEM STATE)
    ======================== */
    return {
      caseModel,
      evidence,
      graph,
      relevantArticles,
      legalAnalysis,
      judgment,

      system: {
        version: "LEGAL-AI-v1-INTELLIGENCE-CORE",
        stage: "foundation",
        next_upgrades: [
          "bayesian_evidence_learning",
          "knowledge_graph_upgrade (Neo4j)",
          "LLM explanation layer",
          "probabilistic verdict engine"
        ]
      }
    };

  } catch (err) {
    console.error("❌ LEGAL AI ERROR:", err);

    return {
      status: "FAILED",
      error: err.message,
      system: {
        version: "LEGAL-AI-v1-INTELLIGENCE-CORE"
      }
    };
  }
};

/* ================================
   🧪 TEST RUN (REALISTIC CASE)
================================ */
(async () => {
  console.log("\n🧪 TEST CASE RUN START\n");

  const result = await runLegalAI(
    "تم سرقة هاتف شخص في الطريق العام مع وجود شاهد وتناقض في أقوال المشتبه به"
  );

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST DONE\n");
})();

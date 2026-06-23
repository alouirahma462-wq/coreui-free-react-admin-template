import dotenv from "dotenv";
dotenv.config();

console.log("🔥 LEGAL AI SYSTEM BOOTING (v3 - GOD CORE PIPELINE)");

import { extractCaseFromFolder } from "../ingestion/nlpExtractor.js";
import { legalEngine } from "../domain/legalEngine.js";
import { judgeEngine } from "../domain/judgeEngine.js";
import { buildLawSystem } from "../rag/core/buildLawSystem.js";
import { lawDB } from "../storage/vectorStore.js";
import { embedText } from "../storage/embeddings.js";

// 🧠 NEW (compat layer with your upgraded modules)
import { buildCaseGraph } from "../graph/caseGraph.js";
import { buildEvidenceScore } from "../ai/evidence/scoring.js";
import { graphNeuralScore } from "../graph/graphScoring.js";

/* ================================
   🧠 CASE MODEL
================================ */
function buildCaseModel(parsed) {
  return {
    facts: parsed?.facts || [],
    actors: parsed?.actors || [],
    events: parsed?.events || [],
    timeline: parsed?.timeline || [],
    location: parsed?.location || null,
    crime_type: parsed?.crime_type || "unknown",
    legal_context: parsed?.legal_context || {}
  };
}

/* ================================
   ⚖️ BAYESIAN WRAPPER (SAFE)
================================ */
function bayesian(evidence) {
  const prior = 0.5;

  const likelihood =
    (evidence.witness_score + evidence.document_score) / 2;

  const posterior =
    (likelihood * prior) /
    ((likelihood * prior) + ((1 - likelihood) * (1 - prior)) + 1e-9);

  return {
    prior,
    likelihood,
    posterior: Number(posterior.toFixed(3))
  };
}

/* ================================
   🧠 EXPLANATION ENGINE
================================ */
function explain({ parsed, bayes, graphScore, judgment }) {
  return {
    summary: `
CASE ANALYSIS (GOD CORE v3):

Crime type: ${parsed.crime_type}
Actors: ${parsed.actors.length}
Events: ${parsed.events.length}

Bayesian probability: ${bayes.posterior}
Graph score: ${graphScore}

VERDICT:
${judgment?.verdict_raw || "UNDEFINED"}
    `,
    confidence: bayes.posterior
  };
}

/* ================================
   ⚖️ MAIN PIPELINE (FULL GOD CORE)
================================ */
export const runLegalAI = async (caseFolderPath) => {
  try {
    console.log("🚀 RUNNING LEGAL AI v3 GOD CORE PIPELINE");

    if (!caseFolderPath) {
      throw new Error("Missing case folder path");
    }

    /* ========================
       🧠 CASE PARSING
    ======================== */
    const parsed = await extractCaseFromFolder(caseFolderPath);
    const caseModel = buildCaseModel(parsed);

    console.log("🧠 CASE PARSED");

    /* ========================
       🕸 GRAPH v5 (UPGRADED)
    ======================== */
    const graph = buildCaseGraph(caseModel);

    console.log("🕸 GRAPH BUILT");

    /* ========================
       📊 EVIDENCE v5 (REAL)
    ======================== */
    const evidence = buildEvidenceScore(caseModel, graph, []);

    const bayes = bayesian(evidence);

    console.log("📊 EVIDENCE + BAYES DONE");

    /* ========================
       🧠 GRAPH NEURAL SCORE
    ======================== */
    const graphScore = graphNeuralScore(graph, {
      finalProbability: bayes.posterior
    });

    console.log("🧠 GRAPH SCORING DONE");

    /* ========================
       📚 RAG SYSTEM
    ======================== */
    const articles = await buildLawSystem(caseFolderPath);

    const vectors = articles.map(a => ({
      vector: embedText(a.text || a.content || ""),
      metadata: a
    }));

    lawDB.add(vectors);

    console.log("📚 RAG READY");

    /* ========================
       ⚖️ LEGAL ENGINE (SAFE CALL)
    ======================== */
    const legalAnalysis = await legalEngine(
      caseModel,
      articles,
      evidence
    );

    console.log("⚖️ LEGAL ENGINE DONE");

    /* ========================
       ⚖️ JUDGMENT ENGINE
    ======================== */
    const judgment = await judgeEngine(
      caseModel,
      legalAnalysis?.analysis || legalAnalysis
    );

    console.log("🏁 JUDGMENT DONE");

    /* ========================
       🧠 FINAL EXPLANATION
    ======================== */
    const explanation = explain({
      parsed,
      bayes,
      graphScore,
      judgment
    });

    console.log("🧠 EXPLANATION READY");

    return {
      caseModel,
      evidence,
      bayes,
      graph,
      graphScore,
      articles,
      legalAnalysis,
      judgment,
      explanation,

      system: {
        version: "LEGAL-AI-V3-GOD-CORE",
        status: "FULLY_CONNECTED_PIPELINE"
      }
    };

  } catch (err) {
    console.error("❌ PIPELINE ERROR:", err);

    // 🧠 ALWAYS SAFE FALLBACK
    return {
      status: "FAILED_SAFE_MODE",
      error: err.message,
      system: {
        version: "LEGAL-AI-V3-GOD-CORE",
        fallback: true
      }
    };
  }
};

/* ================================
   🧪 TEST RUN
================================ */
(async () => {
  console.log("\n🧪 TEST RUN START\n");

  const result = await runLegalAI("src/legal-library/cases");

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST DONE\n");
})();

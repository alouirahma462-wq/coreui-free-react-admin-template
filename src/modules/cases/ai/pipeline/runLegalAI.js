import dotenv from "dotenv";
dotenv.config();

console.log("🔥 LEGAL AI SYSTEM BOOTING (v2 - CLEAN INTELLIGENCE CORE)");

import { extractCaseFromFolder } from "../ingestion/nlpExtractor.js";

import { legalEngine } from "../domain/legalEngine.js";
import { judgeEngine } from "../domain/judgeEngine.js";

import { loadAllLaws } from "../rag/core/buildLawSystem.js";
import { lawDB } from "../storage/vectorStore.js";
import { embedText } from "../storage/embeddings.js";

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
   📊 EVIDENCE ENGINE (CLEAN BASE)
================================ */
function evidenceScoring(parsed) {
  const base =
    (parsed?.actors?.length || 0) * 0.2 +
    (parsed?.events?.length || 0) * 0.2;

  return {
    witness_score: 0.6,
    document_score: 0.7,
    contradiction_penalty: 0,
    base_score: Math.min(1, base)
  };
}

/* ================================
   🧠 BAYESIAN ENGINE (STABLE)
================================ */
function bayesian(evidence) {
  const prior = 0.5;

  const likelihood =
    (evidence.witness_score + evidence.document_score) / 2;

  const posterior =
    (likelihood * prior) /
    ((likelihood * prior) + ((1 - likelihood) * (1 - prior)));

  return {
    prior,
    likelihood,
    posterior: Number((posterior || 0.5).toFixed(3))
  };
}

/* ================================
   🕸 GRAPH ENGINE
================================ */
function buildGraph(parsed) {
  const nodes = [];
  const edges = [];

  (parsed?.actors || []).forEach(a => nodes.push({ id: a, type: "actor" }));
  (parsed?.events || []).forEach(e => nodes.push({ id: e, type: "event" }));

  for (const a of parsed?.actors || []) {
    for (const e of parsed?.events || []) {
      edges.push({ from: a, to: e, relation: "involved_in" });
    }
  }

  return { nodes, edges };
}

/* ================================
   🧠 EXPLANATION LAYER
================================ */
function explain({ parsed, bayes, graph, judgment }) {
  return {
    summary: `
CASE ANALYSIS SUMMARY:

- Crime type: ${parsed.crime_type}
- Actors: ${parsed.actors.length}
- Events: ${parsed.events.length}

BAYESIAN RESULT:
- Probability of guilt: ${bayes.posterior}

GRAPH INSIGHT:
- Nodes: ${graph.nodes.length}
- Edges: ${graph.edges.length}

FINAL VERDICT:
- ${judgment?.verdict || "UNDEFINED"}

SYSTEM: v2 CLEAN PIPELINE
    `,
    confidence: bayes.posterior
  };
}

/* ================================
   ⚖️ MAIN PIPELINE
================================ */
export const runLegalAI = async (caseFolderPath) => {
  try {
    console.log("🚀 RUNNING LEGAL AI v2 CLEAN PIPELINE");

    if (!caseFolderPath) {
      throw new Error("Missing case folder path");
    }

    /* ========================
       🧠 CASE UNDERSTANDING
    ======================== */
    const parsed = await extractCaseFromFolder(caseFolderPath);

    const caseModel = buildCaseModel(parsed);

    console.log("🧠 CASE PARSED");

    /* ========================
       📊 EVIDENCE + BAYES
    ======================== */
    const evidence = evidenceScoring(parsed);
    const bayes = bayesian(evidence);

    console.log("📊 BAYESIAN DONE");

    /* ========================
       🕸 GRAPH
    ======================== */
    const graph = buildGraph(parsed);

    console.log("🕸 GRAPH BUILT");

    /* ========================
       📚 RAG
    ======================== */
    await loadAllLaws();

    const queryVector = await embedText(JSON.stringify(parsed));
    const relevantArticles = lawDB.search(queryVector, 5);

    console.log("📚 RAG DONE");

    /* ========================
       ⚖️ LEGAL ENGINE
    ======================== */
    const legalAnalysis = await legalEngine(
      caseModel,
      relevantArticles,
      evidence
    );

    console.log("⚖️ LEGAL ENGINE DONE");

    /* ========================
       ⚖️ JUDGMENT
    ======================== */
    const judgment = await judgeEngine(
      caseModel,
      legalAnalysis.analysis || legalAnalysis
    );

    console.log("🏁 JUDGMENT DONE");

    /* ========================
       🧠 EXPLANATION
    ======================== */
    const explanation = explain({
      parsed,
      bayes,
      graph,
      judgment
    });

    console.log("🧠 EXPLANATION READY");

    /* ========================
       📦 OUTPUT
    ======================== */
    return {
      caseModel,
      evidence,
      bayes,
      graph,
      relevantArticles,
      legalAnalysis,
      judgment,
      explanation,
      system: {
        version: "LEGAL-AI-V2-CLEAN",
        status: "STABLE_PIPELINE"
      }
    };

  } catch (err) {
    console.error("❌ PIPELINE ERROR:", err);

    return {
      status: "FAILED",
      error: err.message,
      system: {
        version: "LEGAL-AI-V2-CLEAN"
      }
    };
  }
};

/* ================================
   🧪 TEST
================================ */
(async () => {
  console.log("\n🧪 TEST RUN START\n");

  const result = await runLegalAI(
    "src/legal-library/cases"
  );

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST DONE\n");
})();

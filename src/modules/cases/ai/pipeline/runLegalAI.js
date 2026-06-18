import dotenv from "dotenv";
dotenv.config();

console.log("🔥 LEGAL AI SYSTEM BOOTING (v2 - FULL INTELLIGENCE CORE)");

import { extractCaseFromFolder } from "../ingestion/nlpExtractor.js";
import { advancedCaseAnalyzer } from "../nlp/advancedCaseAnalyzer.js";
import { advancedForensics } from "../forensics/advancedForensics.js";

import { legalEngine } from "../legalEngine.js";
import { judgeEngine } from "../engine/judgeEngine.js";

import { loadAllLaws } from "../rag/lawLoader.js";
import { lawDB } from "../rag/lawDB.js";
import { embedText } from "../rag/embeddings.js";

/* ================================
   🧠 CASE MODEL BUILDER
================================ */
function buildCaseModel(parsed, analysisV2) {
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
   📊 EVIDENCE ENGINE (IMPROVED BASE)
================================ */
function evidenceScoring(forensics) {
  const witness = forensics?.witnessReliability ?? 0.6;
  const document = forensics?.documentIntegrity ?? 0.7;
  const contradictions = forensics?.contradictions?.length ?? 0;

  const score =
    witness * 0.4 +
    document * 0.4 -
    contradictions * 0.05;

  return {
    witness_score: witness,
    document_score: document,
    contradiction_penalty: contradictions,
    base_score: Math.max(0, Math.min(1, score))
  };
}

/* ================================
   🧠 BAYESIAN ENGINE (UPGRADE 1)
================================ */
function bayesianEvidenceEngine(evidence) {
  const prior = 0.5;

  const P_E_given_G = (evidence.witness_score + evidence.document_score) / 2;

  const P_E_given_notG = Math.max(
    0.1,
    1 - P_E_given_G + evidence.contradiction_penalty * 0.1
  );

  const numerator = P_E_given_G * prior;
  const denominator = numerator + (P_E_given_notG * (1 - prior));

  const posterior = numerator / (denominator || 1);

  return {
    prior,
    likelihood_guilty: P_E_given_G,
    likelihood_innocent: P_E_given_notG,
    posterior_guilt_probability: Number(posterior.toFixed(3))
  };
}

/* ================================
   🕸 KNOWLEDGE GRAPH ENGINE (UPGRADE 2)
================================ */
function buildKnowledgeGraph(parsedCase) {
  const nodes = [];
  const edges = [];

  const actors = parsedCase?.actors || [];
  const events = parsedCase?.events || [];

  actors.forEach(a => nodes.push({ id: a, type: "actor" }));
  events.forEach(e => nodes.push({ id: e, type: "event" }));

  actors.forEach(actor => {
    events.forEach(event => {
      edges.push({
        from: actor,
        relation: "linked_to_event",
        to: event
      });
    });
  });

  return {
    nodes,
    edges,
    graph_score: nodes.length + edges.length
  };
}

/* ================================
   ⚖️ LEGAL EXPLANATION ENGINE (UPGRADE 3)
================================ */
function explainDecision({
  caseModel,
  evidence,
  bayesian,
  legalAnalysis,
  judgment,
  graph
}) {
  return {
    explanation: `
🧠 CASE UNDERSTANDING:
- Actors: ${caseModel.actors.length}
- Events: ${caseModel.events.length}
- Confidence: ${caseModel.metadata.confidence}

📊 EVIDENCE ANALYSIS:
- Witness score: ${evidence.witness_score}
- Document score: ${evidence.document_score}
- Contradictions: ${evidence.contradiction_penalty}

🧠 BAYESIAN PROBABILITY:
- Prior: ${bayesian.prior}
- P(Guilt|Evidence): ${bayesian.posterior_guilt_probability}

🕸 GRAPH ANALYSIS:
- Nodes: ${graph.nodes.length}
- Edges: ${graph.edges.length}

⚖️ LEGAL RESULT:
- Verdict: ${judgment?.verdict || "undetermined"}

🔎 SYSTEM REASONING:
The decision is based on structured legal inference using Tunisian law mapping,
probabilistic evidence scoring, and relational graph analysis.
`,
    confidence: bayesian.posterior_guilt_probability
  };
}

/* ================================
   ⚖️ MAIN PIPELINE (CORE ORCHESTRATOR)
================================ */
export const runLegalAI = async (caseText) => {
  try {
    console.log("🚀 STARTING FULL LEGAL AI PIPELINE v2");

    if (!caseText?.trim()) {
      throw new Error("Empty case text");
    }

    /* ========================
       🧠 NLP LAYER
    ======================== */
    const parsedCase = parseCase(caseText);
    const analysisV2 = advancedCaseAnalyzer?.(caseText) || {};
    const forensics = advancedForensics?.(caseText) || {};

    const caseModel = buildCaseModel(parsedCase, analysisV2);

    console.log("🧠 CASE MODEL READY");

    /* ========================
       📊 EVIDENCE LAYER
    ======================== */
    const evidence = evidenceScoring(forensics);

    const bayesian = bayesianEvidenceEngine(evidence);

    console.log("📊 BAYESIAN EVIDENCE COMPLETE");

    /* ========================
       🕸 GRAPH LAYER
    ======================== */
    const graph = buildKnowledgeGraph(parsedCase);

    console.log("🕸 KNOWLEDGE GRAPH BUILT");

    /* ========================
       📚 RETRIEVAL LAYER (RAG)
    ======================== */
    await loadAllLaws();
    const queryVector = await embedText(caseText);
    const relevantArticles = lawDB.search(queryVector, 5);

    console.log("📚 LEGAL RETRIEVAL DONE");

    /* ========================
       ⚖️ LEGAL REASONING
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
       🧠 EXPLANATION LAYER
    ======================== */
    const explanation = explainDecision({
      caseModel,
      evidence,
      bayesian,
      legalAnalysis,
      judgment,
      graph
    });

    console.log("🧠 EXPLANATION GENERATED");

    /* ========================
       📦 FINAL OUTPUT
    ======================== */
    return {
      caseModel,
      evidence,
      bayesian,
      graph,
      relevantArticles,
      legalAnalysis,
      judgment,
      explanation,

      system: {
        version: "LEGAL-AI-v2-FULL-INTELLIGENCE",
        level: "bayesian + graph + explanation + reasoning",
        status: "ACTIVE"
      }
    };

  } catch (err) {
    console.error("❌ LEGAL AI ERROR:", err);

    return {
      status: "FAILED",
      error: err.message,
      system: {
        version: "LEGAL-AI-v2-FULL-INTELLIGENCE"
      }
    };
  }
};

/* ================================
   🧪 TEST RUN
================================ */
(async () => {
  console.log("\n🧪 TEST START\n");

  const result = await runLegalAI(
    "تم سرقة هاتف في الطريق العام مع وجود شاهد وتناقض في أقوال المشتبه به"
  );

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST DONE\n");
})();

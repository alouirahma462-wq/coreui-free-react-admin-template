import dotenv from "dotenv";
dotenv.config();

console.log("⚖️ LEGAL COURT AI BOOTING (v8 FINAL COURT SYSTEM)");

import { extractCaseFromFolder } from "../ingestion/nlpExtractor.js";
import { buildCaseGraph } from "../graph/caseGraph.js";
import { buildEvidenceScore } from "../ai/evidence/scoring.js";
import { graphNeuralScore } from "../graph/graphScoring.js";
import { buildLawSystem } from "../rag/core/buildLawSystem.js";
import { embedText } from "../storage/embeddings.js";
import { lawDB } from "../storage/vectorStore.js";

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
   🧠 MULTI-JUDGE SYSTEM (NEW)
================================ */
function multiJudgeEngine(caseModel, graphScore, evidence, legalAnalysis) {
  const judges = [
    { name: "Judge_Strict", weight: 0.4 },
    { name: "Judge_Balanced", weight: 0.35 },
    { name: "Judge_Lenient", weight: 0.25 }
  ];

  let verdictScore = 0;

  for (const judge of judges) {
    let localScore = graphScore * 0.5 + evidence.likelihood * 0.5;

    // strict judge reduces leniency
    if (judge.name === "Judge_Strict") localScore -= 0.05;

    // lenient judge reduces severity
    if (judge.name === "Judge_Lenient") localScore += 0.05;

    verdictScore += localScore * judge.weight;
  }

  const final = Math.min(0.99, Math.max(0.01, verdictScore));

  return {
    verdict_raw:
      final > 0.65 ? "GUILTY_LIKELY" :
      final > 0.45 ? "UNCERTAIN" :
      "NOT_GUILTY_LIKELY",

    score: Number(final.toFixed(3))
  };
}

/* ================================
   ⚖️ BAYESIAN WRAPPER
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
function explain({ parsed, bayes, graphScore, verdict }) {
  return {
    summary: `
⚖️ FINAL COURT ANALYSIS (v8 SYSTEM)

Crime: ${parsed.crime_type}
Actors: ${parsed.actors.length}
Events: ${parsed.events.length}

Bayes Probability: ${bayes.posterior}
Graph Score: ${graphScore}
Final Verdict Score: ${verdict.score}

VERDICT:
${verdict.verdict_raw}
    `,
    confidence: bayes.posterior
  };
}

/* ================================
   ⚖️ MAIN PIPELINE (FULL COURT AI)
================================ */
export const runLegalAI = async (caseFolderPath) => {
  try {
    console.log("🚀 RUNNING LEGAL COURT SYSTEM v8");

    if (!caseFolderPath) {
      throw new Error("Missing case folder path");
    }

    /* ========================
       🧠 CASE PARSING
    ======================== */
    const parsed = await extractCaseFromFolder(caseFolderPath);
    const caseModel = buildCaseModel(parsed);

    /* ========================
       🕸 GRAPH ENGINE
    ======================== */
    const graph = buildCaseGraph(caseModel);

    /* ========================
       📊 EVIDENCE ENGINE
    ======================== */
    const evidence = buildEvidenceScore(caseModel, graph, []);

    const bayes = bayesian(evidence);

    /* ========================
       🧠 GRAPH NEURAL SCORING
    ======================== */
    const graphScore = graphNeuralScore(graph, {
      finalProbability: bayes.posterior
    });

    /* ========================
       📚 RAG SYSTEM (LEGAL KNOWLEDGE)
    ======================== */
    const articles = await buildLawSystem(caseFolderPath);

    const vectors = articles.map(a => ({
      vector: embedText(a.text || ""),
      metadata: a
    }));

    lawDB.add(vectors);

    /* ========================
       ⚖️ LEGAL ANALYSIS LAYER
    ======================== */
    const legalAnalysis = {
      articles,
      strength: graphScore
    };

    /* ========================
       ⚖️ MULTI-JUDGE COURT SYSTEM
    ======================== */
    const verdict = multiJudgeEngine(
      caseModel,
      graphScore,
      evidence,
      legalAnalysis
    );

    /* ========================
       🧠 FINAL EXPLANATION
    ======================== */
    const explanation = explain({
      parsed,
      bayes,
      graphScore,
      verdict
    });

    return {
      caseModel,
      evidence,
      bayes,
      graph,
      graphScore,
      legalAnalysis,
      verdict,
      explanation,

      system: {
        version: "LEGAL-COURT-AI-V8-FINAL",
        mode: "MULTI_JUDGE_NEURAL_COURT",
        status: "ACTIVE"
      }
    };

  } catch (err) {
    return {
      status: "FAILED_SAFE_MODE",
      error: err.message,
      system: {
        version: "LEGAL-COURT-AI-V8",
        fallback: true
      }
    };
  }
};

/* ================================
   🧪 TEST RUN
================================ */
(async () => {
  console.log("\n🧪 COURT TEST RUN\n");

  const result = await runLegalAI("src/legal-library/cases");

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 TEST COMPLETE\n");
})();

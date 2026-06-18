import { buildEvidenceScore } from "../evidence/scoring.js";
import { buildCaseGraph } from "../graph/caseGraph.js";
import { legalReasoningEngine } from "../reasoning/legalReasoning.js";
import { graphNeuralScore } from "../graph/graphScoring.js";
import { explainDecision } from "../core/explainability.js";
import { storeCaseOutcome } from "../core/caseMemory.js";

/**
 * 🧠 CORE INTELLIGENCE ENGINE
 * - Graph reasoning
 * - Evidence Bayesian scoring
 * - Rule-based legal inference
 * - Memory learning
 */
export async function analyzeCase(caseInput = {}, legalCorpus = []) {
  try {
    if (!caseInput || typeof caseInput !== "object") {
      throw new Error("Invalid caseInput provided");
    }

    /* =========================
       🕸 GRAPH BUILDING
    ========================= */
    const graph = buildCaseGraph(caseInput) || {
      nodes: [],
      edges: [],
      contradictions: [],
    };

    /* =========================
       🧪 EVIDENCE SCORING
    ========================= */
    const evidenceReport = buildEvidenceScore(caseInput, graph) || {
      finalProbability: 0.5,
      breakdown: [],
    };

    /* =========================
       🧠 GRAPH NEURAL BOOST
    ========================= */
    const rawGraphScore = graphNeuralScore(graph, evidenceReport);

    const enhancedScore = Math.min(
      0.99,
      Math.max(0.01, rawGraphScore || evidenceReport.finalProbability || 0.5)
    );

    /* =========================
       ⚖️ LEGAL REASONING ENGINE
    ========================= */
    const legalDecision = legalReasoningEngine({
      graph,
      evidenceReport: {
        ...evidenceReport,
        finalProbability: enhancedScore,
      },
      legalCorpus: legalCorpus || [],
    }) || {
      verdict: "UNKNOWN",
      probability: enhancedScore,
      legalMatch: [],
      reasoning: [],
    };

    /* =========================
       🧠 EXPLANATION LAYER
    ========================= */
    const explanation = explainDecision(
      legalDecision,
      evidenceReport,
      graph
    ) || {
      summary: "No explanation generated",
      reasoning: [],
      legalBasis: [],
      graphInsights: {},
    };

    /* =========================
       🧠 MEMORY LEARNING (SAFE)
    ========================= */
    try {
      storeCaseOutcome(caseInput, legalDecision);
    } catch (memErr) {
      console.warn("Memory storage failed:", memErr.message);
    }

    /* =========================
       📦 OUTPUT
    ========================= */
    return {
      graph,
      evidenceReport,
      legalDecision,
      explanation,
      confidence: enhancedScore,
      system: {
        engine: "AI-CASE-INTELLIGENCE-V2.1",
        status: "OK",
      },
    };

  } catch (err) {
    console.error("❌ analyzeCase ERROR:", err.message);

    return {
      error: err.message,
      system: {
        engine: "AI-CASE-INTELLIGENCE-V2.1",
        status: "FAILED",
      },
    };
  }
}

import { buildEvidenceScore } from "../evidence/scoring.js";
import { buildCaseGraph } from "../graph/caseGraph.js";
import { legalReasoningEngine } from "../reasoning/legalReasoning.js";
import { graphNeuralScore } from "../graph/graphScoring.js";
import { explainDecision } from "../core/explainability.js";
import { storeCaseOutcome } from "../core/caseMemory.js";

export async function analyzeCase(caseInput, legalCorpus) {
  // 🕸 GRAPH
  const graph = buildCaseGraph(caseInput);

  // 🧪 EVIDENCE
  const evidenceReport = buildEvidenceScore(caseInput, graph);

  // 🧠 GRAPH INTELLIGENCE LAYER
  const enhancedScore = graphNeuralScore(graph, evidenceReport);

  // ⚖️ LEGAL REASONING
  const legalDecision = legalReasoningEngine({
    graph,
    evidenceReport: {
      ...evidenceReport,
      finalProbability: enhancedScore,
    },
    legalCorpus,
  });

  // 🧠 EXPLANATION
  const explanation = explainDecision(legalDecision, evidenceReport, graph);

  // 🧠 MEMORY LEARNING
  storeCaseOutcome(caseInput, legalDecision);

  return {
    graph,
    evidenceReport,
    legalDecision,
    explanation,
  };
}

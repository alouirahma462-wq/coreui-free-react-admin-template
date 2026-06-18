import { buildEvidenceScore } from "../evidence/scoring.js";
import { buildCaseGraph } from "../graph/caseGraph.js";
import { legalReasoningEngine } from "../reasoning/legalReasoning.js";

export async function analyzeCase(caseInput, legalCorpus) {
  // 1. GRAPH
  const graph = buildCaseGraph(caseInput);

  // 2. EVIDENCE
  const evidenceReport = buildEvidenceScore(caseInput, graph);

  // 3. LEGAL REASONING
  const legalDecision = legalReasoningEngine({
    graph,
    evidenceReport,
    legalCorpus,
  });

  return {
    graph,
    evidenceReport,
    legalDecision,
  };
}

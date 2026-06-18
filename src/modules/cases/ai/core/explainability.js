// 🧠 Explanation Layer (LLM-ready output generator)

export function explainDecision(legalDecision, evidenceReport, graph) {
  return {
    summary: generateSummary(legalDecision),
    reasoning: generateReasoning(legalDecision, evidenceReport),
    legalBasis: legalDecision.legalMatch,
    graphInsights: summarizeGraph(graph),
  };
}

function generateSummary(decision) {
  return `The system classified the case as ${decision.verdict} with probability ${decision.probability.toFixed(2)}`;
}

function generateReasoning(decision, evidence) {
  return [
    `Evidence strength: ${evidence.finalProbability}`,
    `Legal rule match activated`,
    `Bayesian inference applied`,
  ];
}

function summarizeGraph(graph) {
  return {
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    contradictions: graph.contradictions.length,
  };
}

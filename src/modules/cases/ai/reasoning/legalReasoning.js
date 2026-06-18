export function legalReasoningEngine({ graph, evidenceReport, legalCorpus }) {
  const probability = evidenceReport.finalProbability;

  let verdict = "UNKNOWN";
  let legalMatch = [];
  let reasoning = [];

  // 🔥 Rule Engine (Tunisia-style simplified logic)

  const theftCondition =
    graph.edges.some(e => e.relation === "stole") &&
    probability > 0.7;

  const assaultCondition =
    graph.edges.some(e => e.relation === "attacked") &&
    probability > 0.6;

  if (theftCondition) {
    verdict = "AGGRAVATED_THEFT";
    legalMatch.push("Tunisian Penal Code - Theft Article");
    reasoning.push("High confidence theft pattern detected");
  }

  if (assaultCondition) {
    verdict = "ASSAULT";
    legalMatch.push("Tunisian Penal Code - Assault Article");
    reasoning.push("Violent interaction detected in graph");
  }

  if (probability < 0.4) {
    verdict = "INSUFFICIENT_EVIDENCE";
    reasoning.push("Evidence below legal threshold");
  }

  return {
    verdict,
    probability,
    legalMatch,
    reasoning,
  };
}

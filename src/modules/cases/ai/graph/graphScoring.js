// 🧠 Graph Neural-like Scoring (simplified version before real GNN)

export function graphNeuralScore(graph, evidenceReport) {
  let score = evidenceReport.finalProbability;

  // 🔥 Node influence propagation
  for (const node of graph.nodes) {
    if (node.type === "actor") {
      score += 0.02; // presence boost
    }

    if (node.type === "event" && node.severity === "high") {
      score += 0.05;
    }
  }

  // 🔥 Edge reinforcement
  for (const edge of graph.edges) {
    if (edge.relation === "performed") {
      score += 0.03;
    }

    if (edge.relation === "contradicts") {
      score -= 0.05;
    }
  }

  return Math.min(0.99, Math.max(0.01, score));
}

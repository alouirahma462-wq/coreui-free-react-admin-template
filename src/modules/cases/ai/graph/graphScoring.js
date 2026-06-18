export function graphNeuralScore(graph, evidenceReport) {
  let score = evidenceReport.finalProbability || 0.5;

  // ================================
  // 🧠 NODE-BASED INFLUENCE (UPGRADED)
  // ================================
  for (const node of graph.nodes || []) {
    const influence = node.influence || 0.5;

    if (node.type === "actor") {
      score += influence * 0.025;
    }

    if (node.type === "event") {
      score += influence * 0.035;

      if (node.severity === "high") {
        score += influence * 0.05;
      }
    }

    if (node.type === "evidence") {
      score += influence * 0.03;
    }

    if (node.type === "law") {
      score += influence * 0.02;
    }
  }

  // ================================
  // 🧠 EDGE PROPAGATION (WEIGHTED + ATTENTION)
  // ================================
  for (const edge of graph.edges || []) {
    const weight = edge.weight || 0.5;

    // attention boost (important connections matter more)
    const attention = weight * (edge.attention || 1);

    if (edge.relation === "performed") {
      score += attention * 0.04;
    }

    if (edge.relation === "supports") {
      score += attention * 0.05;
    }

    if (edge.relation === "contradicts") {
      score -= attention * 0.07;
    }
  }

  // ================================
  // 🛰 CONTRADICTION DIFFUSION FIELD (FINAL UPGRADE)
  // ================================
  const contradictionPressure =
    graph.contradictions?.reduce(
      (acc, c) => acc + (c.severity || 0),
      0
    ) || 0;

  // diffusion spreads across graph size
  const diffusionFactor =
    (graph.nodes?.length || 1) / 10;

  score -= contradictionPressure * 0.06 * diffusionFactor;

  // ================================
  // 🧠 GRAPH NEURAL PROPAGATION (2-HOP SIMULATION)
  // ================================
  const edgeInfluence =
    (graph.edges?.reduce((acc, e) => acc + (e.weight || 0), 0) || 0) /
    (graph.nodes?.length || 1);

  score += edgeInfluence * 0.03;

  // ================================
  // 🧬 CASE MEMORY INFLUENCE (FINAL ADDITION)
  // ================================
  if (graph.meta?.memoryBias) {
    score += graph.meta.memoryBias * 0.04;
  }

  // ================================
  // 📊 FINAL STABILITY NORMALIZATION (IMPROVED SIGMOID)
  // ================================
  score = 1 / (1 + Math.exp(-12 * (score - 0.5)));

  // ================================
  // ⚖️ HARD SAFETY CLAMP
  // ================================
  return Math.min(0.995, Math.max(0.005, score));
}

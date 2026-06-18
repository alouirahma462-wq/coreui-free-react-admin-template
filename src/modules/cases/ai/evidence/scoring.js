// Bayesian Evidence Engine (GOD MODE v6 FINAL)

function bayesUpdate(prior, likelihood) {
  const p = prior * likelihood;
  const norm = p / (p + (1 - prior) * (1 - likelihood) + 1e-9);
  return norm;
}

export function buildEvidenceScore(caseInput, graph, memory = []) {
  let guiltProbability = 0.5;

  const evidenceScores = [];
  const evidences = caseInput.evidence || [];

  // 🧠 GRAPH CONTEXT
  const contradictionSet = new Set(graph?.contradictions || []);

  // 🧠 GRAPH NEURAL STATE (NEW)
  const graphSignal =
    Math.tanh((graph?.nodes?.length || 1) / 10) * 0.2;

  for (const evidence of evidences) {
    let likelihood = 0.5;

    // ================================
    // 🧠 TIME DECAY
    // ================================
    const age = evidence.age || 0;
    const timeDecay = Math.exp(-age * 0.03);

    // ================================
    // 🧠 NEURAL ATTENTION LAYER
    // ================================
    const tokenWeight =
      (evidence.text?.length || 1) / 1000;

    const attentionScore =
      (evidence.importance || 0.5) * tokenWeight;

    const neuralScore =
      Math.tanh(attentionScore * 2) * 0.25;

    // ================================
    // ⚖️ CROSS-CASE MEMORY LEARNING
    // ================================
    let memoryBoost = 0;

    for (const past of memory) {
      if (past.type === evidence.type) {
        memoryBoost += past.weight || 0.05;
      }
    }

    memoryBoost = Math.min(0.25, memoryBoost);

    // ================================
    // 🔹 WITNESS MODEL
    // ================================
    if (evidence.type === "witness") {
      const credibility = evidence.credibility || 0.5;
      likelihood += credibility * 0.35;

      if (contradictionSet.has(evidence.id)) {
        likelihood -= 0.25;
      }

      if (credibility < 0.3) {
        likelihood -= 0.1;
      }
    }

    // ================================
    // 📄 DOCUMENT MODEL
    // ================================
    if (evidence.type === "document") {
      const authenticity = evidence.authenticity || 0.5;
      likelihood += authenticity * 0.45;

      if (authenticity > 0.8) {
        likelihood += 0.05;
      }
    }

    // ================================
    // 🧪 PHYSICAL EVIDENCE BOOST
    // ================================
    if (evidence.type === "physical") {
      likelihood += 0.6;
    }

    // ================================
    // 🛰 CONTRADICTION DIFFUSION NETWORK
    // ================================
    const contradictionImpact =
      (graph?.contradictions?.length || 0) * 0.07;

    const contradictionDiffusion =
      contradictionImpact * (1 + graphSignal);

    likelihood -= contradictionDiffusion;

    // ================================
    // 📚 SEMANTIC LEGAL EMBEDDING SCORE
    // ================================
    const semanticScore =
      evidence.semanticMatch || 0.5;

    const embeddingBoost =
      Math.pow(semanticScore, 1.35) * 0.22;

    // ================================
    // ⚖️ FINAL FUSION LAYER (NEURAL + GRAPH + MEMORY)
    // ================================
    likelihood =
      likelihood *
        timeDecay +
      neuralScore +
      memoryBoost +
      embeddingBoost +
      graphSignal;

    likelihood = Math.min(0.99, Math.max(0.01, likelihood));

    // ================================
    // 🧠 BAYESIAN UPDATE CORE
    // ================================
    guiltProbability = bayesUpdate(guiltProbability, likelihood);

    // ================================
    // 🔥 REINFORCEMENT LEARNING SIGNAL
    // ================================
    const reinforcementSignal =
      (likelihood > 0.72 ? 0.06 : -0.02) +
      memoryBoost +
      graphSignal;

    evidenceScores.push({
      id: evidence.id,
      type: evidence.type,

      likelihood: Number(likelihood.toFixed(3)),
      updatedProbability: Number(guiltProbability.toFixed(3)),

      meta: {
        timeDecay,
        neuralScore,
        memoryBoost,
        semanticScore,
        graphSignal,
        contradictionDiffusion,
        embeddingBoost,
        reinforcementSignal
      }
    });
  }

  // ================================
  // 📊 FINAL STABILIZATION LAYER
  // ================================
  const stabilized =
    guiltProbability < 0.01 ? 0.01 :
    guiltProbability > 0.99 ? 0.99 :
    guiltProbability;

  return {
    finalProbability: Number(stabilized.toFixed(3)),
    breakdown: evidenceScores,

    meta: {
      evidence_count: evidences.length,
      contradictions: graph?.contradictions?.length || 0,
      graph_nodes: graph?.nodes?.length || 0,
      model: "EVIDENCE_SCORING_V6_GOD_FINAL"
    }
  };
}

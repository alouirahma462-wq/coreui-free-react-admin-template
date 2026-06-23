export function legalReasoningEngine({
  graph,
  evidenceReport,
  legalCorpus
}) {
  // ================================
  // 🧠 SAFE CORE INPUTS
  // ================================
  const probability = evidenceReport?.finalProbability || 0;
  const edges = graph?.edges || [];
  const nodes = graph?.nodes || [];

  let verdict = "UNKNOWN";
  let legalMatch = [];
  let reasoning = [];

  let confidenceBoost = 0;

  // ================================
  // 🧠 GRAPH PATTERN INTELLIGENCE (UPGRADED)
  // ================================
  const relationCount = (type) =>
    edges.filter(e => e.relation === type).length;

  const stealScore = relationCount("stole");
  const attackScore = relationCount("attacked");
  const supportScore = edges.length - (stealScore + attackScore);

  // ================================
  // ⚖️ WEIGHTED GRAPH SIGNALS
  // ================================
  const theftSignal = stealScore * 0.35;
  const assaultSignal = attackScore * 0.4;
  const supportSignal = supportScore * 0.15;

  // ================================
  // 🧠 LEGAL CORPUS MATCHING (SIMULATED SEMANTIC SEARCH)
  // ================================
  const corpusHits =
    legalCorpus?.filter(l =>
      edges.some(e =>
        (l.tags || []).includes(e.relation)
      )
    ) || [];

  const corpusStrength = Math.min(0.3, corpusHits.length * 0.05);

  if (corpusHits.length) {
    legalMatch.push(
      ...corpusHits.map(c => c.title || "Legal Reference")
    );
  }

  // ================================
  // 🧠 GRAPH COMPLEXITY BOOST
  // ================================
  const graphComplexity =
    Math.min(1, (nodes.length + edges.length) / 50);

  confidenceBoost += graphComplexity * 0.1;

  // ================================
  // ⚖️ FINAL DECISION MODEL (MULTI FACTOR FUSION)
  // ================================
  const theftCondition =
    stealScore > 0 &&
    (probability + theftSignal + corpusStrength) > 0.7;

  const assaultCondition =
    attackScore > 0 &&
    (probability + assaultSignal + corpusStrength) > 0.65;

  const strongEvidence =
    probability > 0.75 &&
    supportSignal > 0;

  // ================================
  // ⚖️ VERDICT ENGINE (HIERARCHICAL)
  // ================================
  if (theftCondition) {
    verdict = "AGGRAVATED_THEFT";
    reasoning.push(
      "Graph theft pattern detected with high Bayesian confidence"
    );
  }

  if (assaultCondition) {
    verdict = "ASSAULT";
    reasoning.push(
      "Violent interaction pattern confirmed in evidence graph"
    );
  }

  if (strongEvidence && verdict === "UNKNOWN") {
    verdict = "CIVIL_DISPUTE_OR_MIXED_CASE";
    reasoning.push("Mixed high-confidence evidence detected");
  }

  if (probability < 0.4) {
    verdict = "INSUFFICIENT_EVIDENCE";
    reasoning.push("Bayesian threshold not satisfied");
  }

  // ================================
  // 🧠 FINAL CONFIDENCE SCORE
  // ================================
  const finalConfidence =
    Math.min(
      0.99,
      Math.max(
        0.01,
        probability * 0.6 +
        theftSignal * 0.2 +
        assaultSignal * 0.2 +
        confidenceBoost
      )
    );

  // ================================
  // 📦 OUTPUT (EXPLAINABLE LEGAL AI)
  // ================================
  return {
    verdict,
    probability: Number(probability.toFixed(3)),

    confidence: Number(finalConfidence.toFixed(3)),

    legalMatch,
    reasoning,

    meta: {
      theft_signal: theftSignal,
      assault_signal: assaultSignal,
      corpus_strength: corpusStrength,
      graph_complexity: graphComplexity,
      support_signal: supportSignal,

      version: "LEGAL_REASONING_ENGINE_V2_GOD_CORE"
    }
  };
}

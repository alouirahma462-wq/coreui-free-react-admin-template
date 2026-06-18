export function bayesianEvidenceEngine(evidence, prior = 0.5) {
  const {
    witness_score = 0.5,
    document_score = 0.5,
    contradiction_penalty = 0,
    witness_credibility = 0.5,
    evidence_age = 0,

    // 🧠 NEW (v4)
    network_links = 1,
    evidence_nodes = 1,

    // 🧠 NEW (v5)
    memory_bias = 0,
    ontology_match = 0,

    // 🧠 NEW (v6 GOD MODE)
    case_precedent_weight = 0,
    judge_feedback_signal = 0,
    legal_graph_entropy = 0
  } = evidence || {};

  // ================================
  // 🧠 SAFE NORMALIZATION
  // ================================
  const w = clamp(witness_score);
  const d = clamp(document_score);
  const c = clamp(contradiction_penalty);
  const wc = clamp(witness_credibility);
  const age = Math.max(0, evidence_age);

  // ================================
  // ⏳ TIME DECAY FACTOR
  // ================================
  const timeDecay = Math.exp(-age * 0.05);

  // ================================
  // 🧠 GRAPH INFLUENCE LAYER
  // ================================
  const graphStrength = clamp(network_links / (evidence_nodes + 1));

  // ================================
  // 📚 ONTOLOGY LAYER
  // ================================
  const ontologyBoost = clamp(ontology_match) * 0.25;

  // ================================
  // ⚖️ CASE PRECEDENT INJECTION (NEW v6)
  // ================================
  const precedentBoost = clamp(case_precedent_weight) * 0.35;

  // ================================
  // 🧠 BASE LIKELIHOOD
  // ================================
  const baseLikelihood =
    weightedLikelihood(w, d) *
    wc *
    timeDecay *
    (0.75 + 0.25 * ontologyBoost + 0.2 * precedentBoost);

  // ================================
  // 🧠 GRAPH-ENHANCED LIKELIHOOD
  // ================================
  const P_E_given_G = clamp(
    baseLikelihood * (0.65 + 0.35 * graphStrength)
  );

  // ================================
  // 🛰 CONTRADICTION PROPAGATION (v6 ADVANCED)
  // ================================
  const contradictionImpact = Math.pow(c, 2.3) * 0.5;

  const contradictionNetworkFlow =
    contradictionImpact * (1 + graphStrength + legal_graph_entropy);

  const contradictionPenalty = clamp(1 - contradictionNetworkFlow);

  // ================================
  // ⚖️ INNOCENCE MODEL
  // ================================
  const P_E_given_notG = clamp(
    (1 - P_E_given_G) * contradictionPenalty,
    0.05,
    0.95
  );

  // ================================
  // 🧠 BAYESIAN CORE
  // ================================
  const numerator = P_E_given_G * prior;
  const denominator =
    numerator + P_E_given_notG * (1 - prior) + 1e-9;

  const posterior = numerator / denominator;

  // ================================
  // 🔥 SELF-LEARNING PRIOR (v6)
  // ================================
  const adaptivePrior = clamp(
    prior * 0.5 +
    P_E_given_G * 0.2 +
    graphStrength * 0.1 +
    memory_bias * 0.1 +
    judge_feedback_signal * 0.1
  );

  // ================================
  // 🧠 UNCERTAINTY MODEL
  // ================================
  const uncertainty =
    Math.abs(0.5 - posterior) < 0.1 ? "VERY_HIGH" :
    Math.abs(0.5 - posterior) < 0.25 ? "HIGH" :
    Math.abs(0.5 - posterior) < 0.4 ? "MEDIUM" :
    "LOW";

  return {
    prior: clamp(prior),
    adaptive_prior: adaptivePrior,

    likelihood_guilty: P_E_given_G,
    likelihood_innocent: P_E_given_notG,

    posterior_guilt_probability: Number(clamp(posterior).toFixed(3)),

    // 🧠 v6 GOD NETWORK META LAYER
    meta: {
      time_decay: timeDecay,
      credibility_weight: wc,
      graph_strength: graphStrength,

      ontology_boost: ontologyBoost,
      precedent_boost: precedentBoost,

      contradiction_impact: contradictionImpact,
      contradiction_network_flow: contradictionNetworkFlow,

      legal_entropy: legal_graph_entropy,
      uncertainty_level: uncertainty
    }
  };
}

/* ================================
   ⚖️ WEIGHTED MODEL
================================ */
function weightedLikelihood(w, d) {
  const witnessWeight = 0.55;
  const documentWeight = 0.45;

  return clamp(w * witnessWeight + d * documentWeight);
}

/* ================================
   🧠 SAFETY CLAMP
================================ */
function clamp(x, min = 0, max = 1) {
  if (typeof x !== "number" || isNaN(x)) return 0.5;
  return Math.max(min, Math.min(max, x));
}

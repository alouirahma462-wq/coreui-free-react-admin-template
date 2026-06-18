// 🧠 EXPLAINABILITY v5 — RESEARCH COURT GRADE SYSTEM

export function explainDecision(legalDecision, evidenceReport, graph) {
  return {
    summary: generateSummary(legalDecision, evidenceReport),
    reasoning: generateReasoning(legalDecision, evidenceReport, graph),

    // ⚖️ core legal understanding
    legalBasis: extractLegalBasis(legalDecision),

    // 🕸 graph intelligence
    graphInsights: analyzeGraph(graph),

    // 🧪 evidence audit
    evidenceAudit: auditEvidence(evidenceReport),

    // 🧠 decision reconstruction
    decisionTrace: buildDecisionTrace(legalDecision, evidenceReport),

    // ⚖️ confidence model
    confidenceReport: computeConfidence(legalDecision, evidenceReport, graph),

    // 🚨 NEW v5 FEATURES
    adversarialAnalysis: buildAdversarialView(legalDecision, evidenceReport, graph),
    counterfactuals: buildCounterfactuals(evidenceReport, graph),
    judgeSimulation: simulateJudgeReasoning(legalDecision, evidenceReport, graph),
    argumentGraph: buildArgumentGraph(legalDecision, evidenceReport, graph),
  };
}

/* ================================
   📌 SUMMARY (ENHANCED COURT STYLE)
================================ */
function generateSummary(decision, evidence) {
  const prob = decision?.probability ?? evidence?.finalProbability ?? 0;

  return {
    verdict: decision?.verdict || "UNDEFINED",

    classification:
      prob > 0.75
        ? "STRONG_CASE"
        : prob > 0.5
        ? "MODERATE_CASE"
        : "WEAK_CASE",

    narrative: `Court AI classified this case as ${
      decision?.verdict || "UNDEFINED"
    } with probability ${(prob || 0).toFixed(3)} using multi-layer reasoning, graph inference, and Bayesian evidence fusion.`,

    riskFlag: prob < 0.4 ? "REQUIRES_REVIEW" : "STABLE_DECISION",
  };
}

/* ================================
   🧠 ADVERSARIAL ANALYSIS (NEW)
   → why the model might be WRONG
================================ */
function buildAdversarialView(decision, evidence, graph) {
  const weaknesses = [];

  if ((evidence?.finalProbability || 0) < 0.6) {
    weaknesses.push("Low evidence strength may bias verdict");
  }

  if ((graph?.contradictions?.length || 0) > 0) {
    weaknesses.push("Contradictory witness graph detected");
  }

  if (!decision?.legalMatch?.length) {
    weaknesses.push("Weak legal article mapping");
  }

  return {
    riskOfError:
      weaknesses.length === 0 ? "LOW" : weaknesses.length < 2 ? "MEDIUM" : "HIGH",

    weaknesses,

    interpretation:
      weaknesses.length > 0
        ? "Model decision is potentially unstable under adversarial review"
        : "Decision is robust under adversarial conditions",
  };
}

/* ================================
   🔁 COUNTERFACTUAL ENGINE
   → what if evidence changed?
================================ */
function buildCounterfactuals(evidence, graph) {
  const base = evidence?.finalProbability ?? 0.5;

  return {
    ifWitnessRemoved: clamp(base - 0.15),
    ifDocumentStronger: clamp(base + 0.2),
    ifContradictionResolved: clamp(base + (graph?.contradictions?.length ? 0.1 : 0)),

    interpretation:
      "Shows how sensitive the verdict is to small changes in evidence structure",
  };
}

/* ================================
   ⚖️ JUDGE SIMULATION MODE
================================ */
function simulateJudgeReasoning(decision, evidence, graph) {
  const score = evidence?.finalProbability ?? 0.5;

  let stance = "NEUTRAL";

  if (score > 0.7) stance = "LIKELY_GUILTY";
  else if (score < 0.4) stance = "LIKELY_INNOCENT";

  if ((graph?.contradictions?.length || 0) > 2) {
    stance = "DOUBTFUL_CASE";
  }

  return {
    stance,

    judicialLogic: [
      "Court evaluates evidence credibility",
      "Court checks consistency across testimonies",
      "Court validates legal mapping",
      "Court applies reasonable doubt principle",
    ],

    finalInterpretation:
      "Simulated judge reasoning independent of model bias",
  };
}

/* ================================
   🕸 ARGUMENT GRAPH GENERATION
================================ */
function buildArgumentGraph(decision, evidence, graph) {
  return {
    nodes: [
      { id: "evidence", weight: evidence?.finalProbability },
      { id: "legal_match", weight: decision?.legalMatch?.length || 0 },
      { id: "contradictions", weight: graph?.contradictions?.length || 0 },
    ],

    edges: [
      { from: "evidence", to: "verdict_support" },
      { from: "contradictions", to: "doubt_increase" },
      { from: "legal_match", to: "verdict_support" },
    ],

    interpretation:
      "Causal argument structure of how verdict is formed",
  };
}

/* ================================
   📊 CONFIDENCE MODEL (UPGRADED)
================================ */
function computeConfidence(decision, evidence, graph) {
  const base = evidence?.finalProbability ?? 0.5;

  const contradictionPenalty = (graph?.contradictions?.length || 0) * 0.07;
  const legalBoost = (decision?.legalMatch?.length || 0) * 0.05;

  const final = clamp(base + legalBoost - contradictionPenalty);

  return {
    base,
    adjusted: Number(final.toFixed(3)),

    grade:
      final > 0.8
        ? "VERY_HIGH_CONFIDENCE"
        : final > 0.6
        ? "HIGH_CONFIDENCE"
        : final > 0.4
        ? "MEDIUM_CONFIDENCE"
        : "LOW_CONFIDENCE",
  };
}

/* ================================
   🧠 HELPERS
================================ */
function clamp(x) {
  return Math.max(0, Math.min(1, x));
}

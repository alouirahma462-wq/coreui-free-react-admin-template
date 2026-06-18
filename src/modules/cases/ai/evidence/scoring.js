// Bayesian Evidence Engine (Advanced)

function bayesUpdate(prior, likelihood) {
  const p = prior * likelihood;
  const norm = p / (p + (1 - prior) * (1 - likelihood));
  return norm;
}

export function buildEvidenceScore(caseInput, graph) {
  let guiltProbability = 0.5; // prior assumption

  const evidenceScores = [];

  for (const evidence of caseInput.evidence || []) {
    let likelihood = 0.5;

    // 🔹 witness reliability
    if (evidence.type === "witness") {
      likelihood += evidence.credibility * 0.3;

      // contradiction penalty from graph
      if (graph.contradictions?.includes(evidence.id)) {
        likelihood -= 0.2;
      }
    }

    // 🔹 document strength
    if (evidence.type === "document") {
      likelihood += evidence.authenticity * 0.4;
    }

    // 🔹 physical evidence
    if (evidence.type === "physical") {
      likelihood += 0.5;
    }

    likelihood = Math.min(0.99, Math.max(0.01, likelihood));

    guiltProbability = bayesUpdate(guiltProbability, likelihood);

    evidenceScores.push({
      id: evidence.id,
      likelihood,
      updatedProbability: guiltProbability,
    });
  }

  return {
    finalProbability: guiltProbability,
    breakdown: evidenceScores,
  };
}

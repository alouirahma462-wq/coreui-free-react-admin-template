export function bayesianEvidenceEngine(evidence, prior = 0.5) {
  const {
    witness_score = 0.5,
    document_score = 0.5,
    contradiction_penalty = 0
  } = evidence;

  // likelihoods (simplified Bayesian model)
  const P_E_given_G = (witness_score + document_score) / 2;

  const P_E_given_notG = Math.max(
    0.1,
    1 - P_E_given_G + contradiction_penalty * 0.1
  );

  const numerator = P_E_given_G * prior;
  const denominator =
    numerator + (P_E_given_notG * (1 - prior));

  const posterior = numerator / (denominator || 1);

  return {
    prior,
    likelihood_guilty: P_E_given_G,
    likelihood_innocent: P_E_given_notG,
    posterior_guilt_probability: Number(posterior.toFixed(3))
  };
}

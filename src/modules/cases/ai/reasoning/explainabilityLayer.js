export function explainLegalDecision({
  caseModel,
  evidence,
  bayesianResult,
  legalAnalysis,
  judgment,
  graph
}) {
  return {
    explanation: `
The system analyzed the case using structured legal intelligence.

1. Case Understanding:
- Actors identified: ${caseModel.actors?.length || 0}
- Events extracted: ${caseModel.events?.length || 0}

2. Evidence Evaluation:
- Witness reliability: ${evidence.witness_score}
- Document integrity: ${evidence.document_score}
- Contradictions: ${evidence.contradiction_penalty}

3. Bayesian Probability:
- Prior belief: ${bayesianResult.prior}
- Posterior guilt probability: ${bayesianResult.posterior_guilt_probability}

4. Legal Reasoning:
- Matched statutes from Tunisian law database
- Applied rule-based inference system

5. Graph Analysis:
- Nodes: ${graph.nodes.length}
- Edges: ${graph.edges.length}

FINAL DECISION:
${judgment.verdict || "undetermined"}
`,
    confidence: bayesianResult.posterior_guilt_probability
  };
}

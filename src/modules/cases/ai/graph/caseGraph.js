export function buildCaseGraph(caseInput) {
  const nodes = [];
  const edges = [];
  const contradictions = [];

  // ================================
  // 🧠 NODE INDEX (FAST LOOKUP)
  // ================================
  const nodeIndex = new Map();

  function addNode(node) {
    nodes.push(node);
    nodeIndex.set(node.id, node);
  }

  function addEdge(edge) {
    edges.push(edge);
  }

  // ================================
  // 👤 ACTORS (ENHANCED)
  // ================================
  for (const actor of caseInput.actors || []) {
    addNode({
      id: actor.id,
      type: "actor",
      credibility: actor.credibility || 0.5,
      prior_bias: actor.bias || 0,
    });
  }

  // ================================
  // 📅 EVENTS (TEMPORAL + WEIGHTED)
  // ================================
  for (const event of caseInput.events || []) {
    addNode({
      id: event.id,
      type: "event",
      timestamp: event.time || 0,
      importance: event.importance || 0.5,
    });

    addEdge({
      from: event.actor,
      to: event.id,
      relation: "performed",
      weight: 0.7 + (event.importance || 0.2),
    });
  }

  // ================================
  // 🧪 EVIDENCE LAYER (ENHANCED)
  // ================================
  for (const evidence of caseInput.evidence || []) {
    addNode({
      id: evidence.id,
      type: "evidence",
      reliability:
        (evidence.credibility || 0.5) +
        (evidence.authenticity || 0.5) / 2,
      age: evidence.age || 0,
    });

    if (evidence.relatedTo) {
      addEdge({
        from: evidence.id,
        to: evidence.relatedTo,
        relation: "supports",
        weight: evidence.credibility || 0.5,
      });
    }
  }

  // ================================
  // ⚖️ LAW NODES
  // ================================
  for (const law of caseInput.laws || []) {
    addNode({
      id: law.id,
      type: "law",
      strength: law.strength || 0.5,
    });
  }

  // ================================
  // 🔥 CONTRADICTION ENGINE (v4 UPGRADED)
  // ================================
  const witnesses = caseInput.witnesses || [];

  for (let i = 0; i < witnesses.length; i++) {
    for (let j = i + 1; j < witnesses.length; j++) {
      const w1 = witnesses[i];
      const w2 = witnesses[j];

      const sameTarget = w1.target === w2.target;
      const conflict = w1.statement !== w2.statement;

      if (sameTarget && conflict) {
        const severity =
          Math.abs((w1.confidence || 0.5) - (w2.confidence || 0.5));

        contradictions.push({
          pair: `${w1.id}-${w2.id}`,
          type: "witness_conflict",
          severity: Number(severity.toFixed(3)),
        });

        addEdge({
          from: w1.id,
          to: w2.id,
          relation: "contradicts",
          weight: severity,
        });
      }
    }
  }

  // ================================
  // 🧠 GRAPH NEURAL PROPAGATION (NEW)
  // ================================
  const influenceMap = new Map();

  for (const node of nodes) {
    let influence = 0.5;

    if (node.type === "evidence") influence = node.reliability || 0.5;
    if (node.type === "actor") influence = node.credibility || 0.5;
    if (node.type === "event") influence = node.importance || 0.5;
    if (node.type === "law") influence = node.strength || 0.5;

    // propagation from connected edges
    for (const edge of edges) {
      if (edge.to === node.id) {
        influence += (edge.weight || 0) * 0.1;
      }
    }

    influenceMap.set(node.id, Math.min(1, influence));
  }

  // ================================
  // ⚖️ REASONING PATH EXTRACTION (NEW)
  // ================================
  const reasoningPaths = [];

  for (const edge of edges) {
    if (edge.relation === "supports") {
      const from = nodeIndex.get(edge.from);
      const to = nodeIndex.get(edge.to);

      if (from && to) {
        reasoningPaths.push({
          path: `${from.id} → ${to.id}`,
          strength: edge.weight || 0.5,
        });
      }
    }
  }

  // ================================
  // 🛰 CONTRADICTION DIFFUSION (NEW)
  // ================================
  const contradictionPressure =
    contradictions.length > 0
      ? contradictions.reduce((acc, c) => acc + c.severity, 0) /
        contradictions.length
      : 0;

  // ================================
  // 🧠 FINAL NORMALIZATION LAYER
  // ================================
  const normalizedNodes = nodes.map((n) => ({
    ...n,
    influence: influenceMap.get(n.id) || 0.5,
  }));

  return {
    nodes: normalizedNodes,
    edges,
    contradictions,

    // 🧠 NEW OUTPUTS (GOD MODE)
    reasoningPaths,
    contradictionPressure,

    meta: {
      node_count: nodes.length,
      edge_count: edges.length,
      contradiction_count: contradictions.length,
      model: "CASE_GRAPH_GOD_V4",
    },
  };
}

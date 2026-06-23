import { embedText } from "../embeddings.js";
import { lawDB } from "../storage/vectorStore.js";

/**
 * 🧠 LEGAL RETRIEVAL ENGINE (GOD CORE v4)
 * - Graph Propagation
 * - Temporal Memory
 * - Legal Precedent Awareness
 * - Multi-signal Ranking Fusion
 */

export const retrieveArticles = async (
  query,
  k = 5,
  context = { graph: null, memory: [], timeline: [] }
) => {
  if (!query || typeof query !== "string") {
    return [];
  }

  // ================================
  // 🧠 EMBEDDING LAYER
  // ================================
  const vector = await embedText(query);
  if (!vector) return [];

  // ================================
  // 🔎 VECTOR SEARCH
  // ================================
  const results = lawDB?.instance?.search?.(vector, k) || [];

  const graph = context?.graph;
  const memory = context?.memory || [];
  const timeline = context?.timeline || [];

  const memoryBoost = new Map();
  const timeDecayMap = new Map();

  // ================================
  // 🧠 MEMORY + PRECEDENT BOOST
  // ================================
  for (const m of memory) {
    const key = m.articleId || m.id;
    memoryBoost.set(key, (memoryBoost.get(key) || 0) + (m.weight || 0.05));
  }

  // ================================
  // ⏱ TEMPORAL DECAY (NEW)
  // ================================
  for (const t of timeline) {
    const key = t.id;
    const age = t.age || 0;
    timeDecayMap.set(key, Math.exp(-age * 0.03));
  }

  const contradictionSet = new Set(graph?.contradictions || []);

  // ================================
  // 🧠 GRAPH PROPAGATION BOOST (NEW)
  // ================================
  const graphBoost = new Map();

  if (graph?.edges?.length) {
    for (const edge of graph.edges) {
      if (edge.relation === "supports") {
        graphBoost.set(
          edge.to,
          (graphBoost.get(edge.to) || 0) + 0.1
        );
      }

      if (edge.relation === "contradicts") {
        graphBoost.set(
          edge.to,
          (graphBoost.get(edge.to) || 0) - 0.15
        );
      }
    }
  }

  // ================================
  // ⚖️ HYBRID SCORING ENGINE (GOD CORE)
  // ================================
  const enriched = results.map((r, idx) => {
    const text = r.text || r.metadata?.text || "";
    const id = r.id || r.metadata?.id;

    // 🧠 semantic strength
    const semanticScore = Math.min(1, text.length / 2000);

    // ⚖️ legal relevance
    const legalBoost =
      /قانون|محكمة|جريمة|عقوبة|court|law|crime|penalty/i.test(text)
        ? 0.3
        : 0;

    // 🧬 structure awareness
    const structureBoost =
      /الفصل|المادة|Article|Section/i.test(text)
        ? 0.25
        : 0;

    // 🧠 memory reinforcement
    const memBoost = memoryBoost.get(id) || 0;

    // 🛰 graph propagation
    const gBoost = graphBoost.get(id) || 0;

    // ⏱ temporal stability
    const tDecay = timeDecayMap.get(id) || 1;

    // ⚖️ contradiction penalty
    const contradictionPenalty = contradictionSet.has(id)
      ? -0.25
      : 0;

    // ================================
    // 🧠 FINAL FUSION SCORE (CORE)
    // ================================
    const weight =
      (r.weight || 1) *
      (semanticScore +
        legalBoost +
        structureBoost +
        memBoost +
        gBoost +
        contradictionPenalty) *
      tDecay;

    return {
      ...r,

      weight: Number(weight.toFixed(4)),
      rank: idx + 1,

      meta: {
        semanticScore,
        legalBoost,
        structureBoost,
        memoryBoost: memBoost,
        graphBoost: gBoost,
        timeDecay: tDecay,
        contradictionPenalty,
        graph_aware: !!graph,
        memory_aware: !!memory.length,
        temporal_aware: !!timeline.length,
        retrieval_ready: true
      }
    };
  });

  // ================================
  // 🔥 FINAL SORTING
  // ================================
  return enriched.sort((a, b) => b.weight - a.weight);
};

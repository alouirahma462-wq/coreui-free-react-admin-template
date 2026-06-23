import { embedText } from "../storage/embeddings.js";
import { lawDB } from "../storage/vectorStore.js";

/**
 * 🧠 WEIGHTED LEGAL RETRIEVER (GOD CORE v4)
 * - Query Expansion (Legal NLP)
 * - Graph-aware boosting
 * - Precedent clustering
 * - Contradiction filtering
 * - Hybrid scoring fusion
 */

export const weightedSearch = async (query, k = 5, context = {}) => {
  if (!query || typeof query !== "string") return [];

  // ================================
  // 🧠 LEGAL QUERY EXPANSION ENGINE
  // ================================
  const expandQuery = (q) => {
    const map = {
      theft: "سرقة theft vol volé",
      assault: "عنف assault violence ضرب",
      fraud: "تزوير fraud falsification",
      court: "محكمة court tribunal",
      law: "قانون law legislation"
    };

    let expanded = q;

    for (const key in map) {
      if (q.toLowerCase().includes(key)) {
        expanded += " " + map[key];
      }
    }

    return expanded;
  };

  const expandedQuery = expandQuery(query);

  // ================================
  // 🧠 EMBEDDING LAYER
  // ================================
  const queryVector = await embedText(expandedQuery);
  if (!queryVector) return [];

  // ================================
  // 🔎 VECTOR SEARCH (OVERFETCH)
  // ================================
  const results = lawDB?.instance?.search?.(queryVector, 30) || [];

  const graph = context?.graph;
  const contradictions = new Set(graph?.contradictions || []);
  const precedents = context?.precedents || [];

  // ================================
  // 🧠 PRECEDENT BOOST MAP
  // ================================
  const precedentMap = new Map();

  for (const p of precedents) {
    const key = p.id || p.article;
    precedentMap.set(key, (precedentMap.get(key) || 0) + (p.weight || 0.1));
  }

  // ================================
  // 🛰 GRAPH EDGE BOOST MAP
  // ================================
  const graphBoost = new Map();

  if (graph?.edges) {
    for (const e of graph.edges) {
      if (e.relation === "supports") {
        graphBoost.set(e.to, (graphBoost.get(e.to) || 0) + 0.15);
      }

      if (e.relation === "contradicts") {
        graphBoost.set(e.to, (graphBoost.get(e.to) || 0) - 0.2);
      }
    }
  }

  // ================================
  // ⚖️ SCORING ENGINE (GOD CORE FUSION)
  // ================================
  const scored = results.map((r, idx) => {
    const text = r.text || r.article || "";
    const id = r.id || r.article;

    let score = r._score || 0;

    // 🧠 semantic strength
    const semanticBoost = Math.min(1, text.length / 1800) * 0.15;

    // ⚖️ legal structure boost
    const legalBoost =
      /الفصل|المادة|Article|Section|قانون|محكمة/i.test(text)
        ? 0.25
        : 0;

    // 📄 page/context boost
    const pageBoost = r.page ? 0.1 : 0;

    // 🧠 precedent boost (learning from past cases)
    const precedentBoost = precedentMap.get(id) || 0;

    // 🛰 graph propagation boost
    const gBoost = graphBoost.get(id) || 0;

    // ❌ contradiction penalty
    const contradictionPenalty = contradictions.has(id) ? -0.25 : 0;

    // 📊 positional ranking stability
    const rankBoost = Math.max(0, (30 - idx) / 250);

    // ================================
    // 🧠 FINAL FUSION SCORE
    // ================================
    const final_score =
      score +
      semanticBoost +
      legalBoost +
      pageBoost +
      precedentBoost +
      gBoost +
      contradictionPenalty +
      rankBoost;

    return {
      ...r,

      final_score: Number(final_score.toFixed(4)),

      meta: {
        semanticBoost,
        legalBoost,
        pageBoost,
        precedentBoost,
        graphBoost: gBoost,
        contradictionPenalty,
        rankBoost,
        retrieval_ready: true,
        god_core: "v4"
      }
    };
  });

  // ================================
  // 🔥 FINAL RANKING
  // ================================
  return scored
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, k);
};

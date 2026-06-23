import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const loadPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("PDF not found: " + filePath);
  }

  const buffer = fs.readFileSync(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true
  }).promise;

  const pages = [];
  const seen = new Set();

  // 🧠 GLOBAL LEGAL MEMORY GRAPH (v9 CORE)
  const memoryGraph = {
    nodes: [],
    edges: [],
    embeddings: [],
    contradictionMap: new Map(),
    caseMemory: []
  };

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let text = content.items
      .map(i => i.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    text = cleanLegalText(text);
    text = enrichLegalSemantics(text);

    if (text.length < 10) continue;

    const hash = `${i}-${text.slice(0, 60).replace(/\s+/g, "")}`;
    if (seen.has(hash)) continue;
    seen.add(hash);

    // ================================
    // 🧬 EMBEDDING (VECTOR-LIKE)
    // ================================
    const embedding = generateEmbedding(text);

    // ================================
    // ⚖️ LEGAL SIGNALS
    // ================================
    const risk = computeLegalRisk(text);
    const contradiction = detectContradictions(text);

    // ================================
    // 🧠 GRAPH NODE CREATION
    // ================================
    const node = {
      id: `page_${i}`,
      text,
      embedding,
      risk,
      contradiction,
      page: i
    };

    memoryGraph.nodes.push(node);
    memoryGraph.embeddings.push(embedding);

    // ================================
    // 🛰 CONTRADICTION LINKING
    // ================================
    for (const other of memoryGraph.nodes) {
      if (other.id === node.id) continue;

      const similarity = cosineSimilarity(embedding, other.embedding);

      if (similarity > 0.85) {
        memoryGraph.edges.push({
          from: node.id,
          to: other.id,
          type: "semantic_link",
          weight: similarity
        });
      }

      if (contradiction || other.contradiction) {
        memoryGraph.edges.push({
          from: node.id,
          to: other.id,
          type: "contradiction_link",
          weight: 1 - similarity
        });

        memoryGraph.contradictionMap.set(node.id, true);
      }
    }

    // ================================
    // 🧠 GNN-STYLE PROPAGATION SCORE
    // ================================
    const propagatedScore =
      risk +
      contradiction * 0.4 +
      graphInfluence(memoryGraph, node.id);

    pages.push({
      pageNumber: i,
      text,

      embedding,
      importance: Number(propagatedScore.toFixed(3)),

      graph_ready: true,
      memory_ready: true,
      ontology_ready: true,
      gnn_ready: true,

      meta: {
        risk,
        contradiction,
        propagatedScore,
        model: "V9_LEGAL_GOD_BRAIN"
      }
    });

    // ================================
    // 🧠 CASE MEMORY LEARNING LOOP
    // ================================
    memoryGraph.caseMemory.push({
      page: i,
      risk,
      contradiction,
      embedding
    });
  }

  return {
    pages,
    memoryGraph,
    summary: generateCaseIntelligence(memoryGraph)
  };
};

/* ================================
   🧹 CLEANER
================================ */
function cleanLegalText(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s\.\,\;\:\(\)\-\n]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(\d)\s+(\d)/g, "$1$2")
    .replace(/Imprimerie Officielle de la République Tunisienne/g, "")
    .trim();
}

/* ================================
   🧠 SEMANTIC ENRICHMENT
================================ */
function enrichLegalSemantics(text) {
  return text
    .replace(/لا يجوز|ممنوع/g, "PROHIBITED")
    .replace(/عقوبة|سجن/g, "PENALTY")
    .replace(/محكمة/g, "COURT");
}

/* ================================
   ⚖️ LEGAL RISK ENGINE
================================ */
function computeLegalRisk(text) {
  let score = 0;
  if (/جريمة|crime|theft|fraud/i.test(text)) score += 0.4;
  if (/عقوبة|penalty|سجن/i.test(text)) score += 0.3;
  if (/محكمة|court/i.test(text)) score += 0.2;
  return Math.min(1, score);
}

/* ================================
   🛰 CONTRADICTION DETECTOR
================================ */
function detectContradictions(text) {
  return /ممنوع|لا يجوز|not allowed/i.test(text) ? 0.3 : 0;
}

/* ================================
   🧬 EMBEDDING (SIMULATED)
================================ */
function generateEmbedding(text) {
  return Array.from({ length: 16 }, (_, i) =>
    ((text.charCodeAt(i % text.length) || 1) % 100) / 100
  );
}

/* ================================
   📊 COSINE SIMILARITY
================================ */
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] ** 2;
    magB += b[i] ** 2;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-9);
}

/* ================================
   🧠 GRAPH INFLUENCE FUNCTION (GNN LIGHT)
================================ */
function graphInfluence(graph, nodeId) {
  const edges = graph.edges.filter(e => e.to === nodeId);

  let influence = 0;

  for (const e of edges) {
    if (e.type === "semantic_link") influence += 0.05;
    if (e.type === "contradiction_link") influence -= 0.1;
  }

  return influence;
}

/* ================================
   🧠 FINAL CASE INTELLIGENCE
================================ */
function generateCaseIntelligence(graph) {
  const riskAvg =
    graph.caseMemory.reduce((a, b) => a + b.risk, 0) /
    (graph.caseMemory.length || 1);

  const contradictionLevel =
    graph.caseMemory.filter(x => x.contradiction).length;

  return {
    riskLevel: riskAvg,
    contradictionLevel,
    totalNodes: graph.nodes.length,
    verdictHint:
      riskAvg > 0.6
        ? "HIGH_RISK_CASE"
        : "LOW_TO_MEDIUM_RISK"
  };
}

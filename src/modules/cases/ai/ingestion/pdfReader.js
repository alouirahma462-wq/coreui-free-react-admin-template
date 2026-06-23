import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

//
// 🧠 LEGAL STREAM BRAIN v17
// REAL-TIME PDF → THINKING SYSTEM
//

export const streamLegalPDF = async (filePath, onChunk = () => {}) => {

  const graph = {
    nodes: [],
    edges: [],
    contradictions: []
  };

  try {

    if (!fs.existsSync(filePath)) {
      throw new Error("PDF not found");
    }

    const buffer = fs.readFileSync(filePath);

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true
    }).promise;

    // ================================
    // 🧠 STREAM PROCESSING LOOP
    // ================================
    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      let text = content.items
        .map(x => x.str || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      text = clean(text);

      if (text.length < 10) continue;

      // ================================
      // 🧠 LIVE NODE CREATION
      // ================================
      const node = {
        id: `page-${i}`,
        text,

        importance: score(text),
        embedding: embed(text)
      };

      graph.nodes.push(node);

      // ================================
      // 🧠 LIVE EDGE BUILDING
      // ================================
      if (graph.nodes.length > 1) {
        const prev = graph.nodes[graph.nodes.length - 2];

        graph.edges.push({
          from: prev.id,
          to: node.id,
          type: "flow"
        });
      }

      // ================================
      // 🛰 CONTRADICTION DETECTION LIVE
      // ================================
      for (const n of graph.nodes) {

        if (n.id === node.id) continue;

        const diff =
          Math.abs(n.importance - node.importance);

        if (diff > 0.35) {
          graph.contradictions.push({
            from: n.id,
            to: node.id,
            severity: diff
          });
        }
      }

      // ================================
      // 📚 LIVE LEGAL CLASSIFICATION
      // ================================
      const classification = classify(text);

      node.type = classification.type;
      node.risk = classification.risk;

      // ================================
      // ⚡ STREAM OUTPUT (REAL-TIME)
      // ================================
      onChunk({
        page: i,
        node,
        graphSnapshot: {
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          contradictions: graph.contradictions.length
        }
      });
    }

    return graph;

  } catch (err) {
    console.error("❌ STREAM ENGINE ERROR:", err.message);

    return graph; // always return partial graph
  }
};

//
// 🧹 CLEANER
//
function clean(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//
// 🧠 SCORING ENGINE
//
function score(text) {
  return Math.min(
    1,
    text.length / 1800 +
    (/قانون|محكمة|جريمة|crime|law/i.test(text) ? 0.3 : 0)
  );
}

//
// 🧬 EMBEDDING SIMULATION
//
function embed(text) {
  return text
    .slice(0, 100)
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000 / 1000;
}

//
// ⚖️ CLASSIFIER
//
function classify(text) {
  if (/جريمة|crime|عقوبة|penalty/i.test(text)) {
    return { type: "criminal", risk: 0.9 };
  }

  if (/محكمة|court/i.test(text)) {
    return { type: "procedural", risk: 0.6 };
  }

  return { type: "general", risk: 0.3 };
}

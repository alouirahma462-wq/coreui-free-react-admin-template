import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

//
// 🧠 LEGAL STREAM BRAIN + AI ENGINE
//

export const streamLegalPDF = async (filePath, onChunk = () => {}) => {

  const graph = {
    nodes: [],
    edges: [],
    contradictions: [],
    judgments: []
  };

  if (!fs.existsSync(filePath)) {
    throw new Error("PDF not found");
  }

  const buffer = fs.readFileSync(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true
  }).promise;

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

    // =========================
    // 🧠 AI BRAIN (NEW)
    // =========================
    const brain = analyze(text);
    const facts = extractFacts(text);
    const judgment = judge(brain, facts);

    const node = {
      id: `page-${i}`,
      text,

      // PDF engine
      importance: score(text),
      embedding: embed(text),

      // 🧠 AI ENGINE
      type: brain.type,
      risk: brain.risk,
      facts,
      judgment
    };

    graph.nodes.push(node);

    // =========================
    // 🔗 GRAPH LINKS
    // =========================
    if (graph.nodes.length > 1) {
      const prev = graph.nodes[graph.nodes.length - 2];

      graph.edges.push({
        from: prev.id,
        to: node.id,
        type: "flow"
      });
    }

    // =========================
    // ⚠️ CONTRADICTIONS
    // =========================
    for (const n of graph.nodes) {
      if (n.id === node.id) continue;

      const diff = Math.abs(n.importance - node.importance);

      if (diff > 0.35) {
        graph.contradictions.push({
          from: n.id,
          to: node.id,
          severity: diff
        });
      }
    }

    // =========================
    // ⚡ STREAM OUTPUT
    // =========================
    onChunk({
      page: i,
      node,
      snapshot: {
        nodes: graph.nodes.length,
        edges: graph.edges.length,
        contradictions: graph.contradictions.length
      }
    });
  }

  return graph;
};

//
// 🧹 CLEAN TEXT
//
function clean(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//
// 🧠 SCORING ENGINE (PDF logic)
//
function score(text) {
  return Math.min(
    1,
    text.length / 1800 +
    (/قانون|محكمة|جريمة|عقد|court|law/i.test(text) ? 0.4 : 0)
  );
}

//
// 🧬 EMBEDDING (light)
//
function embed(text) {
  return text
    .slice(0, 120)
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000 / 1000;
}

//
// 🧠 FACT EXTRACTION (NEW AI LAYER)
//
function extractFacts(text) {
  return text
    .split(/[\.،\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 8);
}

//
// ⚖️ AI ENGINE (THE BRAIN)
//
function analyze(text) {

  if (/جريمة|سجن|عقوبة|crime|penalty/i.test(text)) {
    return { type: "criminal", risk: 0.9 };
  }

  if (/عقد|التزام|ملكية|contract/i.test(text)) {
    return { type: "civil", risk: 0.6 };
  }

  if (/محكمة|قاضي|court/i.test(text)) {
    return { type: "procedural", risk: 0.5 };
  }

  return { type: "general", risk: 0.3 };
}

//
// ⚖️ JUDGMENT ENGINE (AI OUTPUT)
//
function judge(brain, facts) {

  const strength =
    facts.length > 8 ? "قوية 🟢" :
    facts.length > 4 ? "متوسطة 🟡" :
    "ضعيفة 🔴";

  return {
    caseType: brain.type,
    risk: brain.risk,
    strength,

    prediction:
      brain.type === "criminal"
        ? "إدانة محتملة"
        : brain.type === "civil"
        ? "تعويض أو رفض"
        : "تحليل إضافي مطلوب"
  };
}

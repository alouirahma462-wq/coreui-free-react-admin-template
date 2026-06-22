import fs from "fs";

/**
 * CASE UNDERSTANDING ENGINE - TUNISIAN LEGAL VERSION (GOD MODE v3)
 */

export async function extractCaseFromFolder(caseFolderPath, memory = []) {
  const files = loadCaseFiles(caseFolderPath);

  const rawText = mergeFiles(files);

  const structured = buildStructuredCase(rawText, memory);

  const legalContext = inferTunisianLaw(structured);

  return {
    ...structured,
    legal_context: legalContext,

    // 🧠 GRAPH + MEMORY LAYER
    meta: {
      graph_ready: true,
      memory_ready: true,
      rag_ready: true,
      embedding_seed: generateSeed(rawText),
      cross_case_learning: memory.length > 0
    }
  };
}

// ----------------------------
// 📥 LOAD FILES
// ----------------------------
function loadCaseFiles(path) {
  return {
    scene: fs.readFileSync(`${path}/scene.txt`, "utf-8"),
    victim: fs.readFileSync(`${path}/victim.txt`, "utf-8"),
    suspect: fs.readFileSync(`${path}/suspect.txt`, "utf-8"),
    witness: fs.readFileSync(`${path}/witness.txt`, "utf-8")
  };
}

// ----------------------------
// 🔗 MERGE TEXTS
// ----------------------------
function mergeFiles(files) {
  return `
SCENE: ${files.scene}
VICTIM: ${files.victim}
SUSPECT: ${files.suspect}
WITNESS: ${files.witness}
  `;
}

// ----------------------------
// 🧠 STRUCTURED CASE BUILDER (GOD CORE + MEMORY)
// ----------------------------
function buildStructuredCase(text, memory = []) {
  const base = {
    facts: extractFacts(text),
    actors: extractActors(text),
    events: extractEvents(text),
    timeline: extractTimeline(text),
    location: extractLocation(text),
    crime_type: detectCrimeType(text),

    sentiment_risk: detectRiskLevel(text),
    contradiction_signals: detectContradictions(text),
    semantic_strength: Math.min(1, text.length / 2000)
  };

  // 🧠 CROSS-CASE LEARNING LAYER (NEW)
  const memoryBoost = memory.length
    ? memory.reduce((acc, m) => acc + (m.weight || 0.1), 0) / memory.length
    : 0;

  return {
    ...base,

    // 🧠 MEMORY ENHANCEMENT
    memory_influence: memoryBoost,

    // 🧠 REINFORCEMENT SIGNAL
    reinforcement_score:
      base.semantic_strength + memoryBoost * 0.3
  };
}

// ----------------------------
// 📌 FACT EXTRACTION (ENHANCED)
// ----------------------------
function extractFacts(text) {
  const facts = [];

  const rules = [
    { key: "theft_event", match: /سرق|volé|stolen/i },
    { key: "violence_event", match: /ضرب|violence|assault/i },
    { key: "illegal_entry", match: /دخل|entered|intrusion/i },
    { key: "fraud_event", match: /تزوير|fraud|forgery/i }
  ];

  for (const r of rules) {
    if (r.match.test(text)) {
      facts.push({
        type: r.key,
        confidence: 0.8
      });
    }
  }

  return facts;
}

// ----------------------------
// 👥 ACTORS EXTRACTION
// ----------------------------
function extractActors(text) {
  const actors = [];

  const map = [
    { role: "victim", regex: /victim|ضحية/i },
    { role: "suspect", regex: /suspect|مشتبه/i },
    { role: "witness", regex: /witness|شاهد/i }
  ];

  for (const m of map) {
    if (m.regex.test(text)) {
      actors.push({
        role: m.role,
        credibility: 0.7
      });
    }
  }

  return actors;
}

// ----------------------------
// ⏱ EVENTS EXTRACTION (GRAPH READY)
// ----------------------------
function extractEvents(text) {
  return text
    .split("\n")
    .filter(line => /قام|did|happened|occurred/i.test(line))
    .map(line => ({
      type: "action",
      text: line,
      importance: line.length / 500,

      // 🧠 GRAPH SIGNAL
      node_strength: Math.tanh(line.length / 200)
    }));
}

// ----------------------------
// ⏱ TIMELINE
// ----------------------------
function extractTimeline(text) {
  const matches = [...text.matchAll(/(\d{1,2}:\d{2})/g)];

  return matches.map(m => ({
    time: m[1],
    weight: 0.5
  }));
}

// ----------------------------
// 📍 LOCATION
// ----------------------------
function extractLocation(text) {
  const locations = [
    { name: "Tunis", match: /تونس|Tunis/i },
    { name: "Sfax", match: /صفاقس|Sfax/i }
  ];

  for (const l of locations) {
    if (l.match.test(text)) return l.name;
  }

  return "unknown";
}

// ----------------------------
// ⚖️ CRIME TYPE
// ----------------------------
function detectCrimeType(text) {
  if (/سرقة|vol|theft/i.test(text)) return "theft";
  if (/عنف|violence|assault/i.test(text)) return "assault";
  if (/تزوير|fraud|forgery/i.test(text)) return "fraud";
  return "unknown";
}

// ----------------------------
// 🧠 RISK
// ----------------------------
function detectRiskLevel(text) {
  if (/قتل|murder|death/i.test(text)) return "HIGH";
  if (/سرقة|theft|violence/i.test(text)) return "MEDIUM";
  return "LOW";
}

// ----------------------------
// 🛰 CONTRADICTION ENGINE (GOD SIGNAL)
// ----------------------------
function detectContradictions(text) {
  return (text.match(/لكن|however|contradiction|غير ذلك/gi) || []).length;
}

// ----------------------------
// ⚖️ TUNISIAN LAW INFERENCE
// ----------------------------
function inferTunisianLaw(structured) {
  const articles = [];

  const map = {
    theft: "Article 258 - vol",
    assault: "Article 218 - violence volontaire",
    fraud: "Article 286 - falsification / fraude"
  };

  if (map[structured.crime_type]) {
    articles.push({
      article: map[structured.crime_type],
      confidence: 0.9
    });
  }

  return {
    possible_articles: articles,
    preliminary_qualification:
      articles.length ? "qualified_case" : "needs_review"
  };
}

// ----------------------------
// 🧬 EMBEDDING SEED (VECTOR READY)
// ----------------------------
function generateSeed(text) {
  return (
    text
      .slice(0, 120)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0) % 10000
  ) / 10000;
}

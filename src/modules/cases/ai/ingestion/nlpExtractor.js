import fs from "fs";

/**
 * CASE UNDERSTANDING ENGINE - TUNISIAN LEGAL VERSION
 * يحول ملفات القضية إلى JSON قانوني قابل للتحليل
 */

// ----------------------------
// 🧠 MAIN FUNCTION
// ----------------------------
export async function extractCaseFromFolder(caseFolderPath) {
  const files = loadCaseFiles(caseFolderPath);

  const rawText = mergeFiles(files);

  const structured = buildStructuredCase(rawText);

  const legalContext = inferTunisianLaw(structured);

  return {
    ...structured,
    legal_context: legalContext
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
// 🧠 NLP STRUCTURING ENGINE (ADVANCED RULE-BASED)
// ----------------------------
function buildStructuredCase(text) {
  return {
    facts: extractFacts(text),
    actors: extractActors(text),
    events: extractEvents(text),
    timeline: extractTimeline(text),
    location: extractLocation(text),
    crime_type: detectCrimeType(text)
  };
}

// ----------------------------
// 📌 FACT EXTRACTION
// ----------------------------
function extractFacts(text) {
  const facts = [];

  if (text.includes("سرق") || text.includes("volé")) {
    facts.push("theft_event");
  }

  if (text.includes("ضرب") || text.includes("violence")) {
    facts.push("violence_event");
  }

  if (text.includes("دخل") || text.includes("entered")) {
    facts.push("illegal_entry");
  }

  return facts;
}

// ----------------------------
// 👥 ACTORS EXTRACTION
// ----------------------------
function extractActors(text) {
  const actors = [];

  if (text.includes("victim") || text.includes("ضحية")) {
    actors.push({ role: "victim" });
  }

  if (text.includes("suspect") || text.includes("مشتبه")) {
    actors.push({ role: "suspect" });
  }

  if (text.includes("witness") || text.includes("شاهد")) {
    actors.push({ role: "witness" });
  }

  return actors;
}

// ----------------------------
// ⏱ EVENTS EXTRACTION
// ----------------------------
function extractEvents(text) {
  const events = [];

  const lines = text.split("\n");

  lines.forEach((line) => {
    if (line.includes("قام") || line.includes("did")) {
      events.push({
        type: "action",
        text: line
      });
    }
  });

  return events;
}

// ----------------------------
// ⏱ TIMELINE (BASIC ORDERING)
// ----------------------------
function extractTimeline(text) {
  const timeline = [];

  const timeRegex = /(\d{1,2}:\d{2})/g;
  let match;

  while ((match = timeRegex.exec(text)) !== null) {
    timeline.push({
      time: match[1],
      context: "event"
    });
  }

  return timeline;
}

// ----------------------------
// 📍 LOCATION EXTRACTION
// ----------------------------
function extractLocation(text) {
  if (text.includes("تونس") || text.includes("Tunis")) return "Tunis";
  if (text.includes("صفاقس") || text.includes("Sfax")) return "Sfax";
  return "unknown";
}

// ----------------------------
// ⚖️ CRIME TYPE DETECTION (TUNISIAN LAW BASE)
// ----------------------------
function detectCrimeType(text) {
  if (text.includes("سرقة") || text.includes("vol")) {
    return "theft";
  }

  if (text.includes("عنف") || text.includes("violence")) {
    return "assault";
  }

  if (text.includes("تزوير") || text.includes("forgery")) {
    return "fraud";
  }

  return "unknown";
}

// ----------------------------
// ⚖️ TUNISIAN LEGAL INFERENCE ENGINE (VERY IMPORTANT)
// ----------------------------
function inferTunisianLaw(structured) {
  const articles = [];

  // 🇹🇳 Code pénal Tunisien (simplified mapping)
  if (structured.crime_type === "theft") {
    articles.push("Article 258 - vol");
  }

  if (structured.crime_type === "assault") {
    articles.push("Article 218 - violence volontaire");
  }

  if (structured.crime_type === "fraud") {
    articles.push("Article 286 - falsification / fraude");
  }

  return {
    possible_articles: articles,
    preliminary_qualification: articles.length > 0
      ? "qualified_case"
      : "needs_review"
  };
}

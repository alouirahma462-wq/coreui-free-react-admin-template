import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: EVIDENCE INGESTION ENGINE
 * =========================
 * - PDF reading
 * - text cleaning
 * - page chunking
 * - basic legal signals extraction
 */

export const loadEvidencePDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("PDF not found: " + filePath);
  }

  const buffer = fs.readFileSync(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true
  }).promise;

  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let text = content.items.map(t => t.str).join(" ");

    text = clean(text);

    if (text.length < 20) continue;

    pages.push(buildEvidencePage(text, i));
  }

  return pages;
};

/**
 * =========================
 * 🧹 CLEANING (Layer 1 only)
 * =========================
 */
function clean(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * 📦 BUILD EVIDENCE OBJECT
 * =========================
 */
function buildEvidencePage(text, pageNumber) {
  return {
    pageNumber,
    rawText: text,

    // =========================
    // 🧠 BASIC SEGMENTATION
    // =========================
    sentences: splitSentences(text),

    // =========================
    // ⚖️ SIMPLE LEGAL SIGNALS
    // =========================
    signals: extractSignals(text),

    // =========================
    // 📊 BASIC SCORE ONLY (NOT AI JUDGMENT)
    // =========================
    relevanceScore: computeRelevance(text),

    meta: {
      layer: "L1_EVIDENCE_INGESTION",
      readyFor: ["chunking", "nlp", "lawMapping"]
    }
  };
}

/**
 * =========================
 * ✂️ SENTENCE SPLIT
 * =========================
 */
function splitSentences(text) {
  return text
    .split(/[\.،\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
}

/**
 * =========================
 * ⚖️ SIGNAL EXTRACTION (VERY LIGHT)
 * =========================
 */
function extractSignals(text) {
  return {
    hasCrime: /جريمة|سرقة|قتل|اعتداء|theft|crime/i.test(text),
    hasContract: /عقد|التزام|اتفاق|contract/i.test(text),
    hasCourt: /محكمة|قاضي|court/i.test(text),
    hasPenalty: /عقوبة|سجن|غرامة|penalty/i.test(text)
  };
}

/**
 * =========================
 * 📊 SIMPLE RELEVANCE (NO AI)
 * =========================
 */
function computeRelevance(text) {
  let score = 0;

  if (/قانون|محكمة|جريمة|عقد/i.test(text)) score += 0.5;
  if (text.length > 300) score += 0.3;
  if (/[0-9]/.test(text)) score += 0.2;

  return Math.min(1, score);
}

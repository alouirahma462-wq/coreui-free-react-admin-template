import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: EVIDENCE INGESTION (CLEAN + SMART)
 * =========================
 * فقط: استخراج + تنظيف + تقسيم + إشارات أولية
 */

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

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let text = content.items.map(x => x.str).join(" ");

    text = clean(text);

    if (text.length < 20) continue;

    pages.push(buildEvidence(text, i));
  }

  return pages;
};

/**
 * =========================
 * 🧹 CLEAN TEXT
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
 * 📦 EVIDENCE OBJECT (Layer 1)
 * =========================
 */
function buildEvidence(text, pageNumber) {
  return {
    id: `page_${pageNumber}`,
    pageNumber,
    text,

    // =========================
    // ✂️ BASIC SEGMENTS
    // =========================
    sentences: splitSentences(text),

    // =========================
    // ⚖️ LIGHT LEGAL SIGNALS ONLY
    // =========================
    signals: extractSignals(text),

    // =========================
    // 📊 SIMPLE RELEVANCE SCORE
    // =========================
    relevance: score(text),

    meta: {
      layer: "L1_EVIDENCE_INGESTION",
      readyFor: "L2_NLP_CHUNKING"
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
 * ⚖️ SIMPLE SIGNALS (NO AI)
 * =========================
 */
function extractSignals(text) {
  return {
    crime: /جريمة|سرقة|قتل|اعتداء|fraud|theft/i.test(text),
    contract: /عقد|اتفاق|التزام|contract/i.test(text),
    court: /محكمة|قاضي|court/i.test(text),
    penalty: /عقوبة|سجن|غرامة|penalty/i.test(text),
    law: /قانون|law/i.test(text)
  };
}

/**
 * =========================
 * 📊 SIMPLE SCORE (NOT AI)
 * =========================
 */
function score(text) {
  let s = 0;

  if (/قانون|محكمة|جريمة|عقد/i.test(text)) s += 0.5;
  if (text.length > 300) s += 0.3;
  if (/[0-9]/.test(text)) s += 0.2;

  return Math.min(1, s);
}

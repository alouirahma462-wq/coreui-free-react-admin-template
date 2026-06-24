import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: SMART LEGAL INGESTION (NO AI UNDERSTANDING)
 * =========================
 * PDF → Pages → Clean → STRUCTURED RAW TEXT
 */

export const readLegalPDF = async (filePath) => {
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

    const rawText = (content.items || [])
      .map(i => i.str || "")
      .join(" ");

    const text = cleanText(rawText);

    if (!text || text.length < 20) continue;

    pages.push({
      pageNumber: i,

      // 🧠 RAW TEXT ONLY
      text,

      // 🧠 STRUCTURE (NOT INTELLIGENCE)
      structure: detectStructure(text),

      meta: {
        layer: "L1",
        type: "legal_raw_page",
        readyFor: ["L2_NLP"]
      }
    });
  }

  return pages;
};

/**
 * =========================
 * 🧹 CLEAN ONLY
 * =========================
 */
function cleanText(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s\.\:\-\(\)]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * 🧱 STRUCTURE DETECTION (NOT LEGAL UNDERSTANDING)
 * =========================
 * فقط شكل النص (ليس معنى)
 */
function detectStructure(text) {
  return {
    hasArticle: /الفصل|المادة|Article|Art\./i.test(text),
    hasNumbers: /[0-9]+/.test(text),
    isLongText: text.length > 800,
    isShortText: text.length < 200,

    // فقط segmentation hint
    splitHint: text.includes("\n") ? "multi_block" : "single_block"
  };
}

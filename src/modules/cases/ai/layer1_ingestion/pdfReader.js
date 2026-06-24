import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: SMART INGESTION (NO LEGAL AI)
 * =========================
 * فقط: PDF → Pages → Clean Text → Structure
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

    let text = content.items.map(t => t.str || "").join(" ");
    text = cleanText(text);

    if (!text || text.length < 20) continue;

    pages.push({
      pageNumber: i,
      text,
      meta: {
        layer: "L1",
        type: "raw_legal_page",
        readyFor: ["L2_NLP", "L2_CHUNKING"]
      }
    });
  }

  return pages;
};

/**
 * =========================
 * 🧹 CLEAN ONLY (NO SEMANTICS)
 * =========================
 */
function cleanText(text) {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

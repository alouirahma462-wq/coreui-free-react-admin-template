import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: CLEAN LEGAL INGESTION (ROBUST)
 * =========================
 * فقط: استخراج + تنظيف + صفحات منظمة
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
  const seenPages = new Set();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const rawText = (content.items || [])
      .map(t => t.str || "")
      .join(" ");

    const text = cleanText(rawText);

    if (!text || text.length < 20) continue;

    // منع تكرار صفحات (PDFs فيها duplication أحيانًا)
    const hash = text.slice(0, 80);
    if (seenPages.has(hash)) continue;
    seenPages.add(hash);

    pages.push({
      pageNumber: i,
      text,
      meta: {
        layer: "L1",
        type: "raw_page",
        readyFor: ["L2_CHUNKING"]
      }
    });
  }

  return pages;
};

/**
 * =========================
 * 🧹 CLEAN ONLY (NO SEMANTIC INTELLIGENCE)
 * =========================
 */
function cleanText(text) {
  if (!text) return "";

  return text
    .replace(/\r/g, " ")
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * =========================
 * 🧠 LAYER 1: CLEAN LEGAL INGESTION
 * =========================
 * فقط: قراءة + تنظيف + صفحات + chunks بسيطة
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

    let text = content.items.map(t => t.str).join(" ");

    text = cleanText(text);

    if (text.length < 20) continue;

    pages.push({
      pageNumber: i,
      text,
      meta: {
        layer: "L1",
        readyFor: "L2_CHUNKING"
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
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * ✂️ SIMPLE CHUNKING (NO AI)
 * =========================
 */
export const chunkText = (text, size = 1000) => {
  if (!text) return [];

  const sentences = text.split(/[.؟!\n]/g);

  const chunks = [];
  let current = "";

  for (const s of sentences) {
    const clean = s.trim();
    if (!clean) continue;

    if ((current + clean).length > size) {
      chunks.push({
        text: current.trim(),
        length: current.length,
        meta: {
          layer: "L1_CHUNK"
        }
      });

      current = clean + ". ";
    } else {
      current += clean + ". ";
    }
  }

  if (current.trim()) {
    chunks.push({
      text: current.trim(),
      length: current.length,
      meta: {
        layer: "L1_CHUNK"
      }
    });
  }

  return chunks;
};

/**
 * =========================
 * 📚 PIPELINE BUILDER (L1 ONLY)
 * =========================
 */
export const buildLegalChunks = async (filePath) => {
  const pages = await readLegalPDF(filePath);

  let chunks = [];

  for (const page of pages) {
    const pageChunks = chunkText(page.text);

    for (let i = 0; i < pageChunks.length; i++) {
      chunks.push({
        id: `${filePath}-p${page.pageNumber}-c${i}`,
        page: page.pageNumber,
        ...pageChunks[i]
      });
    }
  }

  return {
    chunks,
    meta: {
      layer: "L1_COMPLETE",
      next: "L2_NLP_PROCESSING"
    }
  };
};

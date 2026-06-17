import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * 📚 READ PDF (stable + clean)
 */
export const readLegalPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF not found: " + filePath);
    }

    const buffer = fs.readFileSync(filePath);

    if (!buffer || buffer.length === 0) {
      throw new Error("Empty PDF file");
    }

    const data = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({
      data,
      disableWorker: true
    }).promise;

    let pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      let text = content.items
        .map(item => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      // 🧠 CLEANING RULES (important for Tunisian OCR PDFs)
      text = cleanText(text);

      // ignore empty or garbage pages
      if (!text || text.length < 20) continue;

      pages.push({
        pageNumber: i,
        text
      });
    }

    return pages;
  } catch (err) {
    console.error("❌ readLegalPDF error:", err.message);
    return [];
  }
};

/**
 * 🧹 STRONG LEGAL CLEANING
 */
const cleanText = (text) => {
  return text
    // remove weird OCR symbols
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s\.\,\;\:\(\)\-\n]/g, " ")

    // fix spacing
    .replace(/\s+/g, " ")

    // fix broken numbers (OCR issue)
    .replace(/(\d)\s+(\d)/g, "$1$2")

    // remove repeated headers (common in Tunisian PDFs)
    .replace(/Imprimerie Officielle de la République Tunisienne/g, "")

    .trim();
};

/**
 * ✂️ SMART LEGAL CHUNKING
 */
export const chunkText = (text, size = 1200) => {
  if (!text) return [];

  const chunks = [];
  const sentences = text.split(/[.؟!]/g);

  let current = "";

  for (const sentence of sentences) {
    const clean = sentence.trim();
    if (!clean) continue;

    if ((current + clean).length > size) {
      chunks.push(current.trim());
      current = clean + ". ";
    } else {
      current += clean + ". ";
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
};

/**
 * 📚 BUILD FINAL RAG INPUT
 * (THIS is what your AI uses)
 */
export const buildLegalChunks = async (filePath) => {
  try {
    const pages = await readLegalPDF(filePath);

    let chunks = [];

    for (const page of pages) {
      const pageChunks = chunkText(page.text);

      for (let i = 0; i < pageChunks.length; i++) {
        chunks.push({
          id: `${filePath}-p${page.pageNumber}-c${i}`,
          page: page.pageNumber,
          chunkIndex: i,
          text: pageChunks[i]
        });
      }
    }

    console.log(`📦 Built ${chunks.length} chunks from ${filePath}`);

    return chunks;
  } catch (err) {
    console.error("❌ buildLegalChunks error:", err.message);
    return [];
  }
};

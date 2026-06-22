import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * 📚 READ PDF (GOD MODE LOADER v5)
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

      text = cleanText(text);

      if (!text || text.length < 20) continue;

      // 🧠 PAGE INTELLIGENCE (NEW)
      const legalDensity =
        /الفصل|المادة|قانون|محكمة|جريمة|عقوبة|Article|law|court/i.test(text)
          ? 0.8
          : 0.3;

      const embeddingSeed =
        (text
          .slice(0, 120)
          .split("")
          .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000) / 1000;

      const riskSignal =
        /سجن|إعدام|غرامة|penalty|imprison|punishable/i.test(text)
          ? 0.3
          : 0;

      pages.push({
        pageNumber: i,
        text,

        // 🧠 NEW META LAYER (GOD MODE READY)
        meta: {
          legal_density: legalDensity,
          embedding_seed: embeddingSeed,
          risk_signal: riskSignal,
          graph_ready: true,
          rag_ready: true
        }
      });
    }

    return pages;
  } catch (err) {
    console.error("❌ readLegalPDF error:", err.message);
    return [];
  }
};

/**
 * 🧹 STRONG LEGAL CLEANING (ENHANCED)
 */
const cleanText = (text) => {
  return text
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s\.\,\;\:\(\)\-\n]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(\d)\s+(\d)/g, "$1$2")
    .replace(/Imprimerie Officielle de la République Tunisienne/g, "")
    .trim();
};

/**
 * ✂️ SMART LEGAL CHUNKING (GOD MODE v5)
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
      chunks.push(enrichChunk(current));
      current = clean + ". ";
    } else {
      current += clean + ". ";
    }
  }

  if (current.trim()) {
    chunks.push(enrichChunk(current));
  }

  return chunks;
};

/**
 * 🧠 CHUNK INTELLIGENCE LAYER (NEW)
 */
function enrichChunk(text) {
  const articleMatch =
    text.match(/(?:الفصل|المادة|Article)\s*(\d+)/i)?.[1] || null;

  const importance =
    Math.min(1, text.length / 1500) +
    (articleMatch ? 0.25 : 0) +
    (/قانون|محكمة|جريمة|عقوبة|law|court|crime/i.test(text) ? 0.3 : 0);

  const contradiction_hint =
    /ممنوع|غير مسموح|لا يجوز|prohibited|not allowed/i.test(text) ? 0.2 : 0;

  const embedding_seed =
    (text
      .slice(0, 80)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000) / 1000;

  return {
    text,
    articleNumber: articleMatch,

    importance: Number(importance.toFixed(3)),
    contradiction_hint,
    embedding_seed,

    graph_ready: true,
    rag_ready: true,
    memory_ready: true,

    meta: {
      confidence: articleMatch ? 0.93 : 0.7
    }
  };
}

/**
 * 📚 FINAL RAG BUILDER (GOD PIPELINE)
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
          ...pageChunks[i]
        });
      }
    }

    console.log(`📦 GOD MODE LOADED: ${chunks.length} chunks`);

    return chunks;
  } catch (err) {
    console.error("❌ buildLegalChunks error:", err.message);
    return [];
  }
};

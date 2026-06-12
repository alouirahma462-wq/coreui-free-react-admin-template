import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * 📚 PDF LOADER (Clean + Stable for Node)
 */
export const loadPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF not found: " + filePath);
    }

    const buffer = fs.readFileSync(filePath);
    const data = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({
      data,
      disableWorker: true,
    }).promise;

    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const text = content.items
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length < 10) continue;

      pages.push({
        page,
        text,
      });
    }

    return pages;
  } catch (err) {
    console.error("❌ PDF LOAD ERROR:", err.message);
    return [];
  }
};

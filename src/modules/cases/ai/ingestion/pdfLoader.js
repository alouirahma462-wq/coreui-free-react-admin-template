import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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

    const text = content.items
      .map(i => i.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length > 10) {
      pages.push({
        pageNumber: i,
        text
      });
    }
  }

  return pages;
};

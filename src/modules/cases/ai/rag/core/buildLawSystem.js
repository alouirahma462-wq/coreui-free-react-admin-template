import { readLegalPDF } from "../../ingestion/pdfReader.js";

/**
 * 📚 STEP 1: Extract clean articles
 */
export const buildLawSystem = async (filePath) => {
  const pages = await readLegalPDF(filePath);

  const articles = [];

  let current = null;

  for (const page of pages) {
    const lines = page.text.split(/\n|\./g);

    for (const line of lines) {
      const clean = line.trim();
      if (!clean) continue;

      const isArticle =
        /الفصل\s*\d+|المادة\s*\d+|Article\s*\d+/i.test(clean);

      if (isArticle) {
        if (current) articles.push(current);

        current = {
          id: articles.length + 1,
          title: clean,
          page: page.pageNumber,
          text: clean,
        };
      } else if (current) {
        current.text += " " + clean;
      }
    }
  }

  if (current) articles.push(current);

  return articles;
};

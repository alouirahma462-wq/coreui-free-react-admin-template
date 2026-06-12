/**
 * 📚 LAW CHUNKER (Legal optimized for Arabic + OCR PDFs)
 */

export const chunkLaw = (pages, chunkSize = 800) => {
  const chunks = [];

  for (const page of pages) {
    if (!page?.text) continue;

    // تنظيف أولي
    const text = page.text
      .replace(/\s+/g, " ")
      .replace(/\n/g, " ")
      .trim();

    // تقسيم ذكي حسب الجمل
    const sentences = text.split(/(?<=[.؟!])\s+/g);

    let current = "";

    for (const sentence of sentences) {
      if (!sentence) continue;

      if ((current + sentence).length > chunkSize) {
        chunks.push({
          text: current.trim(),
          page: page.page,
          type: "chunk",
        });

        current = sentence + " ";
      } else {
        current += sentence + " ";
      }
    }

    if (current.trim().length > 0) {
      chunks.push({
        text: current.trim(),
        page: page.page,
        type: "chunk",
      });
    }
  }

  return chunks;
};

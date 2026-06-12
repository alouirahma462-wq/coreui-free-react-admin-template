export const chunkLaw = (pages) => {
  const chunks = [];

  for (const page of pages) {
    const text = page.text;

    // 🔥 فصل حسب "الفصل / المادة"
    const parts = text.split(/(?=الفصل|المادة|Article)/g);

    for (const part of parts) {
      const clean = part.trim();

      if (clean.length < 30) continue;

      chunks.push({
        text: clean,
        page: page.pageNumber,
        type: detectType(clean)
      });
    }
  }

  return chunks;
};

function detectType(text) {
  if (text.includes("الفصل")) return "chapter";
  if (text.includes("المادة")) return "article";
  return "paragraph";
}

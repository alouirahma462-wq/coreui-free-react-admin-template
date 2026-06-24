export const chunkLaw = (pages) => {
  const chunks = [];
  const seen = new Set();

  for (const page of pages || []) {
    const text = page.text;
    if (typeof text !== "string" || text.length < 30) continue;

    const parts = text.split(/(?=الفصل|المادة|Article)/g);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]?.trim();
      if (!part || part.length < 30) continue;

      const articleNumber =
        part.match(/(?:الفصل|المادة|Article)\s*(\d+)/i)?.[1] || null;

      const type = detectType(part);

      // 🧹 فقط signals بسيطة (مش ذكاء)
      const hasLegalKeyword =
        /قانون|محكمة|جريمة|عقد|تنفيذ|دعوى|law|court|crime|contract/i.test(part);

      const hasPenalty =
        /سجن|غرامة|إعدام|penalty|imprison|punishable/i.test(part);

      const hash = `${articleNumber || "x"}-${part.slice(0, 60)}`;
      if (seen.has(hash)) continue;
      seen.add(hash);

      chunks.push({
        id: `${page.pageNumber}-${i}`,
        page: page.pageNumber,
        text: part,

        type,
        articleNumber,

        // 🔥 LAYER 1 SIGNALS فقط
        signals: {
          legal: hasLegalKeyword,
          penalty: hasPenalty,
          length: part.length
        },

        meta: {
          layer: "L1",
          readyFor: "L2_NLP"
        }
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

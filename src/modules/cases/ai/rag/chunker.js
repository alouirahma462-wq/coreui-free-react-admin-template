export const chunkLaw = (pages) => {
  const chunks = [];

  let current = null;

  for (const page of pages) {
    if (!page?.text) continue;

    const lines = page.text.split(/\n|\r/);

    for (const line of lines) {
      const clean = line.trim();
      if (!clean) continue;

      // 🧠 detect article start
      const isArticle = /(الفصل|المادة|Article)\s*\d+/i.test(clean);

      if (isArticle) {
        if (current) chunks.push(current);

        current = {
          text: clean,
          page: page.page,
          type: "article",
        };
      } else {
        if (!current) {
          current = {
            text: clean,
            page: page.page,
            type: "paragraph",
          };
        } else {
          current.text += " " + clean;
        }
      }
    }
  }

  if (current) chunks.push(current);

  return chunks;
};

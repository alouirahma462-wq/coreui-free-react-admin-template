export const extractArticles = (chunks) => {
  return chunks.map((chunk, index) => {
    const match =
      chunk.text.match(/(الفصل|المادة|Article)\s*\d+/i)?.[0] ||
      `UNKNOWN_${index}`;

    return {
      id: index,
      article: match,
      text: chunk.text,
      page: chunk.page,
      type: chunk.type,
    };
  });
};

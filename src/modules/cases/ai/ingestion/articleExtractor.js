export const extractArticles = (text) => {
  const matches = text.split(/(?=الفصل|المادة)/g);

  return matches
    .map((t, i) => ({
      id: i,
      text: t.trim(),
      articleNumber: t.match(/\d+/)?.[0] || null
    }))
    .filter(a => a.text.length > 20);
};

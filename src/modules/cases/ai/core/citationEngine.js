export const buildCitation = (article) => {
  return {
    article: article.text.match(/(الفصل|المادة)\s*\d+/)?.[0] || "غير محدد",
    page: article.page || null,
    text: article.text.slice(0, 300)
  };
};

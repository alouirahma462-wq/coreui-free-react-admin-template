export const buildCitations = (articles) => {
  return articles.map((a) => {
    return {
      article: a.article,
      page: a.page,
      text: a.text.slice(0, 500),
      citation: `${a.article || "غير معروف"} - صفحة ${a.page}`,
    };
  });
};

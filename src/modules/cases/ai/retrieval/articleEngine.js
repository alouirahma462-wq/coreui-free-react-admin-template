export const buildArticles = (pages) => {
  const articles = [];

  let current = null;

  for (const page of pages) {
    const lines = page.text.split(/\n|\.|\r/g);

    for (const line of lines) {
      const clean = line.trim();
      if (!clean) continue;

      // detect article start
      const isArticle =
        /الفصل\s*\d+|المادة\s*\d+|Article\s*\d+/i.test(clean);

      if (isArticle) {
        if (current) articles.push(current);

        current = {
          id: articles.length + 1,
          title: clean,
          text: clean,
          page: page.pageNumber,
          references: []
        };
      } else if (current) {
        current.text += " " + clean;
      }
    }
  }

  if (current) articles.push(current);

  return articles;
};

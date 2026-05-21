export const extractArticles = (text) => {
  const articles = text.split(/(?=الفصل|المادة)/g)

  return articles.map((a, i) => ({
    id: i,
    text: a.trim()
  }))
}

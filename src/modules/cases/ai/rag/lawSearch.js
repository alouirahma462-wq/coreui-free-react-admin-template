export const searchRelevantArticles = (articles, caseText) => {
  const keywords = caseText.split(" ")

  return articles
    .map(article => {
      let score = 0

      for (const word of keywords) {
        if (article.text.includes(word)) score++
      }

      return { ...article, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

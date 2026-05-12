// 📑 استخراج المواد القانونية
export const extractArticles = (text) => {
  const parts = text.split(/(الفصل\s+\d+|Article\s+\d+)/g)

  const articles = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim()

    if (part.length > 20) {
      articles.push({
        id: i,
        text: part
      })
    }
  }

  return articles
}

// 🧠 تحليل القضية
export const analyzeCase = (caseText, articles) => {
  const keywords = {
    سرقة: ["سرقة", "اختلاس", "استيلاء"],
    عنف: ["عنف", "اعتداء", "ضرب"],
    احتيال: ["تحيل", "احتيال", "تدليس"],
    قتل: ["قتل", "وفاة", "جريمة"]
  }

  const results = []

  for (const article of articles) {
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(w => article.text.includes(w))) {
        results.push({
          type,
          article
        })
      }
    }
  }

  return results
}

// ⚖️ اقتراح مواد قانونية
export const suggestLaw = (analysis) => {
  return analysis.slice(0, 5).map(item => ({
    type: item.type,
    preview: item.article.text.slice(0, 200)
  }))
}

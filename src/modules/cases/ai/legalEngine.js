import { readLegalPDF, chunkText } from "./pdfReader.js"

// 📑 استخراج المواد (تقسيم بسيط كبداية)
export const extractArticles = (text) => {
  const articles = text.split(/(Article\s+\d+|الفصل\s+\d+)/g)
    .filter(Boolean)
    .map((part, index) => ({
      id: index,
      text: part.trim()
    }))

  return articles
}

// 🔍 بحث قانوني داخل النص
export const searchLaw = (articles, query) => {
  return articles.filter(a =>
    a.text.toLowerCase().includes(query.toLowerCase())
  )
}

// ⚖️ اقتراح مادة (نسخة أولية rule-based)
export const suggestArticle = (caseText, articles) => {
  const keywords = {
    "سرقة": "سرقة",
    "عنف": "عنف",
    "احتيال": "تحيل",
    "قتل": "قتل"
  }

  const matched = articles.filter(a =>
    Object.values(keywords).some(k =>
      a.text.includes(k)
    )
  )

  return matched.slice(0, 5)
}

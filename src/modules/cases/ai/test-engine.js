import { readLegalPDF } from "./pdfReader.js"
import { extractArticles, searchLaw } from "./legalEngine.js"

const run = async () => {
  const text = await readLegalPDF(
    "src/legal-library/pdf/code-penal.pdf"
  )

  const articles = extractArticles(text)

  console.log("📑 عدد المواد:", articles.length)

  const results = searchLaw(articles, "سرقة")

  console.log("🔍 نتائج البحث:")
  console.log(results.slice(0, 3))
}

run()
